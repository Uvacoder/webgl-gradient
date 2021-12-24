<script lang="ts">
	import type {
		ColorPickerContextType,
		DeleteMarker,
		Marker,
		UpdateMarker,
	} from "src/types";
	import { getContext } from "svelte";

	export let markers: Marker[];
	export let deleteMarker: DeleteMarker;

	const { openColorPicker, closeColorPicker } =
		getContext<ColorPickerContextType>("color_picker");
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
					closeColorPicker();
					deleteMarker(id);
				}}>Delete</button
			>
		</li>
	{/each}
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
