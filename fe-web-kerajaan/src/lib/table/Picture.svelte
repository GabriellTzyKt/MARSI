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
	let fileTypes = $state<Record<number, string>>({});

	console.log(data);

	async function getPick() {
		loading = true;
		imageUrls = [];
		fileTypes = {};
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
			const results = await Promise.all(
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
								const url = `${env.PUBLIC_URL_KERAJAAN || ''}/file?file_path=${encodeURIComponent(path)}`;
								// Determine file type based on extension
								const fileType = getFileType(path);
								return { url, fileType };
							}
							return null;
						});
					} catch (error) {
						console.error(`Error fetching file for ID ${id}:`, error);
						return null;
					}
				})
			);

			// Flatten array and filter out nulls
			const fileResults = results
				.filter((result) => result !== null)
				.flat()
				.filter((result) => result !== null);

			// Separate URLs and file types
			imageUrls = fileResults.map((result) => result.url);
			fileResults.forEach((result, index) => {
				fileTypes[index] = result.fileType;
			});

			console.log('Final file URLs:', imageUrls);
			console.log('File types:', fileTypes);
		} catch (error) {
			console.error('Error in getPick():', error);
		} finally {
			loading = false;
		}
	}

	// Function to determine file type based on file path
	function getFileType(path: string): string {
		const extension = path.split('.').pop()?.toLowerCase();

		// Video extensions
		if (['mp4', 'webm', 'ogg', 'mov', 'avi', 'wmv', 'flv', 'mkv'].includes(extension)) {
			return 'video';
		}

		// Audio extensions
		if (['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a'].includes(extension)) {
			return 'audio';
		}

		// Default to image
		return 'image';
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
		if (Object.keys(imagesLoad).length === imageUrls.length) {
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

<div
	class="flex max-h-60 max-w-[300px] gap-2 overflow-x-auto overflow-y-hidden whitespace-nowrap p-1"
>
	{#if loading}
		<div class="inset-0 z-10 flex items-center justify-center bg-white/60">
			<div
				class="border-t-customYellow h-5 w-5 animate-spin rounded-full border-2 border-gray-300"
			></div>
		</div>
	{/if}
	{#if imageUrls.length > 0}
		{#each imageUrls as file, i}
			{#if fileTypes[i] === 'video'}
				<div class="relative inline-block h-40 w-48 min-w-[12rem] overflow-hidden rounded-xl">
					<video
						src={file}
						class="h-full w-full object-cover"
						controls
						on:loadeddata={() => handleI(i)}
						on:error={() => handleI(i)}
					></video>
				</div>
			{:else if fileTypes[i] === 'audio'}
				<div
					class="inline-flex h-40 w-48 min-w-[12rem] flex-col items-center justify-center rounded-xl bg-gray-100 p-2"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-8 w-8 text-gray-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
						/>
					</svg>
					<audio
						controls
						class="mt-2 w-full"
						src={file}
						on:loadeddata={() => handleI(i)}
						on:error={() => handleI(i)}
					></audio>
				</div>
			{:else}
				<a href={file}>
					<div class="inline-block h-40 w-40 min-w-[10rem] overflow-hidden rounded-xl">
						<img
							src={file}
							class="h-full w-full object-cover"
							alt=""
							on:load={() => handleI(i)}
							on:error={() => handleI(i)}
						/>
					</div>
				</a>
			{/if}
		{/each}
	{:else if imageUrls.length === 0 && !loading}
		<p class="text-sm text-gray-500">No files</p>
	{/if}
</div>
