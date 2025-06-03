<script lang="ts">
	import { navigating, page } from '$app/state';
	import { env } from '$env/dynamic/public';
	import Loader from '$lib/loader/Loader.svelte';
	let { data } = $props();
	let total = $state(8);
	console.log(data);
	let loading = $state(false);
	async function persetujuan(yes: boolean) {
		try {
			loading = true;
			let payload = {
				id_acara: Number(data.data.id_acara),
				nama_acara: data.data.nama_acara,
				deskripsi_acara: data.data.deskripsi_acara,
				tujuan_acara: data.data.tujuan_acara,
				lokasi_acara: data.data.id_lokasi,
				alamat_acara: data.data.alamat_acara,
				waktu_mulai: `${data.data.tanggal_mulai} ${data.data.waktu_mulai}`,
				waktu_selesai: `${data.data.tanggal_selesai} ${data.data.waktu_selesai}`,
				penanggung_jawab: Number(data.data.id_penanggung_jawab),
				jenis_acara: data.data.jenis_acara,
				kapasitas_acara: Number(data.data.kapasitas_acara),
				status: yes ? 'Disetujui' : 'Ditolak'
			};
			console.log('Payload', payload);
			// let res = await fetch(`${env.PUBLIC_URL_KERAJAAN}/acara`, {
			// 	method: 'PUT',
			// 	headers: {
			// 		'Content-Type': 'application/json'
			// 	},
			// 	body: JSON.stringify(payload)
			// });
			// let msg = await res.json();
			// console.log(msg);
		} catch (error) {
		} finally {
			loading = false;
		}
	}
</script>

