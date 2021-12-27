<script lang="ts">
	import type { AppContext, CanvasContext } from "src/types";

	import { getContext } from "svelte";

	import { generateGradientImage } from "../gl";

	import Modal from "../Shared/Modal/Modal.svelte";

	let modalOpen: boolean = false;

	const { getMarkers } = getContext<AppContext>("app");
	const { getSize } = getContext<CanvasContext>("canvas");

	const downloadImage = (size: { width: number; height: number }) => {
		const markers = getMarkers();
		const bbox = getSize();

		const image = generateGradientImage(markers, bbox, size);

		const a = document.createElement("a");
		a.href = image;
		a.download = "gradient.png";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};

	const imageSizes = [
		{ width: 640, height: 480, id: "SD" },
		{ width: 1280, height: 720, id: "HD" },
		{ width: 1920, height: 1080, id: "FULL_HD" },
		{ width: 2048, height: 1080, id: "2K" },
		{ width: 3840, height: 2160, id: "4K" },
		{ width: 3840, height: 2160, id: "CUSTOM" },
	];

	let sizeId = imageSizes[2].id;
</script>

<Modal bind:open={modalOpen}>
	<button
		slot="modal_open"
		on:click={() => {
			modalOpen = true;
		}}>Download</button
	>
	<div slot="modal_content">
		<fieldset>
			{#each imageSizes as { id, width, height }}
				<div>
					<input
						type="radio"
						{id}
						bind:group={sizeId}
						name="download_size"
						value={id}
					/>
					<label for={id}>{id} | {width} * {height}</label>
					{#if id === "CUSTOM"}
						<label for="custom_width">Width</label>
						<input
							id="custom_width"
							type="number"
							bind:value={width}
						/>
						<label for="custom_height">Height</label>
						<input
							id="custom_height"
							type="number"
							bind:value={height}
						/>{/if}
				</div>
			{/each}
		</fieldset>
		<button
			on:click={() => {
				const index = imageSizes.findIndex((s) => s.id === sizeId);
				if (index < 0) return;

				downloadImage(imageSizes[index]);
			}}>Download</button
		>
	</div>
</Modal>

<style>
	div {
		background-color: white;
		background-color: white;
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1),
			0 2px 4px -2px rgb(0 0 0 / 0.1);
		border-radius: 5px;
		padding: 1rem;
	}
</style>
