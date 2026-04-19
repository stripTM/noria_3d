import type { Obj3D } from '../domain/types.js';

// Rueda de la noria: aro circular con radios y cubo central (eje)
// Rota alrededor del eje X. Los vértices están en el plano Y-Z.
const N = 8;    // segmentos del aro
const R = 1.8;  // radio de la rueda
const W = 0.18; // semiprofundidad del aro (eje X)

export function createWheel(): Obj3D {
    const nv = N * 2 + 2; // aro delantero + aro trasero + 2 puntos de cubo
    const vertices = new Float32Array(nv * 3);

    for (let k = 0; k < N; k++) {
        const a = (2 * Math.PI * k) / N;
        const y = R * Math.sin(a);
        const z = R * Math.cos(a);
        // Aro delantero (x = -W)
        vertices[k * 3]     = -W;
        vertices[k * 3 + 1] = y;
        vertices[k * 3 + 2] = z;
        // Aro trasero (x = +W)
        vertices[(N + k) * 3]     =  W;
        vertices[(N + k) * 3 + 1] = y;
        vertices[(N + k) * 3 + 2] = z;
    }
    // Cubo delantero — índice 2*N
    vertices[2 * N * 3]     = -W;
    vertices[2 * N * 3 + 1] =  0;
    vertices[2 * N * 3 + 2] =  0;
    // Cubo trasero — índice 2*N + 1
    vertices[(2 * N + 1) * 3]     = W;
    vertices[(2 * N + 1) * 3 + 1] = 0;
    vertices[(2 * N + 1) * 3 + 2] = 0;

    const pairs: number[] = [];
    // Aro delantero
    for (let k = 0; k < N; k++) pairs.push(k, (k + 1) % N);
    // Aro trasero
    for (let k = 0; k < N; k++) pairs.push(N + k, N + (k + 1) % N);
    // Radios delanteros (cubo → aro)
    for (let k = 0; k < N; k++) pairs.push(2 * N, k);
    // Radios traseros
    for (let k = 0; k < N; k++) pairs.push(2 * N + 1, N + k);
    // Eje (cubo delantero ↔ trasero)
    pairs.push(2 * N, 2 * N + 1);
    // Conectores de profundidad (aro delantero ↔ trasero)
    for (let k = 0; k < N; k++) pairs.push(k, N + k);

    return {
        vertices,
        indices: new Uint16Array(pairs),
        rotationAxis: 'x',
        endAngle: Math.PI * 2,
        projected: new Float32Array(nv * 2),
        depths: new Float32Array(nv),
    };
}
