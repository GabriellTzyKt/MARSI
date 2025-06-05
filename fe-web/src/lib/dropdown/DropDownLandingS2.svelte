<script lang="ts">
	import { slide } from 'svelte/transition';
	import img from '../../asset/profile/jdpp.jpg';
	import { data_showraja } from '$lib/dummy';

	let {
		files = $bindable([]),
		existingPreviews = [],
		judulSection,
		name_hidden,
		name_header,
		dataambil,
		name_deskripsi,
		name_gambar
	} = $props();

	let filePreviews: { name: string; url: string; isNew: boolean; id?: string|number }[] = $state([]);
	let initialized = false;

	$effect(() => {
		if (!initialized && existingPreviews && existingPreviews.length > 0) {
			filePreviews = [...existingPreviews];
			initialized = true;
			let allIds = existingPreviews.map((item) => item.id);
			console.log('File preview : ', filePreviews);
			console.log('Existing ID : ', allIds);
		}
	});

	let fileInput: HTMLInputElement;

	function handleFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files) {
			const newFiles = Array.from(input.files);
			files = [...files, ...newFiles];
			filePreviews = [
				...filePreviews,
				...newFiles.map((file) => ({
					name: file.name,
					url: URL.createObjectURL(file),
					isNew: true
				}))
			];
		}
	}

	function rmfile(index: number) {
		const removed = filePreviews[index];
		filePreviews = filePreviews.filter((_, i) => i !== index);

		if (removed.id) {
			// Hapus dari existingPreviews juga jika ada id (gambar lama)
			existingPreviews = existingPreviews.filter((item) => item.id !== removed.id);
		}
		if (removed.isNew) {
			// Hapus dari files jika file baru
			files = files.filter((_, i) => i !== index - existingPreviews.length);
		}
	}

	let value = $state(false);
	function toggle() {
		value = !value;
		if (value) {
			console.log('File preview saat buka:', filePreviews);
			console.log('data : ', dataambil);
		}
	}
</script>

<div class="me-4 ms-4">
	<div
		class="flex cursor-pointer justify-between border-x border-t border-gray-500 bg-blue-400 transition-transform duration-100"
		class:rounded-xl={!value}
		class:rounded-t-xl={value}
		class:border-x={value}
		class:border={!value}
		onclick={toggle}
	>
		<div>
			<p class="ms-4 py-2 text-xl text-white">{judulSection}</p>
		</div>
		<div class="me-4 flex items-center transition-transform duration-100" class:rotate-180={value}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="white"
				class="size-6"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
			</svg>
		</div>
	</div>

	<input type="hidden" name={name_header} value={dataambil.judul_section} />
	<input type="hidden" name={name_deskripsi} value={dataambil.isi_section} />
	<input hidden name={name_hidden} value={existingPreviews.map((item) => item.id).join(',')} />

	{#if value}
		<div
			class="flex flex-col rounded-b-xl border-x border-b border-gray-500 bg-white p-4 pb-6"
			transition:slide={{ duration: 150 }}
		>
			<div class="mt-1 flex flex-col">
				<div><p class="text-xl">Header Section</p></div>
				<div class="mt-1">
					<input
						type="text"
						class="w-full rounded-lg border border-gray-400 py-2 pe-2 ps-2 shadow-xl focus:border-gray-400 focus:outline-none focus:ring-0"
						name={name_header}
						bind:value={dataambil.judul_section}
						placeholder="John Doe"
					/>
				</div>
			</div>
			<div class="mt-6 flex flex-col">
				<div><p class="text-xl">Deskripsi Section</p></div>
				<div class="mt-1">
					<textarea
						name={name_deskripsi}
						bind:value={dataambil.isi_section}
						class="w-full rounded-lg border border-gray-400 p-2 shadow-xl focus:border-gray-400 focus:outline-none focus:ring-0"
						placeholder="Lorem ipsum dolor sit amet..."
						rows="5"
					></textarea>
				</div>
			</div>
			<input hidden name={name_hidden} value={existingPreviews.map((item) => item.id).join(',')} />
			<div class="my-4 flex w-full flex-col items-center justify-center">
				<div class="flex w-full">
					<p class="text-left text-xl">Gambar Section</p>
				</div>
				<div
					class="flex max-h-40 max-w-[200px] gap-3 overflow-x-auto whitespace-nowrap lg:max-w-[1050px]"
				>
					<!-- Input file -->
					<div class="flex h-32 min-w-40 shrink-0">
						<label
							class="relative flex h-auto w-full items-center justify-center rounded-xl bg-gray-500"
						>
							<input
								type="file"
								name={name_gambar}
								class="absolute inset-0 cursor-pointer opacity-0"
								onchange={handleFileChange}
								multiple
								bind:this={fileInput}
							/>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="white"
								class="size-10"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
								/>
							</svg>
						</label>
					</div>
					<!-- Preview dan hapus -->
					{#each filePreviews as file, i}
						<div class="relative flex h-32 min-w-40 shrink-0">
							<img src={file.url} class="h-auto w-full rounded-xl" alt={file.name} />
							<div
								class="absolute right-2 top-2 rounded-xl bg-red-500 p-2"
								onclick={() => rmfile(i)}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="white"
									class="size-4"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
									/>
								</svg>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>
