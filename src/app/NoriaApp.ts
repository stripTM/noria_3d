import { createCube } from '../geometry/cube.js';
import { createPyramids } from '../geometry/pyramid.js';
import { createTriangles } from '../geometry/triangle.js';
import { CanvasRenderer } from '../rendering/CanvasRenderer.js';
import { Animator } from '../animation/Animator.js';
import type { Camera } from '../domain/types.js';

export class NoriaApp {
    private container: HTMLElement;
    private renderer: CanvasRenderer;
    private animator: Animator;
    private camera: Camera = { azimuth: -Math.PI / 3, elevation: Math.PI / 30 };

    constructor(containerId: string) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`No se encontró el elemento con ID: ${containerId}`);
        }
        this.container = container;
        this.renderer = new CanvasRenderer();
        this.animator = new Animator();
        this.setupEventListeners();
        this.render();
    }

    private render(): void {
        const cube = createCube();
        const pyramids = createPyramids(0);
        const triangles = createTriangles();
        const objects = [cube, ...pyramids, ...triangles];
        const canvas = this.container.querySelector('canvas')!;
        this.animator.start(objects, canvas, this.renderer, this.camera);
        console.log("Aplicación NoriaApp inicializada.");
    }

    private setupEventListeners(): void {
        const canvas = this.container.querySelector('canvas');
        if (!canvas) return;

        let isDragging = false;
        let lastX = 0;
        let lastY = 0;
        const sensitivity = 0.005;
        const halfPi = Math.PI / 2;

        canvas.addEventListener('pointerdown', (e: PointerEvent) => {
            isDragging = true;
            lastX = e.clientX;
            lastY = e.clientY;
            canvas.setPointerCapture(e.pointerId);
        });

        canvas.addEventListener('pointermove', (e: PointerEvent) => {
            if (!isDragging) return;
            const dx = e.clientX - lastX;
            const dy = e.clientY - lastY;
            lastX = e.clientX;
            lastY = e.clientY;
            this.camera.azimuth   -= dx * sensitivity;
            this.camera.elevation  = Math.max(-halfPi, Math.min(halfPi, this.camera.elevation + dy * sensitivity));
        });

        canvas.addEventListener('pointerup', () => { isDragging = false; });
        canvas.addEventListener('pointerleave', () => { isDragging = false; });
    }
}
