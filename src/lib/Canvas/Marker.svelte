<svelte:options immutable={true} />

<script lang="ts">
	import type { Marker, UpdateMarker } from "../../types";
	export let marker: Marker;
	export let updateMarker: UpdateMarker;

	const markerSize = 24;
	$: cursor = marker.selected ? "grab" : "pointer";
</script>

<div
	id={marker.id}
	class="outer"
	style="
	transform: translate({marker.x - markerSize / 2}px, {marker.y -
		markerSize / 2}px); 
	width: {markerSize}px; 
	height: {markerSize}px;
	cursor: {cursor};
	"
	on:pointerdown={(e) => {
		e.currentTarget.parentElement.appendChild(e.currentTarget);
		updateMarker(marker.id, { selected: true });
	}}
	on:pointerup={() => updateMarker(marker.id, { selected: false })}
>
	<div class="inner">
		<div
			class="fill"
			style="background-color: rgb({marker.r}, {marker.g}, {marker.b})"
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
