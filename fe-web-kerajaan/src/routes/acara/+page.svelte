<script lang="ts">
	import Card2 from '$lib/card2/Card2.svelte';
	import Footer from '$lib/footer/Footer.svelte';
	import Navbar from '$lib/navbar/Navbar.svelte';
	import situs1 from '$lib/asset/kerajaan/situs1.png';
	import { navigating } from '$app/state';
	import Loader from '$lib/loader/Loader.svelte';
	let { data } = $props();

	let activeTab = $state('Disetujui');

	function setActive(tab: string) {
		activeTab = tab;
	}
	let acara = data.data;
	let filteredData = $derived(acara?.filter((event) => event?.status == activeTab));

	$inspect(activeTab);
</script>

<Navbar></Navbar>
{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
<section class="h-auto w-auto">
	<div class="flex flex-col items-center">
		<p class="mt-10 text-center text-2xl font-bold">Acara</p>
		<div class="mt-2 flex gap-2 rounded-full border-2 px-5 py-2">
			<button
				onclick={() => setActive('Disetujui')}
				class="relative overflow-hidden rounded-full border-2 px-5 py-1 font-semibold"
			>
				<span
					class="absolute left-0 top-0 h-full bg-blue-600 transition-all duration-300"
					style:width={activeTab === 'Disetujui' ? '100%' : '0%'}
				></span>
				<span
					class="relative z-10 transition-colors duration-300"
					class:text-white={activeTab === 'Disetujui'}
					class:text-blue-600={activeTab !== 'Disetujui'}
				>
					Akan datang
				</span>
			</button>

			<!-- Tombol 'Selesai' -->
			<button
				onclick={() => setActive('Selesai')}
				class="relative overflow-hidden rounded-full border-2 px-5 py-1 font-semibold"
			>
				<span
					class="absolute left-0 top-0 h-full bg-blue-600 transition-all duration-300"
					style:width={activeTab === 'Selesai' ? '100%' : '0%'}
				></span>
				<span
					class="relative z-10 transition-colors duration-300"
					class:text-white={activeTab === 'Selesai'}
					class:text-blue-600={activeTab !== 'Selesai'}
				>
					Selesai
				</span>
			</button>
		</div>
	</div>

	<div class="mb-10 ml-5 mr-5 mt-10 flex h-full justify-center">
		<div class="mx-auto grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
			{#each filteredData as event}
				<div class="h-auto">
					<Card2
						situs={event.imageUrls[0] || ''}
						header={event.nama_acara}
						isi={event.deskripsi_acara || 'No Description'}
						icon=""
						href="/acara/{event.id_acara}"
						id={event.id_acara}
					/>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="flex h-fit min-w-full overflow-hidden">
	<Footer></Footer>
</section>

<style>
</style>
