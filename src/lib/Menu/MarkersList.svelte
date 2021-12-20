<script lang="ts">
	import type { DeleteMarker, Marker, UpdateMarker } from "src/types";

	export let markers: Marker[];
	export let deleteMarker: DeleteMarker;
	export let updateMarker: UpdateMarker;
</script>

<ul>
	{#each markers as { id, r, g, b } (id)}
		<li>
			<div>ID: {id}</div>
			<button class="color" style="background-color: rgb({r},{g},{b});" />
			<button
				on:click={() => {
					const r = Math.round(Math.random() * 255);
					const g = Math.round(Math.random() * 255);
					const b = Math.round(Math.random() * 255);
					updateMarker(id, { r, g, b });
				}}>Color</button
			>
			<button on:click={() => deleteMarker(id)}>Delete</button>
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
