<script lang="ts">
	import { navigating } from '$app/state';
	import gambartemp from '$lib/asset/kerajaan/gambar_temp.jpg';
	import Loader from '$lib/loader/Loader.svelte';
	let { data } = $props();
	let dataambil = data.filteredList;
	console.log('data : ', dataambil);
</script>

{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
<div
	class="mx-auto grid gap-12 overflow-auto p-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
>
	{#each dataambil as komunitas}
		<div class="relative min-h-full">
			<div
				class="relative flex h-[250px] w-full flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
			>
				<div class="mx-auto flex w-full items-center justify-center">
					<img src={komunitas.profileUrl || gambartemp} class="h-18 w-18 rounded-full" alt="" />
				</div>
				<h5 class="mb-8 mt-4 text-center text-lg font-bold tracking-tight text-black line-clamp-2">
					{komunitas.nama_organisasi || 'Nama Komunitas'}
				</h5>
				<div class="bottom-0 mt-auto flex w-full justify-end">
					<a
						href={`/abdi/dashboard/organisasi/beranda/${komunitas.id_organisasi}/detail`}
						class="inline-block"
					>
						<button class="w-20 rounded-lg bg-blue-500 px-2 py-1 text-white"> Detail </button>
					</a>
				</div>
			</div>
		</div>
	{/each}
</div>

<style>
	a {
		display: inline-block;
		max-width: 100%;
	}

	button {
		max-width: 100%;
		overflow: hidden;
	}
</style>
