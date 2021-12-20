<script lang="ts">
	export let createMarker: Function;
</script>

<div>
	<button style="margin-right: auto;" on:click={() => createMarker()}
		>Create Marker</button
	>
	<button>Save</button>
	<button>Hide Markers</button>
</div>

<style>
	div {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: flex-end;
		height: 100px;
		background-color: rgb(161, 152, 152);
	}
</style>
