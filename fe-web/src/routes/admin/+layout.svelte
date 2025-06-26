<script lang="ts">
	import { writable } from 'svelte/store';
	import '../../app.css';
	import image from '../../asset/logo_MARSI.png';
	import imageprofile from '../../asset/gambar_temp.jpg';
	import Sidebar from '../Sidebar.svelte';
	import SidebarMenu from '../SidebarMenu.svelte';
	import { navigating, page } from '$app/state';
	import Loader from '$lib/loader/Loader.svelte';
	import { slide } from 'svelte/transition';
	import type { Actions } from '@sveltejs/kit';
	import type { LayoutProps } from './$types';

	const isActive = (path: string) => {
		return page.url.pathname === path;
	};
	let isShow = $state(false);

	// export const actions: Actions = {
	// 	logout: async ({ cookies }) => {
	// 		const sessionId = cookies.get('session_id');
	// 		if (sessionId) {
	// 			cookies.delete('session_id', { path: '/' });
	// 		}
	// 		return {
	// 			status: 302,
	// 			headers: {
	// 				location: '/',
	// 			},
	// 		};
	// 	},
	// };

	$inspect(page);
	$inspect(page.route.id === '/admin/acara/detail/[id]');
	const pageTitle = $derived.by(() => {
		if (page.route.id === '/admin/beranda') {
			return 'Selamat Datang';
		} else if (page.route.id?.startsWith('/admin/keanggotaan/daftaranggota')) {
			return 'Keanggotaan';
		} else if (page.route.id === '/admin/acara') {
			return 'Acara';
		} else if (page.route.id == '/admin/acara/tambahacara') {
			return 'Acara';
		} else if (page.route.id === '/admin/acara/tambahacara/detail/[id]') {
			return 'Acara';
		} else if (page.route.id === '/admin/suratDokumen') {
			return 'Dokumen';
		} else if (
			page.route.id === '/admin/suratDokumen/ubah' ||
			page.route.id === '/admin/suratDokumen/tambah'
		) {
			return 'Arsip';
		} else if (page.route.id === '/admin/landingPage') {
			return 'Landing Page';
		} else if (page.route.id === '/admin/managemen') {
			return 'Managemen Admin';
		} else if (page.route.id?.startsWith('/admin/biodata')) {
			return 'Biodata Kerajaan';
		} else if (page.route.id === '/admin/masterData') {
			return 'Master Data';
		} else if (page.route.id?.startsWith('/admin/pendaftaranKerajaan')) {
			return 'Pendaftaran Kerajaan';
		} else if (page.route.id?.startsWith('/admin/suratDokumen/ubah')) {
			return 'Ubah Dokumen';
		} else if (page.route.id?.startsWith('/admin/aplikasiKerajaan')) {
			return 'Selamat Datang';
		} else if (page.route.id?.startsWith('/admin/manajemenWebsite')) {
			return 'Website Kerajaan';
		}
	});

	const { children, data } = $props();
	console.log('Data : ', data);
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
		<div class="mx-auto flex items-center justify-center gap-2 self-center">
			<img src={image} alt="Deskripsi Gambar" class="h-10 w-10 lg:h-20 lg:w-20" />
			<p class="text-3xl text-white">MARSI</p>
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

				<SidebarMenu
					href="/admin/keanggotaan/daftaranggota"
					icon="mdi:book"
					anchor="Daftar Anggota"
					active={page.route.id?.startsWith('/admin/keanggotaan/daftaranggota')}
				></SidebarMenu>

				<SidebarMenu
					href="/admin/acara"
					icon="mdi:calendar"
					anchor="Acara"
					active={page.route.id?.startsWith('/admin/acara')}
				/>
				<SidebarMenu
					href="/admin/landingPage"
					icon="mdi:globe"
					anchor="Landing page"
					active={isActive('/admin/landingPage')}
				/>
				<SidebarMenu
					href="/admin/masterData"
					icon="mdi:globe"
					anchor="Master Data"
					active={isActive('/admin/masterData')}
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
					active={page.route.id?.startsWith('/admin/suratDokumen')}
				/>
				<SidebarMenu
					href={`/admin/aplikasiKerajaan/${data.id_kerajaan}`}
					icon="mdi:home"
					anchor="Aplikasi Kerajaan"
					active={page.route.id?.startsWith('/admin/aplikasiKerajaan')}
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
				<!-- <SidebarMenu
					href="/admin/pendaftaranKerajaan"
					icon="mdi:home"
					anchor="Pendaftaran Kerajaan"
					active={page.route.id?.startsWith('/admin/pendaftaranKerajaan')}
				/> -->
			</Sidebar>
		</div>
	{/if}
	<div class="width_head2 hidden items-center justify-between lg:flex lg:w-[83.3%]">
		<p class="ml-5 p-5 text-3xl font-bold text-black">{pageTitle}</p>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="bg-customGold relative mr-5 flex w-[350px] cursor-pointer items-center justify-center rounded-t p-2 text-center"
			onclick={() => (isShow = !isShow)}
		>
			<span class="ml-5 text-2xl text-white">
				{#if data}
					{data.hasil}
				{:else}
					Admin MARSI
				{/if}
			</span>
			<img src={imageprofile} alt="duar" class="ml-5 mr-5 h-10 w-10 rounded-full" />

			{#if isShow}
				<div
					class="absolute right-0 top-full h-[150px] w-full bg-white"
					transition:slide={{ duration: 200 }}
				>
					<p class="mt-5">Apakah Anda ingin logout?</p>
					<div class=" col-span-2 mt-10 flex flex-wrap justify-center gap-10">
						<div class="col-span-1 px-5">
							<button
								class="rounded-lg bg-gray-300 px-2 py-2 text-white"
								onclick={(event) => {
									event.stopPropagation();
									isShow = false;
								}}
							>
								Tidak
							</button>
						</div>
						<div class="col-span-1 px-5">
							<form action="/admin/logout" method="POST">
								<button class="rounded-lg bg-red-400 px-2 py-2 text-white" type="submit">
									Logout
								</button>
							</form>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</header>

<div class="flex h-fit min-w-full">
	<div class="test bg-customYellow hidden min-h-screen w-fit lg:block lg:w-[16.7%]">
		<Sidebar>
			{#if data.tipe === 'super admin'}
				<SidebarMenu
					href="/admin/beranda"
					icon="mdi:home"
					anchor="Beranda"
					active={isActive('/admin/beranda')}
				/>

				<SidebarMenu
					href="/admin/keanggotaan/daftaranggota"
					icon="mdi:book"
					anchor="Daftar Anggota"
					active={page.route.id?.startsWith('/admin/keanggotaan/daftaranggota')}
				></SidebarMenu>

				<SidebarMenu
					href="/admin/acara"
					icon="mdi:calendar"
					anchor="Acara"
					active={page.route.id?.startsWith('/admin/acara')}
				/>
				<SidebarMenu
					href="/admin/landingPage"
					icon="mdi:globe"
					anchor="Landing page"
					active={isActive('/admin/landingPage')}
				/>
				<SidebarMenu
					href="/admin/masterData"
					icon="mdi:globe"
					anchor="Master Data"
					active={isActive('/admin/masterData')}
				/>

				<SidebarMenu
					href="/admin/manajemenWebsite"
					icon="mdi:home"
					anchor="Website Kerajaan"
					active={page.route.id?.startsWith('/admin/manajemenWebsite')}
				/>
			{/if}

			{#if data.tipe === 'admin kerajaan'}
				<SidebarMenu
					href={`/admin/aplikasiKerajaan/${data.id_kerajaan}`}
					icon="mdi:home"
					anchor="Aplikasi Kerajaan"
					active={page.route.id?.startsWith('/admin/aplikasiKerajaan')}
				/>
				<SidebarMenu
					href="/admin/biodata"
					icon="mdi:home"
					anchor="Biodata Kerajaan"
					active={page.route.id?.startsWith('/admin/biodata')}
				/>
			{/if}
			<!-- <SidebarMenu
				href="/admin/biodata"
				icon="mdi:globe"
				anchor="Biodata Kerajaan"
				active={isActive('/admin/biodata')}
			/> -->
			{#if data.tipe === 'super admin'}
				<SidebarMenu
					href="/admin/suratDokumen"
					icon="mdi:home"
					anchor="Surat Dokumen"
					active={page.route.id?.startsWith('/admin/suratDokumen')}
				/>
				<SidebarMenu
					href="/admin/managemen"
					icon="mdi:home"
					anchor="Managemen Admin"
					active={isActive('/admin/managemen')}
				/>
				<!-- <SidebarMenu
				href="/admin/pendaftaranKerajaan"
				icon="mdi:home"
				anchor="Pendaftaran Kerajaan"
				active={page.route.id?.startsWith('/admin/pendaftaranKerajaan')}
			/> -->
			{/if}
		</Sidebar>
	</div>

	<main class="flex min-h-screen w-full flex-1 bg-white p-5">
		{@render children()}
	</main>
</div>

{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}

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
