<script lang="ts">
	import gambartemp from '$lib/asset/kerajaan/gambar_temp.jpg';
	let total = $state(16);
</script>

<div class="grid grid-cols-4 gap-12 mx-auto">
	{#each Array(total) as _}
		<div class="relative h-full">
			<a href="/" class="block h-60 w-60 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
				<div class="mx-auto flex w-full items-center justify-center">
					<img src={gambartemp} class="h-25 w-25 ml-5 mr-5 rounded-full" alt="" />
				</div>
				<h5 class="mb-2 mt-2 text-center text-2xl font-bold tracking-tight text-black">
					Sinau batik
				</h5>
				<button class="absolute right-0 mr-3 mt-8 w-20 rounded-lg bg-blue-500 px-2 py-1 text-white">
					Detail
				</button>
			</a>
		</div>
	{/each}
</div>

<style></style>
