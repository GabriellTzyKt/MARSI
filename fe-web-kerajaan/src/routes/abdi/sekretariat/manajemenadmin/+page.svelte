<script lang="ts">
	import DropDownAdmin from '$lib/dropdown/DropDownAdmin.svelte';

	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	import TambahAdminSekre from '$lib/popup/TambahAdminSekre.svelte';
	import { navigating } from '$app/state';
	import Loader from '$lib/loader/Loader.svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import DeleteModal from '$lib/popup/DeleteModal.svelte';
	import { formatDatetoUI } from '$lib';

	// import { load } from '../organisasi/daftaranggota/proxy+page.server.js';
	let selectTipe = $state<string>('');

	let { data } = $props();
	let success = $state(false);
	let userData = data?.user || [];
	let open = $state(false);
	let valo = $state(false);
	let edit = $state(false);
	let selected = $state('ASitus');
	let error = $state();
	let timer: number;
	let editData = $state<any>(null);
	let deleteID = $state<any>(null);
	let deleteModal = $state(false);
	let editmodal = $state(false);
	let activeTab = $state('ASitus');
	let nonAktifkanData = $state<any>(null);
	let nonAktifkanModal = $state(false);
	console.log(data.data);

	function editAction(data: any) {
		console.log('Edit Action : ', data);
		editData = data;
		editmodal = true;
	}
	function hapusAction(data: any) {
		console.log('Hapus Action : ', data);
		deleteID = data.id_admin;
		deleteModal = true;
	}
	function nonAktifkan(data: any) {
		console.log('Non Aktifkan Action : ', data);
		nonAktifkanData = data;
	}
	let user = data.data;

	function filteredUserByTab(tab: string) {
		if (!user) return [];
		let tipe = selectTipe;
		let tipeField = '';
		if (tab === 'ASitus') tipeField = 'Admin Situs';
		if (tab === 'AOrganisasi') tipeField = 'Admin Organisasi';
		if (tab === 'AKomunitas') tipeField = 'Admin Komunitas';

		let filtered = user.filter((item: any) => item.jenis_admin === tipeField);

		// Jika selectTipe diisi, filter lagi berdasarkan tipe tertentu (misal field 'tipe' pada data)
		if (tipe) {
			// Ganti 'tipe' dengan field yang sesuai pada data kamu, misal 'kategori', 'tipe', dsb.
			filtered = filtered.filter((item: any) =>
				(item.tipe || '').toLowerCase().includes(tipe.toLowerCase())
			);
		}
		return filtered;
	}
	function setActive(tab: string) {
		activeTab = tab;
		selected = activeTab;
		console.log('Selected : ', selected);
	}

	let loading = $state(false);
</script>

