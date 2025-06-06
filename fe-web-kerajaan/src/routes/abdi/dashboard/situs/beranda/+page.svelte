<script lang="ts">
	import { goto } from '$app/navigation';
	import { navigating } from '$app/state';
	import gambartemp from '$lib/asset/kerajaan/gambar_temp.jpg';
	import Loader from '$lib/loader/Loader.svelte';
	let { data } = $props();
	let dataambil = data.filteredList;
	let total = $state(16);

	// Function to handle navigation to detail page
	function navigateToDetail(id: any) {
		goto(`/abdi/dashboard/situs/beranda/${id}/detail`);
	}
</script>

{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
<div class=" grid gap-x-12 gap-y-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
	{#each dataambil as situs}
		<div class="relative">
			<div
				class="relative flex w-full flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
			>
				<div class="mx-auto flex w-full items-center justify-center">
					<img src={situs.profileUrl || gambartemp} class="h-20 w-20 rounded-full" alt="" />
				</div>
				<h5
					class="mb-4 mt-2 max-w-[300px] overflow-hidden text-ellipsis text-center text-lg font-bold tracking-tight text-black"
				>
					{situs.nama_situs || 'Nama Situs'}
				</h5>
				<div class=" flex w-full flex-row justify-end">
					<button
						class="w-20 rounded-lg bg-blue-500 px-2 py-1 text-white"
						onclick={() => navigateToDetail(situs.id_situs)}
					>
						Detail
					</button>
				</div>
			</div>
		</div>
	{/each}
</div>

<style></style>