{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
<div class="min-h-full w-full">
	<div class="block min-h-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
		<div class="flex w-full justify-between">
			<p class="mt-2">Informasi Acara</p>
			<a href="/abdi/sekretariat/acara/edit/{data.data.id_acara}"
				><button class="w-40 rounded-lg border-2 bg-yellow-500 px-2 py-2">Ubah</button></a
			>
		</div>

		<div class="mt-5 grid grid-cols-1 gap-12 lg:grid-cols-2">
			<div class="col-span-1">
				<div class="mt-2 w-full">
					<p>Nama Acara:</p>
					<input
						type="text"
						value={data.data.nama_acara}
						placeholder="Masukkan Nama"
						class="w-full rounded-lg border px-2 py-1"
						disabled
					/>
				</div>
				<div class="mt-2 w-full">
					<p>Penanggung Jawab:</p>
					<input
						type="text"
						value={data.data.nama_penanggungjawab}
						placeholder="Masukkan Nama"
						class="w-full rounded-lg border px-2 py-1"
						disabled
					/>
				</div>
				<div class="mt-2 w-full">
					<p>Lokasi Acara:</p>
					<input
						type="text"
						value={data.data.alamat_acara}
						placeholder="Masukkan Nama"
						class="w-full rounded-lg border px-2 py-1"
						disabled
					/>
				</div>
				<div class="mt-2 w-full">
					<p>Tujuan Acara:</p>
					<input
						type="text"
						value={data.data.tujuan_acara}
						placeholder="Masukkan Nama"
						disabled
						class="w-full rounded-lg border px-2 py-1"
					/>
				</div>
				<div class="mt-2 w-full">
					<p>Deskripsi Acara:</p>
					<textarea
						placeholder="Masukkan Deskripsi Acara"
						disabled
						value={data.data.deskripsi_acara}
						class="h-32 w-full resize-none rounded-md border px-3 py-3 text-lg"
					></textarea>
				</div>
			</div>

			<div class="col-span-1">
				<div class="flexcoba flex gap-2">
					<div class="mt-2 w-full">
						<p>Jenis Acara:</p>
						<input
							type="text"
							placeholder="Masukkan Nama"
							value={data.data.jenis_acara}
							class="w-full rounded-lg border px-2 py-1"
							disabled
						/>
					</div>
					<div class="mt-2 w-full">
						<p>Kapasitas Acara:</p>
						<input
							type="text"
							placeholder="Masukkan Nama"
							value={data.data.kapasitas_acara}
							class="w-full rounded-lg border px-2 py-1"
							disabled
						/>
					</div>
				</div>

				<div class="mt-2 w-full">
					<p>Lokasi Acara:</p>
					<input
						type="text"
						value={data.data.alamat_acara}
						placeholder="Masukkan Nama"
						class="w-full rounded-lg border px-2 py-1"
						disabled
					/>
				</div>

				<div class="flexcoba flex gap-2">
					<div class="mt-2 w-full">
						<p>Tanggal Mulai:</p>
						<input
							type="text"
							value={data.data.tanggal_mulai}
							placeholder="Masukkan Nama"
							class="w-full rounded-lg border px-2 py-1"
							disabled
						/>
					</div>
					<div class="mt-2 w-full">
						<p>Tanggal Selesai:</p>
						<input
							type="text"
							value={data.data.tanggal_selesai}
							placeholder="Masukkan Nama"
							class="w-full rounded-lg border px-2 py-1"
							disabled
						/>
					</div>
				</div>

				<div class="flexcoba flex gap-2">
					<div class="mt-2 w-full">
						<p>Jam Mulai:</p>
						<input
							type="text"
							value={data.data.waktu_mulai}
							placeholder="Masukkan Nama"
							class="w-full rounded-lg border px-2 py-1"
							disabled
						/>
					</div>
					<div class="mt-2 w-full">
						<p>Jam Selesai:</p>
						<input
							type="text"
							value={data.data.waktu_selesai}
							placeholder="Masukkan Nama"
							class="w-full rounded-lg border px-2 py-1"
							disabled
						/>
					</div>
				</div>
				{#if data?.data.status.toLowerCase() === 'diajukan'}
					<div class="  w-full gap-2">
						<div class="mt-2 grid w-full grid-cols-1 gap-3 lg:grid-cols-2">
							<div class="flex items-center justify-center">
								<button
									class="w-full cursor-pointer rounded-lg bg-green-500 py-2 text-lg font-[600] text-white"
									onclick={() => persetujuan(true)}>Terima</button
								>
							</div>
							<div class="flex items-center justify-center">
								<button
									class="w-full cursor-pointer rounded-lg bg-red-500 py-2 text-lg font-[600] text-white"
									onclick={() => persetujuan(false)}>Tolak</button
								>
							</div>
						</div>
					</div>
				{/if}

				<div class="mt-12 flex gap-2 px-4">
					<!-- <div class="mt-2 flex w-full">
						<button
							class="flex w-full items-center justify-center rounded-lg border bg-green-600 px-2 py-2 text-white"
						>
							<span class="mr-2 flex items-center justify-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									x="0px"
									y="0px"
									width="28"
									height="28"
									viewBox="0,0,256,256"
								>
									<g
										fill="#ffffff"
										fill-rule="nonzero"
										stroke="none"
										stroke-width="1"
										stroke-linecap="butt"
										stroke-linejoin="miter"
										stroke-miterlimit="10"
										stroke-dasharray=""
										stroke-dashoffset="0"
										font-family="none"
										font-weight="none"
										font-size="none"
										text-anchor="none"
										style="mix-blend-mode: normal"
										><g transform="scale(5.12,5.12)"
											><path
												d="M25,2c-12.683,0 -23,10.317 -23,23c0,12.683 10.317,23 23,23c12.683,0 23,-10.317 23,-23c0,-4.56 -1.33972,-8.81067 -3.63672,-12.38867l-1.36914,1.61719c1.895,3.154 3.00586,6.83148 3.00586,10.77148c0,11.579 -9.421,21 -21,21c-11.579,0 -21,-9.421 -21,-21c0,-11.579 9.421,-21 21,-21c5.443,0 10.39391,2.09977 14.12891,5.50977l1.30859,-1.54492c-4.085,-3.705 -9.5025,-5.96484 -15.4375,-5.96484zM43.23633,7.75391l-19.32227,22.80078l-8.13281,-7.58594l-1.36328,1.46289l9.66602,9.01563l20.67969,-24.40039z"
											></path></g
										></g
									>
								</svg>
							</span>
							Terima
						</button>
					</div>
					<div class="mt-2 flex w-full">
						<button
							class="flex w-full items-center justify-center rounded-lg border bg-red-600 px-2 py-2 text-white"
						>
							<span class="material-symbols--cancel mr-2 flex items-center justify-center"></span>
							Tolak
						</button>
					</div> -->
				</div>
			</div>
		</div>

		<div class="mt-5 h-1 w-full bg-slate-300"></div>

		<!-- bawah -->

		<p class="mb-5 mt-5 text-start text-xl font-bold text-blue-600">Daftar Undangan</p>
		<div class="mt-10 grid grid-cols-9 gap-2">
			{#each data?.undangan as undangan, i}
				<div class="col-span-1 w-full">{i + 1}</div>
				<div class="col-span-2 w-full rounded-lg border px-2 py-1">
					<p class="w-full py-2 text-center">{undangan.jenis_kelamin}</p>
				</div>
				<div class="col-span-3 w-full rounded-lg border px-2 py-1">
					<p class="w-full py-2 text-center">{undangan.nama_penerima}</p>
				</div>
				<div class="col-span-3 w-full rounded-lg border px-2 py-1">
					<p class="w-full py-2 text-center">{undangan.nomer_telepon || 'No Phone'}</p>
				</div>
			{/each}
			{#if data?.undangan.lengh === 0}
				<div class="col-span-full items-center justify-center py-2">
					<p>No Panitia Yet</p>
				</div>
			{/if}
		</div>

		<div class="mt-5 h-1 w-full bg-slate-300"></div>

		<!-- bawah -->

		<p class="mb-5 mt-5 text-start text-xl font-bold text-blue-600">Panitia Acara</p>
		<div class="grid grid-cols-8 gap-2">
			{#each Array(total) as _, i}
				<div class="col-span-1 w-full">{i + 1}</div>
				<div class="col-span-4 w-full rounded-lg border px-2 py-1">Tn</div>
				<div class="col-span-3 w-full rounded-lg border px-2 py-1">Tn</div>
			{/each}
		</div>
	</div>
</div>
{#if loading}
	<Loader></Loader>
{/if}

<style>
	.material-symbols--cancel {
		display: inline-block;
		width: 28px;
		height: 28px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23f6f6f6' d='m8.4 17l3.6-3.6l3.6 3.6l1.4-1.4l-3.6-3.6L17 8.4L15.6 7L12 10.6L8.4 7L7 8.4l3.6 3.6L7 15.6zm3.6 5q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22'/%3E%3C/svg%3E");
	}

	.gg--trash {
		display: inline-block;
		width: 16px;
		height: 16px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cg fill='%23fff6f6'%3E%3Cpath fill-rule='evenodd' d='M17 5V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v1H4a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V7h1a1 1 0 1 0 0-2zm-2-1H9v1h6zm2 3H7v11a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1z' clip-rule='evenodd'/%3E%3Cpath d='M9 9h2v8H9zm4 0h2v8h-2z'/%3E%3C/g%3E%3C/svg%3E");
	}

	@media (max-width: 768px) {
		.flexcoba {
			flex-direction: column;
		}
	}
</style>
