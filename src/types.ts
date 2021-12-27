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
	visible: boolean;
	selected: boolean;
	colLocation: WebGLUniformLocation;
	posLocation: WebGLUniformLocation;
};

export type StillImageMarker = Pick<
	Marker,
	"color" | "position" | "posLocation" | "colLocation"
>;

export type UpdateMarker = (id: string, markerPartial: Partial<Marker>) => void;
export type DeleteMarker = (id: string) => void;

export type ColorPickerState =
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

export type ColorPickerStateContext = {
	openColorPicker: (
		id: string,
		elem: HTMLElement,
		color: Marker["color"]
	) => void;
	closeColorPicker: () => void;
};

export type AppContext = {
	getMarkers: () => Marker[];
	setMarkersVisibility: (visible: boolean) => void;
};

export type CanvasContext = {
	getSize: () => DOMRect;
};
