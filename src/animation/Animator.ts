import type { Obj3D } from '../domain/types.js';
import { transform } from '../math/transform.js';
import { CanvasRenderer } from '../rendering/CanvasRenderer.js';

export class Animator {
    private rafId: number | null = null;

    start(objects: Obj3D[], canvas: HTMLCanvasElement, renderer: CanvasRenderer): void {
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }

        const ctx = canvas.getContext('2d')!;
        const duration = 10000;
        const startAngle = 0;
        let startTime: number | null = null;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const t = Math.min(elapsed / duration, 1);

            for (let idx = 0; idx < objects.length; idx++) {
                const obj = objects[idx]!;
                const angle = startAngle + (obj.endAngle - startAngle) * t;
                if (obj.parentIndex !== undefined) {
                    const parent = objects[obj.parentIndex]!;
                    const parentAngle = startAngle + (parent.endAngle - startAngle) * t;
                    transform(angle, obj, canvas, parentAngle, parent.rotationAxis);
                } else {
                    transform(angle, obj, canvas);
                }
            }
            renderer.draw(ctx, canvas, objects);

            if (t < 1) this.rafId = requestAnimationFrame(animate);
            else this.rafId = null;
        };

        requestAnimationFrame(animate);
    }

    stop(): void {
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }
}
