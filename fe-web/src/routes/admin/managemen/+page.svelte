<script lang="ts">
	import DropDownAdmin from '$lib/dropdown/DropDownAdmin.svelte';
	import { tempasetdata } from '$lib/dummy';
	import ModalAdmin from '$lib/popup/ModalAdmin.svelte';
	import { text } from 'd3';
	import jd from '../../../asset/profile/jdpp.jpg';
	let open = $state(false);
</script>

<div class="mx-6 flex w-full flex-col">
	<div class="flex flex-col justify-center gap-4 md:flex-row md:justify-between md:gap-0">
		<div class="flex justify-center">
			<p class="text-2xl font-[550]">Role Administrasi</p>
		</div>
		<div class="flex w-full md:w-auto">
			<button
				class="w-full rounded-md bg-[#C1A411] px-6 py-2 text-white"
				onclick={() => {
					open = true;
				}}>Tambah Data</button
			>
		</div>
	</div>
	<!-- line -->
	<div class="my-4 h-[2px] w-full bg-[#949494]/80"></div>
	<div class="mb-2">
		<p class="text-lg font-[600]">Super Admin</p>
	</div>
	<div class="grid w-full auto-rows-min grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
		<!-- container -->
		<DropDownAdmin></DropDownAdmin>
		<DropDownAdmin></DropDownAdmin>
		<DropDownAdmin></DropDownAdmin>
		<DropDownAdmin></DropDownAdmin>
		<DropDownAdmin></DropDownAdmin>
		<div
			class="col-span-full my-3 flex w-full cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-[#FEFEFE]"
		>
			<p class="flex items-center gap-2 py-2 text-xl shadow-lg">
				Lihat Semua <svg
					xmlns="http://www.w3.org/2000/svg"
					width="25"
					height="24"
					viewBox="0 0 25 24"
					><path
						fill="currentColor"
						d="M19.109 14.905a.75.75 0 0 1-1.061 0l-5.72-5.72l-5.72 5.72a.75.75 0 0 1-1.06-1.06l6.25-6.25a.75.75 0 0 1 1.06 0l6.25 6.25a.75.75 0 0 1 0 1.06"
					/></svg
				>
			</p>
		</div>
	</div>
	<!-- line -->
	<div class="my-4 h-[2px] w-full bg-[#949494]/80"></div>
	<div
		class="mb-2 flex w-full flex-col justify-center gap-4 md:w-auto md:flex-row md:justify-between md:gap-0"
	>
		<div class="flex justify-center">
			<p class="text-lg font-[600]">Admin Kerajaan</p>
		</div>
		<div class="flex flex-row items-center justify-center gap-2">
			<div>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
					><path
						fill="currentColor"
						d="M7 6h10l-5.01 6.3zm-2.75-.39C6.27 8.2 10 13 10 13v6c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-6s3.72-4.8 5.74-7.39A.998.998 0 0 0 18.95 4H5.04c-.83 0-1.3.95-.79 1.61"
					/></svg
				>
			</div>
			<div>
				<p>Filtered By :</p>
			</div>
			<div class="flex max-w-[300px] items-center justify-center">
				<select name="None" class="w-40 rounded-lg py-2 text-center focus:outline-none" id="">
					<option value="None">None</option>
					<option value="Kerajaan">Kerajaan</option>
					<option value="MARSI">MARSI</option>
				</select>
			</div>
		</div>
	</div>
	<div class="grid w-full auto-rows-min grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
		<!-- container -->
		<DropDownAdmin></DropDownAdmin>
		<DropDownAdmin></DropDownAdmin>
		<DropDownAdmin></DropDownAdmin>
		<DropDownAdmin></DropDownAdmin>
		<DropDownAdmin></DropDownAdmin>
		<div
			class="col-span-full my-3 flex w-full cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-[#FEFEFE]"
		>
			<p class="flex items-center gap-2 py-2 text-xl shadow-lg">
				Lihat Semua <svg
					xmlns="http://www.w3.org/2000/svg"
					width="25"
					height="24"
					viewBox="0 0 25 24"
					><path
						fill="currentColor"
						d="M19.109 14.905a.75.75 0 0 1-1.061 0l-5.72-5.72l-5.72 5.72a.75.75 0 0 1-1.06-1.06l6.25-6.25a.75.75 0 0 1 1.06 0l6.25 6.25a.75.75 0 0 1 0 1.06"
					/></svg
				>
			</p>
		</div>
	</div>
</div>
{#if open}
	<ModalAdmin textM="Tambah" bind:value={open}></ModalAdmin>
{/if}
