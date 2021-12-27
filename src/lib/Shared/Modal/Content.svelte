<script lang="ts">
	import { getFocusableElements } from "../../utils";

	import { onMount } from "svelte";

	export let closeModal: () => void;

	let contentRef: HTMLElement;
	let focusableElements: HTMLElement[] = [];

	onMount(() => {
		// Get focusable element list
		focusableElements = getFocusableElements(contentRef);

		if (focusableElements.length) {
			focusableElements[0].focus();
		}
	});

	const onKeyDown = (e: KeyboardEvent) => {
		e.stopPropagation();

		// Close Modal
		if (e.code === "Escape") {
			closeModal();
		}

		// Trap focus
		if (e.code === "Tab") {
			if (e.shiftKey) {
				if (e.target === focusableElements[0]) {
					e.preventDefault();
					focusableElements[focusableElements.length - 1].focus();
				}
			} else {
				if (
					e.target === focusableElements[focusableElements.length - 1]
				) {
					e.preventDefault();
					focusableElements[0].focus();
				}
			}
		}
	};
</script>

<div
	class="content"
	bind:this={contentRef}
	role="dialog"
	aria-modal={true}
	on:keydown={onKeyDown}
>
	<button on:click={closeModal}>Close</button>
	<slot />
</div>

<style>
	div {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
</style>
