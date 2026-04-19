import type { Obj3D } from '../domain/types.js';

// Con viewY=-PI/2 la cámara mira a lo largo del eje X.
// Las caras delantera y trasera visibles son el plano YZ a x=+1 y x=-1.
// Ápice en el centro de cada cara (x=±1, y=0, z=0).
// Base 1 unidad por debajo del cubo (y=+2 en canvas = abajo en pantalla).
// Anchura de base = 1/3 del cubo → semiancho w=1/3 en eje Z.

const w = 1 / 3;
const baseY = 2; // y positivo = abajo en pantalla

const indices = new Uint16Array([
    0, 1, // ápice -> base izq
    1, 2, // base
    2, 0  // base der -> ápice
]);

export function createTriangles(): Obj3D[] {
    return [1, -1].map((x) => ({
        vertices: new Float32Array([
             x,     0,  0, // 0 ápice — centro de la cara
             x, baseY, -w, // 1 base izquierda
             x, baseY,  w, // 2 base derecha
        ]),
        indices,
        rotationAxis: 'x' as const,
        endAngle: 0,
        projected: new Float32Array(3 * 2),
        depths: new Float32Array(3),
    }));
}
