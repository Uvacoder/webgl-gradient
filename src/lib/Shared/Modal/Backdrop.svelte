<script lang="ts">
	export let closeModal: () => void;
</script>

<div
	on:pointerdown={(e) => {
		if (e.target === e.currentTarget) {
			e.preventDefault();
			e.stopPropagation();
			closeModal();
		}
	}}
>
	<slot />
</div>

<style>
	div {
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 255, 0.3);
		position: absolute;
		top: 0;
		left: 0;
		user-select: none;
	}
</style>
