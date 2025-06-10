<script lang="ts">
	import { goto } from '$app/navigation';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	import { fade } from 'svelte/transition';
	import jd from '$lib/asset/profile/jdpp.jpg';
	import { onMount } from 'svelte';
	import { env } from '$env/dynamic/public';
	let { value = $bindable(), text = '', data = null, isLaporan = $bindable() } = $props();
	let dataLaporan = $state();
	async function fetchLaporan(data: any) {
		try {
			let res = await fetch(`${env.PUBLIC_URL_KERAJAAN}/tugas/laporan/${data?.id_penerima_tugas}`, {
				method: 'GET'
			});
			if (!res.ok) {
				return (dataLaporan = {});
			} else {
				let msg = await res.json();
				msg.map((item: any) => {
					item.id_tugas = item.Tugas.id_tugas;
				});
				console.log('Recieved Laporan', msg);
				msg = msg.find(
					(item: any) => item.id_tugas == data?.id_tugas || item.id_tugas == data?.id_tugas
				);
				console.log('Recieved Laporan', msg);

				let urls: any = [];
				if (msg.bukti_laporan !== undefined && msg.bukti_laporan) {
					let ress = await fetch(`${env.PUBLIC_URL_KERAJAAN}/doc/${msg?.bukti_laporan || '0'}`, {
						method: 'GET'
					});
					if (!ress.ok) {
						// console.error(`Failed to fetch doc/${id}: ${response.status}`);
						return (dataLaporan = msg);
					} else {
						// Step 2: Extract file_dokumentasi path
						const docData = await res.json();
						const filePaths = docData.file_dokumentasi || docData;
						console.log(filePaths);
						// Handle both array and string responses
						let pathsArray = Array.isArray(filePaths) ? filePaths : [filePaths];

						// Step 3: Convert each path to a full URL with the /file endpoint
						pathsArray = pathsArray.map((path) => {
							if (typeof path === 'string') {
								const url = `${env.PUBLIC_URL_KERAJAAN || ''}/file?file_path=${encodeURIComponent(path)}`;
								// Determine file type based on extension

								urls.push(url);
							}
							return null;
						});
						let bukti_pelaksanaan = pathsArray;
						console.log('bukti_pelaksanaan: ', bukti_pelaksanaan);
					}
				}
				dataLaporan = {
					...msg,
					urls: urls || ''
				};
				console.log('data laporan: ', dataLaporan);
			}
		} catch (error) {
			console.error(error);
			return (dataLaporan = {});
		}
	}

	onMount(() => {
		if (isLaporan) {
			try {
				console.log(
					'fetching data tugas',
					data?.id_tugas,
					'with penerima ',
					data?.id_penerima_tugas
				);
				fetchLaporan(data);
			} catch (error) {}
		}
		console.log('data: ', data);
	});
	let total = $state(8);
	let open = $state(false);
	let timer: number;

	function setTimer() {
		open = true;
		if (timer) {
			clearTimeout(timer);
		}
		if (open)
			timer = setTimeout(() => {
				open = false;
				value = false;
				goto('/abdi/sekretariat/tugas');
			}, 3000);
	}
</script>

<div
	class="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black/75"
	transition:fade={{ duration: 100 }}
