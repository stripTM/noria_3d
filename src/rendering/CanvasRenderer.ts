import type { Obj3D } from '../domain/types.js';

export class CanvasRenderer {
    draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, objects: Obj3D[]): void {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        objects.forEach((obj, objIdx) => {
            const { projected, indices } = obj;
            ctx.beginPath();
            // Cubo (idx 0) verde; pirámides (idx > 0) naranja
            ctx.strokeStyle = objIdx === 0 ? '#00ff00' : '#ff6600';

            for (let i = 0; i + 1 < indices.length; i += 2) {
                const startIdx = (indices[i] ?? 0) * 2;
                const endIdx = (indices[i + 1] ?? 0) * 2;

                const x0 = projected[startIdx] ?? 0;
                const y0 = projected[startIdx + 1] ?? 0;
                const x1 = projected[endIdx] ?? 0;
                const y1 = projected[endIdx + 1] ?? 0;

                ctx.moveTo(x0, y0);
                ctx.lineTo(x1, y1);
            }
            ctx.stroke();
        });
    }
}
