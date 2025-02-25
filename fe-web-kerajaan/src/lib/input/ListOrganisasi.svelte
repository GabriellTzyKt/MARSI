<script lang="ts">
	let { data } = $props();
</script>

<div class="mx-4 mt-3 flex flex-col rounded-lg border border-gray-400 p-3 shadow-xl">
	{#each data as d}
		{#if d[0] === 'judul'}
			<!-- judul -->
			<div class="ms-2">
				<p class="text-badran/80 text-lg font-[500]">{d[1]}</p>
			</div>
		{:else}
			<!-- tempat -->
			<div class="ms-2 mt-2">
				<p class="text-badran/80 text-sm font-[400]">{d[0]}</p>
			</div>
		{/if}
	{/each}
</div>
