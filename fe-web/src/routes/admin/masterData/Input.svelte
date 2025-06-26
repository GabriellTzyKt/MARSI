<script lang="ts">
	import { fade } from 'svelte/transition';

	let {
		input = $bindable(),
		error = null,
		value = $bindable(),
		name = 'gelar',
		header = '',
		tipe = ''
	} = $props();

	console.log('Value : ', value);
	console.log('Header : ', header);

	// Fungsi untuk menghasilkan singkatan dari nama gelar
	function generateSingkatan(nama: string): string {
		if (!nama) return '';

		// Split nama berdasarkan spasi
		const words = nama.trim().split(/\s+/);

		// Ambil huruf pertama dari setiap kata dan gabungkan
		return words.map((word) => word.charAt(0).toUpperCase()).join('');
	}

	// Variabel untuk menyimpan singkatan yang dihasilkan
	let generatedSingkatan = $state('');

	// Update singkatan saat nama gelar berubah
	$effect(() => {
		if (tipe === 'gelar' && value?.nama_gelar) {
			generatedSingkatan = generateSingkatan(value.nama_gelar);
			// Update juga value.singkatan_gelar agar dikirim saat form di-submit
			value.singkatan_gelar = generatedSingkatan;
		}
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class=" fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black/90"
	onclick={(e) => {
		e.stopPropagation();
	}}
	transition:fade={{ duration: 200 }}
>
	<div
		class="flex w-full max-w-[800px] flex-col rounded bg-white"
		onclick={(e) => e.stopPropagation()}
	>
		<div class="mx-4 mt-4 flex items-center justify-between">
			<div>
				<p class="text-2xl font-bold">Edit Data</p>
			</div>
			<div
				class="rounded-full p-2 hover:bg-gray-500"
				onclick={() => {
					input = false;
				}}
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
		<div class="my-4 h-[1px] w-full bg-gray-500"></div>
		<div class="mx-4 flex flex-col">
			<p class="text-start">{header} :</p>
			{#if tipe === 'arsip'}
				<input
					type="text"
					{name}
					class="mt-1 rounded-lg px-2 focus:outline-none"
					bind:value={value.nama_jenis}
					placeholder="Silahkan diinput!"
					id=""
				/>

				<input type="text" name="id_jenis_arsip" hidden value={value.id_jenis_arsip} />
			{/if}
			{#if tipe === 'jenis_kerajaan'}
				<input
					type="text"
					{name}
					class="mt-1 rounded-lg px-2 focus:outline-none"
					bind:value={value.nama_jenis_kerajaan}
					placeholder="Silahkan diinput!"
					id=""
				/>

				<input type="text" name="id_jenis_kerajaan" hidden value={value.id_jenis_kerajaan} />
			{/if}
			{#if tipe === 'era'}
				<input
					type="text"
					{name}
					class="mt-1 rounded-lg px-2 focus:outline-none"
					bind:value={value.nama_era}
					placeholder="Silahkan diinput!"
					id=""
				/>

				<input type="text" name="id_era" hidden value={value.id_era} />
			{/if}

			{#if tipe === 'rumpun'}
				<input
					type="text"
					{name}
					class="mt-1 rounded-lg px-2 focus:outline-none"
					bind:value={value.nama_rumpun}
					placeholder="Silahkan diinput!"
					id=""
				/>

				<input type="text" name="id_rumpun" hidden value={value.id_rumpun} />
			{/if}
			{#if tipe === 'gelar'}
				<input
					type="text"
					{name}
					class="mt-1 rounded-lg px-2 focus:outline-none"
					bind:value={value.nama_gelar}
					oninput={() => {
						if (value?.nama_gelar) {
							generatedSingkatan = generateSingkatan(value.nama_gelar);
							value.singkatan_gelar = generatedSingkatan;
						}
					}}
					placeholder="Silahkan diinput!"
					id=""
				/>

				<!-- Tambahkan input untuk singkatan yang readonly -->
				<p class="mt-3 text-start">Singkatan :</p>
				<input
					type="text"
					name="singkatan_gelar"
					class="mt-1 rounded-lg bg-gray-100 px-2 focus:outline-none"
					bind:value={generatedSingkatan}
					placeholder="Singkatan akan otomatis dihasilkan"
					readonly
					id=""
				/>

				<input type="text" name="id_gelar" hidden value={value.id_gelar} />
			{/if}
			{#if error}
				<p class="text-red-500">{error}</p>
			{/if}
		</div>
		<div class="my-4 flex justify-center md:justify-end">
			<button
				type="submit"
				class="w-full rounded-lg bg-yellow-400 py-2 text-white md:me-4 md:w-auto md:px-6"
				>Tambah Data</button
			>
		</div>
	</div>
</div>
