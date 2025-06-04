<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { navigating } from '$app/state';
	import DropDownLandingS1 from '$lib/dropdown/DropDownLandingS1.svelte';
	import DropDownLandingS2 from '$lib/dropdown/DropDownLandingS2.svelte';
	import Loader from '$lib/loader/Loader.svelte';
	import SModal from '$lib/popup/SModal.svelte';

	let { data } = $props()
	console.log("Data : ", data)

	let loading = $state(false);
	let errors = $state();
	let success = $state(false);
	let filesS2_2: File[] = $state([]);
	let filesS2_3: File[] = $state([]);
	let filesS2_4: File[] = $state([]);
	let filesS2_5: File[] = $state([]);
	let filesS2_6: File[] = $state([]);
	
</script>

{#if success}
	<SModal text="Sukses!"></SModal>
{/if}

{#if loading}
	<Loader text="Processing..."></Loader>
{/if}
{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}

<div class="ms-6 flex w-full flex-col pe-6">
	<form
		method="post"
		action="?/ubahLanding"
		enctype="multipart/form-data"
		use:enhance={({ formData }) => {
			loading = true;
			// Hapus semua field gambar_sectionX
			['gambar_section2', 'gambar_section3', 'gambar_section4', 'gambar_section5', 'gambar_section6'].forEach(name => formData.delete(name));
			// Append file dengan nama berbeda per section
			filesS2_2.forEach(file => formData.append('gambar_section2', file));
			filesS2_3.forEach(file => formData.append('gambar_section3', file));
			filesS2_4.forEach(file => formData.append('gambar_section4', file));
			filesS2_5.forEach(file => formData.append('gambar_section5', file));
			filesS2_6.forEach(file => formData.append('gambar_section6', file));
			return async ({ result }) => {
				loading = false;
				if (result.type === 'success') {
					success = true;
					await invalidateAll().then(() => {
						setTimeout(() => {
							success = false;
						}, 3000);
					});
				}
				if (result.type === 'failure') {
					errors = result.data?.errors;
				}
			};
		}}
	>
		<div class="my-4 flex">
			<p class="text-4xl font-[700]">Ubah Landing Page</p>
		</div>

		<div class="max-h-[700px] w-full overflow-y-auto rounded-xl bg-gray-300 p-4">
			<div class="my-2">
				<DropDownLandingS1></DropDownLandingS1>
			</div>
			<div class="my-2">
				<DropDownLandingS2
					name_header="judulpage_section2"
					name_deskripsi="isipage_section2"
					judulSection="Section 2 - Tentang Kami"
					name_gambar="gambar_section2"
					bind:files={filesS2_2}
				></DropDownLandingS2>
			</div>
			<div class="my-2">
				<DropDownLandingS2
					name_header="judulpage_section3"
					name_deskripsi="isipage_section3"
					judulSection="Section 3 - Kerajaan"
					    name_gambar="gambar_section3"

					bind:files={filesS2_3}
				></DropDownLandingS2>
			</div>
			<div class="my-2">
				<DropDownLandingS2
					name_header="judulpage_section4"
					name_deskripsi="isipage_section4"
					judulSection="Section 4 - Situs"
					    name_gambar="gambar_section4"
					bind:files={filesS2_4}
				></DropDownLandingS2>
			</div>
			<div class="my-2">
				<DropDownLandingS2
					name_header="judulpage_section5"
					name_deskripsi="isipage_section5"
					judulSection="Section 5 - Aset Kebudayaan"
					    name_gambar="gambar_section5"
					bind:files={filesS2_5}
				></DropDownLandingS2>
			</div>
			<div class="my-2">
				<DropDownLandingS2
					name_header="judulpage_section6"
					name_deskripsi="isipage_section6"
					judulSection="Section 6 - Sorotan Acara"
					    name_gambar="gambar_section6"
					bind:files={filesS2_6}
				></DropDownLandingS2>
			</div>
		</div>
		<div class="mt-4 flex justify-end">
			<button type="submit" class="rounded-lg bg-orange-500 px-6 py-2 text-white"
				>Simpan Data</button
			>
		</div>
	</form>
</div>
