import type { Obj3D } from '../domain/types.js';

export function createCube(): Obj3D {
    const vertices = new Float32Array([
        -1, -1,  1,   // 0
         1, -1,  1,   // 1
         1,  1,  1,   // 2
        -1,  1,  1,   // 3
        -1, -1, -1,   // 4
         1, -1, -1,   // 5
         1,  1, -1,   // 6
        -1,  1, -1    // 7
    ]);
    const indices = new Uint16Array([
        0, 1, 1, 2, 2, 3, 3, 0, // Cara frontal
        4, 5, 5, 6, 6, 7, 7, 4, // Cara trasera
        0, 4, 1, 5, 2, 6, 3, 7  // Conexiones laterales
    ]);
    return {
        vertices,
        indices,
        rotationAxis: 'x',
        endAngle: Math.PI * 2,
        projected: new Float32Array(vertices.length / 3 * 2),
        depths: new Float32Array(vertices.length / 3),
    };
}
