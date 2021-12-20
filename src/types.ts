export type Marker = {
	r: number;
	g: number;
	b: number;
	x: number;
	y: number;
	id: string;
	hidden: boolean;
	selected: boolean;
	colLocation: WebGLUniformLocation;
	posLocation: WebGLUniformLocation;
};

export type UpdateMarker = (id: string, markerPartial: Partial<Marker>) => void;
export type DeleteMarker = (id: string) => void;
