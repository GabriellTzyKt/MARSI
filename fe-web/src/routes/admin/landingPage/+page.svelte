<script lang="ts">
	import DropDownLandingS1 from '$lib/dropdown/DropDownLandingS1.svelte';
	import DropDownLandingS2 from '$lib/dropdown/DropDownLandingS2.svelte';
</script>

<div class="ms-6 flex w-full flex-col pe-6">
	<div class="my-4 flex">
		<p class="text-4xl font-[700]">Ubah Landing Page</p>
	</div>

	<div class="max-h-[700px] w-full overflow-y-auto rounded-xl bg-gray-300 p-4">
		<div class="my-2">
			<DropDownLandingS1></DropDownLandingS1>
		</div>
		<div class="my-2">
			<DropDownLandingS2 judulSection="Section 2 - Tentang Kami"></DropDownLandingS2>
		</div>
		<div class="my-2">
			<DropDownLandingS2 judulSection="Section 3 - Kerajaan"></DropDownLandingS2>
		</div>
		<div class="my-2">
			<DropDownLandingS2 judulSection="Section 4 - Situs"></DropDownLandingS2>
		</div>
		<div class="my-2">
			<DropDownLandingS2 judulSection="Section 5 - Aset Kebudayaan"></DropDownLandingS2>
		</div>
		<div class="my-2">
			<DropDownLandingS2 judulSection="Section 6 - Sorotan Acara"></DropDownLandingS2>
		</div>
	</div>
</div>
