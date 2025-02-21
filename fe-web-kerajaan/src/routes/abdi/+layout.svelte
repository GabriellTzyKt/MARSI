<script lang="ts">
	import { writable } from 'svelte/store';
	import '../../app.css';
	import image from '$lib/asset/kerajaan/sidebaricon.png';
	import imageprofile from '$lib/asset/kerajaan/gambar_temp.jpg';
	import { page } from '$app/state';
	import Sidebar from '$lib/sidebar/Sidebar.svelte';
	import SidebarMenu from '$lib/sidebar/SidebarMenu.svelte';

	const isActive = (path: string) => page.route.id === path;

	$inspect(page);
	const pageTitle = $derived.by(() => {
		if (page.route.id === '/abdi/dashboard') {
			return 'Selamat datang';
		} else if (page.route.id === '/abdi/dashboard/organisasi/beranda') {
			return 'Daftar Organisasi';
		} else if (page.route.id === '/abdi/dashboard/komunitas/beranda') {
			return 'Daftar Komunitas';
		} else if (page.route.id === '/abdi/dashboard/situs/beranda') {
			return 'Daftar Situs';
		} else if (page.route.id === '/abdi/dashboard/komunitas/detail') {
			return 'Detail Komunitas';
		} else if (page.route.id === '/abdi/dashboard/organisasi/detail') {
			return 'Detail Organisasi';
		} else if (page.route.id === '/abdi/dashboard/komunitas/edit') {
			return 'Edit Komunitas';
		} else if (page.route.id === '/abdi/dashboard/organisasi/edit') {
			return 'Edit Organisasi';
		} else if (page.route.id === '/abdi/dashboard/komunitas/daftaranggota') {
			return 'Daftar Anggota Komunitas';
		} else if (page.route.id === '/abdi/dashboard/organisasi/daftaranggota') {
			return 'Daftar Anggota Organisasi';
		} else if (
			page.route.id === '/abdi/dashboard/komunitas/daftaranggota/edit' ||
			page.route.id === '/abdi/dashboard/organisasi/daftaranggota/edit'
		) {
			return 'Ubah Abdi';
		} else if (page.route.id === '/abdi/dashboard/komunitas/acara/detail') {
			return 'Detail Acara Komunitas';
		} else if (page.route.id === '/abdi/dashboard/organisasi/acara/detail') {
			return 'Detail Acara Organisasi';
		} else if (page.route.id === '/abdi/dashboard/komunitas/acara/edit') {
			return 'Edit Acara Komunitas';
		} else if (page.route.id === '/abdi/dashboard/organisasi/acara/edit') {
			return 'Edit Acara Organisasi';
		} else if (page.route.id === '/abdi/dashboard/komunitas/acara/buat') {
			return 'Buat Acara Komunitas';
		} else if (page.route.id === '/abdi/dashboard/organisasi/acara/buat') {
			return 'Buat Acara Organisasi';
		} else if (page.route.id === '/abdi/dashboard/organisasi/acara/laporan') {
			return 'Detail Acara Organisasi';
		} else if (page.route.id === '/abdi/dashboard/komunitas/acara/laporan') {
			return 'Detail Acara Komunitas';
		} else if (page.route.id === '/abdi/dashboard/situs/detail') {
			return 'Detail Situs';
		} else if (page.route.id === '/abdi/dashboard/situs/detail/ubah') {
			return 'Ubah Situs';
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
		class="test2 width_head1 flex items-center justify-between bg-blue-400 p-2 lg:w-[16.7%] lg:justify-center"
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
		<div class="mobile-sidebar-options flex w-full flex-col bg-blue-400 p-2 lg:hidden">
			<Sidebar>
				<SidebarMenu
					href="/abdi/dashboard"
					icon="mdi:home"
					anchor="Dashboard"
					active={isActive('/abdi/dashboard')}
				/>

				<SidebarMenu href="#" icon="mdi:people" anchor="Komunitas" hasChildren={true}>
					<SidebarMenu
						href="/abdi/komunitas/detail"
						icon="mdi:book"
						anchor="Detail komunitas"
						active={isActive('/abdi/komunitas/detail')}
					/>
					<SidebarMenu
						href="/abdi/komunitas/daftaranggota"
						icon="mdi:crown"
						anchor="Daftar Anggota"
						active={isActive('/abdi/komunitas/daftaranggota')}
					/>
					<SidebarMenu
						href="/abdi/komunitas/acara/detail"
						icon="mdi:crown"
						anchor="Gelar"
						active={isActive('/abdi/komunitas/acara/detail')}
					/>
					<SidebarMenu
						href="/abdi/komunitas/acara"
						icon="mdi:crown"
						anchor="Acara"
						active={isActive('/abdi/komunitas/acara')}
					/>
				</SidebarMenu>
			</Sidebar>
		</div>
	{/if}
	<div class="width_head2 hidden items-center justify-between lg:flex lg:w-[83.3%]">
		<p class="ml-5 p-5 text-3xl font-bold text-black">{pageTitle}</p>
		<div class="mr-5 flex items-center rounded-md border-2 border-blue-600 p-2">
			<span class="ml-5 text-black">Sriayu Mutiara</span>
			<img src={imageprofile} alt="duar" class="ml-5 mr-5 h-10 w-10 rounded-full" />
		</div>
	</div>
</header>

<div class="flex h-fit min-w-full">
	<div class="test hidden min-h-screen w-fit bg-blue-400 lg:block lg:w-[16.7%]">
		{#if page.route.id === '/abdi/dashboard'}
			<Sidebar>
				<SidebarMenu
					href="/abdi/dashboard"
					icon="mdi:home"
					anchor="Dashboard"
					active={isActive('/abdi/dashboard')}
				/>
			</Sidebar>
		{/if}

		{#if page.route.id?.startsWith('/abdi/dashboard/komunitas')}
			<Sidebar>
				<SidebarMenu
					href="/abdi/dashboard/komunitas/beranda"
					icon="mdi:home"
					anchor="Dashboard"
					active={isActive('/abdi/dashboard/komunitas/beranda')}
				/>
				<SidebarMenu href="#" icon="mdi:people" anchor="Komunitas" hasChildren={true}>
					<SidebarMenu
						href="/abdi/dashboard/komunitas/detail"
						icon="mdi:book"
						anchor="Detail komunitas"
						active={isActive('/abdi/dashboard/komunitas/acara/detail')}
					/>
					<SidebarMenu
						href="/abdi/dashboard/komunitas/daftaranggota"
						icon="mdi:crown"
						anchor="Daftar Anggota"
						active={isActive('/abdi/dashboard/komunitas/daftaranggota')}
					/>
					<SidebarMenu
						href="/abdi/dashboard/komunitas/acara/detail"
						icon="mdi:crown"
						anchor="Acara"
						active={isActive('/abdi/dashboard/komunitas/acara/detail')}
					/>
				</SidebarMenu>
			</Sidebar>
		{/if}

		{#if page.route.id?.startsWith('/abdi/dashboard/organisasi')}
			<Sidebar>
				<SidebarMenu
					href="/abdi/dashboard/organisasi/beranda"
					icon="mdi:home"
					anchor="Dashboard"
					active={isActive('/abdi/dashboard/organisasi/beranda')}
				/>
				<SidebarMenu href="#" icon="mdi:people" anchor="Komunitas" hasChildren={true}>
					<SidebarMenu
						href="/abdi/dashboard/organisasi/detail"
						icon="mdi:book"
						anchor="Detail komunitas"
						active={isActive('/abdi/dashboard/organisasi/acara/detail')}
					/>
					<SidebarMenu
						href="/abdi/dashboard/organisasi/daftaranggota"
						icon="mdi:crown"
						anchor="Daftar Anggota"
						active={isActive('/abdi/dashboard/organisasi/daftaranggota')}
					/>
					<SidebarMenu
						href="/abdi/dashboard/organisasi/acara/detail"
						icon="mdi:crown"
						anchor="Acara"
						active={isActive('/abdi/dashboard/organisasi/acara/detail')}
					/>
				</SidebarMenu>
			</Sidebar>
		{/if}

		{#if page.route.id?.startsWith('/abdi/dashboard/situs')}
			<Sidebar>
				<SidebarMenu
					href="/abdi/dashboard/situs/beranda"
					icon="mdi:home"
					anchor="Dashboard"
					active={isActive('/abdi/dashboard/situs/beranda')}
				/>
				<SidebarMenu href="#" icon="mdi:people" anchor="Situs" hasChildren={true}>
					<SidebarMenu
						href="/abdi/dashboard/situs/detail"
						icon="mdi:book"
						anchor="Detail Situs"
						active={isActive('/abdi/dashboard/situs/detail')}
					/>
				</SidebarMenu>
			</Sidebar>
		{/if}
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
