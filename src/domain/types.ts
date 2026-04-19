export interface Obj3D {
    vertices: Float32Array;
    indices: Uint16Array;
    rotationAxis: 'x' | 'y' | 'z';
    endAngle: number;
    projected: Float32Array;
    parentIndex?: number;
    offset?: [number, number, number];
}
