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

<div class={`h-full max-w-sm overflow-hidden rounded ${bgClass} shadow-lg`}>
	<div class="w-full">
		<img class="ml-4 mt-3 h-full w-[350px]" src={gambarAbout} alt="Sunset in the mountains" />
	</div>
	<div class="px-6 py-4">
		<p class="text-md mb-5 mt-5 text-gray-700">
			{isiAbout}
		</p>
	</div>
</div>

<style>
</style>
