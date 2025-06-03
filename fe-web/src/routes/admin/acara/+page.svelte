<script lang="ts">
	import PieChart from '../../Piechart.svelte';
	import Barplot from '../../Barplot.svelte';
	import ColorPicker from 'svelte-awesome-color-picker';
	import { colord, Colord } from 'colord';
	import Icon from '@iconify/svelte';
	import '@fontsource/lato';
	import TableAcara from '$lib/table/TableAcara.svelte';

	let { data } = $props();
	let dataacara = data.acara;
	let keyword = $state('');
	let filteredAcara = $state(dataacara);

	$effect(() => {
		if (keyword && keyword.trim() !== '') {
			filteredAcara = dataacara.filter(
				(a: any) => a.nama_acara && a.nama_acara.toLowerCase().includes(keyword.toLowerCase())
			);
		} else {
			filteredAcara = dataacara;
		}
	});

	// let dummyAcara = [
	// 	{
	// 		id: 0,
	// 		nama: 'Acara1'
	// 	},
	// 	{
	// 		id: 1,
	// 		nama: 'Acara2'
	// 	},
	// 	{
	// 		id: 2,
	// 		nama: 'Acara3'
	// 	},
	// 	{
	// 		id: 3,
	// 		nama: 'Acara4'
	// 	}
	// ];
	let hex = '#878272ed';

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

<div class="flex h-full w-full flex-col">
	<p></p>

	<div class="flex w-full flex-col flex-wrap items-center gap-6 overflow-auto p-5 lg:flex-row">
		<div
			class="flex-shrink-1 h-fit flex-grow rounded-md border border-gray-500 bg-white p-5 lg:h-full"
		>
			<p class="mb-3 text-center text-xl font-bold">Persentase Acara Kerajaan berdasarkan pulau</p>
			<PieChart data={dataacara} />
		</div>
		<div
			class="flex-shrink-1 h-fit flex-grow rounded-md border border-gray-500 bg-white p-5 lg:h-full"
		> 
			<p class="mb-3 text-center text-xl font-bold">Jumlah Acara yang Berlangsung di 2025</p>
			<Barplot data={dataacara} />
		</div>
	</div>

	<div class="relative w-[70%] items-center lg:w-[97%] lg:items-start">
		<input
			name="keyword"
			class="m-5 w-full pr-12 text-start"
			placeholder="Cari Acara..."
			bind:value={keyword}
		/>
		<svg
			class="absolute right-0 top-1/2 -translate-y-1/2 transform"
			xmlns="http://www.w3.org/2000/svg"
			width="18"
			height="18"
			viewBox="0 0 24 24"
		>
			<path
				fill="#150000"
				d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14"
			/>
		</svg>
	</div>

	<div class="m-5 flex w-[97%] flex-grow flex-col rounded-md border border-gray-500 bg-white p-5">
		<p class="text-xl font-bold">History Acara :</p>
		<div class="w-full">
			<TableAcara
				table_data={filteredAcara}
				table_header={[
					['nama_acara', 'Nama Acara'],
					['tanggalmulai', 'Tanggal Acara'],
					['alamat_acara', 'Lokasi Acara'],
					// ['penyelenggara', 'Penyelenggara Acara'],
					['jenis_acara', 'Jenis Acara'],
					['status', 'Status']
				]}
			></TableAcara>
		</div>
	</div>
</div>

<style>
</style>
