<script lang="ts">
	import { writable } from 'svelte/store';
	import '../../app.css';
	import image from '$lib/asset/kerajaan/sidebaricon.png';
	import imageprofile from '$lib/asset/kerajaan/gambar_temp.jpg';
	import { page } from '$app/state';
	import Sidebar from '$lib/sidebar/Sidebar.svelte';
	import SidebarMenu from '$lib/sidebar/SidebarMenu.svelte';

	// const isActive = (path: string) => page.route.id === path;
	console.log(page.route.id);
	const pageTitle = $derived.by(() => {
		if (page.route.id === '/managemen') {
			return 'Selamat Datang';
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
				<SidebarMenu href="/managemen" icon="mdi:home" anchor="Managemen" active={true} />
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
		<Sidebar>
			<SidebarMenu href="/managemen" icon="mdi:home" anchor="Managemen" active={true} />
		</Sidebar>
	</div>

	<main class="flex min-h-full w-full flex-1 overflow-auto bg-gray-100 p-5">
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
