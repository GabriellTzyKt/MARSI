<script lang="ts">
	import { easeBack } from 'd3';
	import { fade } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	
	let { value = $bindable(), data = null, errors = $bindable(), type = '', dataGelar = [] } = $props();
	
	function handleClose() {
		value = false;
		dispatch('close');
	}
</script>

<div
	class=" fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black/70"
	transition:fade={{ duration: 200 }}
>
	<div class="flex w-full max-w-[900px] flex-col bg-white">
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div class="mb-4 me-4 ms-4 mt-4 flex items-center justify-between">
			<div>
				<p class="text-2xl font-[600]">{type} Anggota Kerajaan</p>
			</div>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				onclick={handleClose}
				class="cursor-pointer rounded-full p-1 hover:bg-gray-200"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-6"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
				</svg>
			</div>
		</div>
		<div class="mb-4 h-[1px] w-full bg-[#CFCFCF]"></div>
		<div class="mb-4 me-4 ms-4 flex flex-col gap-3">
			<div class="flex w-full flex-col gap-1">
				<div>
					<p>Nama Lengkap Anggota</p>
				</div>
				<div class=" w-full">
					<input
						type="text"
						class="flex w-full rounded-lg border border-gray-500 px-3 py-2 focus:outline-none"
						name="nama_lengkap_anggota"
						id=""
					/>
					{#if errors}
						{#each errors.nama_lengkap_anggota as e}
							<p class="text-red-500">{e}</p>
						{/each}
					{/if}
				</div>
			</div>
			<div class="flex w-full flex-col gap-1">
				<div>
					<p>Gelar Anggota</p>
				</div>
				<div class="w-full">
					<select
						class="flex w-full rounded-lg border border-gray-500 px-3 py-2 focus:outline-none"
						name="gelar_anggota"
						id=""
					>
						<option value="" selected disabled>Pilih Gelar Anggota</option>
						{#each dataGelar || [] as gelar}
							<option value={gelar.id_gelar}>{gelar.nama_gelar || gelar.gelar}</option>
						{/each}
					</select>
					{#if errors}
						{#each errors.gelar_anggota as e}
							<p class="text-red-500">{e}</p>
						{/each}
					{/if}
				</div>
			</div>
			<div class=" w-full flex-col gap-1">
				<div>
					<p>Posisi Anggota</p>
				</div>
				<div class=" w-full">
					<input
						type="text"
						class="flex w-full rounded-lg border border-gray-500 px-3 py-2 focus:outline-none"
						name="posisi_anggota"
						id=""
					/>
					{#if errors}
						{#each errors.posisi_anggota as e}
							<p class="text-red-500">{e}</p>
						{/each}
					{/if}
				</div>
			</div>
		</div>
		<div class="mb-4 me-4 mr-4 flex w-full justify-center md:justify-end">
			<button
				class="me-4 w-full rounded-lg bg-[#C1A411] px-0 py-2 text-white md:w-auto md:px-6"
				type="submit">{type} Data</button
			>
		</div>
	</div>
</div>
