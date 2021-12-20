<script lang="ts">
	import { setMarkersUniformsLocations, setupProgram } from "./gl";

	import Canvas from "./lib/Canvas/Canvas.svelte";
	import MarkersList from "./lib/Menu/MarkersList.svelte";
	import type { DeleteMarker, Marker, UpdateMarker } from "./types";

	let markers: Marker[] = [];

	let id = 0;

	let gl: WebGL2RenderingContext;
	let program: WebGLProgram;
	let resUniformLocation: WebGLUniformLocation;

	const updateMarker: UpdateMarker = (id, markerPartial) => {
		const index = markers.findIndex((m) => m.id === id);

		if (index > -1) {
			markers[index] = { ...markers[index], ...markerPartial };
		}
	};

	const makeProgram = () => {
		try {
			program = setupProgram(gl, markers.length);
			setMarkersUniformsLocations(gl, program, markers);
			resUniformLocation = gl.getUniformLocation(program, "u_resolution");
		} catch (e) {
			console.log(e);
		}
	};

	const createMarker = () => {
		markers = [
			...markers,
			{
				r: Math.round(Math.random() * 255),
				g: Math.round(Math.random() * 255),
				b: Math.round(Math.random() * 255),
				x: 592 / 2,
				y: 762 / 2,
				id: "_" + id,
				hidden: false,
				selected: false,
				colLocation: -1,
				posLocation: -1,
			},
		];

		id++;
		makeProgram();
	};

	const deselectMarkers = () => {
		for (const marker of markers) {
			marker.selected = false;
		}
		markers = markers;
	};

	const deleteMarker: DeleteMarker = (id) => {
		markers = markers.filter((m) => m.id !== id);
		makeProgram();
	};
</script>

<main>
	<Canvas
		{resUniformLocation}
		bind:gl
		{program}
		{markers}
		{updateMarker}
		{createMarker}
		{deselectMarkers}
		{makeProgram}
	/>
	<div class="menu_wrapper">
		<h3>Menu</h3>
		<MarkersList {markers} {deleteMarker} {updateMarker} />
	</div>
</main>

<style>
	main {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.menu_wrapper {
		width: 300px;
		height: 100%;
		background-color: grey;
		flex-shrink: 0;
		padding: 1rem;
	}
</style>
