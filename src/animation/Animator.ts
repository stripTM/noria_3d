import type { Camera, Obj3D } from '../domain/types.js';
import { transform } from '../math/transform.js';
import { CanvasRenderer } from '../rendering/CanvasRenderer.js';

export class Animator {
    private rafId: number | null = null;

    start(objects: Obj3D[], canvas: HTMLCanvasElement, renderer: CanvasRenderer, camera: Camera): void {
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
            const t = elapsed / duration;

            for (let idx = 0; idx < objects.length; idx++) {
                const obj = objects[idx]!;
                const angle = startAngle + (obj.endAngle - startAngle) * t;
                if (obj.parentIndex !== undefined) {
                    const parent = objects[obj.parentIndex]!;
                    const parentAngle = startAngle + (parent.endAngle - startAngle) * t;
                    transform(angle, obj, canvas, parentAngle, parent.rotationAxis, camera);
                } else {
                    transform(angle, obj, canvas, undefined, undefined, camera);
                }
            }
            renderer.draw(ctx, canvas, objects);

            this.rafId = requestAnimationFrame(animate);
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
