<script lang="ts">
	let { dokumentasi, data } = $props<{
		dokumentasi?: string[];
		data?: any;
	}>();

	let imagesLoad = $state<Record<number, boolean>>({});
	let loading = $state(true);

	let imagesDisplay = $derived(
		Array.isArray(data?.dokumentasi)
			? data.dokumentasi
			: Array.isArray(dokumentasi)
				? dokumentasi
				: []
	);
	function handleI(index: number) {
		imagesLoad[index] = true;
		if (Object.keys(imagesLoad).length === imagesDisplay.length) {
			loading = false;
		}
	}
	$effect(() => {
		if (imagesDisplay.length === 0) {
			loading = false;
		} else loading = true;
	});
</script>

<div class="flex max-h-60 max-w-[300px] gap-x-2 overflow-auto p-1">
	{#if imagesDisplay.length > 0}
		{#each imagesDisplay as file, i}
			<img
				src={file}
				class="h-auto w-full rounded-xl"
				alt=""
				onload={() => {
					handleI(i);
				}}
				onerror={() => handleI(i)}
			/>
		{/each}
		{#if loading}
			<div class=" inset-0 z-10 flex items-center justify-center bg-white/60">
				<div
					class="border-t-customYellow h-5 w-5 animate-spin rounded-full border-2 border-gray-300"
				></div>
			</div>
		{/if}
	{:else}
		<p class="text-sm text-gray-500">No images</p>
	{/if}
</div>
