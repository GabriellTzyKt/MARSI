<script lang="ts">
	import { enhance } from '$app/forms';
	let { value = $bindable(), name = '', errors = null, header = '' } = $props();
	let namagelar = $state('');
	let singkatan = $state('');
	let daftarGelar: any = $state([]);

	console.log('Modal name prop:', name);

	function generateSingkatan(nama: string): string {
		if (!nama) return '';

		// Split kalo ada spasi
		const words = nama.trim().split(/\s+/);

		// Ambil huruf pertama terus digabung
		return words.map((word) => word.charAt(0).toUpperCase()).join('');
	}

	// $effect(() => {
	// 	if (name === 'nama_gelar') {
	// 		singkatan = generateSingkatan(namagelar);
	// 	}
	// });

	function tambahGelar() {
		if (namagelar.trim() !== '') {
			if (name === 'nama_gelar') {
				// Pastikan singkatan diupdate terlebih dahulu
				const updatedSingkatan = generateSingkatan(namagelar.trim());
				singkatan = updatedSingkatan;
				console.log('Singkatan : ', updatedSingkatan);

				daftarGelar = [
					...daftarGelar,
					{
						nama: namagelar.trim(),
						singkatan: updatedSingkatan // Gunakan singkatan yang baru diupdate
					}
				];
			} else {
				daftarGelar = [...daftarGelar, namagelar.trim()];
			}
			namagelar = '';
			singkatan = ''; // Reset supaya balik kosong
		}
	}

	function hapusGelar(index: number) {
		daftarGelar = daftarGelar.filter((_, i) => i !== index);
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	class="fixed inset-0 flex items-center justify-center bg-black/90"
	onclick={(e) => {
		e.stopPropagation();
	}}
>
	<div
		class="max-h-[90vh] w-[70%] overflow-y-auto rounded-lg bg-white p-5 shadow-lg"
		onclick={(e) => e.stopPropagation()}
	>
		<div class="flex justify-between">
			<h2 class="font-bold lg:text-xl">Tambah Data</h2>
			<!-- svelte-ignore a11y_consider_explicit_label -->
			<button onclick={() => (value = false)}>
				<span class="carbon--close-outline items-center"></span>
			</button>
		</div>
		<div class="h-1 bg-gray-300"></div>
		<div class="mt-5 flex flex-col">
			<label for="gelar">{header}:</label>
			<div class="relative w-full">
				<input
					id="gelar"
					bind:value={namagelar}
					class="w-full rounded-lg border px-3 py-2 pr-12"
					placeholder={`Masukkan ${header}`}
				/>
				<button
					class="absolute bottom-0 right-0 top-0 h-full rounded-r-lg bg-yellow-500 px-8 text-white"
					onclick={tambahGelar}
					type="button"
				>
					Add
				</button>
			</div>

			<!-- {#if name === 'nama_gelar'}
				<div class="mt-2">
					<label for="singkatan">Singkatan:</label>
					<input
						id="singkatan"
						bind:value={singkatan}
						class="w-full rounded-lg border px-3 py-2"
						placeholder="Field ini otomatis terisi, silahkan input nama gelar"
					/>
				</div>
			{/if} -->

			{#if daftarGelar.length > 0}
				<div class="w-full overflow-x-auto">
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
						{#each daftarGelar as gelar, index}
							<div class="mt-3 flex items-center justify-between rounded-lg border p-3">
								<div class="w-full max-w-[200px] truncate break-words">
									{#if typeof gelar === 'string'}
										<p>{gelar}</p>
										<input type="hidden" {name} value={gelar} />
									{:else if name === 'nama_gelar'}
										<p>{gelar.nama}</p>
										<p class="text-sm text-gray-500">Singkatan: {gelar.singkatan}</p>
										<input type="hidden" name="nama_gelar" value={gelar.nama} />
										<input type="hidden" name="singkatan_gelar" value={gelar.singkatan} />
									{/if}
								</div>
								<!-- svelte-ignore a11y_consider_explicit_label -->
								<button class="text-red-500" onclick={() => hapusGelar(index)}>
									<span class="carbon--close-outline2 ml-2 items-center"></span>
								</button>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<div class="flex w-full justify-end">
				<button type="submit" class="mt-12 w-fit rounded-lg bg-yellow-600 px-5 py-3 text-white">
					Simpan data
				</button>
			</div>
			<div>
				{#if errors}
					<p class="text-red-500">{errors}</p>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.carbon--close-outline {
		display: inline-block;
		width: 24px;
		height: 24px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath fill='%23bba5a5' d='M16 2C8.2 2 2 8.2 2 16s6.2 14 14 14s14-6.2 14-14S23.8 2 16 2m0 26C9.4 28 4 22.6 4 16S9.4 4 16 4s12 5.4 12 12s-5.4 12-12 12'/%3E%3Cpath fill='%23bba5a5' d='M21.4 23L16 17.6L10.6 23L9 21.4l5.4-5.4L9 10.6L10.6 9l5.4 5.4L21.4 9l1.6 1.6l-5.4 5.4l5.4 5.4z'/%3E%3C/svg%3E");
	}

	.carbon--close-outline2 {
		display: inline-block;
		width: 12px;
		height: 12px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath fill='%23bba5a5' d='M16 2C8.2 2 2 8.2 2 16s6.2 14 14 14s14-6.2 14-14S23.8 2 16 2m0 26C9.4 28 4 22.6 4 16S9.4 4 16 4s12 5.4 12 12s-5.4 12-12 12'/%3E%3Cpath fill='%23bba5a5' d='M21.4 23L16 17.6L10.6 23L9 21.4l5.4-5.4L9 10.6L10.6 9l5.4 5.4L21.4 9l1.6 1.6l-5.4 5.4l5.4 5.4z'/%3E%3C/svg%3E");
	}
</style>
