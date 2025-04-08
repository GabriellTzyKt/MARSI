<script lang="ts">
	import DropDownAdmin from '$lib/dropdown/DropDownAdmin.svelte';
	import { tempasetdata } from '$lib/dummy';
	import ModalAdmin from '$lib/popup/ModalAdmin.svelte';
	import { text } from 'd3';
	import jd from '../../../asset/profile/jdpp.jpg';
	import { onMount } from 'svelte';
	import SModal from '$lib/popup/SModal.svelte';
	let { form } = $props();
	let open = $state(false);
	let valo = $state(false);
	let edit = $state(false);
	let list = ['Super Admin', 'Admin Kerajaan'];
	let selected = $state('Super Admin');
	let error = $state();
	let timer: number;
	let data = $state();
	onMount(() => {
		if (form?.errors) {
			error = form.errors;
			data = form.formData;
			if (form.type === 'add') {
				open = true;
			} else {
				edit = true;
			}
			valo = false;
		} else if (form?.success) {
			if (form.type === 'add') {
				open = false;
			} else {
				edit = false;
			}
			valo = true;
			timer = setTimeout(() => {
				valo = false;
			}, 3000);
		} else {
			open = false;
			valo = false;
			edit = false;
		}
	});
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
			<DropDownAdmin bind:edit {error} {data}></DropDownAdmin>

			<DropDownAdmin></DropDownAdmin>
			<DropDownAdmin></DropDownAdmin>
			<DropDownAdmin></DropDownAdmin>
			<DropDownAdmin></DropDownAdmin>
		{:else if selected === 'Admin Kerajaan'}
			<DropDownAdmin></DropDownAdmin>
			<DropDownAdmin></DropDownAdmin>
			<DropDownAdmin></DropDownAdmin>
			<DropDownAdmin></DropDownAdmin>
			<DropDownAdmin></DropDownAdmin>
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
	<form action="?/tambah" method="post">
		<ModalAdmin textM="Tambah" bind:value={open} bind:open={valo} errors={error} {data}
		></ModalAdmin>
	</form>
{/if}
{#if valo}
	<SModal text="Admin Berhasil Ditambah"></SModal>
{/if}
