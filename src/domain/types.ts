export interface Obj3D {
    vertices: Float32Array;
    indices: Uint16Array;
    rotationAxis: 'x' | 'y' | 'z';
    endAngle: number;
    projected: Float32Array;
    depths: Float32Array;
    parentIndex?: number;
    offset?: [number, number, number];
}

export interface Camera {
    azimuth: number;
    elevation: number;
}
