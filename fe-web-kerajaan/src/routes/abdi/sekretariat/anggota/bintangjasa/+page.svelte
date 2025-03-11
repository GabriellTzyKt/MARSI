<script lang="ts">
	import { goto } from '$app/navigation';
	import SekreAbdiInput from '$lib/input/SekreAbdiInput.svelte';
</script>

<div class="mt-6 flex h-full w-full flex-col md:h-auto">
	<!-- tanggal & btn lantik -->
	<div class="mx-6 flex justify-between">
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
				>Beri Bintang Jasa</button
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
				<button class="bg-badran-bt cursor-pointer rounded-md px-6 py-2 text-white"
					>+Tambah Abdi</button
				>
			</div>
		</div>
		<div class="max-h-[500px] overflow-y-auto">
			<!-- abdi yang akan dilantik -->
			<div class="bg-badran/60 mx-3 mb-3 flex flex-col rounded-xl pb-3">
				<div class="bg-badran/80 flex rounded-t-xl py-3">
					<p class="ms-3 text-gray-200">Nama Abdi</p>
				</div>
				<!-- nama abdi/ id abdi -->
				<div class="mx-3 mt-3 grid grid-cols-1 gap-4 lg:grid-cols-4">
					<SekreAbdiInput span="1" placeholder="Nama Abdi/ID Abdi"></SekreAbdiInput>
					<SekreAbdiInput span="1" placeholder="Nama Acara"></SekreAbdiInput>
					<SekreAbdiInput span="1" placeholder="Dilantik oleh Siapa"></SekreAbdiInput>
					<SekreAbdiInput span="1" placeholder="Bukti Bintang Jasa" img={true}></SekreAbdiInput>
					<SekreAbdiInput span="2" placeholder="Nama Bintang Jasa"></SekreAbdiInput>
					<SekreAbdiInput span="2" placeholder="Keterangan Bintang Jasa"></SekreAbdiInput>
				</div>
			</div>
			<!-- abdi yang akan dilantik -->
			<div class="bg-badran/60 mx-3 mb-3 flex flex-col rounded-xl pb-3">
				<div class="bg-badran/80 flex rounded-t-xl py-3">
					<p class="ms-3 text-gray-200">Nama Abdi</p>
				</div>
				<!-- nama abdi/ id abdi -->
				<div class="mx-3 mt-3 grid grid-cols-1 gap-4 lg:grid-cols-4">
					<SekreAbdiInput span="1" placeholder="Nama Abdi/ID Abdi"></SekreAbdiInput>
					<SekreAbdiInput span="1" placeholder="Nama Acara"></SekreAbdiInput>
					<SekreAbdiInput span="1" placeholder="Dilantik oleh Siapa"></SekreAbdiInput>
					<SekreAbdiInput span="1" placeholder="Bukti Bintang Jasa" img={true}></SekreAbdiInput>
					<SekreAbdiInput span="2" placeholder="Nama Bintang Jasa"></SekreAbdiInput>
					<SekreAbdiInput span="2" placeholder="Keterangan Bintang Jasa"></SekreAbdiInput>
				</div>
			</div>
			<!-- abdi yang akan dilantik -->
			<div class="bg-badran/60 mx-3 mb-3 flex flex-col rounded-xl pb-3">
				<div class="bg-badran/80 flex rounded-t-xl py-3">
					<p class="ms-3 text-gray-200">Nama Abdi</p>
				</div>
				<!-- nama abdi/ id abdi -->
				<div class="mx-3 mt-3 grid grid-cols-1 gap-4 lg:grid-cols-4">
					<SekreAbdiInput span="1" placeholder="Nama Abdi/ID Abdi"></SekreAbdiInput>
					<SekreAbdiInput span="1" placeholder="Nama Acara"></SekreAbdiInput>
					<SekreAbdiInput span="1" placeholder="Dilantik oleh Siapa"></SekreAbdiInput>
					<SekreAbdiInput span="1" placeholder="Bukti Bintang Jasa" img={true}></SekreAbdiInput>
					<SekreAbdiInput span="2" placeholder="Nama Bintang Jasa"></SekreAbdiInput>
					<SekreAbdiInput span="2" placeholder="Keterangan Bintang Jasa"></SekreAbdiInput>
				</div>
			</div>
			<!-- abdi yang akan dilantik -->
			<div class="bg-badran/60 mx-3 mb-3 flex flex-col rounded-xl pb-3">
				<div class="bg-badran/80 flex rounded-t-xl py-3">
					<p class="ms-3 text-gray-200">Nama Abdi</p>
				</div>
				<!-- nama abdi/ id abdi -->
				<div class="mx-3 mt-3 grid grid-cols-1 gap-4 lg:grid-cols-4">
					<SekreAbdiInput span="1" placeholder="Nama Abdi/ID Abdi"></SekreAbdiInput>
					<SekreAbdiInput span="1" placeholder="Nama Acara"></SekreAbdiInput>
					<SekreAbdiInput span="1" placeholder="Dilantik oleh Siapa"></SekreAbdiInput>
					<SekreAbdiInput span="1" placeholder="Bukti Bintang Jasa" img={true}></SekreAbdiInput>
					<SekreAbdiInput span="2" placeholder="Nama Bintang Jasa"></SekreAbdiInput>
					<SekreAbdiInput span="2" placeholder="Keterangan Bintang Jasa"></SekreAbdiInput>
				</div>
			</div>
			<!-- abdi yang akan dilantik -->
			<div class="bg-badran/60 mx-3 mb-3 flex flex-col rounded-xl pb-3">
				<div class="bg-badran/80 flex rounded-t-xl py-3">
					<p class="ms-3 text-gray-200">Nama Abdi</p>
				</div>
				<!-- nama abdi/ id abdi -->
				<div class="mx-3 mt-3 grid grid-cols-1 gap-4 lg:grid-cols-4">
					<SekreAbdiInput span="1" placeholder="Nama Abdi/ID Abdi"></SekreAbdiInput>
					<SekreAbdiInput span="1" placeholder="Nama Acara"></SekreAbdiInput>
					<SekreAbdiInput span="1" placeholder="Dilantik oleh Siapa"></SekreAbdiInput>
					<SekreAbdiInput span="1" placeholder="Bukti Bintang Jasa" img={true}></SekreAbdiInput>
					<SekreAbdiInput span="2" placeholder="Nama Bintang Jasa"></SekreAbdiInput>
					<SekreAbdiInput span="2" placeholder="Keterangan Bintang Jasa"></SekreAbdiInput>
				</div>
			</div>
		</div>
	</div>
</div>
