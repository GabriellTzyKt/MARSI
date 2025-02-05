<!-- layout laptop  -->

<script lang="ts">
	import '../../app.css';
	import image from '../../asset/logo_MARSI.png';
	import imageprofile from '../../asset/gambar_temp.jpg';
	import Sidebar from '../../Sidebar.svelte';
	import SidebarMenu from '../../SidebarMenu.svelte';
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';

	// Fungsi untuk menentukan apakah menu aktif
	const isActive = (path: string) => {
		return $page.url.pathname === path;
	};

	const pageTitle = derived(page, ($page) => {
		if ($page.route.id === '/admin/beranda') {
			return 'Selamat Datang';
		} else if ($page.route.id === '/admin/keanggotaan/daftaranggota') {
			return 'Keanggotaan';
		} else if ($page.route.id === '/admin/keanggotaan/daftaranggota/tambahanggota') {
			return 'Keanggotaan';
		} else if ($page.route.id === '/admin/keanggotaan/gelar') {
			return 'Keanggotaan';
		} else if ($page.route.id === '/admin/acara') {
			return 'Acara';
		}
	});
	let { children } = $props();
</script>

<header class="flex w-full">
	<div class="bg-customGold flex w-1/6 items-center text-center">
		<span class="ri--menu-line ml-5 cursor-pointer lg:hidden" onclick={toggleSidebar}></span>
		<img src={image} alt="Deskripsi Gambar" class="ml-2"/>
		<h1 class="ml-2 mt-3 mb-3 font-edit">MARSI</h1>
	</div>
	<div class="flex w-5/6 items-center justify-between">
		<p class="ml-5 p-5 text-3xl font-bold text-black">
			{$pageTitle}
		</p>
		<div class="bg-customYellow mr-5 flex items-center rounded-md p-2">
			<span class="ml-5 text-black">Admin MARSI</span>
			<img src={imageprofile} alt="duar" class="ml-5 mr-5 h-10 w-10 rounded-full" />
		</div>
	</div>
</header>

<div class="flex min-h-screen">
	<div class="bg-customYellow w-1/6 min-h-screen"> <!-- Ganti h-fill menjadi min-h-screen -->
		<Sidebar>
			<SidebarMenu href="/admin/beranda" icon="mdi:home" anchor="Beranda" active={isActive("/admin/beranda")}></SidebarMenu>
			<SidebarMenu href="#" icon="mdi:people" anchor="Keanggotaan" hasChildren={true}>
				<SidebarMenu href="/admin/keanggotaan/daftaranggota" icon="mdi:book" anchor="Daftar Anggota" active={isActive("/admin/keanggotaan/daftaranggota")}></SidebarMenu>
				<SidebarMenu href="/admin/keanggotaan/gelar" icon="mdi:crown" anchor="Gelar" active={isActive("/admin/keanggotaan/gelar")}></SidebarMenu>
			</SidebarMenu>
			<SidebarMenu href="/admin/acara" icon="mdi:calendar" anchor="Acara" active={isActive("/admin/acara")}></SidebarMenu>
			<SidebarMenu href="/admin/landing" icon="mdi:globe" anchor="Landing page" active={isActive("/admin/landing")}></SidebarMenu>
		</Sidebar>
	</div>

	<main class="w-5/6 bg-gray-100 p-5 min-h-screen"> <!-- Ganti min-h-min menjadi min-h-screen -->
		{@render children()}
	</main>
</div>

<style>
	h1 {
		font-family: 'Cormorant Garamond', serif;
		font-size: 3rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		color: white;
	}

	.font-edit{
		font-size:4.5ch;
		margin-right: 10px;
	}
</style>


<!-- ========================================= -->

<!-- layout tampilan mobile  -->


<script lang="ts">
	import '../../app.css';
	import image from '../../asset/logo_MARSI.png';
	import imageprofile from '../../asset/gambar_temp.jpg';
	import Sidebar from '../../Sidebar.svelte';
	import SidebarMenu from '../../SidebarMenu.svelte';
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';

	// Fungsi untuk menentukan apakah menu aktif
	const isActive = (path: string) => {
		return $page.url.pathname === path;
	};

	const pageTitle = derived(page, ($page) => {
		if ($page.route.id === '/admin/beranda') {
			return 'Selamat Datang';
		} else if ($page.route.id === '/admin/keanggotaan/daftaranggota') {
			return 'Keanggotaan';
		} else if ($page.route.id === '/admin/keanggotaan/daftaranggota/tambahanggota') {
			return 'Keanggotaan';
		} else if ($page.route.id === '/admin/keanggotaan/gelar') {
			return 'Keanggotaan';
		} else if ($page.route.id === '/admin/acara') {
			return 'Acara';
		}
	});
	let { children } = $props();

	// Tambahkan state untuk mengontrol sidebar
	let sidebarActive = $state(false);

	// Fungsi untuk toggle sidebar
	const toggleSidebar = () => {
		if (sidebarActive == false) {
			sidebarActive = true;
		} else {
			sidebarActive = false;
		}
	};
</script>

<header class="fixed top-0 z-10 flex w-full">
	<div class="test flex w-screen items-center bg-customGold">
		<span class="ri--menu-line ml-5 cursor-pointer" onclick={toggleSidebar}></span>
		<div class="flex items-center justify-center">
			<img src={image} alt="Deskripsi Gambar" class="ml-2" />
			<h1 class="font-edit ml-2 mt-3">MARSI</h1>
		</div>
		<div class="mr-5 flex items-center rounded-md bg-customYellow">
			<span class="ml-5 text-black">Admin MARSI</span>
			<img src={imageprofile} alt="duar" class="ml-5 mr-5 h-10 w-10 rounded-full" />
		</div>
	</div>
