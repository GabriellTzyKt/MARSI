<script lang="ts">
	import { goto } from '$app/navigation';
	import SekreAbdiInput from '$lib/input/SekreAbdiInput.svelte';
	import { slide } from 'svelte/transition';
	import DropPelantikan from './DropPelantikan.svelte';
	let drop = $state(false);
	const togle = () => {
		if (!drop) {
			drop = true;
		} else drop = false;
	};
</script>

<div class="mt-6 flex h-full w-full flex-col md:h-auto">
	<!-- tanggal & btn lantik -->
	<div class="mx-6 flex justify-between gap-2">
		<div class="flex flex-col">
			<div>
				<p class="text-gray-500">Pilih Tanggal</p>
			</div>
			<div class="mt-2">
				<input
					type="date"
					placeholder="tanggal pemberian"
					class="w-full rounded-md border border-gray-500 px-6 py-2 focus:outline-none"
					value="2025-12-11"
					name=""
					id=""
				/>
			</div>
		</div>
		<div class="flex items-center">
			<button class="cursor-pointer rounded-md bg-green-500 px-8 py-2 text-white"
				>Lantik Abdi</button
			>
		</div>
	</div>
	<div class="mt-5 flex flex-col rounded-md border">
		<!-- text atas -->
		<div class="mx-3 my-4 flex items-center justify-between">
			<div>
				<p>Abdi yang akan dilantik</p>
			</div>
			<div class="flex items-center">
				<a href="/abdi/sekretariat/anggota/pelantikan/tambahabdi">
					<button class="bg-badran-bt cursor-pointer rounded-md px-6 py-2 text-white"
						>+Tambah Abdi</button
					>
				</a>
			</div>
		</div>
		<div class="max-h-[500px] overflow-y-auto">
			<DropPelantikan nama="Halo"></DropPelantikan>
			<DropPelantikan nama="Halo"></DropPelantikan>
			<DropPelantikan nama="Halo"></DropPelantikan>
			<DropPelantikan nama="Halo"></DropPelantikan>
			<DropPelantikan nama="Halo"></DropPelantikan>
			<DropPelantikan nama="Halo"></DropPelantikan>
			<DropPelantikan nama="Halo"></DropPelantikan>
			<DropPelantikan nama="Halo"></DropPelantikan>
		</div>
	</div>
</div>