{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
{#if loading}
	<Loader></Loader>
{/if}
<div class="flex w-full flex-col md:mx-6">
	<div class="flex flex-col justify-center gap-4 md:flex-row md:justify-between md:gap-0">
		<div class="flex justify-center">
			<p class="text-2xl font-[550]">Role Administrasi</p>
		</div>
		<div class="flex w-full md:w-auto">
			<button
				class="w-full rounded-md bg-[#0315da] px-6 py-2 text-white"
				onclick={() => {
					open = true;
				}}>+Tambah Data</button
			>
		</div>
	</div>
	<!-- line -->
	<div class="my-4 h-[2px] w-full bg-[#949494]/80"></div>
	<div class="col-span-2 flex w-full flex-col lg:flex-row">
		<div class="col-span-1">
			<div class="border-1 mb-3 mt-2 flex w-full gap-2 rounded-full px-3 py-2 lg:text-nowrap">
				<button
					onclick={() => setActive('ASitus')}
					class="relative w-full overflow-hidden rounded-full border-2 px-5 py-1 font-semibold"
				>
					<span
						class="absolute left-0 top-0 h-full bg-blue-600 transition-all duration-300"
						style:width={activeTab === 'ASitus' ? '100%' : '0%'}
					></span>
					<span
						class="text-md relative transition-colors duration-300"
						class:text-white={activeTab === 'ASitus'}
						class:text-black={activeTab !== 'ASitus'}
					>
						Admin Situs
					</span>
				</button>

				<button
					onclick={() => setActive('AOrganisasi')}
					class="relative w-full overflow-hidden rounded-full border-2 py-1 pe-8 ps-5 font-semibold"
				>
					<span
						class="absolute left-0 top-0 h-full bg-blue-600 transition-all duration-300"
						style:width={activeTab === 'AOrganisasi' ? '100%' : '0%'}
					></span>
					<span
						class="text-md relative transition-colors duration-300"
						class:text-white={activeTab === 'AOrganisasi'}
						class:text-black={activeTab !== 'AOrganisasi'}
					>
						Admin Organisasi
					</span>
				</button>

				<button
					onclick={() => setActive('AKomunitas')}
					class="relative w-full overflow-hidden rounded-full border-2 py-1 pe-8 ps-5 font-semibold"
				>
					<span
						class="absolute left-0 top-0 h-full bg-blue-600 transition-all duration-300"
						style:width={activeTab === 'AKomunitas' ? '100%' : '0%'}
					></span>
					<span
						class="text-md relative transition-colors duration-300"
						class:text-white={activeTab === 'AKomunitas'}
						class:text-black={activeTab !== 'AKomunitas'}
					>
						Admin Komunitas
					</span>
				</button>
			</div>
		</div>
		<div class="col-span-1 my-auto flex w-full items-center justify-start gap-2 lg:justify-end">
			<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
				<path
					fill="#4a4a4a"
					d="M6.532 4.75h6.936c.457 0 .854 0 1.165.03c.307.028.685.095.993.348c.397.326.621.814.624 1.322c.002.39-.172.726-.34.992c-.168.27-.411.59-.695.964l-.031.04l-.01.013l-2.555 3.369c-.252.332-.315.42-.359.51a1.2 1.2 0 0 0-.099.297c-.02.1-.023.212-.023.634v4.243c0 .208 0 .412-.014.578c-.015.164-.052.427-.224.663c-.21.287-.537.473-.9.495c-.302.019-.547-.103-.69-.183c-.144-.08-.309-.195-.476-.31l-.989-.683l-.048-.033c-.191-.131-.403-.276-.562-.477a1.7 1.7 0 0 1-.303-.585c-.071-.244-.07-.5-.07-.738v-2.97c0-.422-.004-.534-.023-.634a1.2 1.2 0 0 0-.1-.297c-.043-.09-.106-.178-.358-.51L4.825 8.459l-.01-.012l-.03-.04c-.284-.375-.527-.695-.696-.965c-.167-.266-.34-.602-.339-.992a1.72 1.72 0 0 1 .624-1.322c.308-.253.686-.32.993-.349c.311-.029.707-.029 1.165-.029m.397 4l1.647 2.17l.035.047c.201.264.361.475.478.715q.154.317.222.665c.051.261.05.527.05.864v2.968c0 .158.001.247.005.314l.006.062a.2.2 0 0 0 .036.073l.041.034c.05.04.12.088.248.176l.941.65V13.21c0-.337 0-.603.051-.864q.068-.347.222-.665c.117-.24.277-.45.478-.715l.035-.046l1.646-2.17zm7.28-1.5c.195-.26.334-.45.43-.604c.08-.126.104-.188.11-.207a.22.22 0 0 0-.057-.134a1 1 0 0 0-.2-.032c-.232-.022-.556-.023-1.06-.023H6.568c-.504 0-.828 0-1.06.023a1 1 0 0 0-.2.032a.22.22 0 0 0-.057.134c.006.019.03.081.11.207c.096.155.235.344.43.604zm1.541 3.25a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75m-1.5 2.5a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5H15a.75.75 0 0 1-.75-.75m-.5 2.5a.75.75 0 0 1 .75-.75h5a.75.75 0 0 1 0 1.5h-5a.75.75 0 0 1-.75-.75m0 2.5a.75.75 0 0 1 .75-.75H17a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75"
				/>
			</svg>
			<p>Filter Data :</p>
			<select
				id="sortSelect"
				bind:value={selectTipe}
				class="h-[40px] w-fit rounded border border-gray-300 bg-white px-2 py-2 text-left text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
			>
				<option value="">None</option>
				<option value="A">A</option>
				<option value="B">B</option>
			</select>
		</div>
	</div>
	<div class="grid w-full auto-rows-min grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
		<!-- container -->
		{#if selected === 'ASitus'}
			{#each filteredUserByTab('ASitus') as data}
				<DropDownAdmin
					{data}
					editAction={{
						action: () => {
							editAction(data);
						}
					}}
					hapusAction={{
						action: () => {
							hapusAction(data);
						}
					}}
					nonAktifAction={{
						action: () => {
							nonAktifkan(data);
						}
					}}
				></DropDownAdmin>
			{/each}
		{/if}

		{#if selected === 'AOrganisasi'}
			{#each filteredUserByTab('AOrganisasi') as data}
				<DropDownAdmin
					{data}
					editAction={{
						action: () => {
							editAction(data);
						}
					}}
					hapusAction={{
						action: () => {
							hapusAction(data);
						}
					}}
					nonAktifAction={{
						action: () => {
							nonAktifkan(data);
						}
					}}
				></DropDownAdmin>
			{/each}
		{/if}

		{#if selected === 'AKomunitas'}
			{#each filteredUserByTab('AKomunitas') as data}
				<DropDownAdmin
					{data}
					editAction={{
						action: () => {
							editAction(data);
						}
					}}
					hapusAction={{
						action: () => {
							hapusAction(data);
						}
					}}
					nonAktifAction={{
						action: () => {
							nonAktifkan(data);
						}
					}}
				></DropDownAdmin>
			{/each}
		{/if}

		<div
			class="col-span-full my-3 flex w-full cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-[#FEFEFE]"
		>
			<p class="flex items-center gap-2 py-2 text-xl shadow-lg">
				Lihat Semua <svg
					xmlns="http://www.w3.org/2000/svg"
					width="25"
					height="24"
					viewBox="0 0 25 24"
					><path
						fill="currentColor"
						d="M19.109 14.905a.75.75 0 0 1-1.061 0l-5.72-5.72l-5.72 5.72a.75.75 0 0 1-1.06-1.06l6.25-6.25a.75.75 0 0 1 1.06 0l6.25 6.25a.75.75 0 0 1 0 1.06"
					/></svg
				>
			</p>
		</div>
	</div>
</div>
{#if open}
	<form
		action="?/tambah"
		method="post"
		autocomplete="off"
		use:enhance={() => {
			loading = true;
			return async ({ result }) => {
				loading = false;
				console.log(result);
				if (result.type === 'success') {
					valo = true;
					open = true;
					await invalidateAll().then(() => {
						setTimeout(() => {
							valo = false;
							open = false;
							goto('/abdi/sekretariat/manajemenadmin', { replaceState: true });
						}, 3000);
					});
				} else if (result.type === 'failure') {
					error = result?.data?.errors;
				}
			};
		}}
	>
		<TambahAdminSekre
			textM="Tambah"
			{userData}
			bind:value={open}
			bind:open={valo}
			errors={error}
			{data}
		></TambahAdminSekre>
	</form>
{/if}
{#if valo}
	<SuccessModal text="Admin Berhasil Ditambah"></SuccessModal>
{/if}
{#if nonAktifkanModal}
	<form
		action="?/nonAktifkan"
		method="post"
		use:enhance={() => {
			loading = true;
			return async ({ result }) => {
				loading = false;
				if (result.type === 'success') {
					nonAktifkanModal = false;
					await invalidateAll().then(() => {
						setTimeout(() => {
							goto('/abdi/sekretariat/manajemenadmin', { replaceState: true });
						}, 1000);
					});
				} else if (result.type === 'failure') {
					console.log(result.data?.errors);
				}
			};
		}}
	>
		<input type="hidden" name="id_admin" value={nonAktifkanData.id_admin} />
		<input type="hidden" name="nama_lengkap" value={nonAktifkanData.nama_lengkap} />
		<input type="hidden" name="email" value={nonAktifkanData.email} />
		<input type="hidden" name="no_telp" value={nonAktifkanData.no_telp} />
		<input
			type="hidden"
			name="tanggal_lahir"
			value={formatDatetoUI(nonAktifkanData.tanggal_lahir)}
		/>
		<input type="hidden" name="tempat_lahir" value={nonAktifkanData.tempat_lahir} />
		<input type="hidden" name="jenis_kelamin" value={nonAktifkanData.jenis_kelamin} />
		<input type="hidden" name="id_kerajaan" value={nonAktifkanData.id_kerajaan} />
		<input type="hidden" name="jenis_admin" value={nonAktifkanData.jenis_admin} />
		<input type="hidden" name="jenis_admin" value={nonAktifkanData.jenis_admin} />
	</form>
{/if}
{#if editmodal}
	<form
		action="?/ubahAdmin"
		method="post"
		autocomplete="off"
		use:enhance={() => {
			loading = true;
			return async ({ result }) => {
				loading = false;
				console.log(result);
				if (result.type === 'success') {
					valo = true;
					editmodal = true;
					await invalidateAll().then(() => {
						setTimeout(() => {
							valo = false;
							editmodal = false;
							goto('/abdi/sekretariat/manajemenadmin', { replaceState: true });
						}, 3000);
					});
				} else if (result.type === 'failure') {
					error = result?.data?.errors;
				}
			};
		}}
	>
		<TambahAdminSekre textM="Edit" bind:value={editmodal} errors={error} data={editData}
		></TambahAdminSekre>
	</form>
{/if}
{#if deleteModal}
	<form
		action="?/hapusAdmin"
		method="post"
		use:enhance={() => {
			loading = true;
			return async ({ result }) => {
				loading = false;
				if (result.type === 'success') {
					success = true;
					deleteModal = false;
					await invalidateAll().then(() => {
						setTimeout(() => {
							deleteModal = false;
							success = false;
							goto('/abdi/sekretariat/manajemenadmin', { replaceState: true });
						}, 3000);
					});
				} else if (result.type === 'failure') {
					console.log(result.data?.errors);
				}
			};
		}}
	>
		<input type="hidden" name="id_admin" value={deleteID} />
		<DeleteModal
			bind:value={deleteModal}
			text="Apakah yakin ingin menghapus admin ini?"
			successText="Admin berhasil dihapus!"
			choose="delete"
		></DeleteModal>
	</form>
{/if}
{#if success}
	<SuccessModal text="Admin berhasil dihapus!"></SuccessModal>
{/if}
