<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { formatDatetoUI } from '$lib';
	import SimpleLoader from '$lib/loader/SimpleLoader.svelte';
	import Table from '$lib/table/Table.svelte';
	import { onDestroy, onMount } from 'svelte';

	let { value = $bindable(), header, title, userId } = $props();
	console.log('userId: ', userId);
	console.log('title: ', title);
	let finalData = $state([]);
	let loading = $state(false);
	async function fetchDataPenghargaan(id: any) {
		loading = true;
		try {
			// Ambil data penghargaan berdasarkan anggota
			const resPenghargaan = await fetch(
				`${env.PUBLIC_URL_KERAJAAN}/anggota/penghargaan/${userId}`
			);
			const penghargaanList = await resPenghargaan.json();
			console.log('Penghargaan List:', penghargaanList);

			// Fetch daftar gelar lengkap
			const resPenghargaanS = await fetch(`${env.PUBLIC_URL_KERAJAAN}/penghargaan?limit=100`);
			const daftarPenghargaan = await resPenghargaanS.json();
			console.log('Daftar Penghargaan:', daftarPenghargaan);
			const result = await Promise.all(
				penghargaanList.map(async (item: any) => {
					let nama_anggota = 'Nama tidak ditemukan';
					let nama_pemberi = 'Nama tidak ditemukan';
					let nama_acara = 'Acara tidak ditemukan';
					let nama_penghargaan = 'Penghargaan tidak ditemukan';
					let fileUrls = [];
					if (item.dokumentasi) {
						try {
							let resPict = await fetch(`${env.PUBLIC_URL_KERAJAAN}/doc/${item.dokumentasi}`);
							if (resPict.ok) {
								const docData = await resPict.json();
								const filePath = docData.file_dokumentasi || docData;
								// Jika filePath adalah array, ambil yang pertama
								if (filePath) {
									fileUrls.push(
										`${env.PUBLIC_URL_KERAJAAN}/file?file_path=${encodeURIComponent(filePath)}`
									);
								}
							}
						} catch (error) {}
					}

					try {
						const resAnggota = await fetch(`${env.PUBLIC_URL_KERAJAAN}/anggota/${item.id_anggota}`);
						if (resAnggota.ok) {
							const anggota = await resAnggota.json();
							nama_anggota = anggota?.nama_lengkap?.trim() || 'Nama tidak ditemukan';
						}
					} catch (e) {
						console.warn(`Gagal fetch anggota: ${item.id_anggota}`, e);
					}

					try {
						const resPemberi = await fetch(
							`${env.PUBLIC_URL_KERAJAAN}/anggota/${item.pemberi_penghargaan}`
						);
						if (resPemberi.ok) {
							const pemberi = await resPemberi.json();
							nama_pemberi = pemberi?.nama_lengkap?.trim() || 'Nama tidak ditemukan';
						}
					} catch (e) {
						console.warn(`Gagal fetch pemberi: ${item.pemberi_penghargaan}`, e);
					}

					try {
						const resAcara = await fetch(
							`${env.PUBLIC_URL_KERAJAAN}/acara/detail/${item.acara_pemberian}`
						);
						if (resAcara.ok) {
							const acara = await resAcara.json();
							nama_acara = acara?.nama_acara?.trim() || 'Acara tidak ditemukan';
						}
					} catch (e) {
						console.warn(`Gagal fetch acara: ${item.acara_pemberian}`, e);
					}
					const penghargaan = daftarPenghargaan.find(
						(p: any) => p.id_penghargaan === item.id_penghargaan
					);
					if (penghargaan) {
						nama_penghargaan = penghargaan.nama_penghargaan || 'Penghargaan tidak ditemukan';
					}

					return {
						...item,
						nama_anggota,
						nama_pemberi,
						nama_acara,
						tanggal_penerimaan: formatDatetoUI(item.tanggal_penerimaan),
						nama_penghargaan,
						keterangan: item.keterangan || 'Tidak ada keterangan',
						dokumentasi: fileUrls.length > 0 ? fileUrls : ['Tidak ada dokumentasi']
					};
				})
			);

			finalData = result;
			console.log(finalData);
		} catch (error) {
			console.error('Error fetching penghargaan data:', error);
		} finally {
			loading = false;
		}
	}
	async function fetchData(id: any) {
		loading = true;
		try {
			const resGelar = await fetch(`${env.PUBLIC_URL_KERAJAAN}/anggota/gelar/${userId}`);
			if (!resGelar.ok) {
				throw new Error(`Error fetching gelar data: ${resGelar.statusText}`);
			}
			const gelarList = await resGelar.json();
			console.log('Gelar List:', gelarList);

			// Fetch daftar gelar lengkap
			const resGelarr = await fetch(`${env.PUBLIC_URL_KERAJAAN}/gelar?limit=100`);
			const daftargelar = await resGelarr.json();
			console.log('Daftar Penghargaan:', daftargelar);

			const result = await Promise.all(
				gelarList.map(async (item: any) => {
					// Inisialisasi default
					let nama_anggota = 'Nama tidak ditemukan';
					let nama_pemberi = 'Nama tidak ditemukan';
					let nama_acara = 'Acara tidak ditemukan';
					let nama_gelar = 'Gelar tidak ditemukan';
					let fileUrls = [];
					if (item.dokumentasi) {
						try {
							let resPict = await fetch(`${env.PUBLIC_URL_KERAJAAN}/doc/${item.dokumentasi}`);
							if (resPict.ok) {
								const docData = await resPict.json();
								const filePath = docData.file_dokumentasi || docData;
								// Jika filePath adalah array, ambil yang pertama
								if (filePath) {
									fileUrls.push(
										`${env.PUBLIC_URL_KERAJAAN}/file?file_path=${encodeURIComponent(filePath)}`
									);
								}
							}
						} catch (error) {}
					}
					try {
						const resAnggota = await fetch(`${env.PUBLIC_URL_KERAJAAN}/anggota/${item.id_anggota}`);
						if (resAnggota.ok) {
							const anggota = await resAnggota.json();
							nama_anggota = anggota?.nama_lengkap?.trim() || 'Nama tidak ditemukan';
						}
					} catch (e) {
						console.warn(`Gagal fetch anggota: ${item.id_anggota}`, e);
					}

					try {
						const resPemberi = await fetch(
							`${env.PUBLIC_URL_KERAJAAN}/anggota/${item.pemberi_gelar}`
						);
						if (resPemberi.ok) {
							const pemberi = await resPemberi.json();
							nama_pemberi = pemberi?.nama_lengkap?.trim() || 'Nama tidak ditemukan';
						}
					} catch (e) {
						console.warn(`Gagal fetch pemberi: ${item.pemberi_gelar}`, e);
					}

					try {
						const resAcara = await fetch(
							`${env.PUBLIC_URL_KERAJAAN}/acara/detail/${item.acara_pemberian}`
						);
						if (resAcara.ok) {
							const acara = await resAcara.json();
							nama_acara = acara?.nama_acara?.trim() || 'Acara tidak ditemukan';
						}
					} catch (e) {
						console.warn(`Gagal fetch acara: ${item.acara_pemberian}`, e);
					}
					const gelar = daftargelar.find((g: any) => g.id_gelar === item.id_gelar);
					if (gelar) {
						nama_gelar = gelar.nama_gelar || 'Gelar tidak ditemukan';
					}
					return {
						...item,
						tanggal_penerimaan: formatDatetoUI(item.tanggal_penerimaan),
						nama_anggota,
						nama_pemberi,
						nama_acara,
						nama_gelar,
						keterangan: item.keterangan || 'Tidak ada keterangan',
						dokumentasi: fileUrls.length > 0 ? fileUrls : ['Tidak ada dokumentasi']
					};
				})
			);

			finalData = result;
			console.log(finalData);
		} catch (error) {
			console.error('Error utama:', error);
		} finally {
			loading = false;
		}
	}
	onMount(() => {
		if (title === 'History Gelar' && userId) {
			fetchData(userId);
		}
		if (title === 'History Bintang Jasa' && userId) {
			fetchDataPenghargaan(userId);
		}
	});
	onDestroy(() => {
		finalData = [];
		loading = false;
	});
