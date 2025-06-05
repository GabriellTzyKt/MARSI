<script lang="ts">
	type Color = 'blue' | 'red' | 'yellow';

	let { gambarAbout, isiAbout, warna }: { gambarAbout: string; isiAbout: string; warna: Color } =
		$props();
	const colorMap: Record<Color, string> = {
		blue: 'bg-blue-100',
		red: 'bg-red-100',
		yellow: 'bg-yellow-100'
	};

	const bgClass = colorMap[warna] || 'bg-gray-100';
</script>

<div class={`h-full w-full overflow-hidden rounded ${bgClass} shadow-lg`}>
	<div class="mx-auto flex w-full justify-center">
		<img
			class="me-2 ms-2 mt-3 h-full w-[300px] rounded-lg lg:w-[400px]"
			src={gambarAbout}
			alt="Sunset in the mountains"
		/>
	</div>
	<div class="px-6 py-4">
		<p class="text-md mb-5 mt-5 text-gray-700">
			{isiAbout}
		</p>
	</div>
</div>

<style>
</style>
