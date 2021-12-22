<script lang="ts">
	import { onMount, tick } from "svelte";
	import Controls from "./Controls.svelte";
	import Marker from "./Marker.svelte";
	import type { Marker as MarkerType, UpdateMarker } from "../../types";
	import { setMarkersUniforms } from "../gl";

	export let markers: MarkerType[];
	export let updateMarker: UpdateMarker;
	export let createMarker: Function;
	export let deselectMarkers: Function;
	export let gl: WebGL2RenderingContext;
	export let program: WebGLProgram;
	export let resUniformLocation: WebGLUniformLocation;
	export let makeProgram;

	$: selectedMarker = markers.find((m) => m.selected === true);

	let bbox: DOMRect;
	let canvas: HTMLCanvasElement;
	let w;
	let h;

	onMount(() => {
		const container = document.querySelector(".markers_container");
		bbox = container.getBoundingClientRect();

		gl = canvas.getContext("webgl2");

		// Init makeProgram
		makeProgram();

		let frame;

		const loop = () => {
			frame = requestAnimationFrame(loop);
			gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
			gl.clearColor(0, 0, 0, 0);
			gl.clear(gl.COLOR_BUFFER_BIT);

			if (program) {
				gl.useProgram(program);

				if (markers.length) {
					setMarkersUniforms(gl, markers);
					// Set uniform values
					gl.uniform2f(
						resUniformLocation,
						gl.canvas.width,
						gl.canvas.height
					);
				}

				gl.drawArrays(gl.TRIANGLES, 0, 6);
			}
		};

		loop();

		return () => window.cancelAnimationFrame(frame);
	});

	// TODO: Handle resize, devicepixel ecc.
</script>

<main>
	<Controls {createMarker} />
	<div class="container">
		<canvas
			bind:this={canvas}
			bind:clientWidth={w}
			bind:clientHeight={h}
			width={w}
			height={h}
		/>
		<div
			class="markers_container"
			on:pointerdown={(e) => {
				e.currentTarget.setPointerCapture(e.pointerId);
			}}
			on:pointermove={(e) => {
				if (e.buttons !== 1) return;

				if (selectedMarker) {
					let x = e.clientX - bbox.x;
					let y = e.clientY - bbox.y;

					if (x < 0) x = 0;
					if (y < 0) y = 0;
					if (x > bbox.width) x = bbox.width;
					if (y > bbox.height) y = bbox.height;

					updateMarker(selectedMarker.id, { position: { x, y } });
				}
			}}
			on:pointerup={() => deselectMarkers()}
			on:pointercancel={() => deselectMarkers()}
		>
			{#each markers as marker}
				<Marker {marker} {updateMarker} />
			{/each}
		</div>
	</div>
</main>

<style>
	main {
		flex-grow: 1;
		margin-right: 2rem;
		display: flex;
		flex-direction: column;
	}

	.container {
		width: 100%;
		height: 100%;
		background-color: rgb(99, 93, 93);
		position: relative;
	}

	canvas {
		position: absolute;
		top: 0;
		right: 0;
		width: 90%;
		height: 90%;
		display: block;
		pointer-events: none;
		touch-action: none;
	}

	.markers_container {
		position: absolute;
		top: 0;
		right: 0;
		width: 90%;
		height: 90%;
		z-index: 1;
		border: 2px solid red;
	}
</style>
