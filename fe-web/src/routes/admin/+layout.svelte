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
		} else if (page.route.id === '/admin/suratDokumen') {
			return 'Dokumen';
		} else if (page.route.id === '/admin/suratDokumen/ubah' || page.route.id === '/admin/suratDokumen/tambah') {
			return 'Arsip';
		}  else if (page.route.id === '/admin/landingPage') {
			return 'Landing Page';
		} else if (page.route.id === '/admin/managemen') {
			return 'Managemen Admin';
		} else if (page.route.id?.startsWith('/admin/biodata')) {
			return 'Biodata Kerajaan';
		}
	});
	let { children } = $props();

	let sidebarActive = writable(false);

	const toggleSidebar = () => {
		sidebarActive.update((value) => !value);
	};
</script>

<header class="w-full lg:flex lg:h-full lg:min-w-full">
	<div
		class="test2 width_head1 bg-customGold flex items-center justify-between p-2 lg:w-[16.7%] lg:justify-center"
	>
		<div class="buttonshow lg:hidden">
			<button
				type="button"
				class="ri--menu-line ml-2 block lg:hidden"
				onclick={toggleSidebar}
				aria-label="Toggle sidebar"
			></button>
		</div>
		<div class="mx-auto flex items-center justify-center self-center">
			<img src={image} alt="Deskripsi Gambar" class="ml-2 h-20 w-20 lg:h-32 lg:w-32" />
		</div>
	</div>
	{#if $sidebarActive}
		<div class="mobile-sidebar-options bg-customYellow flex w-full flex-col p-2 lg:hidden">
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
	{/if}
	<div class="width_head2 hidden items-center justify-between lg:flex lg:w-[83.3%]">
		<p class="ml-5 p-5 text-3xl font-bold text-black">{pageTitle}</p>
		<div class="mr-5 flex items-center rounded-md border-2 border-blue-600 p-2">
			<span class="ml-5 text-black">Admin MARSI</span>
			<img src={imageprofile} alt="duar" class="ml-5 mr-5 h-10 w-10 rounded-full" />
		</div>
	</div>
</header>

<div class="flex h-fit min-w-full">
	<div class="test bg-customYellow hidden min-h-screen w-fit lg:block lg:w-[16.7%]">
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
				href="/admin/landingPage"
				icon="mdi:globe"
				anchor="Landing page"
				active={isActive('/admin/landingPage')}
			/>
			<!-- <SidebarMenu
				href="/admin/biodata"
				icon="mdi:globe"
				anchor="Biodata Kerajaan"
				active={isActive('/admin/biodata')}
			/> -->
			<SidebarMenu
				href="/admin/suratDokumen"
				icon="mdi:home"
				anchor="Surat Dokumen"
				active={isActive('/admin/suratDokumen')}
			/>
			<SidebarMenu
				href="/admin/biodata"
				icon="mdi:home"
				anchor="Biodata Kerajaan"
				active={page.route.id?.startsWith('/admin/biodata')}
			/>
			<SidebarMenu
				href="/admin/managemen"
				icon="mdi:home"
				anchor="Managemen Admin"
				active={isActive('/admin/managemen')}
			/>
		</Sidebar>
	</div>

	<main class="flex min-h-full w-full flex-1 bg-gray-100 p-5">
		{@render children()}
	</main>
</div>

<style>
	.buttonshow {
		visibility: hidden;
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
	}
	/* Untuk mobile, tombol hamburger tampil */
	@media (max-width: 1024px) {
		.ri--menu-line {
			display: block;
		}

		.buttonshow {
			visibility: visible;
		}
	}
</style>
