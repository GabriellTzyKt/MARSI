<script lang="ts">
	import { page } from '$app/stores';
	import Footer from '$lib/footer/Footer.svelte';
	import Navbar from '$lib/navbarLogin/Navbar.svelte';
	import { goto } from '$app/navigation';
</script>

<Navbar />

<div class="flex min-h-[70vh] w-full flex-col items-center justify-center bg-gray-50 px-4 py-12">
	<div class="text-center">
		<h1 class="text-badran-yellow mb-4 text-9xl font-bold">{$page.status}</h1>
		<p class="text-badran mb-8 text-2xl font-medium">
			{$page.error?.message || 'Terjadi kesalahan pada server'}
		</p>
		<div
			class="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
		>
			<button
				on:click={() => goto('/beranda')}
				class="bg-badran hover:bg-badran-bt focus:ring-badran-bt/30 rounded-lg px-8 py-3 text-center font-semibold text-white focus:outline-none focus:ring-4"
			>
				Kembali ke Beranda
			</button>
			<button
				on:click={() => window.location.reload()}
				class="border-badran-bt text-badran-bt focus:ring-badran-bt/30 rounded-lg border bg-white px-8 py-3 text-center font-semibold hover:bg-gray-100 focus:outline-none focus:ring-4"
			>
				Coba Lagi
			</button>
		</div>
	</div>
</div>

<Footer />