</header>

<div class="mt-20 flex min-h-screen flex-col lg:flex-row">
	Sidebar for small screens
	<div class={`w-full bg-customYellow lg:w-1/6 ${sidebarActive ? 'block' : 'hidden'} lg:block`}>
		<Sidebar>
			<SidebarMenu
				href="/admin/beranda"
				icon="mdi:home"
				anchor="Beranda"
				active={isActive('/admin/beranda')}
			></SidebarMenu>
			<SidebarMenu href="#" icon="mdi:people" anchor="Keanggotaan" hasChildren={true}>
				<SidebarMenu
					href="/admin/keanggotaan/daftaranggota"
					icon="mdi:book"
					anchor="Daftar Anggota"
					active={isActive('/admin/keanggotaan/daftaranggota')}
				></SidebarMenu>
				<SidebarMenu
					href="/admin/keanggotaan/gelar"
					icon="mdi:crown"
					anchor="Gelar"
					active={isActive('/admin/keanggotaan/gelar')}
				></SidebarMenu>
			</SidebarMenu>
			<SidebarMenu
				href="/admin/acara"
				icon="mdi:calendar"
				anchor="Acara"
				active={isActive('/admin/acara')}
			></SidebarMenu>
			<SidebarMenu
				href="/admin/landing"
				icon="mdi:globe"
				anchor="Landing page"
				active={isActive('/admin/landing')}
			></SidebarMenu>
		</Sidebar>
	</div>

	<main class="min-h-screen w-full bg-gray-100 p-5">
		{@render children()}
	</main>
</div>

<style>
	.test {
		justify-self: center;
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
		margin-right: 10px;
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

	/* Responsive Styling */
	@media (max-width: 768px) {
		/* Sidebar appears below header in mobile */
		.flex-col {
			flex-direction: column;
		}

		/* Hide sidebar when not active on small screens */
		.sidebar {
			width: 100% !important;
			position: fixed;
			top: 0;
			left: 0;
			height: 100%;
			display: none; /* Hide sidebar by default on mobile */
		}

		.test {
			justify-content: space-between;
		}

		/* Show sidebar on mobile */
		.sidebar.active {
			display: block;
		}

		.ri--menu-line {
			display: block;
		}
	}

	/* Additional adjustments for large screens */
	@media (min-width: 769px) {
		/* Restore sidebar behavior on larger screens */
		.sidebar {
			display: block;
		}
	}
</style>

<!-- ========================================================================================================================== -->

<!-- BERANDA AWAL  -->

<script lang="ts">
	import PieChart from '../../Piechart.svelte';
	import Barplot from '../../Barplot.svelte';
	import ColorPicker from 'svelte-awesome-color-picker';
	import { colord, Colord } from 'colord';

	let hex = '#878272ed';

	let rgb = {
		r: 135,
		g: 130,
		b: 114,
		a: 0.93
	};

	let hsv = {
		h: 46,
		s: 15.307687612680287,
		v: 52.76250457763672,
		a: 0.93
	};

	let color: Colord = colord(hex); // Inisialisasi Colord instance
</script>

<div class="ml-5 w-fit border border-blue-500">
	<ColorPicker bind:hex bind:rgb bind:hsv bind:color position="responsive" />
</div>

<p class="m-5 text-5xl font-bold underline">Beranda</p>

<div class="form-container grid grid-cols-2 content-center gap-8" style="background: {hex};">
	<!-- Pie Chart Section -->
	<div class="flex flex-col items-center">
		<p class="mb-3 text-xl font-bold">Data BlaBla</p>
		<PieChart />
	</div>

	<!-- Barplot Section -->
	<div class="flex flex-col items-center">
		<p class="mb-3 text-xl font-bold">Data BlaBla</p>
		<Barplot />
	</div>
</div>

<!-- ketika layar mengecil, kira-kira begini -->
<div class="form-container1 flex flex-col content-center gap-8" style="background: {hex};">
	<div class="flex flex-col items-center">
		<p class="mb-3 text-xl font-bold">Data BlaBla</p>
		<PieChart />
	</div>

	<div class="flex flex-col items-center">
		<p class="mb-3 text-xl font-bold">Data BlaBla</p>
		<Barplot />
	</div>
</div>

<div class="form-container grid grid-cols-2 content-center gap-8" style="background: {hex};">
	<div class="flex flex-col items-center">
		<p class="mb-3 text-xl font-bold">Data BlaBla</p>
		<PieChart />
	</div>

	<div class="flex flex-col items-center">
		<p class="mb-3 text-xl font-bold">Data BlaBla</p>
		<Barplot />
	</div>
</div>

<style>
	.form-container {
		margin-top: 30px;
		margin-left: 20px;
		margin-right: 20px;
		padding: 20px;
		border-radius: 10px;
		width: auto;
		height: 500px;
		text-align: center;
	}

	.form-container1 {
		margin-top: 30px;
		margin-left: 20px;
		margin-right: 30px;
		padding: 20px;
		border-radius: 10px;
		width: 500px;
		height: 1000px;
		text-align: center;
	}

	@media (max-width: 768px) {
		.sidebar {
			position: fixed;
			top: 0;
			left: 0;
			width: 75%;
			height: 100vh;
			background-color: #f5c518;
			box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
			transition: transform 0.3s ease-in-out;
			transform: translateX(-100%);
			z-index: 50;
		}

		.sidebar.open {
			transform: translateX(0);
		}
	}
</style>


