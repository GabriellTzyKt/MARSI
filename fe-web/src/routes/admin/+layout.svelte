<script lang="ts">
	import { writable } from 'svelte/store';
	import '../../app.css';
	import image from '../../asset/logo_MARSI.png';
	import imageprofile from '../../asset/gambar_temp.jpg';
	import Sidebar from '../Sidebar.svelte';
	import SidebarMenu from '../SidebarMenu.svelte';
	import { page } from '$app/state';
	const isActive = (path: string) => {
		return page.url.pathname === path;
	};

	$inspect(page);
	$inspect(page.route.id === '/admin/acara/detail/[id]');
	const pageTitle = $derived.by(() => {
		if (page.route.id === '/admin/beranda') {
			return 'Selamat Datang';
		} else if (page.route.id === '/admin/keanggotaan/daftaranggota') {
			return 'Keanggotaan';
		} else if (page.route.id === '/admin/keanggotaan/daftaranggota/tambahanggota') {
			return 'Keanggotaan';
		} else if (page.route.id === '/admin/keanggotaan/gelar') {
			return 'Keanggotaan';
		} else if (page.route.id === '/admin/acara') {
			return 'Acara';
		} else if (page.route.id == '/admin/acara/tambahacara') {
			return 'Acara';
		} else if (page.route.id === '/admin/acara/tambahacara/detail/[id]') {
			return 'Acara';
		}
	});
	let { children } = $props();

	let sidebarActive = writable(false);

	const toggleSidebar = () => {
		sidebarActive.update((value) => !value);
	};
</script>

<header class="min-w-screen flex">
	<div
		class="test2 width_head1 bg-customGold flex w-[16.7%] items-center justify-between text-center"
	>
		<button
			type="button"
			class="ri--menu-line ml-2"
			onclick={toggleSidebar}
			aria-label="Toggle sidebar"
		></button>
		<div class="flex items-center">
			<img src={image} alt="Deskripsi Gambar" class="ml-2" />
			<h1 class="font-edit mb-3 ml-2 mt-3">MARSI</h1>
		</div>
	</div>
	<div class="width_head2 flex w-[83.3%] items-center justify-between">
		<p class="md:w-16,7% lg:w-16,7% ml-5 p-5 text-3xl font-bold text-black">
			{pageTitle}
		</p>
		<div class="bg-customYellow mr-5 flex items-center rounded-md p-2">
			<span class="ml-5 text-black">Admin MARSI</span>
			<img src={imageprofile} alt="duar" class="ml-5 mr-5 h-10 w-10 rounded-full" />
		</div>
	</div>
</header>

<div class=" min-w-screen flex min-h-screen">
	<div class=" test lg:w=[16.7%] bg-customYellow w-[16.7%] lg:block" class:active={$sidebarActive}>
		<Sidebar>
			<SidebarMenu
				href="/admin/beranda"
				icon="mdi:home"
				anchor="Beranda"
				active={isActive('/admin/beranda')}
			/>
			<SidebarMenu href="#" icon="mdi:people" anchor="Keanggotaan" hasChildren={true}>
				<SidebarMenu
					href="/admin/keanggotaan/daftaranggota"
					icon="mdi:book"
					anchor="Daftar Anggota"
					active={isActive('/admin/keanggotaan/daftaranggota')}
				/>
				<SidebarMenu
					href="/admin/keanggotaan/gelar"
					icon="mdi:crown"
					anchor="Gelar"
					active={isActive('/admin/keanggotaan/gelar')}
				/>
			</SidebarMenu>
			<SidebarMenu
				href="/admin/acara"
				icon="mdi:calendar"
				anchor="Acara"
				active={isActive('/admin/acara')}
			/>
			<SidebarMenu
				href="/admin/landing"
				icon="mdi:globe"
				anchor="Landing page"
				active={isActive('/admin/landing')}
			/>
		</Sidebar>
	</div>

	<main class="flex min-h-screen flex-1 overflow-auto bg-gray-100 p-5">
		{@render children()}
	</main>
</div>

<style>
	.active {
		display: block !important;
	}

	.width_head2 {
		width: 83.3%;
		visibility: visible;
		flex-shrink: 1;
	}

	h1 {
		font-family: 'Cormorant Garamond', serif;
		font-size: 3rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		color: white;
	}

	.font-edit {
		font-size: 4.5ch;
		margin-right: 15px;
	}

	.test {
		min-width: 250px;
		flex-shrink: 0;
	}

	.test2 {
		min-width: 250px;
		flex-shrink: 0;
	}

	.ri--menu-line {
		display: inline-block;
		width: 24px;
		height: 24px;
		--svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M3 4h18v2H3zm0 7h18v2H3zm0 7h18v2H3z'/%3E%3C/svg%3E");
		background-color: currentColor;
		-webkit-mask-image: var(--svg);
		mask-image: var(--svg);
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		-webkit-mask-size: 100% 100%;
		mask-size: 100% 100%;
		cursor: pointer;
		display: none;
	}

	/* Mobile Styling */
	@media (max-width: 768px) {
		.ri--menu-line {
			display: block;
		}
		.width_head1 {
			width: 100%;
			position: fixed;
			z-index: 10;
			flex-shrink: 0;
		}

		.width_head2 {
			width: 0;
			display: none;
			flex-shrink: 0;
		}
		.test {
			margin-top: 90px;
			min-width: 250px;
			flex-shrink: 0;
		}

		/* Sidebar hidden by default on mobile */
		.lg\:block {
			display: none;
		}
	}

	/* Desktop (Laptop) Styling */
	@media (min-width: 769px) {
		.lg\:block {
			display: block;
		}
	}
</style>
