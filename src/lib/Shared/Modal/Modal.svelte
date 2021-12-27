<script lang="ts">
	import Backdrop from "./Backdrop.svelte";
	import Content from "./Content.svelte";

	export let open: boolean;
	let openerElement: HTMLElement;

	$: if (open) {
		openerElement = document.activeElement as HTMLElement;
	}

	const closeModal = () => {
		open = false;
		openerElement.focus();
	};

	// Work w/ portals if possible
</script>

<slot name="modal_open" />
{#if open}
	<div class="modal">
		<Backdrop {closeModal} />
		<Content {closeModal}>
			<slot name="modal_content" />
		</Content>
	</div>
{/if}

<style>
	.modal {
		z-index: 5;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
</style>
