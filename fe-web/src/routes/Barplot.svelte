<script>
	import { onMount } from "svelte";
	import * as d3 from "d3";

	let chartContainer;

	onMount(async () => {
		// Set ukuran grafik
		const margin = { top: 30, right: 30, bottom: 70, left: 60 },
			width = 560 - margin.left - margin.right,
			height = 300 - margin.top - margin.bottom;

		// Hapus elemen SVG lama jika ada
		d3.select(chartContainer).select("svg").remove();

		// Tambahkan elemen SVG
		const svg = d3.select(chartContainer)
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

		// Ambil data dari CSV
		const data = await d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv");

		// Buat X axis
		const x = d3.scaleBand()
			.range([0, width])
			.domain(data.map(d => d.Country))
			.padding(0.2);
		svg.append("g")
			.attr("transform", `translate(0,${height})`)
			.call(d3.axisBottom(x))
			.selectAll("text")
			.attr("transform", "translate(-10,0)rotate(-45)")
			.style("text-anchor", "end");

		// Buat Y axis
		const y = d3.scaleLinear()
			.domain([0, 13000])
			.range([height, 0]);
		svg.append("g").call(d3.axisLeft(y));

		// Tambahkan bar
		svg.selectAll("mybar")
			.data(data)
			.enter()
			.append("rect")
			.attr("x", d => x(d.Country))
			.attr("y", d => y(d.Value))
			.attr("width", x.bandwidth())
			.attr("height", d => height - y(d.Value))
			.attr("fill", "#69b3a2");
	});
</script>

<div bind:this={chartContainer}></div>
