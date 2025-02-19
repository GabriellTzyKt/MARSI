<script lang="ts">
	import { writable } from 'svelte/store';
	import '../../app.css';
	import image from '$lib/asset/kerajaan/sidebaricon.png';
	import imageprofile from '$lib/asset/kerajaan/gambar_temp.jpg';
	import { page } from '$app/state';
	import Sidebar from '$lib/sidebar/Sidebar.svelte';
	import SidebarMenu from '$lib/sidebar/SidebarMenu.svelte';

	const isActive = (path: string) => {
		return page.route.id === path;
	};

	$inspect(page);
	const pageTitle = $derived.by(() => {
		if (page.route.id === '/abdi/dashboard') {
			return 'Daftar Komunitas';
		} else if (page.route.id === '/abdi/komunitas/detail') {
			return 'Detail Komunitas';
		} else if (page.route.id === '/abdi/komunitas/edit') {
			return 'Edit Komunitas';
		} else if (page.route.id === '/abdi/komunitas/daftaranggota') {
			return 'Daftar Anggota Komunitas';
		}  else if (page.route.id === '/abdi/komunitas/daftaranggota/edit') {
			return 'Ubah Abdi';
		}else if (page.route.id === '/abdi/komunitas/acara/detail') {
			return 'Detail Acara Komunitas';
		} else if (page.route.id === '/abdi/komunitas/acara/edit') {
			return 'Edit Acara Komunitas';
		} else if (page.route.id == '/abdi/komunitas/acara/buat') {
			return 'Buat Acara Komunitas';
		} else if (page.route.id === '/abdi/komunitas/acara/laporan') {
			return 'Laporan Acara';
		}
	});
	let { children } = $props();

	let sidebarActive = writable(false);

	const toggleSidebar = () => {
		sidebarActive.update((value) => !value);
	};
</script>

<header class="flex min-w-full">
	<div
		class="test2 width_head1 flex w-[16.7%] items-center justify-between bg-blue-400 text-center"
	>
		<button
			type="button"
			class="ri--menu-line ml-2"
			onclick={toggleSidebar}
			aria-label="Toggle sidebar"
		></button>
		<div class="mx-auto flex items-center justify-center self-center">
			<img src={image} alt="Deskripsi Gambar" class="ml-2" />
		</div>
	</div>
	<div class="width_head2 flex w-[83.3%] items-center justify-between">
		<p class="md:w-16,7% lg:w-16,7% ml-5 p-5 text-3xl font-bold text-black">
			{pageTitle}
		</p>
		<div class=" mr-5 flex items-center rounded-md border-2 border-blue-600 p-2">
			<span class="ml-5 text-black">Sriayu Mutiara</span>
			<img src={imageprofile} alt="duar" class="ml-5 mr-5 h-10 w-10 rounded-full" />
		</div>
	</div>
</header>

<div class=" flex min-h-screen min-w-full">
	<div class=" test lg:w=[16.7%] w-[16.7%] bg-blue-400 lg:block" class:active={$sidebarActive}>
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
			</SidebarMenu>
		</Sidebar>
	</div>

	<main class="flex min-h-full flex-1 overflow-auto bg-gray-100 p-5">
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
			margin-top: 120px;
			min-width: 250px;
			flex-shrink: 0;
		}

		.lg\:block {
			display: none;
		}
	}

	@media (min-width: 769px) {
		.lg\:block {
			display: block;
		}
	}
</style>
