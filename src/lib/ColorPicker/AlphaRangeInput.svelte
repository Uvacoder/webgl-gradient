<script lang="ts">
	import type { ColorPickerState } from "src/types";
	import { hsvToHsl } from "./colorpicker";

	export let color: ColorPickerState["color"];

	let inputRef: HTMLInputElement;

	$: if (inputRef) {
		const { hue, saturation, lightness } = hsvToHsl(
			color.hue,
			color.saturation,
			color.value
		);

		inputRef.style.setProperty(
			"--thumb-color",
			`hsla(${hue}, ${saturation}%, ${lightness}%, ${color.alpha})`
		);

		inputRef.style.setProperty(
			"background",
			`linear-gradient(to right, hsla(${hue}, ${saturation}%, ${lightness}%, 0) 0%, hsla(${hue}, ${saturation}%, ${lightness}%, 1) 100%)`
		);
	}
</script>

<div>
	<input
		aria-label="Alpha Range Input"
		type="range"
		class="picker_range_input"
		min={0}
		max={1}
		step={0.01}
		bind:this={inputRef}
		bind:value={color.alpha}
		on:change={(e) => {
			color.alpha = Number(e.currentTarget.value);
		}}
	/>
</div>

<style>
	div {
		background: linear-gradient(45deg, #acacac 25%, transparent 25%),
			linear-gradient(-45deg, #acacac 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, #acacac 75%),
			linear-gradient(-45deg, transparent 75%, #acacac 75%);
		background-size: 10px 10px;
		background-position: 0 0, 0 5px, 5px -5px, -5px 0px;
		display: flex;
		border-radius: 10px;
	}

	input {
		-webkit-appearance: none;
		width: 100%;
		height: 14px;
		border-radius: inherit;
		padding: 0;
		cursor: pointer;
	}
</style>
