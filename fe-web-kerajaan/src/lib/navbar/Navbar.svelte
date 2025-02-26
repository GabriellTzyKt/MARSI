<script lang="ts">
	import gambar2 from '$lib/asset/kerajaan/temp_login.png';
	import gambarprofile from '$lib/asset/kerajaan/gambar_temp.jpg';
	import { page } from '$app/state';
	import { slide } from 'svelte/transition';

	let id = Number();
	let isOpen = $state(false);
	$inspect(page);
</script>

<section class=" w-full bg-blue-900 p-4">
	<div class="flex items-center justify-between">
		<img src={gambar2} class=" ml-3 h-[60px] max-w-full p-2" alt="" />
		<nav class="hidden space-x-20 text-white md:flex">
			<a href="/beranda" class:underline={page.route.id === '/beranda'}>Beranda</a>
			<a href="/situs" class:underline={page.route.id?.startsWith('/situs')}>Situs</a>
			<a href="/acara" class:underline={page.route.id?.startsWith('/acara')}>Acara</a>
			<a href="/kelompok" class:underline={page.route.id?.startsWith('/kelompok')}>Kelompok</a>
			<a href="/cariabdi" class:underline={page.route.id === '/'}>Abdi</a>
		</nav>

		<div class="flex items-center space-x-4">
			<a href="/profile"
				><img src={gambarprofile} alt="" class="ml-5 mr-5 h-10 w-10 rounded-full" />
			</a>
			<button
				class="text-white md:hidden"
				onclick={() => {
					isOpen = !isOpen;
				}}
			>
				{#if isOpen}
					&times;
				{:else}
					&#9776;
				{/if}</button
			>
		</div>
	</div>
	<!-- Mobile Menu -->
	{#if isOpen}
		<div
			class="mt-4 space-y-2 text-center text-white md:hidden flex-col flex"
			transition:slide={{ duration: 100 }}
		>
			<a href="/beranda" class:underline={page.route.id === '/beranda'}>Beranda</a>
			<a href="/situs" class:underline={page.route.id?.startsWith('/situs')}>Situs</a>
			<a href="/acara" class:underline={page.route.id?.startsWith('/acara')}>Acara</a>
			<a href="/kelompok" class:underline={page.route.id?.startsWith('/kelompok')}>Kelompok</a>
		</div>
	{/if}
</section>

<style>
</style>
