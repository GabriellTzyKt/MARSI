<script lang="ts">
	import { enhance } from '$app/forms';
	let { value = $bindable(), name = '', errors = null } = $props();
	let namagelar = $state('');
	let namagelartemp: any = $state('');
	let daftarGelar: any = $state([]);
	function tambahGelar() {
		if (namagelar.trim() !== '') {
			daftarGelar = [...daftarGelar, namagelar.trim()];
			namagelar = ''; // Reset input setelah ditambahkan
		}
	}

	function hapusGelar(index: number) {
		daftarGelar = daftarGelar.filter((_: any, i: number) => i !== index);
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
	onclick={() => {
		value = false;
	}}
>
	<div
		class="max-h-[90vh] w-[70%] overflow-y-auto rounded-lg bg-white p-5 shadow-lg"
		onclick={(e) => e.stopPropagation()}
	>
		<div class="flex justify-between">
			<h2 class="font-bold lg:text-xl">Tambah Data</h2>
			<!-- svelte-ignore a11y_consider_explicit_label -->
			<button>
				<span class="carbon--close-outline items-center"></span>
			</button>
		</div>
		<div class="h-1 bg-gray-300"></div>
		<div class="mt-5 flex flex-col">
			<label for="gelar">Nama Gelar:</label>
			<div class="relative w-full">
				<input
					id="gelar"
					{name}
					bind:value={namagelar}
					class="w-full rounded-lg border px-3 py-2 pr-12"
					placeholder="Masukkan Gelar"
				/>
				<button
					class="absolute bottom-0 right-0 top-0 h-full rounded-r-lg bg-yellow-500 px-8 text-white"
					onclick={tambahGelar}
					type="button"
				>
					Add
				</button>
			</div>

			{#if daftarGelar.length > 0}
				<div class="w-full overflow-x-auto">
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
						{#each daftarGelar as gelar, index}
							<div class="mt-3 flex items-center justify-between rounded-lg border p-3">
								<p class="w-full max-w-[200px] truncate break-words">
									{gelar}
								</p>
								<input type="text" hidden {name} value={gelar} id="" />
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
