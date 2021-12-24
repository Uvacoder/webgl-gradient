<script lang="ts">
	import type {
		ColorPicker,
		UpdateMarker,
		ColorPickerContextType,
	} from "src/types";
	import { getContext, onMount } from "svelte";
	import { positionWithinWindowBounds } from "../utils";
	import { hsvToRgb } from "./colorpicker";
	import Canvas from "./Canvas.svelte";
	import HueRangeInput from "./HueRangeInput.svelte";
	import AlphaRangeInput from "./AlphaRangeInput.svelte";
	import RgbaInputField from "./RGBAInputField.svelte";

	export let state: ColorPicker;
	export let updateMarker: UpdateMarker;

	const { closeColorPicker } =
		getContext<ColorPickerContextType>("color_picker");

	let elemRef: HTMLElement | null = null;

	onMount(() => {
		if (elemRef) {
			const bbox = elemRef.getBoundingClientRect();
			state.position = positionWithinWindowBounds(
				state.position.x,
				state.position.y,
				bbox.width,
				bbox.height
			);
		}

		const onPointerDown = (e: PointerEvent) => {
			const target = e.target;
			if (!(target instanceof HTMLElement)) return;

			if (!elemRef || !elemRef.contains(target)) {
				state = { id: null, color: null, position: null };
			}
		};

		window.addEventListener("pointerdown", onPointerDown);
		window.addEventListener("resize", closeColorPicker, { passive: true });

		return () => {
			window.removeEventListener("pointerdown", onPointerDown);
			window.removeEventListener("resize", closeColorPicker);
		};
	});

	$: {
		const rgb = hsvToRgb(
			state.color.hue,
			state.color.saturation,
			state.color.value
		);
		updateMarker(state.id, { color: { ...rgb, a: state.color.alpha } });
	}
</script>

<div
	bind:this={elemRef}
	class="colorpicker_wrapper"
	style="transform: translate({state.position.x}px, {state.position.y}px);"
>
	<Canvas bind:color={state.color} />
	<HueRangeInput bind:color={state.color} />
	<AlphaRangeInput bind:color={state.color} />
	<RgbaInputField bind:color={state.color} />
</div>

<style>
	.colorpicker_wrapper {
		position: absolute;
		top: 0;
		left: 0;
		background-color: white;
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1),
			0 2px 4px -2px rgb(0 0 0 / 0.1);
		z-index: 5;
		border-radius: 5px;
		padding: 1rem;
	}

	:global(.picker_range_input::-webkit-slider-runnable-track) {
		width: 200px;
		height: 14px;
		border: none;
		border-radius: 10px;
	}

	:global(.picker_range_input::-webkit-slider-thumb) {
		-webkit-appearance: none;
		height: 22px;
		width: 22px;
		border-radius: 50%;
		background: var(--thumb-color);
		border: 1px solid black;
		transform: translateY(-18%);
	}

	:global(.picker_range_input::-moz-range-track) {
		width: 200px;
		height: 14px;
		border: none;
		border-radius: 10px;
	}

	:global(.picker_range_input::-moz-range-thumb) {
		height: 16px;
		width: 16px;
		border-radius: 50%;
		background: var(--thumb-color);
		border: 1px solid black;
	}
</style>
