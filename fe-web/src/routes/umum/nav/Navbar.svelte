<script lang="ts">
	import { onMount } from 'svelte';
	import logo_marsi from '../../../asset/logo_MARSI.png';
	import SearchNav from './SearchNav.svelte';

	let pos = 0;
	let hidden = false;
	let menuOpen = false;

	onMount(() => {
		const handleScroll = () => {
			let curr = window.scrollY;
			hidden = pos < curr;
			pos = curr;
		};

		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

<nav
	class="nav fixed top-0 z-50 w-screen bg-white px-3 py-2 lg:px-10"
	style:top={hidden ? '-80px' : '0'}
>
	<div class="flex items-center justify-between pe-4">
		<div class="flex items-center gap-4">
			<img src={logo_marsi} class="h-auto w-10" alt="" />
			<p class="text-3xl font-medium">MARSI</p>
		</div>

		<div class="hidden items-center gap-6 lg:flex">
			<SearchNav />
			<div class="flex">
				<a href="/umum/beranda" class="nav-link whitespace-nowrap">Beranda</a>
				<a href="/umum/daftarkerajaan" class="nav-link whitespace-nowrap">Daftar Kerajaan</a>
				<a href="/umum/daftarsitus" class="nav-link whitespace-nowrap">Situs Kerajaan</a>
				<a href="/umum/daftaraset" class="nav-link whitespace-nowrap">Aset Kerajaan</a>
				<a href="/umum/daftaracara" class="nav-link whitespace-nowrap">Acara</a>
			</div>
		</div>

		<!-- svelte-ignore a11y_consider_explicit_label -->
		<button class="lg:hidden" on:click={() => (menuOpen = !menuOpen)}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="2"
				stroke="currentColor"
				class="h-8 w-8"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
			</svg>
		</button>
	</div>

	<div
		class="absolute left-0 w-full whitespace-nowrap bg-white shadow-md transition-all lg:hidden"
		style:display={menuOpen ? 'block' : 'none'}
	>
		<a href="/umum/beranda" class="block border-b px-4 py-2" on:click={() => (menuOpen = !menuOpen)}
			>Beranda</a
		>
		<a
			href="/umum/daftarkerajaan"
			class="block border-b px-4 py-2"
			on:click={() => (menuOpen = !menuOpen)}>Daftar Kerajaan</a
		>
		<a
			href="/umum/daftarsitus"
			class="block border-b px-4 py-2"
			on:click={() => (menuOpen = !menuOpen)}>Situs Kerajaan</a
		>
		<a
			href="/umum/daftaraset"
			class="block border-b px-4 py-2"
			on:click={() => (menuOpen = !menuOpen)}>Aset Kerajaan</a
		>
		<a href="/umum/acara" class="block px-4 py-2" on:click={() => (menuOpen = !menuOpen)}>Acara</a>
	</div>
</nav>

<style>
	.nav {
		transition: top 0.35s;
	}
	.nav-link {
		padding: 8px 16px;
		transition: border-bottom 0.2s;
	}
	.nav-link:hover {
		border-bottom: 2px solid gray;
	}
	@media (max-width: 1200px) {
		.lg\:hidden {
			display: block;
		}
		.lg\:flex {
			display: none;
		}
	}
</style>
