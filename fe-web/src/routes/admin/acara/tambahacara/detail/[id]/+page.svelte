<script lang="ts">
	import { page } from '$app/state';
	import { colors } from '$lib/store';
	const { data } = $props();
	const acara = data.acara;
	console.log(data.acara);
</script>

<div class="test flex w-full flex-col">
	<div class="flex flex-row">
		<div>
			<a href="/admin/acara"
				><button class="custom-button bg-customRed px-8 py-2">⭠ Kembali</button></a
			>
		</div>
		<div>
			<p class="ml-5 mt-6 text-3xl font-bold underline">Detail Acara</p>
		</div>
	</div>

	<div class="me-4 flex flex-row items-center justify-end gap-3">
		<div><p class="text-xl font-[500]">Status</p></div>
		<div class="mx-2 my-2 rounded-lg px-4 py-1" style="background-color: {colors[acara.status]};">
			<p class="text-xl font-[500]">{acara.status}</p>
		</div>
	</div>
	<div
		class="mt-4 grid grid-cols-1 items-center justify-center gap-y-6 rounded-xl bg-gray-300 p-14 md:grid-cols-2 md:gap-x-4"
	>
		<div class="min-h-36 rounded-xl bg-white px-8 py-4 pb-12">
			<div class="">
				<p class="text-2xl font-[500]">Nama Acara</p>
			</div>
			<div class="mt-2">
				<p>{acara.nama_acara}</p>
			</div>
		</div>
		<div class="min-h-36 rounded-xl bg-white px-8 py-4 pb-12">
			<div>
				<p class="text-2xl font-[500]">Tanggal Acara</p>
			</div>
			<div>
				<p>{acara.tanggal}</p>
			</div>
		</div>
		<div class="min-h-36 rounded-xl bg-white px-8 py-4 pb-12">
			<div>
				<p class="text-2xl font-[500]">Lokasi Acara</p>
			</div>
			<div>
				<p>{acara.lokasi}</p>
			</div>
		</div>
		<div class="min-h-36 rounded-xl bg-white px-8 py-4 pb-12">
			<div>
				<p class="text-2xl font-[500]">Penanggung Jawab</p>
			</div>
			<div>
				<p>{acara.penanggungjawab}</p>
			</div>
		</div>
		<div class="min-h-36 rounded-xl bg-white px-8 py-4 pb-12">
			<div>
				<p class="text-2xl font-[500]">Jenis Acara</p>
			</div>
			<div>
				<p>{acara.jenis_acara}</p>
			</div>
		</div>
		<div class="min-h-36 rounded-xl bg-white px-8 py-4 pb-12">
			<div>
				<p class="text-2xl font-[500]">Kapasitas</p>
			</div>
			<div>
				<p>{acara.nama_acara}</p>
			</div>
		</div>
	</div>
</div>

<style>
	.input-field {
		width: auto;
	}

	.custom-button {
		border: none;
		padding: 10px;
		margin-left: 20px;
		margin-top: 20px;
		text-align: center;
		color: white;
		font-size: 16px;
		border-radius: 10px;
		box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
		cursor: pointer;
	}

	.form-container {
		margin-top: 30px;
		margin-left: 20px;
		margin-right: 20px;
		background: #dddee4;
		padding: 20px;
		border-radius: 10px;
		width: auto;
		height: 600px;
		text-align: center;
	}

	@media (max-width: 768px) {
		.test {
			margin-top: 90px;
		}
	}
</style>
