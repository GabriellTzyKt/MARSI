<script lang="ts">
	import { page } from '$app/state';

	let { id = 0, errors = null, data2 } = $props();
	let namapengunjung = $state(data2 ? data2.namapengunjung : '');
	// let radioinput = $state(data2 ? data2.radioinput : 'tidak');
	let radioinput = $state('tidak');
	let keterangankunjungan = $state(data2 ? data2.keterangankunjungan : '');
	let notelp = $state(data2 ? data2.notelp : '');
	let kotaasal = $state(data2 ? data2.kotaasal : '');
	let orangyangditemui = $state(data2 ? data2.orangyangditemui : '');
	let tujuankunjungan = $state(data2 ? data2.tujuankunjungan : '');
	console.log('ini data2 : ', data2);
	console.log('ini error : ', errors);
	let idAktif = $state(page.params.id);
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
			<div class="relative flex items-center">
				<input
					type="text"
					name={`namapengunjung-${id}`}
					bind:value={namapengunjung}
					class="h-10 w-full rounded-lg border-2 border-gray-200 px-2 pr-7"
					placeholder="Nama Pengunjung"
				/>
				<span class="line-md--pencil absolute right-2"></span>
			</div>
			{#if errors && errors[`namapengunjung.${id}`]}
				<p class="ml-5 text-left text-red-500">{errors[`namapengunjung.${id}`]}</p>
			{/if}
			<div class="relative mt-5 flex items-center">
				<input
					type="text"
					name={`keterangankunjungan-${id}`}
					bind:value={keterangankunjungan}
					class="py-8.5 lg:py-9.5 h-10 w-full rounded-lg border-2 border-gray-200 px-2 pr-7"
					placeholder="Keterangan kunjungan"
				/>
				<span class="line-md--pencil absolute right-2"></span>
			</div>
			{#if errors && errors[`keterangankunjungan.${id}`]}
				<p class="ml-5 text-left text-red-500">{errors[`keterangankunjungan.${id}`]}</p>
			{/if}
		</div>
	</div>

	<div class="col-span-7 mb-5 mt-5">
		<div class="flex flex-col">
			<div class="grid grid-cols-1 gap-2 lg:grid-cols-7">
				<div class="relative col-span-3 flex flex-col lg:col-span-4">
					<div class="relative flex items-center">
						<input
							type="text"
							class="h-10 w-full rounded-lg border-2 border-gray-200 px-2 pr-7"
							placeholder="No Telepon"
							bind:value={notelp}
							name={`notelp-${id}`}
							pattern="[0-9]*"
							minlength="10"
						/>
						<span class="line-md--pencil absolute right-2"></span>
					</div>

					{#if errors && errors[`notelp.${id}`]}
						<p class="ml-1 mt-1 text-left text-red-500">{errors[`notelp.${id}`]}</p>
					{/if}
				</div>

				<div class="relative col-span-3 flex flex-col">
					<input
						type="text"
						name={`kotaasal-${id}`}
						bind:value={kotaasal}
						class="h-10 w-full rounded-lg border-2 border-gray-200 px-2 pr-7"
						placeholder="Kota asal"
					/>
					<span class="line-md--pencil absolute right-2 top-2.5"></span>
					{#if errors && errors[`kotaasal.${id}`]}
						<p class="ml-5 text-left text-red-500">{errors[`kotaasal.${id}`]}</p>
					{/if}
				</div>
			</div>

			<!-- Radio Button -->
			<div class="flexcoba mt-5 flex items-center">
				<p class="mb-2 text-nowrap text-sm lg:mt-3">Menemui Seseorang?</p>
				<div class="mb-2 flex items-center lg:mb-0">
					<div class="mx-2 flex items-center justify-center">
						<input
							id="default-radio-1-{id}"
							type="radio"
							value="ya"
							bind:group={radioinput}
							name={`menemui_seseorang-${id}`}
							class="h-3 w-3 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
						/>
						<label for="default-radio-1-{id}" class="ms-2 text-sm font-medium text-gray-900"
							>Ya</label
						>
					</div>
					<div class="flex items-center justify-center">
						<input
							id="default-radio-2-{id}"
							type="radio"
							value="tidak"
							bind:group={radioinput}
							name={`menemui_seseorang-${id}`}
							class="h-3 w-3 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
						/>
						<label for="default-radio-2-{id}" class="ms-2 text-sm font-medium text-black"
							>Tidak</label
						>
					</div>
				</div>
				{#if errors && errors[`radioinput.${id}`]}
					<p class="ml-5 text-left text-red-500">{errors[`radioinput.${id}`]}</p>
				{/if}
			</div>

			<!-- Grid untuk input field -->
			{#if radioinput === 'ya'}
				<div class="grid grid-cols-1 gap-2 lg:grid-cols-7">
					<div class="relative flex items-center lg:col-span-4">
						<input
							type="text"
							bind:value={orangyangditemui}
							class="h-10 w-full rounded-lg border-2 border-gray-200 px-2 pr-7"
							name={`orangyangditemui-${id}`}
							placeholder="Orang Yang Ingin Ditemui"
						/>
						<span class="line-md--pencil absolute right-2"></span>
					</div>

					<div class="relative flex items-center lg:col-span-3">
						<input
							type="text"
							class="h-10 w-full rounded-lg border-2 border-gray-200 px-2 pr-7"
							bind:value={tujuankunjungan}
							name={`tujuankunjungan-${id}`}
							placeholder={`tujuankunjungan-${id}`}
						/>
						<span class="line-md--pencil absolute right-2"></span>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.line-md--pencil {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cg fill='none' stroke='%23101010' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'%3E%3Cpath stroke-dasharray='56' stroke-dashoffset='56' d='M3 21l2 -6l11 -11c1 -1 3 -1 4 0c1 1 1 3 0 4l-11 11l-6 2'%3E%3Canimate fill='freeze' attributeName='stroke-dashoffset' dur='0.6s' values='56;0'/%3E%3C/path%3E%3Cpath stroke-dasharray='8' stroke-dashoffset='8' d='M15 5l4 4'%3E%3Canimate fill='freeze' attributeName='stroke-dashoffset' begin='0.6s' dur='0.2s' values='8;0'/%3E%3C/path%3E%3Cpath stroke-dasharray='6' stroke-dashoffset='6' stroke-width='1' d='M6 15l3 3'%3E%3Canimate fill='freeze' attributeName='stroke-dashoffset' begin='0.6s' dur='0.2s' values='6;0'/%3E%3C/path%3E%3C/g%3E%3C/svg%3E");
	}

	@media (max-width: 768px) {
		.flexcoba {
			flex-direction: column;
		}
	}
</style>
