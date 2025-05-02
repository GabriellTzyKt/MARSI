<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { onMount } from 'svelte';

	let { dokumentasi, data } = $props<{
		dokumentasi?: string[];
		data?: any;
	}>();

	let imagesLoad = $state<Record<number, boolean>>({});
	let loading = $state(true);
	let imageUrls = $state<string[]>([]);
	console.log(data);
	async function getPick() {
		loading = true;
		imageUrls = [];
		let docs_id: string[] = [];

		// Extract document IDs from either data.dokumentasi or dokumentasi prop
		if (data?.dokumentasi) {
			if (typeof data.dokumentasi === 'string') {
				docs_id = data.dokumentasi.split(',').map((id) => id.trim());
			} else if (Array.isArray(data.dokumentasi)) {
				docs_id = data.dokumentasi;
			}
		} else if (Array.isArray(dokumentasi)) {
			docs_id = dokumentasi;
		}

		if (docs_id.length === 0) {
			loading = false;
			return;
		}

		console.log('Document IDs to fetch:', docs_id);

		try {
			// Fetch file paths for each document ID
			const urls = await Promise.all(
				docs_id.map(async (id) => {
					try {
						// Step 1: Fetch document metadata
						const response = await fetch(`${env.PUBLIC_URL_KERAJAAN || ''}/doc/${id}`);
						if (!response.ok) {
							console.error(`Failed to fetch doc/${id}: ${response.status}`);
							return null;
						}

						// Step 2: Extract file_dokumentasi path
						const docData = await response.json();
						const filePaths = docData.file_dokumentasi || docData;
						console.log(filePaths);
						// Handle both array and string responses
						const pathsArray = Array.isArray(filePaths) ? filePaths : [filePaths];

						// Step 3: Convert each path to a full URL with the /file endpoint
						return pathsArray.map((path) => {
							if (typeof path === 'string') {
								return `${env.PUBLIC_URL_KERAJAAN || ''}/file?file_path=${encodeURIComponent(path)}`;
							}
							return null;
						});
					} catch (error) {
						console.error(`Error fetching image for ID ${id}:`, error);
						return null;
					}
				})
			);

			// Flatten array and filter out nulls
			imageUrls = urls
				.filter((url) => url !== null)
				.flat()
				.filter((url) => url !== null);

			console.log('Final image URLs:', imageUrls);
		} catch (error) {
			console.error('Error in getPick():', error);
		} finally {
			if (imageUrls.length === 0) {
				loading = false;
			}
			loading = false;
		}
	}

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
	$effect(() => {});
	onMount(() => {
		getPick();
	});

	$effect(() => {
		// Re-fetch when data or dokumentasi changes
		getPick();
	});
</script>

<div class="flex max-h-60 max-w-[300px] gap-x-2 overflow-auto p-1">
	{#if loading}
		<div class="inset-0 z-10 flex items-center justify-center bg-white/60">
			<div
				class="border-t-customYellow h-5 w-5 animate-spin rounded-full border-2 border-gray-300"
			></div>
		</div>
	{/if}
	{#if imageUrls.length > 0}
		{#each imageUrls as file, i}
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
	{:else if imageUrls.length === 0}
		<p class="text-sm text-gray-500">No images</p>
	{:else}
		<div class="inset-0 z-10 flex items-center justify-center bg-white/60">
			<div
				class="border-t-customYellow h-5 w-5 animate-spin rounded-full border-2 border-gray-300"
			></div>
		</div>
	{/if}
</div>
