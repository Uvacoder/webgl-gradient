<script lang="ts">
	import { getContext } from "svelte";

	import type {
		ColorPickerStateContext,
		Marker,
		UpdateMarker,
	} from "../../types";
	import { markerRGBAString, markerTransform } from "../utils";
	export let marker: Marker;
	export let updateMarker: UpdateMarker;

	const { openColorPicker } =
		getContext<ColorPickerStateContext>("color_picker");
	const markerSize = 24;

	// TODO: Problem with cursor still
</script>

<div
	id={marker.id}
	tabindex="0"
	class="outer {marker.selected ? 'selected' : ''} {marker.visible
		? ''
		: 'hidden'}"
	style="
	transform: {markerTransform(marker.position, markerSize)}; 
	width: {markerSize}px; 
	height: {markerSize}px;
	"
	on:pointerdown={(e) => {
		if (e.buttons !== 1) return;
		e.currentTarget.parentElement.appendChild(e.currentTarget);
		updateMarker(marker.id, { selected: true });
	}}
	on:keydown={(e) => {
		if (e.code === "Enter" || e.code === "Space") {
			openColorPicker(marker.id, e.currentTarget, marker.color);
		}
	}}
	on:contextmenu={(e) => {
		e.preventDefault();
		// TODO: Position picker to not overlap with marker
		openColorPicker(marker.id, e.currentTarget, marker.color);
	}}
>
	<div class="inner">
		<div
			class="fill"
			style="background-color: {markerRGBAString(marker.color)}"
		/>
	</div>
</div>

<style>
	.outer {
		position: absolute;
		top: 0;
		left: 0;
		border: 2px solid black;
		border-radius: 50%;
		outline: none;
		cursor: pointer;
	}

	.hidden {
		visibility: hidden;
		pointer-events: none;
		touch-action: none;
	}

	.outer.selected {
		outline: 2px solid red;
	}

	.inner {
		width: 100%;
		height: 100%;
		border: 2px solid white;
		border-radius: inherit;
	}

	.fill {
		width: 100%;
		height: 100%;
		border-radius: inherit;
	}
</style>
