export type Marker = {
	color: {
		r: number;
		g: number;
		b: number;
		a: number;
	};
	position: {
		x: number;
		y: number;
	};
	id: string;
	hidden: boolean;
	selected: boolean;
	colLocation: WebGLUniformLocation;
	posLocation: WebGLUniformLocation;
};

export type UpdateMarker = (id: string, markerPartial: Partial<Marker>) => void;
export type DeleteMarker = (id: string) => void;

export type ColorPicker =
	| {
			id: null;
			color: null;
			position: null;
	  }
	| {
			id: string;
			color: {
				hue: number;
				saturation: number;
				value: number;
				alpha: number;
			};
			position: {
				x: number;
				y: number;
			};
	  };

export type ColorPickerContextType = {
	openColorPicker: (
		id: string,
		elem: HTMLElement,
		color: Marker["color"]
	) => void;
	closeColorPicker: () => void;
};
