<script lang="ts">
	// import Search from '$lib/table/Search.svelte';
	import { onMount } from 'svelte';
	import logo_marsi from '../../../asset/logo_MARSI.png';
	import SearchNav from './SearchNav.svelte';
	import { page } from '$app/state';

	// import { svelte } from '@sveltejs/vite-plugin-svelte';
	// import { handlers } from 'svelte/legacy';

	let pos = $state(0);
	let hidden = $state(false);

	onMount(() => {
		const handleScroll = () => {
			let curr = window.scrollY;
			if (pos > curr) {
				hidden = false;
			} else {
				hidden = true;
			}
			pos = curr;
		};

		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

<nav class="nav fixed top-0 z-50 w-full bg-white py-2" style:top={hidden ? '-60px' : '0'}>
	<div class="flex justify-between">
		<div class="me-16 flex flex-row items-center gap-4">
			<div class="ms-4">
				<img src={logo_marsi} class="h-auto w-10" alt="" />
			</div>
			<div class="">
				<p class="text-3xl font-[500]">MARSI</p>
			</div>
		</div>
		<div class="me-10 flex items-center gap-6">
			<div>
				<SearchNav></SearchNav>
			</div>
			<div class="flex flex-grow flex-row items-center justify-evenly">
				<div class="">
					<a
						href="beranda"
						class="mx-2 px-4 py-2 transition-all duration-100 ease-in-out hover:border-b-2 hover:border-b-gray-800 {page
							.route.id === '/umum/beranda'
							? 'border-b-2 border-b-gray-800'
							: ''}">Beranda</a
					>
				</div>
				<div>
					<a
						href="daftarkerajaan"
						class="mx-2 px-4 py-2 transition-all duration-100 ease-in-out hover:border-b-2 hover:border-b-gray-800 {page
							.route.id === '/umum/daftarkerajaan'
							? 'border-b-2 border-b-gray-800'
							: ''}">Daftar Kerajaan</a
					>
				</div>
				<div>
					<a
						href="situskerajaan"
						class="mx-2 px-4 py-2 transition-all duration-100 ease-in-out hover:border-b-2 hover:border-b-gray-800 {page
							.route.id === '/umum/situskerajaan'
							? 'border-b-2 border-b-gray-800'
							: ''}">Situs Kerajaan</a
					>
				</div>
				<div>
					<a
						href="asetkerajaan"
						class="mx-2 px-4 py-2 transition-all duration-100 ease-in-out hover:border-b-2 hover:border-b-gray-800 {page
							.route.id === '/umum/asetkerajaan'
							? 'border-b-2 border-b-gray-800'
							: ''}">Aset Kerajaan</a
					>
				</div>
				<div>
					<a
						href="acara"
						class="mx-2 px-4 py-2 transition-all duration-100 ease-in-out hover:border-b-2 hover:border-b-gray-800 {page
							.route.id === '/umum/acara'
							? 'border-b-2 border-b-gray-800'
							: ''}">Acara</a
					>
				</div>
			</div>
		</div>
	</div>
</nav>

<style>
	.nav {
		transition: top 0.35s;
	}
</style>
