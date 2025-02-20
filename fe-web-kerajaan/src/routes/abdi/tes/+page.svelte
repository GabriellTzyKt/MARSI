<script lang="ts">
	import TambahKunjungan from '$lib/popup/TambahKunjungan.svelte';

	let count = $state(1);
	let id = $state(1);

	function increment() {
		count += 1;
		id += 1;
	}
</script>

<div class="flex flex-col">
	<p>Tambah Kunjungan</p>

	<div class="relative mt-3 min-h-screen w-full rounded-lg border-2 border-gray-500 p-3 lg:ml-5">
		<div class="flex flex-col">
			<div class="flex w-full justify-end">
				<button class="h-fit w-fit rounded-lg bg-blue-600 px-2 py-2 text-white" onclick={increment}>
					Tambah Kunjungan
				</button>
			</div>
			{#each Array(count) as _, id}
				<TambahKunjungan id={id+1}></TambahKunjungan>
			{/each}
		</div>
	</div>
</div>
