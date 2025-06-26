<script lang="ts">
	import { slide } from 'svelte/transition';
	import img from '../../asset/Logo_MARSI_login.png';
	import { scaleUtc } from 'd3';
	import SModal from '$lib/popup/SModal.svelte';
	import DeleteModal from '$lib/popup/DeleteModal.svelte';

	let value = $state(false);
	let open = $state(false);

	let { dataambil } = $props()
	console.log("d ambil : ", dataambil)

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

	<input type="hidden" name="judulpage_section1" value={dataambil.judul_section}>

	{#if value}
		<div
			class=" grid grid-cols-6 rounded-b-xl border-x border-b border-gray-500 bg-white pb-6"
			transition:slide={{ duration: 150 }}
		>
			<div class="col-span-full me-4 ms-4 mt-6 flex flex-col md:col-span-5">
				<div class="">
					<p class="text-xl">Judul Page</p>
				</div>
				<div class="mt-1 max-w-full">
					<input
						type="text"
						class="w-full rounded-lg border border-gray-400 py-2 pe-2 ps-2 shadow-xl focus:border-gray-400 focus:outline-none focus:ring-0"
						name="judulpage_section1"
						maxlength=50
						bind:value={dataambil.judul_section}
						placeholder="MAJELIS AGUNG RAJA SULTAN INDONESIA"
						id=""
					/>
				</div>
			</div>
		</div>
	{/if}
</div>
