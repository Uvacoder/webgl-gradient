<script lang="ts">
	import ColorPicker from "../ColorPicker/ColorPicker.svelte";
	import type {
		DeleteMarker,
		Marker,
		UpdateMarker,
		ColorPicker as ColorPickerState,
	} from "src/types";
	import { rgbToHsv } from "../ColorPicker/colorpicker";

	export let markers: Marker[];
	export let deleteMarker: DeleteMarker;
	export let updateMarker: UpdateMarker;

	let pickerState: ColorPickerState = {
		id: null,
		color: null,
		position: null,
	};

	const openColorPicker = (
		id: string,
		elem: HTMLElement,
		color: Marker["color"]
	) => {
		const hsvColor = rgbToHsv(color.r, color.g, color.b, color.a);

		const elemBBox = elem.getBoundingClientRect();
		pickerState = {
			id,
			color: hsvColor,
			position: { x: elemBBox.x, y: elemBBox.y + elemBBox.height },
		};
	};

	const closeColorPicker = () => {
		pickerState = { id: null, color: null, position: null };
	};
</script>

<ul>
	{#each markers as { id, color } (id)}
		<li>
			<div>ID: {id}</div>
			<button
				class="color"
				style="background-color: rgba({color.r},{color.g},{color.b}, {color.a});"
				on:click={(e) => {
					openColorPicker(id, e.currentTarget, color);
				}}
			/>
			<button
				on:click={() => {
					if (pickerState.id) {
						closeColorPicker();
					}
					deleteMarker(id);
				}}>Delete</button
			>
		</li>
	{/each}
	{#if pickerState.id}
		<ColorPicker
			bind:state={pickerState}
			{updateMarker}
			{closeColorPicker}
		/>
	{/if}
</ul>

<style>
	ul {
		list-style-type: none;
	}

	li {
		margin: 1rem 0;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}

	.color {
		width: 24px;
		height: 24px;
		border: 2px solid black;
		border-radius: 6px;
	}
</style>
