<script lang="ts">
	import PieChart from '../../Piechart.svelte';
	import Barplot from '../../Barplot.svelte';
	import ColorPicker from 'svelte-awesome-color-picker';
	import { colord, Colord } from 'colord';
	import Icon from '@iconify/svelte';
	import '@fontsource/lato';

	let hex = '#878272ed';

	let { data } = $props();
	console.log("Data ", data)
	let dataambil = data.adminCount;
	let datadetail = data.adminData
	let dataambil2 = data.arsipCount
	let dataambil3 = data.kerajaanCount
	let dataambil4 = data.acaraCount

	let rgb = {
		r: 135,
		g: 130,
		b: 114,
		a: 0.93
	};

	let hsv = {
		h: 46,
		s: 15.3,
		v: 52.76,
		a: 0.93
	};

	let color: Colord = colord(hex);
</script>

<div class="flex w-full flex-col">
	<p class="m-5 text-center text-4xl font-bold underline">Beranda</p>

	<div class="flex w-full flex-col flex-wrap items-center gap-6 overflow-auto p-5 lg:flex-row">
		<div class="flex-shrink-1 h-[380px] flex-grow rounded-md border border-gray-500 bg-white p-5">
			<p class="mb-3 text-center text-xl font-bold">Jumlah Anggota MARSI Tahun 2025</p>
			<Barplot data = {datadetail}/>
		</div>
		<div class="flex-shrink-1 h-[380px] flex-grow rounded-md border border-gray-500 bg-white p-5">
			<p class="mb-3 text-center text-xl font-bold">Persentase Anggota MARSI Berdasarkan Pulau</p>
			<PieChart data = {datadetail} />
		</div>
	</div>

	<div class="grid w-full grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
		{#each Array(4) as _, i}
			<div
				class="flex h-[150px] w-full items-center justify-between rounded-md border border-gray-500 bg-white p-4"
			>
				{#if i === 0}
					<span class="material-symbols--person mr-4 text-7xl"></span>
				{:else if i === 1}
					<span class="solar--document-broken mr-4 text-7xl"></span>
				{:else if i === 2}
					<span class="carbon--event mr-4 text-7xl"></span>
				{:else}
					<span class="material-symbols--castle-outline-rounded ml-5 mr-4 h-[150px] w-[150px]"
					></span>
				{/if}
				<div class="flex w-full flex-col items-center">
					<p class="lg:text-sm text-md">
						{i === 0
							? 'Jumlah Total Anggota:'
							: i === 1
								? 'Jumlah Total Dokumen:'
								: i === 2
									? 'Jumlah Total Acara:'
									: 'Jumlah Total Kerajaan:'}
					</p>
					<p class="text-3xl font-bold">
						{i === 0 ? dataambil : i === 1 ? dataambil2 : i === 2 ? dataambil4 : dataambil3}
					</p>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.material-symbols--person {
		display: inline-block;
		background-color: currentColor;
		-webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M12 12q-1.65 0-2.825-1.175T8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12m-8 8v-2.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20z'/%3E%3C/svg%3E")
			no-repeat center;
		mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M12 12q-1.65 0-2.825-1.175T8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12m-8 8v-2.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20z'/%3E%3C/svg%3E")
			no-repeat center;
		mask-size: contain;
		width: 6rem;
		height: 6rem;
	}

	.solar--document-broken {
		display: inline-block;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='%23202020' stroke-linecap='round' stroke-width='1.5' d='M3 14v-4c0-3.771 0-5.657 1.172-6.828S7.229 2 11 2h2c3.771 0 5.657 0 6.828 1.172c.654.653.943 1.528 1.07 2.828M21 10v4c0 3.771 0 5.657-1.172 6.828S16.771 22 13 22h-2c-3.771 0-5.657 0-6.828-1.172c-.654-.653-.943-1.528-1.07-2.828M8 14h5m-5-4h1m7 0h-4'/%3E%3C/svg%3E");
		width: 6rem;
		height: 6rem;
	}

	.carbon--event {
		display: inline-block;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath fill='%23202020' d='M28 6a2 2 0 0 0-2-2h-4V2h-2v2h-8V2h-2v2H6a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h4v-2H6V6h4v2h2V6h8v2h2V6h4v6h2Z'/%3E%3Cpath fill='%23202020' d='m21 15l2.549 4.938l5.451.791l-4 3.844L26 30l-5-2.562L16 30l1-5.427l-4-3.844l5.6-.791z'/%3E%3C/svg%3E");
		width: 6rem;
		height: 6rem;
	}

	.material-symbols--castle-outline-rounded {
		display: inline-block;
		width: 6rem;
		height: 6rem;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23202020' d='M1 19v-9q0-.425.288-.712T2 9t.713.288T3 10v1h2V4q0-.425.288-.712T6 3t.713.288T7 4v1h2V4q0-.425.288-.712T10 3t.713.288T11 4v1h2V4q0-.425.288-.712T14 3t.713.288T15 4v1h2V4q0-.425.288-.712T18 3t.713.288T19 4v7h2v-1q0-.425.288-.712T22 9t.713.288T23 10v9q0 .825-.587 1.413T21 21h-6q-.425 0-.712-.288T14 20v-2q0-.825-.587-1.412T12 16t-1.412.588T10 18v2q0 .425-.288.713T9 21H3q-.825 0-1.412-.587T1 19m2 0h5v-1q0-1.65 1.175-2.825T12 14t2.825 1.175T16 18v1h5v-6h-3q-.425 0-.712-.288T17 12V7H7v5q0 .425-.288.713T6 13H3zm6.25-7h1.5q.125 0 .188-.062T11 11.75V10q0-.425-.288-.712T10 9t-.712.288T9 10v1.75q0 .125.063.188T9.25 12m4 0h1.5q.125 0 .188-.062T15 11.75V10q0-.425-.288-.712T14 9t-.712.288T13 10v1.75q0 .125.063.188t.187.062M12 13'/%3E%3C/svg%3E");
	}
</style>
