<script lang="ts">
	import type {
		ColorPicker as ColorPickerState,
		ColorPickerContextType,
		UpdateMarker,
	} from "src/types";

	import { setContext } from "svelte";
	import { rgbToHsv } from "./colorpicker";
	import ColorPicker from "./ColorPicker.svelte";

	export let updateMarker: UpdateMarker;

	let pickerState: ColorPickerState = {
		id: null,
		color: null,
		position: null,
	};

	setContext<ColorPickerContextType>("color_picker", {
		openColorPicker: (id, elem, color) => {
			const hsvColor = rgbToHsv(color.r, color.g, color.b, color.a);

			const elemBBox = elem.getBoundingClientRect();
			pickerState = {
				id,
				color: hsvColor,
				position: { x: elemBBox.x, y: elemBBox.y + elemBBox.height },
			};
		},
		closeColorPicker: () => {
			pickerState = { id: null, color: null, position: null };
		},
	});
</script>

<slot />
{#if pickerState.id}
	<ColorPicker bind:state={pickerState} {updateMarker} />
{/if}
