import { createWheel } from '../geometry/wheel.js';
import { createCabins } from '../geometry/cabins.js';
import { createSupports } from '../geometry/supports.js';
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

    private fitCanvas(canvas: HTMLCanvasElement): void {
        const dpr = window.devicePixelRatio || 1;
        const w = Math.round(canvas.clientWidth  * dpr);
        const h = Math.round(canvas.clientHeight * dpr);
        if (canvas.width !== w || canvas.height !== h) {
            canvas.width  = w;
            canvas.height = h;
        }
    }

    private render(): void {
        const wheel = createWheel();
        const cabins = createCabins(0);
        const supports = createSupports();
        const objects = [wheel, ...cabins, ...supports];
        const canvas = this.container.querySelector('canvas')!;

        this.fitCanvas(canvas);
        this.animator.start(objects, canvas, this.renderer, this.camera);

        const ro = new ResizeObserver(() => { this.fitCanvas(canvas); });
        ro.observe(canvas);

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
