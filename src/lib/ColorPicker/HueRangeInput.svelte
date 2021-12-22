<script lang="ts">
	import type { ColorPicker } from "src/types";

	export let color: ColorPicker["color"];

	let inputRef: HTMLInputElement;

	$: if (inputRef) {
		inputRef.style.setProperty(
			"--thumb-color",
			`hsl(${color.hue}, 100%, 50%)`
		);
	}
</script>

<input
	bind:this={inputRef}
	bind:value={color.hue}
	aria-label="Hue Range Input"
	type="range"
	class="picker_range_input"
	min={0}
	max={360}
	on:change={(e) => {
		color.hue = Number(e.currentTarget.value);
	}}
/>

<style>
	input {
		-webkit-appearance: none;
		width: 100%;
		height: 14px;
		border-radius: 10px;
		padding: 0;
		background: linear-gradient(
			to right,
			rgb(255, 0, 0) 0%,
			rgb(255, 255, 0) 17%,
			rgb(0, 255, 0) 33%,
			rgb(0, 255, 255) 50%,
			rgb(0, 0, 255) 67%,
			rgb(255, 0, 255) 83%,
			rgb(255, 0, 0) 100%
		);
		cursor: pointer;
	}
</style>
