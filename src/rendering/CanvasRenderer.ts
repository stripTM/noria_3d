import type { Obj3D } from '../domain/types.js';

export class CanvasRenderer {
    draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, objects: Obj3D[]): void {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        objects.forEach((obj, objIdx) => {
            const { projected, indices, depths } = obj;
            // Rueda (idx 0): azul claro; cabinas (con parentIndex): naranja; soportes: gris
            const color = objIdx === 0 ? '#4fc3f7'
                : obj.parentIndex !== undefined ? '#ff9800'
                : '#90a4ae';

            // Rango de profundidad del objeto para normalizar
            let minD = Infinity, maxD = -Infinity;
            for (let k = 0; k < depths.length; k++) {
                const d = depths[k] ?? 1;
                if (d < minD) minD = d;
                if (d > maxD) maxD = d;
            }
            const range = maxD - minD || 1;

            for (let i = 0; i + 1 < indices.length; i += 2) {
                const aIdx = indices[i] ?? 0;
                const bIdx = indices[i + 1] ?? 0;

                const x0 = projected[aIdx * 2] ?? 0;
                const y0 = projected[aIdx * 2 + 1] ?? 0;
                const x1 = projected[bIdx * 2] ?? 0;
                const y1 = projected[bIdx * 2 + 1] ?? 0;

                // t=0 -> más cercano (grosor 2), t=1 -> más lejano (grosor 0.5)
                const avgD = ((depths[aIdx] ?? 1) + (depths[bIdx] ?? 1)) / 2;
                const t = (avgD - minD) / range;
                const lineWidth = 2 - t * 1.5;

                ctx.beginPath();
                ctx.strokeStyle = color;
                ctx.lineWidth = lineWidth;
                ctx.moveTo(x0, y0);
                ctx.lineTo(x1, y1);
                ctx.stroke();
            }
        });
    }
}
