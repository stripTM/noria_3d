//import { foo, type Foo } from './polygon';

//console.log("hola", foo());

interface Obj3D {
    vertices: Float32Array;
    indices: Uint16Array;
    rotationAxis: 'x' | 'y' | 'z';
    endAngle: number;
    projected: Float32Array;
    parentIndex?: number; // índice del objeto padre en this.objects
    offset?: [number, number, number]; // traslación al pivote del padre (después de rotación propia)
}

class NoriaApp {
    private container: HTMLElement;
    private rafId: number | null = null;
    private objects: Obj3D[] = [];

    constructor(containerId: string) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`No se encontró el elemento con ID: ${containerId}`);
        }
        this.container = container;
        this.setupEventListeners();
        this.render();
    }
    private render(): void {
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
        this.model3d();
        const canvas = this.container.querySelector('canvas')!;
        const ctx = canvas.getContext('2d')!;

        const duration = 10000; // ms
        const startAngle = 0;
        let startTime: number | null = null;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const t = Math.min(elapsed / duration, 1); // 0..1

            for (let idx = 0; idx < this.objects.length; idx++) {
                const obj = this.objects[idx]!;
                const angle = startAngle + (obj.endAngle - startAngle) * t;
                if (obj.parentIndex !== undefined) {
                    const parent = this.objects[obj.parentIndex]!;
                    const parentAngle = startAngle + (parent.endAngle - startAngle) * t;
                    this.transform(angle, obj, canvas, parentAngle, parent.rotationAxis);
                } else {
                    this.transform(angle, obj, canvas);
                }
            }
            this.draw(ctx, canvas);

            if (t < 1) this.rafId = requestAnimationFrame(animate);
            else this.rafId = null;
        };

        requestAnimationFrame(animate);
        console.log("Aplicación NoriaApp inicializada.");
    }
    private setupEventListeners(): void {
        const demoButton = document.getElementById('demo-button');
        if (demoButton) {
            demoButton.addEventListener('click', () => this.render());
        }
    }

    model3d() {
        // --- Cubo: 8 vértices (x, y, z), rota 90° en eje Y ---
        const cubeVertices = new Float32Array([
            -1, -1,  1,   // 0
             1, -1,  1,   // 1
             1,  1,  1,   // 2
            -1,  1,  1,   // 3
            -1, -1, -1,   // 4
             1, -1, -1,   // 5
             1,  1, -1,   // 6
            -1,  1, -1    // 7
        ]);
        const cubeIndices = new Uint16Array([
            0, 1, 1, 2, 2, 3, 3, 0, // Cara frontal
            4, 5, 5, 6, 6, 7, 7, 4, // Cara trasera
            0, 4, 1, 5, 2, 6, 3, 7  // Conexiones laterales
        ]);

        // Vértices frontales del cubo donde se centra cada pirámide
        const frontVertices: [number, number, number][] = [
            [-1, -1, 1],
            [ 1, -1, 1],
            [ 1,  1, 1],
            [-1,  1, 1],
        ];
        const pyramidIndices = new Uint16Array([
            0, 1, 1, 2, 2, 3, 3, 0, // Base
            0, 4, 1, 4, 2, 4, 3, 4  // Aristas laterales al ápice
        ]);

        const s = 1 / 3; // escala: 1/3 del cubo

        // Pirámide en espacio LOCAL: ápice en el origen (pivote),
        // base extendiéndose hacia +z (fuera de la cara frontal del cubo)
        const pyramidLocalVertices = new Float32Array([
            -s, -s, 2 * s,  // 0 base
             s, -s, 2 * s,  // 1 base
             s,  s, 2 * s,  // 2 base
            -s,  s, 2 * s,  // 3 base
             0,  0,     0   // 4 ápice = pivote en el vértice del cubo
        ]);

        const pyramids: Obj3D[] = frontVertices.map(([cx, cy, cz]) => ({
            vertices: pyramidLocalVertices, // misma geometría local para las 4
            indices: pyramidIndices,
            rotationAxis: 'x' as const,
            endAngle: -Math.PI * 2,
            projected: new Float32Array(5 * 2),
            parentIndex: 0,               // hereda la rotación del cubo
            offset: [cx, cy, cz],         // ápice situado en el vértice del cubo
        }));

        this.objects = [
            {
                vertices: cubeVertices,
                indices: cubeIndices,
                rotationAxis: 'x',
                endAngle: Math.PI * 2,
                projected: new Float32Array(cubeVertices.length / 3 * 2)
            },
            ...pyramids
        ];
    }
    transform(
        angle: number,
        obj: Obj3D,
        canvas: HTMLCanvasElement,
        parentAngle?: number,
        parentAxis?: 'x' | 'y' | 'z'
    ): void {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const pCos = parentAngle !== undefined ? Math.cos(parentAngle) : 0;
        const pSin = parentAngle !== undefined ? Math.sin(parentAngle) : 0;

        const focalLength = 400;
        const cameraDist = 5;
        const { vertices, projected, rotationAxis, offset } = obj;
        const [ox, oy, oz] = offset ?? [0, 0, 0];

        for (let i = 0; i < vertices.length; i += 3) {
            let x = vertices[i] || 0;
            let y = vertices[i + 1] || 0;
            let z = vertices[i + 2] || 0;

            // 1. Rotación propia alrededor del origen local (el ápice)
            let rx: number, ry: number, rz: number;
            if (rotationAxis === 'y') {
                rx = x * cos + z * sin;
                rz = -x * sin + z * cos;
                ry = y;
            } else if (rotationAxis === 'z') {
                rx = x * cos - y * sin;
                ry = x * sin + y * cos;
                rz = z;
            } else {
                rx = x;
                ry = y * cos - z * sin;
                rz = y * sin + z * cos;
            }

            // 2. Trasladar el ápice al vértice del padre
            rx += ox;
            ry += oy;
            rz += oz;

            // 3. Rotación del padre alrededor del origen del mundo
            let fx = rx, fy = ry, fz = rz;
            if (parentAngle !== undefined) {
                if (parentAxis === 'y') {
                    fx =  rx * pCos + rz * pSin;
                    fz = -rx * pSin + rz * pCos;
                    fy = ry;
                } else if (parentAxis === 'z') {
                    fx =  rx * pCos - ry * pSin;
                    fy =  rx * pSin + ry * pCos;
                    fz = rz;
                } else {
                    fx = rx;
                    fy =  ry * pCos - rz * pSin;
                    fz =  ry * pSin + rz * pCos;
                }
            }

            // 4. Transformación de vista: cámara elevada y 30° a la derecha
            const viewY = -Math.PI / 6;  // −30° en Y (cámara a la derecha)
            const viewX =  Math.PI / 2;  //  30° en X (cámara arriba)
            const vyC = Math.cos(viewY), vyS = Math.sin(viewY);
            const vx1 =  fx * vyC + fz * vyS;
            const vy1 =  fy;
            const vz1 = -fx * vyS + fz * vyC;
            const vxC = Math.cos(viewX), vxS = Math.sin(viewX);
            const vxf = vx1;
            const vyf =  vy1 * vxC - vz1 * vxS;
            const vzf =  vy1 * vxS + vz1 * vxC;

            // 5. Proyección de perspectiva
            const scale = focalLength / (vzf + cameraDist);
            const pIdx = (i / 3) * 2;
            projected[pIdx]     = vxf * scale + canvas.width  / 2;
            projected[pIdx + 1] = vyf * scale + canvas.height / 2;
        }
    }
    draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.objects.forEach((obj, objIdx) => {
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
const app = new NoriaApp('app-container');

// Hacer la aplicación disponible globalmente para debugging
(window as any).noriaApp = app;