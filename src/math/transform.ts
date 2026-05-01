import type { Camera, Obj3D } from '../domain/types.js';

export function transform(
    angle: number,
    obj: Obj3D,
    canvas: HTMLCanvasElement,
    parentAngle?: number,
    parentAxis?: 'x' | 'y' | 'z',
    camera?: Camera
): void {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const pCos = parentAngle !== undefined ? Math.cos(parentAngle) : 0;
    const pSin = parentAngle !== undefined ? Math.sin(parentAngle) : 0;

    const focalLength = canvas.height * 0.8;
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

        // 4. Transformación de vista: cámara configurable
        const viewY = camera ? camera.azimuth   : -Math.PI / 3;
        const viewX = camera ? camera.elevation :  Math.PI / 30;
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
        obj.depths[i / 3]   = vzf + cameraDist;
    }
}
