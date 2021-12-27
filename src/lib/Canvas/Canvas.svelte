<script lang="ts">
	import { onMount, setContext } from "svelte";
	import Controls from "./Controls.svelte";
	import Marker from "./Marker.svelte";
	import type {
		CanvasContext,
		Marker as MarkerType,
		UpdateMarker,
	} from "../../types";
	import { setMarkersUniforms } from "../gl";
	import CheckeredBg from "../Shared/CheckeredBg.svelte";

	export let markers: MarkerType[];
	export let updateMarker: UpdateMarker;
	export let createMarker: Function;
	export let deselectMarkers: Function;
	export let gl: WebGL2RenderingContext;
	export let program: WebGLProgram;
	export let resUniformLocation: WebGLUniformLocation;
	export let makeProgram;

	$: selectedMarker = markers.find((m) => m.selected === true);

	let container: HTMLElement;
	let bbox: DOMRect;
	let canvas: HTMLCanvasElement;
	let w: number;
	let h: number;

	setContext<CanvasContext>("canvas", {
		getSize: () => bbox,
	});

	$: dpr = Math.min(window.devicePixelRatio, 2);

	onMount(() => {
		const onResize = () => {
			const newBbox = container.getBoundingClientRect();
			const wDiff = newBbox.width / bbox.width;
			const hDiff = newBbox.height / bbox.height;
			bbox = newBbox;
			w = newBbox.width;
			h = newBbox.height;

			for (const marker of markers) {
				const position = {
					x: marker.position.x * wDiff,
					y: marker.position.y * hDiff,
				};
				updateMarker(marker.id, { position });
			}
		};

		window.addEventListener("resize", onResize, { passive: true });

		container = document.querySelector(".markers_container");
		bbox = container.getBoundingClientRect();

		gl = canvas.getContext("webgl2", { alpha: true });

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

		return () => {
			window.cancelAnimationFrame(frame);
			window.removeEventListener("resize", onResize);
		};
	});
</script>

<main>
	<Controls {createMarker} />
	<div class="container">
		<CheckeredBg size={20} />
		<canvas
			bind:this={canvas}
			bind:clientWidth={w}
			bind:clientHeight={h}
			width={w * dpr}
			height={h * dpr}
		/>
		<div
			bind:this={container}
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
		align-items: flex-end;
	}

	.container {
		width: 90%;
		height: 80%;
		background-color: rgb(99, 93, 93);
		position: relative;
		border: 2px solid green;
	}

	canvas {
		position: absolute;
		top: 0;
		right: 0;
		width: 100%;
		height: 100%;
		display: block;
		pointer-events: none;
		touch-action: none;
	}

	.markers_container {
		position: absolute;
		top: 0;
		right: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
		border: 2px solid red;
	}
</style>
