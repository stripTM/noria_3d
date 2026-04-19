import type { Obj3D } from '../domain/types.js';

// Cabinas de la noria: cajas rectangulares que cuelgan del aro.
// La contra-rotación (endAngle = -2π) cancela la rotación de la rueda,
// por lo que las cabinas permanecen erguidas como góndolas reales.
const N = 8;      // número de cabinas (debe coincidir con cube.ts)
const R = 1.8;    // radio de la rueda (debe coincidir con cube.ts)
const hw = 0.18;  // semiancho X
const top = 0.05; // offset superior Y desde el punto de enganche
const bot = 0.55; // offset inferior Y
const hd = 0.13;  // semiprofundidad Z

// Vértices locales compartidos por todas las cabinas
const localVertices = new Float32Array([
    -hw, top, -hd,  // 0 superior-frontal-izquierda
     hw, top, -hd,  // 1 superior-frontal-derecha
     hw, top,  hd,  // 2 superior-trasera-derecha
    -hw, top,  hd,  // 3 superior-trasera-izquierda
    -hw, bot, -hd,  // 4 inferior-frontal-izquierda
     hw, bot, -hd,  // 5 inferior-frontal-derecha
     hw, bot,  hd,  // 6 inferior-trasera-derecha
    -hw, bot,  hd,  // 7 inferior-trasera-izquierda
]);

const indices = new Uint16Array([
    0, 1,  1, 2,  2, 3,  3, 0,  // cara superior
    4, 5,  5, 6,  6, 7,  7, 4,  // cara inferior
    0, 4,  1, 5,  2, 6,  3, 7,  // aristas verticales
]);

export function createCabins(wheelIndex: number): Obj3D[] {
    return Array.from({ length: N }, (_, k) => {
        const a = (2 * Math.PI * k) / N;
        return {
            vertices: localVertices,
            indices,
            rotationAxis: 'x' as const,
            endAngle: -Math.PI * 2,
            projected: new Float32Array(8 * 2),
            depths: new Float32Array(8),
            parentIndex: wheelIndex,
            offset: [0, R * Math.sin(a), R * Math.cos(a)] as [number, number, number],
        };
    });
}
