<script lang="ts">
	import { slide } from 'svelte/transition';
	import img from '../../asset/Logo_MARSI_login.png';
	import { scaleUtc } from 'd3';
	import SModal from '$lib/popup/SModal.svelte';
	import DeleteModal from '$lib/popup/DeleteModal.svelte';

	let value = $state(false);
	let open = $state(false);

	function toggle() {
		if (!value) value = true;
		else value = false;
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="me-4 ms-4">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class=" flex cursor-pointer justify-between border-x border-t border-gray-500 bg-blue-400 transition-transform duration-100"
		class:rounded-xl={value === false}
		class:rounded-t-xl={value === true}
		class:border-x={value === true}
		class:border={value === false}
		onclick={() => toggle()}
	>
		<div>
			<p class=" ms-4 py-2 text-xl text-white">Section 1 - Bagian Awal</p>
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

	{#if value}
		<div
			class=" grid grid-cols-6 rounded-b-xl border-x border-b border-gray-500 bg-white pb-6"
			transition:slide={{ duration: 150 }}
		>
			<div class="col-span-5 me-4 ms-4 mt-6 flex flex-col">
				<div class="">
					<p class="text-xl">Judul Page</p>
				</div>
				<div class="mt-1">
					<input
						type="text"
						class="w-full rounded-lg border border-gray-400 py-2 pe-2 ps-2 shadow-xl focus:border-gray-400 focus:outline-none focus:ring-0"
						name=""
						placeholder="MAJELIS AGUNG RAJA SULTAN INDONESIA"
						id=""
					/>
				</div>
			</div>
			<div class="col-span-full mx-4 my-6">
				<p class="text-2xl font-[600]">Tambah Titik Kerajaan di Peta</p>
			</div>
			<div class="col-span-full me-4 ms-4 mt-1 flex flex-col">
				<div class="">
					<p class="text-xl">Pilih Kerajaan</p>
				</div>
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div class="col-span-full flex justify-between gap-4">
					<div class="flex w-full">
						<select
							name="Surabaya"
							class="w-full rounded-lg border border-gray-400 py-2 pe-2 ps-2 shadow-xl focus:border-gray-400 focus:outline-none focus:ring-0"
							id=""
						>
							<option value="Jakarta">Jakarta</option>
							<option value="Surabaya">Surabaya</option>
							<option value="Jember">Jember</option>
						</select>
					</div>
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div class=" flex cursor-pointer items-end justify-start rounded-xl">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="2"
							stroke="white"
							class="size-11 rounded-xl bg-red-500 p-2"
							onclick={() => {
								open = true;
							}}
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
							/>
						</svg>
					</div>
				</div>
			</div>
			<div class="col-span-2 ms-4 mt-4 w-full">
				<p class="text-lg">Logo Kerajaan:</p>
			</div>
			<!-- <div class="col-span-4 ms-2.5 mt-4 w-full">
				<p class="text-lg">Nama Kerajaan:</p>
			</div> -->
			<div class="col-span-full ms-4 mt-4 grid grid-cols-1 lg:grid-cols-6 grid-rows-5">
				<div class="col-span-2 row-span-5 flex h-full w-full">
					<img src={img} class="h-full w-auto" alt="" />
				</div>
				<div class="col-span-4 mt-4 flex">
					<p class="text-lg">Nama Kerajaan:</p>
				</div>
				<div class="col-span-4 mt-4 flex">
					<p class="text-lg">Lokasi Kerajaan:</p>
				</div>
				<div class="col-span-4 mt-4 flex">
					<p class="text-lg">Longitude:</p>
				</div>
				<div class="col-span-4 mt-4 flex">
					<p class="text-lg">Latitude:</p>
				</div>
				<div class="col-span-4 mt-4 flex">
					<p class="text-lg">URL Link:</p>
				</div>
				<div class="col-span-4 flex w-full pe-4">
					<input
						type="text"
						class=" w-full rounded-lg border border-gray-400 py-2 shadow-xl focus:border-gray-400 focus:outline-none focus:ring-0"
						name=""
						placeholder="MAJELIS AGUNG RAJA SULTAN INDONESIA"
						id=""
					/>
				</div>
			</div>
		</div>
	{/if}
</div>
{#if open}
	<DeleteModal
	choose = "arsip"
		bind:value={open}
		text="Apaakah Anda Ingin Mengarsip Titik Kerajaan?"
		successText="Berhasil diarsip!"
	></DeleteModal>
{/if}
