<script lang="ts">
	import DropDownAdmin from '$lib/dropdown/DropDownAdmin.svelte';
	import { tempasetdata } from '$lib/dummy';
	import ModalAdmin from '$lib/popup/ModalAdmin.svelte';
	import { text } from 'd3';
	import jd from '../../../asset/profile/jdpp.jpg';
	import { onMount } from 'svelte';
	import SModal from '$lib/popup/SModal.svelte';
	import { enhance } from '$app/forms';
	import Loader from '$lib/loader/Loader.svelte';
	import { invalidateAll } from '$app/navigation';
	let { form, data } = $props();
	let adminMarsi = data.adminMarsiData;
	let dataKerajaan = data.kerajaanData;
	// console.log("Base Admin Data: ", adminMarsi);
	// console.log("Data Kerajaan : ", dataKerajaan)

	let open = $state(false);
	let admin = $state();
	let valo = $state(false);
	let valo2 = $state(false);
	let edit = $state(false);
	let list = ['Super Admin', 'Admin Kerajaan'];
	let selected = $state('Super Admin');
	let error = $state();
	let timer: number;
	let loading = $state(false);
	let dataEdit : any = null;

	function handleEdit(admin: any) {
		console.log('ADMIN EDIT : ', admin);
		// Buat salinan mendalam dari data admin
		dataEdit = JSON.parse(JSON.stringify(admin));

		console.log('Data edit : ', dataEdit);

		// Buka modal edit setelah data siap
		edit = true;
	}
</script>

<div class="flex w-full flex-col md:mx-6">
	<div class="flex flex-col justify-center gap-4 md:flex-row md:justify-between md:gap-0">
		<div class="flex justify-center">
			<p class="text-2xl font-[550]">Role Administrasi</p>
		</div>
		<div class="flex w-full md:w-auto">
			<button
				class="w-full rounded-md bg-[#C1A411] px-6 py-2 text-white"
				onclick={() => {
					open = true;
				}}>Tambah Data</button
			>
		</div>
	</div>
	<!-- line -->
	<div class="my-4 h-[2px] w-full bg-[#949494]/80"></div>
	<div class="mb-2 flex flex-col gap-4 md:flex-row">
		{#each list as l}
			<button
				class="rounded-lg border border-[#FFA600] px-4 {selected === l
					? 'bg-[#FFA600] text-white'
					: 'bg-white'} py-2 hover:bg-[#FFA600] hover:text-white"
				onclick={() => (selected = l)}>{l}</button
			>
		{/each}
	</div>
	<div class="grid w-full auto-rows-min grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
		<!-- container -->
		{#if selected === 'Super Admin'}
			{#each data.adminMarsiData?.filter((admin: any) => admin.jenis_admin?.toLowerCase() === 'super admin') || [] as admin}
				<DropDownAdmin
					{error}
					data={admin}
					actions={[{ action: () => handleEdit(admin) }]}
				></DropDownAdmin>
			{/each}
		{:else if selected === 'Admin Kerajaan'}
			{#each data.adminMarsiData?.filter((admin: any) => admin.jenis_admin?.toLowerCase() === 'admin kerajaan') || [] as admin}
				<DropDownAdmin
					{error}
					data={admin}
					actions={[{ action: () => handleEdit(admin) }]}
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
	<!-- line -->
</div>
{#if open}
	<form
		action="?/tambah"
		method="post"
		autocomplete="off"
		use:enhance={() => {
			loading = true
			return async ({ result }) => {
				console.log(result);
				loading = false;
				if (result.type === 'success') {
					valo = true;
					clearTimeout(timer);
					invalidateAll();
					timer = setTimeout(() => {
						valo = false;
						open = false;
					}, 3000);
				} else if (result.type === 'failure') {
					error = result?.data?.errors;
					console.log("Errors : ", error)
				}
			};
		}}
	>
		<ModalAdmin
			textM="Tambah"
			bind:value={open}
			bind:open={valo}
			errors={error}
			data
			datakerajaan={dataKerajaan}
		></ModalAdmin>
	</form>
{/if}
{#if valo}
	<SModal text="Admin Berhasil Ditambah"></SModal>
{/if}
{#if valo2}
	<SModal text="Admin Berhasil Diubah"></SModal>
{/if}
{#if loading}
	<Loader></Loader>
{/if}
{#if edit}
	<form
		action="?/ubah"
		method="POST"
		use:enhance={() => {
			loading = true;
			return async ({ result }) => {
				loading = false;
				console.log(result);
				if (result.type === 'success') {
					valo2 = true;
					clearTimeout(timer);
					invalidateAll();
					timer = setTimeout(() => {
						valo2 = false;
						edit = false;
					}, 3000);
				} else if (result.type === 'failure') {
					loading = false;
					error = result?.data?.errors;
				}
			};
		}}
	>
		<ModalAdmin
			textM="Ubah"
			bind:value={edit}
			bind:open={valo}
			errors={error}
			data={dataEdit}
			datakerajaan={dataKerajaan}
		></ModalAdmin>
	</form>
{/if}
