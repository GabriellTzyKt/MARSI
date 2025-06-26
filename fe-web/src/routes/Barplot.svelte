<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { data_barplots } from '$lib/dummy';

	let { data } = $props();
	let dataambil = data;
	console.log('Barplot : ', dataambil);

	// Fungsi untuk mendapatkan nama bulan dari angka bulan
	function getNamaBulan(bulanNum: string) {
		const namaBulan: any = {
			'01': 'Januari',
			'02': 'Februari',
			'03': 'Maret',
			'04': 'April',
			'05': 'Mei',
			'06': 'Juni',
			'07': 'Juli',
			'08': 'Agustus',
			'09': 'September',
			'10': 'Oktober',
			'11': 'November',
			'12': 'Desember'
		};
		return namaBulan[bulanNum] || bulanNum;
	}

	function processData(dataAPI: any) {
		const bulanCount: any = {};

		dataAPI.forEach((item: any) => {
			let tanggal = '';
			if (item.waktu_mulai) {
				tanggal = item.waktu_mulai.split('T')[0];
			} else if (item.created_at) {
				tanggal = item.created_at.split('T')[0];
			}
			if (tanggal) {
				const bulan = tanggal.split('-')[1];
				console.log("bulan : ", bulan)
				if (bulanCount[bulan]) {
					bulanCount[bulan]++;
				} else {
					bulanCount[bulan] = 1;
				}
			}
		});

		// Urutan bulan tetap Januari–Desember
		const allBulan = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
		const result = allBulan.map((kode) => ({
			name: 'Admin',
			bulan: getNamaBulan(kode),
			total: bulanCount[kode] || 0
		}));

		return result;
	}

	// Data untuk chart
	let chartData = dataambil && dataambil.length > 0 ? processData(dataambil) : data_barplots;

	// @ts-ignore
	let chartContainer;

	onMount(async () => {
		// Set ukuran grafik
		const margin = { top: 30, right: 30, bottom: 70, left: 60 },
			width = 500 - margin.left - margin.right,
			height = 300 - margin.top - margin.bottom;

		// Hapus elemen SVG lama jika ada
		// @ts-ignore
		d3.select(chartContainer).select('svg').remove();

		// Tambahkan elemen SVG
		const svg = d3
			// @ts-ignore
			.select(chartContainer)
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		// Gunakan data yang sudah diproses
		const data = chartData;

		// Buat X axis
		const x = d3
			.scaleBand()
			.range([0, width])
			.domain(data.map((d) => d.bulan))
			.padding(0.2);
		svg
			.append('g')
			.attr('transform', `translate(0,${height})`)
			.call(d3.axisBottom(x))
			.selectAll('text')
			.attr('transform', 'translate(-10,0)rotate(-45)')
			.style('text-anchor', 'end');

		// Buat Y axis
		const maxValue = d3.max(data, (d: any) => d.total || 0) || 0;
		const y = d3
			.scaleLinear()
			.domain([0, maxValue * 1.1])
			.range([height, 0]);
		svg.append('g').call(d3.axisLeft(y));

		// Tambahkan bar
		svg
			.selectAll('mybar')
			.data(
				data.map((d) => ({
					name: 'name' in d ? d.name : 'nama_lenkgap' in d ? d.nama_lenkgap : '',
					bulan: d.bulan,
					total: d.total
				}))
			)
			.enter()
			.append('rect')
			// @ts-ignore
			.attr('x', (d) => x(d.bulan))
			.attr('y', (d) => y(d.total))
			.attr('width', x.bandwidth())
			.attr('height', (d) => height - y(d.total))
			.attr('fill', '#69b3a2');
	});
</script>

<div bind:this={chartContainer}></div>