>
	<div
		class="relative m-8 flex max-h-full w-full max-w-[600px] flex-col overflow-y-auto rounded-lg border bg-white p-6"
	>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="absolute right-0 top-0 me-4 mt-7 cursor-pointer p-2"
			onclick={() => {
				value = false;
				isLaporan = false;
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-8"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
			</svg>
		</div>
		<div class="my-4 flex justify-self-start">
			<p class=" text-xl font-[500]">{text}</p>
		</div>
		<div class="flex w-full flex-col">
			<div>
				<p class="text-sm">Pemberi Tugas</p>
			</div>
			<!-- Pemberi Tugas -->
			<div class="mt-1 flex justify-between rounded-lg border border-gray-700 bg-white">
				<div class="grow">
					<input
						type="text"
						readonly
						value={data?.pemberi_tugas || '-'}
						class="my-2 w-full pe-2 ps-2 focus:outline-none"
						placeholder="Jane Doe"
						name=""
						id=""
					/>
				</div>
				<div class="me-2 ms-2 flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="gray"
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
		</div>
		<div class="mt-2 flex w-full flex-col">
			<div>
				<p class="text-sm">Nama Tugas</p>
			</div>
			<!-- nama Tugas -->
			<div class="mt-1 flex justify-between rounded-lg border border-gray-700 bg-white">
				<div class="grow">
					<input
						type="text"
						class="my-2 w-full pe-2 ps-2 focus:outline-none"
						placeholder="Jane Doe"
						readonly
						value={data?.nama_tugas || '-'}
						name=""
						id=""
					/>
				</div>
				<div class="me-2 ms-2 flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="gray"
						class="size-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
						/>
					</svg>
				</div>
			</div>
		</div>
		<div class="mt-2 flex w-full flex-col">
			<div>
				<p class="text-sm">Tanggal Penugasan</p>
			</div>
			<!-- Anggota yang ditugaskan -->
			<div class="mt-1 flex justify-between rounded-lg border border-gray-700 bg-white">
				<div class="grow">
					<input
						type="date"
						class="my-2 w-full pe-2 ps-2 focus:outline-none"
						placeholder="13-12-2001"
						name=""
						readonly
						value={data?.tanggal_mulai || '-'}
						id=""
					/>
				</div>
			</div>
		</div>
		<div class="mt-2 flex w-full flex-col">
			<div>
				<p class="text-sm">Anggota yang Ditugaskan</p>
			</div>
			<!-- nama Tugas -->
			<div class="mt-1 flex justify-between rounded-lg border border-gray-700 bg-white">
				<div class="grow">
					<input
						type="text"
						class="my-2 w-full pe-2 ps-2 focus:outline-none"
						placeholder="Jane Doe"
						name=""
						readonly
						value={data?.penerima_tugas || '-'}
						id=""
					/>
				</div>
				<div class="me-2 ms-2 flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="gray"
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
		</div>
		<div class="mt-2 flex w-full flex-col">
			<div>
				<p class="text-sm">Deskripsi Tugas:</p>
			</div>
			<!-- nama Tugas -->
			<div class="mt-1 flex justify-between rounded-lg border border-gray-700 bg-white">
				<div class="grow">
					<textarea
						name=""
						readonly
						value={data?.deskripsi_tugas || '-'}
						class="w-full pe-2 ps-2 pt-2 focus:outline-none"
						placeholder="Deskripsi"
						id=""
						rows="5"
					></textarea>
				</div>
			</div>
		</div>
		{#if isLaporan}
			<div class="mt-2 flex w-full flex-col">
				<div>
					<p class="text-sm">Catatan:</p>
				</div>
				<!-- nama Tugas -->
				<div class="mt-1 flex justify-between rounded-lg border border-gray-700 bg-white">
					<div class="grow">
						<textarea
							name=""
							readonly
							value={dataLaporan?.keterangan || '-'}
							class="w-full pe-2 ps-2 pt-2 focus:outline-none"
							placeholder="Deskripsi"
							id=""
							rows="5"
						></textarea>
					</div>
				</div>
			</div>
			<div class="mt-2 flex w-full flex-col">
				<div>
					<p class="text-sm">Foto Bukti</p>
				</div>

				<div class="mt-1 w-full overflow-x-auto rounded-lg bg-white p-2">
					<div class="flex min-w-max gap-4">
						{#if dataLaporan?.urls.length > 0}
							{#each dataLaporan.urls as u, i}
								<div class="h-auto min-w-[200px] rounded-xl">
									<img src={u} class="h-36 w-full rounded-xl object-cover" alt="" />
								</div>
							{/each}
						{:else}
							<div class="flex items-center justify-center">
								<div class="flex items-center justify-center">
									<p>No Foto Available</p>
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<!-- <div class="h-auto min-w-[200px] rounded-xl">
	<img src={jd} class="h-36 w-full rounded-xl object-cover" alt="" />
</div>
<div class="h-auto min-w-[200px] rounded-xl">
	<img src={jd} class="h-36 w-full rounded-xl object-cover" alt="" />
</div>
<div class="h-auto min-w-[200px] rounded-xl">
	<img src={jd} class="h-36 w-full rounded-xl object-cover" alt="" />
</div>
<div class="h-auto min-w-[200px] rounded-xl">
	<img src={jd} class="h-36 w-full rounded-xl object-cover" alt="" />
</div>
<div class="h-auto min-w-[200px] rounded-xl">
	<img src={jd} class="h-36 w-full rounded-xl object-cover" alt="" />
</div> -->
