<script lang="ts">
	import type { AppContext } from "src/types";

	import { getContext, onMount } from "svelte";
	import Download from "./Download.svelte";

	export let createMarker: Function;
	let markersVisible = true;

	const { setMarkersVisibility } = getContext<AppContext>("app");

	$: setMarkersVisibility(markersVisible);

	// TODO: Remove
	onMount(() => {
		createMarker();
	});

	// Export / Download select w/ different resolutions
</script>

<div>
	<button style="margin-right: auto;" on:click={() => createMarker()}
		>Create Marker</button
	>
	<button>Save</button>
	<button
		on:click={() => {
			markersVisible = !markersVisible;
		}}>{markersVisible ? "Hide" : "Show"} Markers</button
	>
	<Download />
</div>

<style>
	div {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: flex-end;
		height: 100px;
		width: 100%;
		background-color: rgb(161, 152, 152);
	}
</style>
