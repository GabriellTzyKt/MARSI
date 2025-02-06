<script lang="ts">
	import PieChart from '../../Piechart.svelte';
	import Barplot from '../../Barplot.svelte';
	import ColorPicker from 'svelte-awesome-color-picker';
	import { colord, Colord } from 'colord';

	let hex = '#878272ed';

	let rgb = {
		r: 135,
		g: 130,
		b: 114,
		a: 0.93
	};

	let hsv = {
		h: 46,
		s: 15.307687612680287,
		v: 52.76250457763672,
		a: 0.93
	};

	let color: Colord = colord(hex); // Inisialisasi Colord instance
</script>

<p class="m-5 text-5xl font-bold underline text-center test">Beranda</p>


<div class="sigma ml-5 w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 border border-blue-500 mt-20">
	<ColorPicker bind:hex bind:rgb bind:hsv bind:color position="responsive-x" />
</div>

<!-- Main container that holds both charts -->
<div class="form-container1 flex justify-between w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4" style="background: {hex};">
	<!-- Pie chart section -->
	<div class="flex flex-col mt-10 items-center">
		<p class="mb-3 text-xl font-bold">Data BlaBla</p>
		<PieChart />
	</div>

	<!-- Barplot chart section -->
	<div class="flex flex-col mt-10 items-center">
		<p class="mb-3 text-xl font-bold mr-10">Data BlaBla</p>
		<Barplot />
	</div>
</div>

<!-- Responsive layout when screen width is less than 768px -->
<div class="form-container1 flex justify-between w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4" style="background: {hex};">
	<!-- Pie chart section -->
	<div class="flex flex-col mt-10 items-center">
		<p class="mb-3 text-xl font-bold">Data BlaBla</p>
		<PieChart />
	</div>

	<!-- Barplot chart section -->
	<div class="flex flex-col mt-10 items-center">
		<p class="mb-3 text-xl font-bold mr-10">Data BlaBla</p>
		<Barplot />
	</div>
</div>

<!-- Another container for the same layout (repeat as needed) -->
<div class="form-container1 flex justify-between w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4" style="background: {hex};">
	<!-- Pie chart section -->
	<div class="flex flex-col mt-10 items-center">
		<p class="mb-3  text-xl font-bold">Data BlaBla</p>
		<PieChart />
	</div>

	<!-- Barplot chart section -->
	<div class="flex flex-col mt-10 items-center">
		<p class="mb-3  text-xl font-bold mr-10">Data BlaBla</p>
		<Barplot />
	</div>
</div>

<style>
	/* Default container style */
	.form-container1 {
		margin-top: 30px;
		margin-left: 10px;
		padding: 20px;
		border-radius: 10px;
		width: 100%;
		height: auto;
		text-align: center;
	}
	.sigma {
		width: 100%;
		max-width: 300px; /* Adjust width based on your preference */
		margin-right: 30px; /* Keep margin-right */
	}


	@media (max-width: 768px) {
		/* Reduce width and allow elements to stack vertically on small screens */
		.form-container1 {
			width: 100%;
			margin-top: 10px;
			padding: 15px;
			flex-direction: column;
			align-items: center;
		}

		.test{
			margin-top: 90px;
		}

		/* Adjust chart spacing */
		.form-container1 .flex {
			flex-direction: column;
			align-items: center;
			width: 100%;
		}

		/* Ensure the text is readable on smaller screens */
		.form-container1 p {
			font-size: 1.25rem;
		}

		/* Modify the ColorPicker to be more responsive */
		.ml-5 {
			width: 100%;
		}

		/* Reduce ColorPicker width on smaller screens */
		.sigma {
			width: 90%;
			margin-right: 10px;
		}
	}

	/* Add responsive styles for additional containers if necessary */
	@media (max-width: 480px) {
		.form-container1 {
			width: 100%;
			margin-left: 5px;
			margin-right: 5px;
		}

		.form-container1 .text-xl {
			font-size: 1rem;
		}
	}
</style>