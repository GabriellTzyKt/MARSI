<script lang="ts">
	import Pagination from '$lib/table/Pagination.svelte';
	import Search from '$lib/table/Search.svelte';
	import Table from '$lib/table/Table.svelte';
	import DropDown from '$lib/dropdown/DropDown.svelte';
	import DeleteModal from '$lib/popup/DeleteModal.svelte';
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import SModal from '$lib/popup/SModal.svelte';

	let currPage = $state(1);
	let entries = $state(10);
	let keyword = $state('');
	let deleteD = $state(false);
	let success = $state(false);
	let selesaiOpen = $state(false);
	let sedangDiprosesOpen = $state(false);
	let sedangDiprosesOpen2 = $state(false);
	let diajukanOpen = $state(false);

	let { data } = $props();
	const dataArsip = data.dataArsip || [];
	console.log("u : ", dataArsip);

	function filterData(data: any[]) {
		return data.filter((item) =>
			item?.asal_kerajaan?.toLowerCase().includes(keyword.toLowerCase())
		);
	}

	function pagination(data: any[]) {
		const filter = filterData(data);
		const start = (currPage - 1) * entries;
		const end = start + entries;
		return filter.slice(start, end);
	}

	// Memastikan datanya dalam bentuk array
	let arsipArray = $state(Array.isArray(data.dataArsip) ? data.dataArsip : []);
	let resData = $derived(pagination(Array.isArray(data.dataArsip) ? data.dataArsip : []));
	let total_pages = $derived(
		Math.ceil(filterData(Array.isArray(data.dataArsip) ? data.dataArsip : []).length / entries)
	);

	$effect(() => {
		if (keyword || entries) {
			currPage = 1;
		}
	});

	// Check if we have an ID in the URL for deletion
	$effect(() => {
		const urlParams = new URLSearchParams(page.url.search);
		const deleteId = urlParams.get('delete');

		if (deleteId) {
			console.log('Found delete ID in URL:', deleteId);
			deleteD = true;
			// Store the ID for the delete operation
			selectedItemId = deleteId;
		}
	});

	let selectedItemId = $state<string | null>(null);
	let selectedItem = $state<any>(null);

	let videoName: string | null = $state('Silahkan Upload!');


	function handleFileChange(event: Event, type: string) {
		const target = event.target as HTMLInputElement;

		if (target.files && target.files.length > 0) {
			const newFiles = Array.from(target.files);

			if (type === 'video') {
				videoName = newFiles[0].name;
			}
		}
	}
</script>

