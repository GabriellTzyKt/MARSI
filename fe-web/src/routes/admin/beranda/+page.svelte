<script lang="ts">
	import PieChart from '../../Piechart.svelte';
	import Barplot from '../../Barplot.svelte';
	import ColorPicker from 'svelte-awesome-color-picker';
	import { colord, Colord } from 'colord';
	import Icon from '@iconify/svelte';
	import '@fontsource/lato';

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

<div class="flex w-full flex-col">
	<p class="m-5 text-center text-4xl font-bold underline">Beranda</p>

	<div class="grid w-full grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
		{#each Array(4) as _, i}
			<div
				class="flex-shrink-1 flex h-[150px] flex-grow items-center rounded-md border border-gray-500 bg-white p-4"
			>
				<span class="material-symbols--person mr-4 text-6xl"></span>
				<div>
					<p class="text-sm">Total Jumlah Anggota:</p>
					<p class="text-3xl font-bold">3000</p>
				</div>
			</div>
		{/each}
	</div>

	<div class="flex w-full flex-col flex-wrap items-center overflow-auto gap-6 p-5 lg:flex-row">
		<div class="flex-shrink-1 flex-grow rounded-md border border-gray-500 bg-white p-5">
			<p class="mb-3 text-center text-xl font-bold">Jumlah Anggota MARSI Tahun 2024</p>
			<Barplot />
		</div>
		<div class="flex-shrink-1 flex-grow rounded-md border border-gray-500 bg-white p-5">
			<p class="mb-3 text-center text-xl font-bold">Persentase Anggota MARSI Berdasarkan Pulau</p>
			<PieChart />
		</div>
	</div>
</div>

<style>
	.material-symbols--person {
		display: inline-block;
		width: 1em;
		height: 1em;
		background-color: currentColor;
		-webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M12 12q-1.65 0-2.825-1.175T8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12m-8 8v-2.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20z'/%3E%3C/svg%3E")
			no-repeat center;
		mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M12 12q-1.65 0-2.825-1.175T8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12m-8 8v-2.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20z'/%3E%3C/svg%3E")
			no-repeat center;
		mask-size: contain;
		width: 3rem;
		height: 3rem;
	}
</style>
