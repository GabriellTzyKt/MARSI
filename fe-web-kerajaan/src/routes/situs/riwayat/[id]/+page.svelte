<script lang="ts">
	import { navigating } from '$app/state';
	import Navbar from '$lib/navbar/Navbar.svelte';
	import Footer from '$lib/footer/Footer.svelte';
	import Loader from '$lib/loader/Loader.svelte';
	import Card2 from '$lib/card2/Card2.svelte';

	let { data } = $props();

	const situs = data.situs;
	const acara = data.acara;

	// For "See More" functionality
	let displayCount = 8; // Initial number of items to display

	function loadMore() {
		displayCount += 8; // Increase the number of displayed items
	}
</script>

<div class="relative">
	<Navbar></Navbar>
</div>
{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
<section class="bg-gray-100 pb-10 pt-20">
	<div class="mx-auto max-w-6xl px-4">
		<div class="form-container">
			<div class="flex justify-start p-2">
				<!-- svelte-ignore a11y_consider_explicit_label -->
				<a href="/situs/{situs.id_situs}">
					<span class="solar--arrow-left-outline"></span>
				</a>
			</div>
			<div class="flex flex-col px-4 pt-5 md:flex-row md:items-center md:justify-between">
				<div class="text-center md:text-left">
					<p class="text-2xl font-bold">Riwayat Acara - {situs.nama_situs}</p>
				</div>
				<div class="mt-2 flex justify-center md:mt-0 md:justify-end">
					<a
						href="/acara"
						class="flex items-center gap-2 rounded-full border-2 px-3 py-1 text-blue-500"
					>
						Lihat Semua
						<span class="fluent--arrow-right-12-filled"></span>
					</a>
				</div>
			</div>

			<section class="h-auto w-full py-5">
				<div class="ml-5 mr-5">
					{#if acara.length > 0}
						<div class="mx-auto grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
							{#each acara.slice(0, displayCount) as a}
								<Card2
									situs={a.imageUrls[0] || ''}
									header={a.nama_acara}
									isi={a.deskripsi_acara || 'No Description'}
									icon=""
									href={`/acara/${a.id_acara}`}
									id={a.id_acara}
								></Card2>
							{/each}
						</div>

						{#if acara.length > displayCount}
							<div class="mt-8 flex justify-center">
								<button
									on:click={loadMore}
									class="edit flex-shrink-1 mx-auto h-[40px] w-[85%] items-center rounded-lg border bg-white shadow-md"
								>
									See More !
								</button>
							</div>
						{/if}
					{:else}
						<div class="flex h-40 items-center justify-center">
							<p class="text-lg text-gray-500">Belum ada acara untuk situs ini</p>
						</div>
					{/if}
				</div>
			</section>
		</div>
	</div>
</section>
<section class="flex h-fit min-w-full overflow-hidden">
	<Footer></Footer>
</section>

<style>
	.form-container {
		background-color: white;
		border-radius: 10px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		padding: 20px;
		margin-top: 20px;
		margin-bottom: 20px;
	}

	@media (max-width: 820px) {
		.edit {
			display: flex;
			justify-content: center;
		}
	}
</style>