<div class="mt-5 flex w-full flex-col xl:mt-0">
	<div class="test flex flex-col justify-center xl:mt-0 xl:flex-row xl:justify-between">
		<div class="col-start-1 mb-4 flex flex-row items-center justify-center xl:mb-0"></div>
		<div class="flex flex-col items-center justify-center gap-3 xl:flex-row xl:justify-end">
			<div class="flex justify-between gap-3 rounded-lg border border-[#818181] bg-white">
				<div class="ms-2 flex grow">
					<input
						type="text"
						class="border-none focus:outline-none focus:ring-0"
						placeholder="cari arsip"
						bind:value={keyword}
						name=""
						id=""
					/>
				</div>
				<div class="me-2 flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
						/>
					</svg>
				</div>
			</div>
			<div class="flex items-center gap-3">
				<p>Show</p>
				<input
					type="number"
					class="flex w-16 justify-center rounded-lg border border-[#818181] bg-white focus:outline-none"
					name=""
					bind:value={entries}
					id=""
				/>
				<p>entries</p>
			</div>
		</div>
	</div>
	<Table
		table_header={[
			['asal_kerajaan', 'Asal Kerajaan'],
			['link_website', 'Link Website Kerajaan'],
			['tanggal_buat', 'Tanggal Request Dibuat'],
			['tanggal_selesai', 'Tanggal Request Selesai'],
			['status', 'Status'],
			['children', 'Aksi']
		]}
		table_data={resData}
	>
		{#snippet children({ header, data })}
			{#if header === 'Aksi'}
				<div class="flex justify-center gap-2">
					{#if data.status === 'Ditinjau'}
						<!-- svelte-ignore a11y_consider_explicit_label -->
						<button
							class="bg-customOrange2 rounded-lg p-1 text-white"
							onclick={() => {
								selectedItemId = data.id_permintaan;
								const selectedData = arsipArray.find(
									(item) => item.id_permintaan === Number(selectedItemId)
								);
								if (selectedData) {
									selectedItem = selectedData;
									{
										console.log('Selected : ', selectedItem);
									}
								}
								diajukanOpen = true;
							}}
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
								><path fill="currentColor" d="m10 17l5-5l-5-5z" /></svg
							>
						</button>
					{:else if data.status === 'Diproses'}
						<!-- svelte-ignore a11y_consider_explicit_label -->
						<div class="flex flex-row gap-2">
							<button
								class="rounded-full bg-yellow-400 p-1.5 text-white"
								onclick={() => {
									selectedItemId = data.id_permintaan;
									{
										console.log('Selected ID : ', selectedItemId);
									}

									const selectedData = arsipArray.find(
										(item) => item.id_permintaan === Number(selectedItemId)
									);
									if (selectedData) {
										selectedItem = selectedData;
										{
											console.log('Selected : ', selectedItem);
										}
									}
									sedangDiprosesOpen = true;
								}}
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"
									><path
										fill="currentColor"
										d="M2.93 17.07A10 10 0 1 1 17.07 2.93A10 10 0 0 1 2.93 17.07m12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32M9 5h2v6H9zm0 8h2v2H9z"
									/></svg
								>
							</button>

							<button
								class="bg-customOrange2 rounded-lg p-1 text-white"
								onclick={() => {
									selectedItemId = data.id_permintaan;
									const selectedData = arsipArray.find(
										(item) => item.id_permintaan === Number(selectedItemId)
									);
									if (selectedData) {
										selectedItem = selectedData;
									}
									sedangDiprosesOpen2 = true;
								}}
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
									><path fill="currentColor" d="m10 17l5-5l-5-5z" /></svg
								>
							</button>
						</div>
					{:else if data.status === 'Selesai'}
						<!-- svelte-ignore a11y_consider_explicit_label -->
						<button
							class="rounded-full bg-green-500 p-1.5 text-white hover:bg-green-600"
							onclick={() => {
								selectedItemId = data.id_permintaan;
								const selectedData = arsipArray.find(
									(item) => item.id_permintaan === Number(selectedItemId)
								);
								if (selectedData) {
									selectedItem = selectedData;
								}
								selesaiOpen = true;
							}}
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"
								><path
									fill="currentColor"
									d="M2.93 17.07A10 10 0 1 1 17.07 2.93A10 10 0 0 1 2.93 17.07m12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32M9 5h2v6H9zm0 8h2v2H9z"
								/></svg
							>
						</button>
					{/if}
				</div>
			{/if}
		{/snippet}
	</Table>

	<div class="mt-4 flex flex-col lg:flex-row lg:justify-between">
		<div>
			<p>
				Showing {(currPage - 1) * entries + 1}
				to {Math.min(
					currPage * entries,
					filterData(Array.isArray(data.dataArsip) ? data.dataArsip : []).length
				)}
				of {filterData(Array.isArray(data.dataArsip) ? data.dataArsip : []).length}
			</p>
		</div>
		<div class="flex flex-row gap-3">
			<button
				class="rounded-lg bg-white px-3 py-2 hover:bg-[#F9D48B]"
				disabled={currPage === 1}
				onclick={() => {
					currPage--;
				}}>Previous</button
			>
			{#each Array(total_pages) as _, i}
				<button
					class="rounded-lg p-4"
					class:bg-[#F9D48B]={currPage === i + 1}
					class:text-white={currPage === i + 1}
					onclick={() => (currPage = i + 1)}>{i + 1}</button
				>
			{/each}
			<button
				class="rounded-lg bg-white px-3 py-2 hover:bg-[#F9D48B]"
				disabled={currPage === total_pages}
				onclick={() => {
					currPage++;
				}}>Next</button
			>
		</div>
	</div>
</div>

{#if selesaiOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
		<div class="w-full max-w-2xl rounded-lg bg-white shadow-lg">
			<div
				class="flex w-full cursor-pointer items-center justify-between rounded-t-lg border bg-gray-100 px-4 py-3"
			>
				<p class="font-medium">Detail Aplikasi Kerajaan</p>
				<!-- svelte-ignore a11y_consider_explicit_label -->
				<!-- svelte-ignore a11y_invalid_attribute -->
				<button class="focus:outline-none" onclick={() => (selesaiOpen = false)}>
					<span class="basil--cross-outline"></span>
				</button>
			</div>
			<div
				class="rounded-b-lg border-x border-b bg-white p-4 transition-all duration-300 ease-in-out"
			>
				<p>
					Asal Kerajaan : {selectedItem?.asal_kerajaan || '-'}
				</p>
				<p>
					Tanggal Request Diselesaikan : {selectedItem?.tanggal_selesai || '-'}
				</p>
				<div class="mb-4 mt-2">
					<p>Link Website Kerajaan</p>
					<input
						type="text"
						class="mt-2 w-full rounded-lg border border-gray-400 py-2 pe-2 ps-2 focus:border-gray-400 focus:outline-none focus:ring-0"
						name=""
						value={selectedItem?.link_website || ''}
						id=""
						readonly
					/>
				</div>

				{#if selectedItem?.mobileFeatures !== null}
					<div class="mb-4">
						<p>Aplikasi Kerajaan</p>
						<input
							type="text"
							class="mt-2 w-full rounded-lg border border-gray-400 py-2 pe-2 ps-2 focus:border-gray-400 focus:outline-none focus:ring-0"
							name=""
							placeholder="kerajaantest.apk"
							id=""
							readonly
						/>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

{#if sedangDiprosesOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
		<div class="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-lg bg-white shadow-lg">
			<div class="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-4">
				<p class="font-medium">Detail Aplikasi Kerajaan</p>
				<!-- svelte-ignore a11y_consider_explicit_label -->
				<button class="focus:outline-none" onclick={() => (sedangDiprosesOpen = false)}>
					<span class="basil--cross-outline"></span>
				</button>
			</div>

			<div class="rounded-b-lg p-4 transition-all duration-300 ease-in-out">
				<p class="ml-5">Asal Kerajaan : {selectedItem?.asal_kerajaan || '-'}</p>
				<p class="ml-5">Tanggal Request Dibuat : {selectedItem?.tanggal_buat || '-'}</p>

				<div class="w-full px-5">
					<div class="mt-4 w-full">
						<div
							class="flex w-full cursor-pointer items-center justify-between border bg-gray-100 px-4 py-3"
						>
							<p>Detail Permintaan Anda :</p>
						</div>
						<div
							class="rounded-b-lg border-x border-b bg-white p-4 transition-all duration-300 ease-in-out"
						>
							<!-- Website Kerajaan Section -->
							<div class="mb-6">
								<div class="mb-2 grid grid-cols-12">
									<h3 class="col-span-8 text-lg font-semibold">Website Kerajaan</h3>
									<!-- svelte-ignore a11y_click_events_have_key_events -->
									<!-- svelte-ignore a11y_no_static_element_interactions -->
									<div
										class="col-span-2 cursor-pointer border-r border-gray-300 text-center font-medium"
										class:active={selectedItem?.websiteFeatures !== null}
									>
										Ya
									</div>
									<!-- svelte-ignore a11y_click_events_have_key_events -->
									<!-- svelte-ignore a11y_no_static_element_interactions -->
									<div
										class="col-span-2 cursor-pointer text-center font-medium"
										class:active={selectedItem?.websiteFeatures === null}
									>
										Tidak
									</div>
								</div>

								{#if selectedItem?.websiteFeatures !== null}
									<div class="border-t border-gray-200 pt-2">
										<!-- Fitur Situs -->
										<div class="grid grid-cols-12 py-2">
											<div class="col-span-8">Fitur Situs</div>
											<div class="col-span-2 flex justify-center border-r border-gray-300">
												<span class="text-customOrange2 text-xl">✓</span>
											</div>
											<div class="col-span-2"></div>
										</div>

										<!-- Fitur Acara -->
										<div class="grid grid-cols-12 py-2">
											<div class="col-span-8">Fitur Acara</div>
											<div class="col-span-2 flex justify-center border-r border-gray-300">
												<span class="text-customOrange2 text-xl">✓</span>
											</div>
											<div class="col-span-2"></div>
										</div>

										<!-- Fitur Aset -->
										<div class="grid grid-cols-12 py-2">
											<div class="col-span-8">Fitur Aset</div>
											<div class="col-span-2 border-r border-gray-300"></div>
											<div class="col-span-2 flex justify-center">
												<span class="text-customOrange2 text-xl">✓</span>
											</div>
										</div>

										<!-- Fitur Komunitas -->
										<div class="grid grid-cols-12 py-2">
											<div class="col-span-8">Fitur Komunitas</div>
											<div class="col-span-2 flex justify-center">
												<span class="text-customOrange2 text-xl">✓</span>
											</div>
											<div class="col-span-2 border-l border-gray-300"></div>
										</div>

										<!-- Fitur Organisasi -->
										<div class="grid grid-cols-12 py-2">
											<div class="col-span-8">Fitur Organisasi</div>
											<div class="col-span-2 flex justify-center border-r border-gray-300">
												<span class="text-customOrange2 text-xl">✓</span>
											</div>
											<div class="col-span-2"></div>
										</div>

										<!-- Fitur Tugas -->
										<div class="grid grid-cols-12 py-2">
											<div class="col-span-8">Fitur Tugas</div>
											<div class="col-span-2 border-r border-gray-300"></div>
											<div class="col-span-2 flex justify-center">
												<span class="text-customOrange2 text-xl">✓</span>
											</div>
										</div>
									</div>
								{/if}
							</div>

							<div class="border-t border-gray-300 pt-4">
								<div class="mb-2 grid grid-cols-12">
									<h3 class="col-span-8 text-lg font-semibold">Aplikasi Mobile Kerajaan</h3>
									<!-- svelte-ignore a11y_click_events_have_key_events -->
									<!-- svelte-ignore a11y_no_static_element_interactions -->
									<div
										class="col-span-2 cursor-pointer border-r border-gray-300 text-center font-medium"
										class:active={selectedItem?.mobileFeatures !== null}
									>
										Ya
									</div>
									<!-- svelte-ignore a11y_click_events_have_key_events -->
									<!-- svelte-ignore a11y_no_static_element_interactions -->
									<div
										class="col-span-2 cursor-pointer text-center font-medium"
										class:active={selectedItem?.mobileFeatures === null}
									>
										Tidak
									</div>
								</div>

								{#if selectedItem?.mobileFeatures !== null}
									<div class="border-t border-gray-200 pt-2">
										<!-- Fitur Penanggalan -->
										<div class="grid grid-cols-12 py-2">
											<div class="col-span-8">Fitur Penanggalan</div>
											<div class="col-span-2 flex justify-center border-r border-gray-300">
												{#if selectedItem.mobileFeatures.fitur_kalender === 1}
													<span class="text-customOrange2 text-xl">✓</span>
												{/if}
											</div>
											<div class="col-span-2 flex justify-center">
												{#if selectedItem.mobileFeatures.fitur_kalender === 0}
													<span class="text-customOrange2 text-xl">✓</span>
												{/if}
											</div>
										</div>

										<!-- Fitur Tugas Pribadi -->
										<div class="grid grid-cols-12 py-2">
											<div class="col-span-8">Fitur Tugas Pribadi</div>
											<div class="col-span-2 flex justify-center border-r border-gray-300">
												{#if selectedItem.mobileFeatures.fitur_tugas_pribadi === 1}
													<span class="text-customOrange2 text-xl">✓</span>
												{/if}
											</div>
											<div class="col-span-2 flex justify-center">
												{#if selectedItem.mobileFeatures.fitur_tugas_pribadi === 0}
													<span class="text-customOrange2 text-xl">✓</span>
												{/if}
											</div>
										</div>

										<!-- Fitur Tugas Acara -->
										<div class="grid grid-cols-12 py-2">
											<div class="col-span-8">Fitur Tugas Acara</div>
											<div class="col-span-2 flex justify-center border-r border-gray-300">
												{#if selectedItem.mobileFeatures.fitur_tugas_acara === 1}
													<span class="text-customOrange2 text-xl">✓</span>
												{/if}
											</div>
											<div class="col-span-2 flex justify-center">
												{#if selectedItem.mobileFeatures.fitur_tugas_acara === 0}
													<span class="text-customOrange2 text-xl">✓</span>
												{/if}
											</div>
										</div>

										<!-- Fitur Situs Kerajaan -->
										<div class="grid grid-cols-12 py-2">
											<div class="col-span-8">Fitur Situs Kerajaan</div>
											<div class="col-span-2 flex justify-center border-r border-gray-300">
												{#if selectedItem.mobileFeatures.fitur_situs === 1}
													<span class="text-customOrange2 text-xl">✓</span>
												{/if}
											</div>
											<div class="col-span-2 flex justify-center">
												{#if selectedItem.mobileFeatures.fitur_situs === 0}
													<span class="text-customOrange2 text-xl">✓</span>
												{/if}
											</div>
										</div>

										<!-- Fitur Check-In Situs -->
										<div class="grid grid-cols-12 py-2">
											<div class="col-span-8">Fitur Check-In Situs</div>
											<div class="col-span-2 flex justify-center border-r border-gray-300">
												{#if selectedItem.mobileFeatures.fitur_check_in === 1}
													<span class="text-customOrange2 text-xl">✓</span>
												{/if}
											</div>
											<div class="col-span-2 flex justify-center">
												{#if selectedItem.mobileFeatures.fitur_check_in === 0}
													<span class="text-customOrange2 text-xl">✓</span>
												{/if}
											</div>
										</div>

										<!-- Fitur Acara Kerajaan -->
										<div class="grid grid-cols-12 py-2">
											<div class="col-span-8">Fitur Acara Kerajaan</div>
											<div class="col-span-2 flex justify-center border-r border-gray-300">
												{#if selectedItem.mobileFeatures.fitur_acara === 1}
													<span class="text-customOrange2 text-xl">✓</span>
												{/if}
											</div>
											<div class="col-span-2 flex justify-center">
												{#if selectedItem.mobileFeatures.fitur_acara === 0}
													<span class="text-customOrange2 text-xl">✓</span>
												{/if}
											</div>
										</div>

										<!-- Fitur Group Chat -->
										<div class="grid grid-cols-12 py-2">
											<div class="col-span-8">Fitur Group Chat</div>
											<div class="col-span-2 flex justify-center border-r border-gray-300">
												{#if selectedItem.mobileFeatures.fitur_chat === 1}
													<span class="text-customOrange2 text-xl">✓</span>
												{/if}
											</div>
											<div class="col-span-2 flex justify-center">
												{#if selectedItem.mobileFeatures.fitur_chat === 0}
													<span class="text-customOrange2 text-xl">✓</span>
												{/if}
											</div>
										</div>

										<!-- Fitur Forum -->
										<div class="grid grid-cols-12 py-2">
											<div class="col-span-8">Fitur Forum</div>
											<div class="col-span-2 flex justify-center border-r border-gray-300">
												{#if selectedItem.mobileFeatures.fitur_forum === 1}
													<span class="text-customOrange2 text-xl">✓</span>
												{/if}
											</div>
											<div class="col-span-2 flex justify-center">
												{#if selectedItem.mobileFeatures.fitur_forum === 0}
													<span class="text-customOrange2 text-xl">✓</span>
												{/if}
											</div>
										</div>

										<!-- Fitur Permohonan -->
										<div class="grid grid-cols-12 py-2">
											<div class="col-span-8">Fitur Permohonan</div>
											<div class="col-span-2 flex justify-center border-r border-gray-300">
												{#if selectedItem.mobileFeatures.fitur_permohonan === 1}
													<span class="text-customOrange2 text-xl">✓</span>
												{/if}
											</div>
											<div class="col-span-2 flex justify-center">
												{#if selectedItem.mobileFeatures.fitur_permohonan === 0}
													<span class="text-customOrange2 text-xl">✓</span>
												{/if}
											</div>
										</div>
									</div>
								{/if}
								<div class="h-0.5 w-full bg-gray-400 opacity-40"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

{#if sedangDiprosesOpen2}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
		<div class="max-h-[90vh] w-full max-w-3xl rounded-lg bg-white shadow-lg">
			<div class="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-4">
				<p class="font-medium">Selesaikan Request</p>
				<!-- svelte-ignore a11y_consider_explicit_label -->
				<button class="focus:outline-none" onclick={() => (sedangDiprosesOpen2 = false)}>
					<span class="basil--cross-outline"></span>
				</button>
			</div>

			<div class="rounded-b-lg p-4 transition-all duration-300 ease-in-out">
				<p class="ml-5">Asal Kerajaan : {selectedItem?.asal_kerajaan || '-'}</p>
				<p class="ml-5">Tanggal Request Dibuat : {selectedItem?.tanggal_buat || '-'}</p>
				<div class="ml-5 mt-4 w-full">
					<div>
						<p>Upload Link Website Kerajaan</p>
						<input
							type="text"
							class="mt-2 w-full max-w-[90%] rounded-lg border border-gray-400 py-2 pe-2 ps-2 focus:border-gray-400 focus:outline-none focus:ring-0"
							name=""
							placeholder="https://kerajaan.com"
							id=""
						/>
					</div>
					{#if selectedItem?.mobileFeatures !== null}
						<div class="w-full flex-col">
							<p class="mt-5">Upload Aplikasi Mobile Kerajaan</p>
							<div
								class="upload-container relative mt-4 h-[44px] w-full max-w-[90%] flex-shrink-0 overflow-hidden rounded-lg border-2 border-black bg-gray-200"
							>
								<input
									type="file"
									id="fileVideo"
									class="hidden"
									name="inputvideo"
									accept="video/*"
									onchange={(e) => handleFileChange(e, 'video')}
								/>
								<label
									for="fileVideo"
									class="absolute left-0 top-0 flex h-full w-full cursor-pointer flex-col items-center justify-center"
								>
								</label>
								<div class="flex h-full w-full items-center justify-between">
									<p class="max-w-[60%] truncate px-2">{videoName}</p>
									<button class="bg-customOrange2 h-full px-4 font-semibold text-white">
										Choose file
									</button>
								</div>
							</div>
							<p class="text-md text-red-600">
								Pastikan Link atau FIle yang anda masukan sudah benar karena tidak akan bisa di edit
								atau diubah!
							</p>
						</div>
					{/if}
					<div class="mt-8 flex w-full justify-end">
						<button
							class="bg-customGold mr-5 w-auto rounded-lg px-12 py-1 text-center text-white"
							type="submit"
						>
							Selesaikan
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

{#if diajukanOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
		<div class="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-lg bg-white shadow-lg">
			<div class="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-4">
				<p class="font-medium">Request Aplikasi</p>
				<!-- svelte-ignore a11y_consider_explicit_label -->
				<button class="focus:outline-none" onclick={() => (diajukanOpen = false)}>
					<span class="basil--cross-outline"></span>
				</button>
			</div>

			<div class="rounded-b-lg p-4 transition-all duration-300 ease-in-out">
				<p class="ml-5">Asal Kerajaan : {selectedItem?.asal_kerajaan || '-'}</p>
				<p class="ml-5">Tanggal Request Dibuat : {selectedItem?.tanggal_buat || '-'}</p>

				<div class="w-full px-5">
					<div class="mt-4 w-full">
						<div
							class="flex w-full cursor-pointer items-center justify-between border bg-gray-100 px-4 py-3"
						>
							<p>Detail Permintaan Anda :</p>
						</div>
						<div
							class="rounded-b-lg border-x border-b bg-white p-4 transition-all duration-300 ease-in-out"
						>
							<!-- Website Kerajaan Section -->
							<div class="mb-6">
								<div class="mb-2 grid grid-cols-12">
									<h3 class="col-span-8 text-lg font-semibold">Website Kerajaan</h3>
									<!-- svelte-ignore a11y_click_events_have_key_events -->
									<!-- svelte-ignore a11y_no_static_element_interactions -->
									<div
										class="col-span-2 cursor-pointer border-r border-gray-300 text-center font-medium"
										class:active={selectedItem?.websiteFeatures !== null}
									>
										Ya
									</div>
									<!-- svelte-ignore a11y_click_events_have_key_events -->
									<!-- svelte-ignore a11y_no_static_element_interactions -->
									<div
										class="col-span-2 cursor-pointer text-center font-medium"
										class:active={selectedItem?.websiteFeatures === null}
									>
										Tidak
									</div>
								</div>

								{#if selectedItem?.websiteFeatures !== null}
									<div class="border-t border-gray-200 pt-2">
										<!-- Fitur Situs -->
										<div class="grid grid-cols-12 py-2">
											<div class="col-span-8">Fitur Situs</div>
											<div class="col-span-2 flex justify-center border-r border-gray-300">
												<span class="text-customOrange2 text-xl">✓</span>
											</div>
											<div class="col-span-2"></div>
										</div>

										<!-- Fitur Acara -->
										<div class="grid grid-cols-12 py-2">
											<div class="col-span-8">Fitur Acara</div>
											<div class="col-span-2 flex justify-center border-r border-gray-300">
												<span class="text-customOrange2 text-xl">✓</span>
											</div>
											<div class="col-span-2"></div>
										</div>

										<!-- Fitur Aset -->
										<div class="grid grid-cols-12 py-2">
											<div class="col-span-8">Fitur Aset</div>
											<div class="col-span-2 border-r border-gray-300"></div>
											<div class="col-span-2 flex justify-center">
												<span class="text-customOrange2 text-xl">✓</span>
											</div>
										</div>

										<!-- Fitur Komunitas -->
										<div class="grid grid-cols-12 py-2">
											<div class="col-span-8">Fitur Komunitas</div>
											<div class="col-span-2 flex justify-center">
												<span class="text-customOrange2 text-xl">✓</span>
											</div>
											<div class="col-span-2 border-l border-gray-300"></div>
										</div>

										<!-- Fitur Organisasi -->
										<div class="grid grid-cols-12 py-2">
											<div class="col-span-8">Fitur Organisasi</div>
											<div class="col-span-2 flex justify-center border-r border-gray-300">
												<span class="text-customOrange2 text-xl">✓</span>
											</div>
											<div class="col-span-2"></div>
										</div>

										<!-- Fitur Tugas -->
										<div class="grid grid-cols-12 py-2">
											<div class="col-span-8">Fitur Tugas</div>
											<div class="col-span-2 border-r border-gray-300"></div>
											<div class="col-span-2 flex justify-center">
												<span class="text-customOrange2 text-xl">✓</span>
											</div>
										</div>
									</div>
								{/if}
							</div>

							<div class="border-t border-gray-300 pt-4">
								<div class="mb-2 grid grid-cols-12">
									<h3 class="col-span-8 text-lg font-semibold">Aplikasi Mobile Kerajaan</h3>
									<!-- svelte-ignore a11y_click_events_have_key_events -->
									<!-- svelte-ignore a11y_no_static_element_interactions -->
									<div
										class="col-span-2 cursor-pointer border-r border-gray-300 text-center font-medium"
										class:active={selectedItem?.mobileFeatures !== null}
									>
										Ya
									</div>
									<!-- svelte-ignore a11y_click_events_have_key_events -->
									<!-- svelte-ignore a11y_no_static_element_interactions -->
									<div
										class="col-span-2 cursor-pointer text-center font-medium"
										class:active={selectedItem?.mobileFeatures === null}
									>
										Tidak
									</div>
								</div>

								{#if selectedItem?.mobileFeatures !== null}
									<div class="border-t border-gray-200 pt-2">
										<!-- Fitur Penanggalan -->
										<div class="grid grid-cols-12 py-2">
											<div class="col-span-8">Fitur Penanggalan</div>
											<div class="col-span-2 flex justify-center border-r border-gray-300">
												{#if selectedItem.mobileFeatures.fitur_kalender === 1}
													<span class="text-customOrange2 text-xl">✓</span>
												{/if}
											</div>
											<div class="col-span-2 flex justify-center">
												{#if selectedItem.mobileFeatures.fitur_kalender === 0}
													<span class="text-customOrange2 text-xl">✓</span>
												{/if}
											</div>
										</div>

										<!-- Fitur Tugas Pribadi -->
										<div class="grid grid-cols-12 py-2">
											<div class="col-span-8">Fitur Tugas Pribadi</div>
											<div class="col-span-2 flex justify-center border-r border-gray-300">
												{#if selectedItem.mobileFeatures.fitur_tugas_pribadi === 1}
													<span class="text-customOrange2 text-xl">✓</span>
												{/if}
											</div>
											<div class="col-span-2 flex justify-center">
												{#if selectedItem.mobileFeatures.fitur_tugas_pribadi === 0}
													<span class="text-customOrange2 text-xl">✓</span>
												{/if}
											</div>
										</div>

										<!-- Fitur Tugas Acara -->
										<div class="grid grid-cols-12 py-2">
											<div class="col-span-8">Fitur Tugas Acara</div>
											<div class="col-span-2 flex justify-center border-r border-gray-300">
												{#if selectedItem.mobileFeatures.fitur_tugas_acara === 1}
													<span class="text-customOrange2 text-xl">✓</span>
												{/if}
											</div>
											<div class="col-span-2 flex justify-center">
												{#if selectedItem.mobileFeatures.fitur_tugas_acara === 0}
													<span class="text-customOrange2 text-xl">✓</span>
												{/if}
											</div>
										</div>

										<!-- Fitur Situs Kerajaan -->
										<div class="grid grid-cols-12 py-2">
											<div class="col-span-8">Fitur Situs Kerajaan</div>
											<div class="col-span-2 flex justify-center border-r border-gray-300">
												{#if selectedItem.mobileFeatures.fitur_situs === 1}
													<span class="text-customOrange2 text-xl">✓</span>
												{/if}
											</div>
											<div class="col-span-2 flex justify-center">
												{#if selectedItem.mobileFeatures.fitur_situs === 0}
													<span class="text-customOrange2 text-xl">✓</span>
												{/if}
											</div>
										</div>

										<!-- Fitur Check-In Situs -->
										<div class="grid grid-cols-12 py-2">
											<div class="col-span-8">Fitur Check-In Situs</div>
											<div class="col-span-2 flex justify-center border-r border-gray-300">
												{#if selectedItem.mobileFeatures.fitur_check_in === 1}
													<span class="text-customOrange2 text-xl">✓</span>
												{/if}
											</div>
											<div class="col-span-2 flex justify-center">
												{#if selectedItem.mobileFeatures.fitur_check_in === 0}
													<span class="text-customOrange2 text-xl">✓</span>
												{/if}
											</div>
										</div>

										<!-- Fitur Acara Kerajaan -->
										<div class="grid grid-cols-12 py-2">
											<div class="col-span-8">Fitur Acara Kerajaan</div>
											<div class="col-span-2 flex justify-center border-r border-gray-300">
												{#if selectedItem.mobileFeatures.fitur_acara === 1}
													<span class="text-customOrange2 text-xl">✓</span>
												{/if}
											</div>
											<div class="col-span-2 flex justify-center">
												{#if selectedItem.mobileFeatures.fitur_acara === 0}
													<span class="text-customOrange2 text-xl">✓</span>
												{/if}
											</div>
										</div>

										<!-- Fitur Group Chat -->
										<div class="grid grid-cols-12 py-2">
											<div class="col-span-8">Fitur Group Chat</div>
											<div class="col-span-2 flex justify-center border-r border-gray-300">
												{#if selectedItem.mobileFeatures.fitur_chat === 1}
													<span class="text-customOrange2 text-xl">✓</span>
												{/if}
											</div>
											<div class="col-span-2 flex justify-center">
												{#if selectedItem.mobileFeatures.fitur_chat === 0}
													<span class="text-customOrange2 text-xl">✓</span>
												{/if}
											</div>
										</div>

										<!-- Fitur Forum -->
										<div class="grid grid-cols-12 py-2">
											<div class="col-span-8">Fitur Forum</div>
											<div class="col-span-2 flex justify-center border-r border-gray-300">
												{#if selectedItem.mobileFeatures.fitur_forum === 1}
													<span class="text-customOrange2 text-xl">✓</span>
												{/if}
											</div>
											<div class="col-span-2 flex justify-center">
												{#if selectedItem.mobileFeatures.fitur_forum === 0}
													<span class="text-customOrange2 text-xl">✓</span>
												{/if}
											</div>
										</div>

										<!-- Fitur Permohonan -->
										<div class="grid grid-cols-12 py-2">
											<div class="col-span-8">Fitur Permohonan</div>
											<div class="col-span-2 flex justify-center border-r border-gray-300">
												{#if selectedItem.mobileFeatures.fitur_permohonan === 1}
													<span class="text-customOrange2 text-xl">✓</span>
												{/if}
											</div>
											<div class="col-span-2 flex justify-center">
												{#if selectedItem.mobileFeatures.fitur_permohonan === 0}
													<span class="text-customOrange2 text-xl">✓</span>
												{/if}
											</div>
										</div>
									</div>
								{/if}
								<div class="h-0.5 w-full bg-gray-400 opacity-40"></div>

								<div class="mt-3 flex w-full justify-end">
									<button class=" bg-customGold rounded-lg px-5 py-2 text-white"> Proses </button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.basil--cross-outline {
		display: inline-block;
		width: 24px;
		height: 24px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='%23000' stroke-linecap='round' stroke-width='1.5' d='m8.464 15.535l7.072-7.07m-7.072 0l7.072 7.07'/%3E%3C/svg%3E");
	}

	.active {
		background-color: var(--color-customOrange2, #ffa600);
		color: white;
		font-weight: bold;
	}
</style>
