<script lang="ts">
	import { goto } from '$app/navigation';
	import SekreAbdiInput from '$lib/input/SekreAbdiInput.svelte';
	import { slide } from 'svelte/transition';

	import { navigating } from '$app/state';
	import Loader from '$lib/loader/Loader.svelte';
	import { enhance } from '$app/forms';
	import DropBj from './DropBJ.svelte';
	// import { state } from '$app/state';
	let { data } = $props();

	let anggotaData = data?.anggotaData;
	let penghargaanData = data?.penghargaanData;
	let drop = $state(false);
	let add = $state(1);
	const togle = () => {
		if (!drop) {
			drop = true;
		} else drop = false;
	};
	let errors = $state();
	let open = $state(false);
	let timer: number;
	let loading = $state(false);

	// Get current date in YYYY-MM-DD format for default value
	const today = new Date();
	const formattedDate = today.toISOString().split('T')[0];
	let selectedDate = $state(formattedDate);
</script>

{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
{#if loading}
	<Loader></Loader>
{/if}
<div class="mt-6 flex h-full w-full flex-col md:h-auto">
	<form
		action="?/lantikAbdi"
		method="post"
		enctype="multipart/form-data"
		use:enhance={() => {
			loading = true;
			return async ({ result }) => {
				loading = false;
				if (result.type === 'success') {
					open = true;
					clearTimeout(timer);
					console.log('Success');
					timer = setTimeout(() => {
						open = false;
						goto('/abdi/sekretariat/anggota/daftaranggota');
					}, 3000);
				}
				if (result.type === 'failure') {
					errors = result.data?.errors;
					console.log(errors);
				}
			};
		}}
	>
		<!-- tanggal & btn lantik -->
		<div class="mx-6 flex justify-between gap-2">
			<div class="flex flex-col">
				<div>
					<p class="text-gray-500">Pilih Tanggal</p>
				</div>
				<div class="mt-2">
					<input
						type="date"
						placeholder="tanggal_pemberian"
						class="w-full rounded-md border border-gray-500 px-6 py-2 focus:outline-none"
						bind:value={selectedDate}
						name="tanggal_pelantikan"
						id="tanggal_pelantikan"
					/>
				</div>
				{#if errors && errors.tanggal_pelantikan}
					<p class="text-left text-red-500">- {errors.tanggal_pelantikan}</p>
				{/if}
			</div>
			<div class="flex items-center">
				<button
					class="cursor-pointer rounded-md bg-green-500 px-8 py-2 text-white"
					type="submit"
					disabled={loading}
				>
					{loading ? 'Memproses...' : 'Lantik Abdi'}
				</button>
			</div>
		</div>
		<div class="mt-5 flex flex-col rounded-md border">
			<!-- text atas -->
			<div class="mx-3 my-4 flex items-center justify-between">
				<div>
					<p>Abdi yang akan dilantik</p>
				</div>
				<div class="flex items-center">
					<button
						type="button"
						class="bg-badran-bt cursor-pointer rounded-md px-6 py-2 text-white"
						onclick={() => {
							add++;
						}}>+Tambah Abdi</button
					>
				</div>
			</div>
			<div class=" max-h-full overflow-y-auto">
				{#each Array(add) as _, id}
					<DropBj
						{anggotaData}
						nama={`Abdi ${id + 1}`}
						{penghargaanData}
						index={id}
						{errors}
						acara={data?.acaraData}
					/>
				{/each}
			</div>
		</div>

		{#if open}
			<div class="fixed inset-0 z-50 flex items-center justify-center">
				<div class="rounded-lg bg-white p-6 shadow-lg">
					<p class="text-green-600">Pelantikan berhasil disimpan!</p>
				</div>
			</div>
		{/if}
	</form>
</div>
