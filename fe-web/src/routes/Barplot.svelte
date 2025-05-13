<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { data_barplots } from '$lib/dummy';

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

		// Ambil data dari CSV
		const data = data_barplots.map((item) => ({
			name: item.nama_lenkgap,
			bulan: item.bulan,
			total: item.total
		}));

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
		const maxValue = d3.max(data, (d) => d.total) || 0;
		const y = d3
			.scaleLinear()
			.domain([0, maxValue * 1.1])
			.range([height, 0]);
		svg.append('g').call(d3.axisLeft(y));

		// Tambahkan bar
		svg
			.selectAll('mybar')
			.data(data)
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