</script>

<div class="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black/65">
	<div class="relative flex max-h-[700px] flex-col overflow-y-auto rounded-lg border bg-white p-4">
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="absolute right-0 top-0 mr-4 mt-6 hover:cursor-pointer"
			onclick={() => {
				value = false;
				finalData = [];
				loading = false;
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-8"
				onclick={() => {
					value = false;
				}}
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
			</svg>
		</div>
		<div class=" mt-6 text-center">
			<p class="text-2xl font-[500]">{title}</p>
		</div>
		<div class="mb-6 mt-6 flex flex-col items-center justify-center gap-3 md:mx-6 md:flex-row">
			<div>
				<select
					name="Keterangan"
					class="rounded-lg border border-gray-700 px-8 py-2 focus:outline-none"
					id=""
					value="Keterangan"
				>
					<option value="Keterangan">Keterangan</option>
				</select>
			</div>
			<div class="flex items-center justify-between rounded-lg border border-gray-700">
				<div class="flex grow">
					<input
						type="text"
						placeholder="Cari Nama {title === 'History Gelar' ? 'Gelar' : 'Bintang Jasa'}"
						class="flex w-full px-2 py-2 focus:outline-none"
						name=""
						id=""
					/>
				</div>
				<div class="pe-2">
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
			<div class="flex items-center justify-between rounded-lg border border-gray-700">
				<div class="flex grow">
					<input
						type="text"
						placeholder="Cari Nama Acara.."
						class="flex w-full px-2 py-2 focus:outline-none"
						name=""
						id=""
					/>
				</div>
				<div class="pe-2">
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
			<div class="flex flex-row items-center gap-3">
				<div>
					<p>Show</p>
				</div>
				<div>
					<input
						type="number"
						class="flex h-auto w-16 rounded-lg border border-gray-700 px-2 py-2 focus:outline-none"
						placeholder="8"
						name=""
						id=""
					/>
				</div>
				<div>
					<p>Entries</p>
				</div>
			</div>
		</div>
		<div class="  overflow-x-auto md:mx-6">
			<Table table_header={header} table_data={finalData}>
				{#snippet picture({ data, header, index })}
					{#if data.dokumentasi && data.dokumentasi.length > 0}
						{#each data.dokumentasi as doc, i}
							{#if doc === 'Tidak ada dokumentasi'}
								<p class="text-gray-500">Tidak ada dokumentasi</p>
							{:else}
								<a href={doc} target="_blank" rel="noopener noreferrer">
									<img src={doc} alt="Dokumentasi" class="h-12 w-12 rounded-md object-cover" />
								</a>
							{/if}
						{/each}
					{:else if data.dokumentasi && data.dokumentasi[0] === 'Tidak ada dokumentasi'}
						<p class="text-gray-500">Tidak ada dokumentasi</p>
					{/if}
				{/snippet}
			</Table>
			{#if !loading && finalData.length === 0}
				<p class="flex items-center justify-center text-center">No data available</p>
			{/if}
			{#if loading}
				<div class="mt-2 flex justify-center">
					<SimpleLoader></SimpleLoader>
				</div>
			{/if}
		</div>
	</div>
</div>
