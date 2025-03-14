<script lang="ts">
	import DropDownLandingS1 from '$lib/dropdown/DropDownLandingS1.svelte';
	import DropDownLandingS2 from '$lib/dropdown/DropDownLandingS2.svelte';
</script>

<div class="ms-6 flex w-full flex-col pe-6">
	<form method="post" action="?/ubahLanding">
		<div class="my-4 flex">
			<p class="text-4xl font-[700]">Ubah Landing Page</p>
		</div>

		<div class="max-h-[700px] w-full overflow-y-auto rounded-xl bg-gray-300 p-4">
			<div class="my-2">
				<DropDownLandingS1></DropDownLandingS1>
			</div>
			<div class="my-2">
				<DropDownLandingS2
					name_header="header_tentangKami"
					name_checkbox="checkbox_tentangKami"
					name_deskripsi="deskripsi_tentangKami"
					judulSection="Section 2 - Tentang Kami"
				></DropDownLandingS2>
			</div>
			<div class="my-2">
				<DropDownLandingS2
					name_header="header_kerajaan"
					name_checkbox="checkbox_kerajaan"
					name_deskripsi="deskripsi_kerajaan"
					judulSection="Section 3 - Kerajaan"
				></DropDownLandingS2>
			</div>
			<div class="my-2">
				<DropDownLandingS2
					name_header="header_situs"
					name_checkbox="checkbox_situs"
					name_deskripsi="deskripsi_situs"
					judulSection="Section 4 - Situs"
				></DropDownLandingS2>
			</div>
			<div class="my-2">
				<DropDownLandingS2
					name_header="header_keudayaan"
					name_checkbox="checkbox_keudayaan"
					name_deskripsi="deskripsi_keudayaan"
					judulSection="Section 5 - Aset Kebudayaan"
				></DropDownLandingS2>
			</div>
			<div class="my-2">
				<DropDownLandingS2
					name_header="header_acara"
					name_checkbox="checkbox_acara"
					name_deskripsi="deskripsi_acara"
					judulSection="Section 6 - Sorotan Acara"
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
