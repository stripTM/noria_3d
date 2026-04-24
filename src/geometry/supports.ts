import type { Obj3D } from '../domain/types.js';

// Estructura de soporte de la noria: cuatro vigas desde el eje central al suelo
// más cuatro travesaños en la base formando un marco rectangular.
// Cada segmento se representa como una viga de sección cuadrada (8 vértices).
// No rota (endAngle = 0).
const GY = 4.0;  // nivel del suelo
const GS = 1.3;  // apertura de las patas (más estrecha que el radio de la rueda)
const BW = 0.06; // semiancho de la sección de viga

// Genera 8 vértices de sección cuadrada para una viga entre dos puntos
function beamBox(
    ax: number, ay: number, az: number,
    bx: number, by: number, bz: number
): number[] {
    const dx = bx - ax, dy = by - ay, dz = bz - az;
    const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const ux = dx / len, uy = dy / len, uz = dz / len;

    // Primer perpendicular: cross(u, eje_menos_alineado)
    let rx: number, ry: number, rz: number;
    if (Math.abs(ux) <= Math.abs(uy) && Math.abs(ux) <= Math.abs(uz)) {
        rx = 0;   ry = uz;  rz = -uy;  // cross(u, X)
    } else if (Math.abs(uy) <= Math.abs(uz)) {
        rx = -uz; ry = 0;   rz = ux;   // cross(u, Y)
    } else {
        rx = uy;  ry = -ux; rz = 0;    // cross(u, Z)
    }
    const rlen = Math.sqrt(rx * rx + ry * ry + rz * rz);
    rx /= rlen; ry /= rlen; rz /= rlen;

    // Segundo perpendicular: cross(u, r)
    const sx = uy * rz - uz * ry;
    const sy = uz * rx - ux * rz;
    const sz = ux * ry - uy * rx;

    const corners: [number, number][] = [[1, 1], [-1, 1], [-1, -1], [1, -1]];
    const v: number[] = [];
    for (const [ci, cj] of corners) {
        v.push(ax + ci * BW * rx + cj * BW * sx,
               ay + ci * BW * ry + cj * BW * sy,
               az + ci * BW * rz + cj * BW * sz);
    }
    for (const [ci, cj] of corners) {
        v.push(bx + ci * BW * rx + cj * BW * sx,
               by + ci * BW * ry + cj * BW * sy,
               bz + ci * BW * rz + cj * BW * sz);
    }
    return v;
}

// 24 índices de arista para una viga con vértices base en `base`
function beamEdges(base: number): number[] {
    const b = base;
    return [
        b+0, b+1,  b+1, b+2,  b+2, b+3,  b+3, b+0,  // tapa inicio
        b+4, b+5,  b+5, b+6,  b+6, b+7,  b+7, b+4,  // tapa final
        b+0, b+4,  b+1, b+5,  b+2, b+6,  b+3, b+7,  // aristas longitudinales
    ];
}

export function createSupports(): Obj3D[] {
    const segments: [[number, number, number], [number, number, number]][] = [
        // Patas desde el eje al suelo
        [[0, 0, 0], [-GS, GY, -GS]],
        [[0, 0, 0], [ GS, GY, -GS]],
        [[0, 0, 0], [-GS, GY,  GS]],
        [[0, 0, 0], [ GS, GY,  GS]],
        // Travesaños en la base
        [[-GS, GY, -GS], [ GS, GY, -GS]],
        [[-GS, GY,  GS], [ GS, GY,  GS]],
        [[-GS, GY, -GS], [-GS, GY,  GS]],
        [[ GS, GY, -GS], [ GS, GY,  GS]],
    ];

    const allVerts: number[] = [];
    const allIdx: number[] = [];

    for (const [[ax, ay, az], [bx, by, bz]] of segments) {
        const base = allVerts.length / 3;
        allVerts.push(...beamBox(ax, ay, az, bx, by, bz));
        allIdx.push(...beamEdges(base));
    }

    const nv = allVerts.length / 3;
    return [{
        vertices: new Float32Array(allVerts),
        indices: new Uint16Array(allIdx),
        rotationAxis: 'x' as const,
        endAngle: 0,
        projected: new Float32Array(nv * 2),
        depths: new Float32Array(nv),
    }];
}
