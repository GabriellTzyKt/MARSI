<script lang="ts">
	import { easeBack } from 'd3';
	import { fade } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	
	let { 
		value = $bindable(), 
		data = $bindable({}), 
		errors = $bindable(), 
		error = $bindable(), 
		type = '', 
		dataGelar = [] 
	} = $props();
	
	console.log("data popup : ", data);
	console.log("dataGelar : ", dataGelar);

	// Gunakan $state untuk datagelar agar reaktif
	let datagelar = $state(data?.id_gelar ? String(data.id_gelar) : "");
	
	// Log setiap perubahan pada datagelar
	$effect(() => {
		console.log("datagelar changed to:", datagelar);
		// Update data.id_gelar saat datagelar berubah
		if (data && datagelar) {
			data.id_gelar = datagelar;
			console.log("Updated data.id_gelar to:", data.id_gelar);
		}
	});
	
	// Debugging untuk memeriksa apakah ada nilai yang cocok
	$effect(() => {
		if (dataGelar && dataGelar.length > 0) {
			console.log("Available gelar options:");
			dataGelar.forEach(gelar => {
				console.log(`Option: ${gelar.id_gelar} (${typeof gelar.id_gelar}) - ${gelar.nama_gelar || gelar.gelar}`);
				console.log(`Match with datagelar: ${String(gelar.id_gelar) === datagelar}`);
			});
		}
	});

	function handleClose() {
		value = false;
		dispatch('close');
	}
	
	// Fungsi untuk menangani perubahan pada select
	function handleGelarChange(event : any) {
		const selectedValue = event.target.value;
		console.log("Select changed to:", selectedValue);
		datagelar = selectedValue;
		// Pastikan data.id_gelar juga diupdate
		if (data) {
			data.id_gelar = selectedValue;
		}
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
			<div onclick={handleClose} class="cursor-pointer rounded-full p-1 hover:bg-gray-200">
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
						bind:value={data.nama_anggota}
						id=""
					/>
					{#if errors}
						{#each errors.nama_lengkap_anggota || [] as e}
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
						bind:value={datagelar}
						onchange={handleGelarChange}
						id=""
					>
						<option value="" selected disabled>Pilih Gelar Anggota</option>
						{#each dataGelar || [] as gelar}
							<option value={String(gelar.id_gelar)}>{gelar.nama_gelar || gelar.gelar}</option>
						{/each}
					</select>
					{#if errors}
						{#each errors.gelar_anggota || [] as e}
							<p class="text-red-500">{e}</p>
						{/each}
					{/if}
				</div>
			</div>
			<!-- Tambahkan hidden input untuk memastikan nilai gelar_anggota terkirim -->
			<input type="hidden" name="gelar_anggota" value={datagelar} />
			<input type="hidden" name="id_kerajaan2" value={data.id_kerajaan} />
			
			<div class=" w-full flex-col gap-1">
				<div>
					<p>Posisi Anggota</p>
				</div>
				<div class=" w-full">
					<input
						type="text"
						class="flex w-full rounded-lg border border-gray-500 px-3 py-2 focus:outline-none"
						name="posisi_anggota"
						bind:value={data.posisi}
						id=""
					/>
					{#if errors}
						{#each errors.posisi_anggota || [] as e}
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
