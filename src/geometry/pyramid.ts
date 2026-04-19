import type { Obj3D } from '../domain/types.js';

const FRONT_VERTICES: [number, number, number][] = [
    [0, -1, -1],
    [0, -1,  1],
    [0,  1, -1],
    [0,  1,  1],
];

export function createPyramids(cubeIndex: number): Obj3D[] {
    const s = 1 / 3;
    const indices = new Uint16Array([
        0, 1, 1, 2, 2, 3, 3, 0, // Base
        0, 4, 1, 4, 2, 4, 3, 4  // Aristas laterales al ápice
    ]);
    // Geometría local compartida: ápice en el origen, base paralela al plano XZ hacia abajo (+Y)
    const localVertices = new Float32Array([
         s, 2 * s, -s,  // 0 base
        -s, 2 * s, -s,  // 1 base
        -s, 2 * s,  s,  // 2 base
         s, 2 * s,  s,  // 3 base
         0, 0,      0   // 4 ápice = pivote
    ]);

    return FRONT_VERTICES.map(([cx, cy, cz]) => ({
        vertices: localVertices,
        indices,
        rotationAxis: 'x' as const,
        endAngle: -Math.PI * 2,
        projected: new Float32Array(5 * 2),
        depths: new Float32Array(5),
        parentIndex: cubeIndex,
        offset: [cx, cy, cz],
    }));
}
