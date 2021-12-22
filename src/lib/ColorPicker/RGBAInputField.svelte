<script lang="ts">
	import type { ColorPicker } from "src/types";
	import { hsvToRgb, rgbToHsv, toColorInput } from "./colorpicker";

	export let color: ColorPicker["color"];

	$: rgb = hsvToRgb(color.hue, color.saturation, color.value);
</script>

{#if rgb}
	<fieldset>
		<legend>RGB</legend>

		<input
			aria-label="Rgb red channel input"
			type="number"
			inputMode="numeric"
			min={0}
			max={255}
			value={toColorInput(rgb.r)}
			on:input={(e) => {
				let val = Number(e.currentTarget.value) || 0;
				if (val > 255) val = 255;
				const hsv = rgbToHsv(val, rgb.g, rgb.b, color.alpha);
				color = hsv;
			}}
		/>

		<input
			aria-label="Rgb green channel input"
			type="number"
			inputMode="numeric"
			min={0}
			max={255}
			value={toColorInput(rgb.g)}
			on:input={(e) => {
				let val = Number(e.currentTarget.value) || 0;
				if (val > 255) val = 255;
				const hsv = rgbToHsv(rgb.r, val, rgb.b, color.alpha);
				color = hsv;
			}}
		/>

		<input
			aria-label="Rgb blue channel input"
			type="number"
			inputMode="numeric"
			min={0}
			max={255}
			value={toColorInput(rgb.b)}
			on:input={(e) => {
				let val = Number(e.currentTarget.value) || 0;
				if (val > 255) val = 255;
				const hsv = rgbToHsv(rgb.r, rgb.g, val, color.alpha);
				color = hsv;
			}}
		/>

		<input
			aria-label="Alpha channel input"
			type="number"
			inputMode="decimal"
			step={0.01}
			min={0}
			max={1}
			value={color.alpha !== 0
				? Number(color.alpha.toString().replace(/^0+/, ""))
				: 0}
			on:input={(e) => {
				const val = Number(e.currentTarget.value);
				color.alpha = val;
			}}
		/>
	</fieldset>
{/if}

<style>
	fieldset {
		margin: 1rem 0;
		padding: 0;
		border: none;
		display: flex;
		justify-content: space-between;
	}

	input {
		width: 40px;
	}
</style>
