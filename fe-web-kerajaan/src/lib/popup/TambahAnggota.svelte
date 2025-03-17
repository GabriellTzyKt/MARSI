<script lang="ts">
	import { flip } from 'svelte/animate';

	let { value = $bindable() } = $props();
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	class="fixed left-0 top-0 flex min-h-full min-w-full items-center justify-center bg-black/75"
	onclick={() => {
		value = false;
	}}
>
	<div
		class="w-100 relative mt-3 min-h-fit rounded-lg border-2 border-gray-500 bg-white p-3 lg:ml-5"
		onclick={(e) => e.stopPropagation()}
	>
		<div class="flex flex-col">
			<p>Tambah Anggota</p>
			<div class="h-1 rounded-lg bg-black"></div>

			<p class="ml-5 mt-5">Nama Anggota</p>
			<div class="relative ml-5 w-[90%]">
				<input
					type="text"
					placeholder="Nama Anggota"
					class="w-full rounded-lg border-2 border-gray-400 px-2 py-2 pr-8"
				/>
				<span class="icon-park-twotone--search absolute right-2 mt-2.5 opacity-55"> </span>
			</div>

			<p class="ml-5 mt-5">Deskripsi Tugas</p>
			<div class="relative ml-5 w-[90%]">
				<textarea
					placeholder="Nama Anggota"
					class="w-full rounded-lg border-2 border-gray-400 px-2 py-2 pr-8"
				></textarea>
			</div>

			<p class="ml-5 mt-5">Pilih Jabatan</p>
			<div class="relative ml-5 w-[90%]">
				<select
					id="jabatan"
					class="block w-full rounded-lg border border-gray-300 bg-gray-50 px-2 py-2 text-sm text-gray-900"
				>
					<option selected disabled>Pilih Jabatan</option>
					<option value="Ketua">Ketua</option>
					<option value="FR">...</option>
					<option value="DE">...</option>
				</select>
			</div>

			<div class="mt-2 flex w-full justify-end">
				<button
					class="mr-5 w-40 text-nowrap rounded-lg border-2 bg-green-500 py-1 text-white"
					onclick={() => {
						value = false;
					}}
				>
					Tambah Anggota
				</button>
			</div>
		</div>
	</div>
</div>

<style>
	.icon-park-twotone--search {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cdefs%3E%3Cmask id='ipTSearch0'%3E%3Cg fill='none' stroke='%23fff' stroke-linejoin='round' stroke-width='4'%3E%3Cpath fill='%23555555' d='M21 38c9.389 0 17-7.611 17-17S30.389 4 21 4S4 11.611 4 21s7.611 17 17 17Z'/%3E%3Cpath stroke-linecap='round' d='M26.657 14.343A7.98 7.98 0 0 0 21 12a7.98 7.98 0 0 0-5.657 2.343m17.879 18.879l8.485 8.485'/%3E%3C/g%3E%3C/mask%3E%3C/defs%3E%3Cpath fill='%23000' d='M0 0h48v48H0z' mask='url(%23ipTSearch0)'/%3E%3C/svg%3E");
	}
</style>
