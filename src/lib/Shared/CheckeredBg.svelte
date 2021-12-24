<script lang="ts">
	export let size: number;
</script>

<div
	style="
        background-size: {size}px {size}px;
        background-position: 0 0, 0 {size / 2}px, {size / 2}px -{size /
		2}px, -{size / 2}px 0px;
    "
/>

<style>
	div {
		width: 100%;
		height: 100%;
		pointer-events: none;
		background-image: linear-gradient(45deg, #acacac 25%, transparent 25%),
			linear-gradient(-45deg, #acacac 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, #acacac 75%),
			linear-gradient(-45deg, transparent 75%, #acacac 75%);
	}
</style>
