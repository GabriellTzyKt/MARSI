<script lang="ts">
	import gambar2 from '$lib/asset/kerajaan/temp_login.png';
	import gambarprofile from '$lib/asset/kerajaan/gambar_temp.jpg';
	import gambardefault from '$lib/asset/kerajaan/default.jpg';
	import { navigating, page } from '$app/state';
	import { slide } from 'svelte/transition';
	import Loader from '$lib/loader/Loader.svelte';
	let { gambar = '' } = $props();
	let id = Number();
	let isOpen = $state(false);
	$inspect(page);
</script>

{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
<section class=" w-full bg-blue-900 p-4">
	<div class="flex items-center justify-between">
		<img src={gambar2} class=" ml-3 h-[60px] max-w-full p-2" alt="" />
		<nav class="hidden space-x-20 text-white md:flex">
			<a href="/beranda" class:underline={page.route.id === '/beranda'}>Beranda</a>
			<a href="/situs" class:underline={page.route.id?.startsWith('/situs')}>Situs</a>
			<a href="/aset" class:underline={page.route.id?.startsWith('/aset')}>Aset</a>
			<a href="/acara" class:underline={page.route.id?.startsWith('/acara')}>Acara</a>
			<a href="/kelompok" class:underline={page.route.id?.startsWith('/kelompok')}>Kelompok</a>
			<a href="/sabdi" class:underline={page.route.id === '/sabdi'}>Abdi</a>
			<!-- <a href="/cariabdi" class:underline={page.route.id === '/'}>Abdi</a> -->
		</nav>

		<div class="flex items-center space-x-4">
			<a href="/profile"
				><img src={gambar || gambardefault} alt="" class="ml-5 mr-5 h-10 w-10 rounded-full" />
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
			class="mt-4 flex flex-col space-y-2 text-center text-white md:hidden"
			transition:slide={{ duration: 100 }}
		>
			<a href="/beranda" class:underline={page.route.id === '/beranda'}>Beranda</a>
			<a href="/situs" class:underline={page.route.id?.startsWith('/situs')}>Situs</a>
			<a href="/acara" class:underline={page.route.id?.startsWith('/acara')}>Acara</a>
			<a href="/kelompok" class:underline={page.route.id?.startsWith('/kelompok')}>Kelompok</a>
			<a href="/sabdi" class:underline={page.route.id === '/sabdi'}>Abdi</a>
		</div>
	{/if}
</section>

<style>
</style>
