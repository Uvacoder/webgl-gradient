<script lang="ts">
	import type { ColorPicker } from "src/types";

	import { onMount } from "svelte";
	import { markerTransform, getPointerPosition } from "../utils";
	import { fillColorPicker, hsvToRgb } from "./colorpicker";

	export let color: ColorPicker["color"];

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let w: number = 200;
	let h: number = 200;

	let bbox: DOMRect;

	onMount(() => {
		ctx = canvas.getContext("2d");
		const { r, g, b } = hsvToRgb(color.hue, 100, 100);

		fillColorPicker(ctx, `rgba(${r}, ${g}, ${b}, ${color.alpha})`, w, h);
	});

	const cursorSize = 20;
	$: x = w ? (color.saturation / 100) * w : 0;
	$: y = h ? h - (color.value / 100) * h : 0;

	$: {
		if (ctx) {
			const { r, g, b } = hsvToRgb(color.hue, 100, 100);

			fillColorPicker(
				ctx,
				`rgba(${r}, ${g}, ${b}, ${color.alpha})`,
				w,
				h
			);
		}
	}
</script>

<div class="gradient_canvas_container">
	<div class="canvas_bg_checkered" />
	<canvas
		bind:this={canvas}
		bind:clientWidth={w}
		bind:clientHeight={h}
		width={w}
		height={h}
		tabindex="0"
		on:keydown={(e) => {
			// don't prevent default here or it may mess up tabbing ecc..
			if (e.key === "ArrowUp") {
				e.preventDefault();
				color.value = Math.min(color.value + 1, 100);
			} else if (e.key === "ArrowDown") {
				e.preventDefault();
				color.value = Math.max(color.value - 1, 0);
			} else if (e.key === "ArrowLeft") {
				e.preventDefault();
				color.saturation = Math.max(color.saturation - 1, 0);
			} else if (e.key === "ArrowRight") {
				e.preventDefault();
				color.saturation = Math.min(color.saturation + 1, 100);
			}
		}}
		on:pointerdown={(e) => {
			bbox = e.currentTarget.getBoundingClientRect();
			e.currentTarget.setPointerCapture(e.pointerId);

			const { x, y } = getPointerPosition(bbox, e.clientX, e.clientY);

			color.saturation = (x / bbox.width) * 100;
			color.value = 100 - (y / bbox.height) * 100;
		}}
		on:pointermove={(e) => {
			if (!bbox) return;
			if (e.buttons === 1) {
				const { x, y } = getPointerPosition(bbox, e.clientX, e.clientY);

				color.saturation = (x / bbox.width) * 100;
				color.value = 100 - (y / bbox.height) * 100;
			}
		}}
	/>
	<div
		class="outer"
		style="
            width: {cursorSize}px;
            height: {cursorSize}px;
            transform: {markerTransform({ x, y }, cursorSize)};
        "
	>
		<div class="inner" />
	</div>
</div>

<style>
	.gradient_canvas_container {
		position: relative;
		width: 200px;
		height: 200px;
		cursor: pointer;
	}

	canvas {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
	}

	.canvas_bg_checkered {
		background-image: linear-gradient(45deg, #acacac 25%, transparent 25%),
			linear-gradient(-45deg, #acacac 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, #acacac 75%),
			linear-gradient(-45deg, transparent 75%, #acacac 75%);
		background-size: 20px 20px;
		background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
		height: 100%;
		width: 100%;
	}

	.outer {
		position: absolute;
		top: 0;
		left: 0;
		border: 2px solid black;
		border-radius: 50%;
		pointer-events: none;
	}

	.inner {
		width: 100%;
		height: 100%;
		border: 2px solid white;
		border-radius: inherit;
	}
</style>
