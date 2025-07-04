<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	const { data } = $props();
	let dataambil = data;
	console.log('Data piechart : ', dataambil);

	// Tentukan field mana yang dipakai (jenis_kerajaan_nama atau lokasi)
	let pieField = 'jenis_kerajaan_nama';
	if (dataambil && dataambil.length > 0 && dataambil[0].tempat_lahir) {
		pieField = 'tempat_lahir';
	} else if (dataambil && dataambil.length > 0 && dataambil[0].lokasi) {
		pieField = 'lokasi'
	}

	function processDataForPieChart(data: any[], field: string) {
		if (!data || !Array.isArray(data) || data.length === 0) {
			return [];
		}
		const jenisCount: Record<string, number> = {};
		data.forEach((item) => {
			const value = item[field] || '';
			if (!value || value === '-' || value.trim() === '') return;
			if (jenisCount[value]) {
				jenisCount[value]++;
			} else {
				jenisCount[value] = 1;
			}
		});
		return Object.keys(jenisCount).map((jenis) => ({
			kota: jenis,
			angka: jenisCount[jenis]
		}));
	}

	// Process the data
	const data2 = processDataForPieChart(dataambil, pieField);
	console.log('Processed data for pie chart:', data2);

	const colors = d3.scaleOrdinal(d3.schemeSet2);
	console.log('colors : ', colors);
	const width = 460;
	const height = 280;
	const radius = Math.min(width, height) / 2;
	let svg: SVGSVGElement;
	let tooltip: HTMLDivElement;

	onMount(() => {
		// Only render the pie chart if we have data
		if (data2.length === 0) {
			// If no valid data, display a message
			d3.select(svg)
				.attr('width', width)
				.attr('height', height)
				.append('text')
				.attr('x', width / 2)
				.attr('y', height / 2)
				.attr('text-anchor', 'middle')
				.text('Tidak ada data yang valid untuk ditampilkan');
			return;
		}

		const svgElement = d3
			.select(svg)
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', `translate(${width / 2}, ${height / 2})`);

		const pie = d3.pie<{ kota: string; angka: number }>().value((d) => d.angka);

		const arc = d3
			.arc<d3.PieArcDatum<{ kota: string; angka: number }>>()
			.innerRadius(0)
			.outerRadius(radius);

		console.log('Pie data:', pie(data2));

		const labelArc = d3
			.arc<d3.PieArcDatum<{ kota: string; angka: number }>>()
			.innerRadius(50)
			.outerRadius(radius);

		// Membuat tooltip yang akan muncul saat hover
		const tooltipDiv = d3
			.select(tooltip)
			.style('opacity', 0)
			.style('position', 'absolute')
			.style('background', 'white')
			.style('border', '1px solid #ccc')
			.style('padding', '5px 10px')
			.style('border-radius', '5px')
			.style('pointer-events', 'none');

		// Membuat path untuk pie chart
		svgElement
			.selectAll('path')
			.data(pie(data2))
			.enter()
			.append('path')
			.attr('d', arc)
			.attr('fill', (_, i) => colors(i.toString()).toString())
			.attr('stroke', '#fff')
			.style('stroke-width', '2px')
			.on('mouseover', (event, d) => {
				tooltipDiv.style('opacity', 1).html(`${d.data.kota}: ${d.data.angka}`);
			})
			.on('mousemove', (event) => {
				tooltipDiv.style('left', `${event.pageX + 10}px`).style('top', `${event.pageY - 10}px`);
			})
			.on('mouseleave', () => {
				tooltipDiv.style('opacity', 0);
			});

		// Label pada setiap segmen pie chart
		svgElement
			.selectAll('text')
			.data(pie(data2))
			.enter()
			.append('text')
			.attr('transform', (d) => `translate(${labelArc.centroid(d)})`)
			.attr('text-anchor', 'middle')
			.attr('font-size', '14px')
			.attr('fill', 'white')
			.text((d) => d.data.angka.toString());
	});
</script>

<svg bind:this={svg}></svg>
<div bind:this={tooltip}></div>

<style>
	svg {
		display: block;
		margin: auto;
	}
</style>
