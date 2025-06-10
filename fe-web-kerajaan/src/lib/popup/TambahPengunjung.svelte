<script lang="ts">
	import { page } from '$app/state';

	let { id = 0, errors = null, data2, userData = null } = $props();
	let nama_pengunjung = $state(data2 ? data2.nama_pengunjung : '');
	let tanggal_kunjungan = $state(data2 ? data2.tanggal_kunjungan : '');
	let no_telp = $state(data2 ? data2.no_telp : '');
	let kota_asal = $state(data2 ? data2.kota_asal : '');
	let keterangan = $state(data2 ? data2.keterangan : '');
	let keyword = $state('');
	let nomor_telepon = $state('');
	console.log('ini data2 : ', data2);
	console.log('ini error : ', errors);
	let selectedUsername = $state();
	let idAktif = $state(page.params.id);
	function selectUser() {
		let find = userData.find((user) => user.id_user == keyword);
		selectedUsername = find.nama_lengkap;
		nomor_telepon = find.no_telp;
		kota_asal = find.tempat_lahir;
	}
	$effect(() => {
		idAktif = page.params.id;
		console.log('ID kunjungan  : ', id);
	});
</script>

<div
	class="lg:grid-cols-15 mt-5 grid h-fit w-full grid-cols-5 gap-2 rounded-lg border-2 border-gray-100 bg-gray-300 p-10 px-2 lg:h-fit"
>
	<div class="col-span-7 mt-5 lg:col-span-5 lg:mb-5">
		<div class="flex flex-col">
			<input type="hidden" bind:value={idAktif} name="ID" />
			<input type="hidden" name={`id_user-${id}`} value="3" />
			<span class="text-red-500">*</span>
			<div class="relative flex items-center">
				<select
					name={`id_user_ditemui-${id}`}
					class="h-10 w-full rounded-lg border-2 border-gray-200 px-2 pr-7"
					placeholder="Nama Pengunjung"
					bind:value={keyword}
					id=""
					onchange={() => selectUser()}
				>
					<option value="" selected>Silahkan Pilih</option>
					{#each userData as user}
						<option value={user.id_user}>{user.nama_lengkap}</option>
					{/each}
				</select>
				<input type="text" name={`nama_user-${id}`} value={selectedUsername} hidden id="" />
				<!-- <input
					type="text"
					name={`nama_pengunjung-${id}`}
					bind:value={nama_pengunjung}
					class="h-10 w-full rounded-lg border-2 border-gray-200 px-2 pr-7"
					placeholder="Nama Pengunjung"
				/> -->
				<!-- <span class="line-md--pencil absolute right-2"></span> -->
			</div>
			{#if errors && errors[`nama_pengunjung.${id}`]}
				<p class="ml-5 text-left text-red-500">{errors[`nama_pengunjung.${id}`]}</p>
			{/if}

			<span class="text-red-500">*</span>
			<div class="relative mt-5 flex items-center">
				<input
					type="date"
					name={`tanggal_kunjungan-${id}`}
					bind:value={tanggal_kunjungan}
					class="h-10 w-full rounded-lg border-2 border-gray-200 px-2 pr-7"
					placeholder="Tanggal Kunjungan"
				/>
				<span class="line-md--pencil absolute right-2"></span>
			</div>
			{#if errors && errors[`tanggal_kunjungan.${id}`]}
				<p class="ml-5 text-left text-red-500">{errors[`tanggal_kunjungan.${id}`]}</p>
			{/if}
		</div>
	</div>

	<div class="col-span-7 mb-5 mt-5">
		<div class="flex flex-col">
			<div class="grid grid-cols-1 gap-2 lg:grid-cols-7">
				<div class="relative col-span-3 flex flex-col lg:col-span-4">
					<span class="text-red-500">*</span>
					<div class="relative flex items-center">
						<input
							type="text"
							class="h-10 w-full rounded-lg border-2 border-gray-200 px-2 pr-7"
							placeholder="No Telepon"
							bind:value={nomor_telepon}
							name={`no_telp-${id}`}
							pattern="[0-9]*"
							minlength="10"
						/>
						<span class="line-md--pencil absolute right-2"></span>
					</div>

					{#if errors && errors[`no_telp.${id}`]}
						<p class="ml-1 mt-1 text-left text-red-500">{errors[`no_telp.${id}`]}</p>
					{/if}
				</div>
				<div class="relative col-span-3 flex flex-col">
					<span class="text-red-500">*</span>
					<input
						type="text"
						name={`kota_asal-${id}`}
						bind:value={kota_asal}
						class="h-10 w-full rounded-lg border-2 border-gray-200 px-2 pr-7"
						placeholder="Kota asal"
					/>
					<span class="line-md--pencil absolute right-2 top-1/2"></span>
					{#if errors && errors[`kota_asal.${id}`]}
						<p class="ml-5 text-left text-red-500">{errors[`kota_asal.${id}`]}</p>
					{/if}
				</div>
			</div>

			<div class="relative mt-5 flex items-center">
				<textarea
					name={`tujuan_kunjungan-${id}`}
					class="h-20 w-full rounded-lg border-2 border-gray-200 px-2 py-2 pr-7"
					placeholder="Tujuan Kunjungan"
				></textarea>
				<span class="line-md--pencil absolute right-2 top-2"></span>
			</div>
		</div>
		<div class="relative mt-5 flex items-center">
			<textarea
				name={`keterangan-${id}`}
				bind:value={keterangan}
				class="h-20 w-full rounded-lg border-2 border-gray-200 px-2 py-2 pr-7"
				placeholder="Keterangan (opsional)"
			></textarea>
			<span class="line-md--pencil absolute right-2 top-2"></span>
		</div>
		{#if errors && errors[`keterangan.${id}`]}
			<p class="ml-5 text-left text-red-500">{errors[`keterangan.${id}`]}</p>
		{/if}
	</div>
</div>

<style>
	.line-md--pencil {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 20h9'%3E%3C/path%3E%3Cpath d='M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z'%3E%3C/path%3E%3C/svg%3E");
	}

	@media (max-width: 768px) {
		.flexcoba {
			flex-direction: column;
		}
	}
</style>
