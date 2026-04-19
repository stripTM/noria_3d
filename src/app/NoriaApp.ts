import { createCube } from '../geometry/cube.js';
import { createPyramids } from '../geometry/pyramid.js';
import { CanvasRenderer } from '../rendering/CanvasRenderer.js';
import { Animator } from '../animation/Animator.js';

export class NoriaApp {
    private container: HTMLElement;
    private renderer: CanvasRenderer;
    private animator: Animator;

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
        const objects = [cube, ...pyramids];
        const canvas = this.container.querySelector('canvas')!;
        this.animator.start(objects, canvas, this.renderer);
        console.log("Aplicación NoriaApp inicializada.");
    }

    private setupEventListeners(): void {
        const demoButton = document.getElementById('demo-button');
        if (demoButton) {
            demoButton.addEventListener('click', () => this.render());
        }
    }
}
