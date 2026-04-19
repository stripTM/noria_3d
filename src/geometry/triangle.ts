import type { Obj3D } from '../domain/types.js';

// Estructura de soporte de la noria: cuatro patas en forma de X
// que parten del cubo central (eje) y se anclan al suelo.
// No rota (endAngle = 0).
const GY = 4.0;  // nivel del suelo (Y positivo = abajo en pantalla)
const GS = 2.0;  // apertura de las patas (X y Z desde el centro)

export function createTriangles(): Obj3D[] {
    const vertices = new Float32Array([
           0,    0,    0,  // 0 cubo central (eje de la rueda)
        -GS,  GY,  -GS,  // 1 pata delantera-izquierda
         GS,  GY,  -GS,  // 2 pata delantera-derecha
        -GS,  GY,   GS,  // 3 pata trasera-izquierda
         GS,  GY,   GS,  // 4 pata trasera-derecha
    ]);

    const indices = new Uint16Array([
        0, 1,  0, 2,  0, 3,  0, 4,  // patas desde el cubo
        1, 2,                         // barra delantera del suelo
        3, 4,                         // barra trasera del suelo
        1, 3,                         // barra izquierda del suelo
        2, 4,                         // barra derecha del suelo
    ]);

    return [{
        vertices,
        indices,
        rotationAxis: 'x' as const,
        endAngle: 0,
        projected: new Float32Array(5 * 2),
        depths: new Float32Array(5),
    }];
}
