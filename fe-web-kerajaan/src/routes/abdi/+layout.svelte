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
		} else if (page.route.id === '/abdi/dashboard/organisasi/daftarorganisasi') {
			return 'Daftar Organisasi';
		} else if (page.route.id === '/abdi/dashboard/organisasi/acara') {
			return 'Acara Organisasi';
		} else if (page.route.id === '/abdi/dashboard/situs/daftaracara') {
			return 'Daftar Acara di Situs';
		} else if (page.route.id === '/abdi/dashboard/situs/bukutamu') {
			return 'Buku Tamu Situs';
		} else if (page.route.id === '/abdi/dashboard/situs/daftaracara/detail') {
			return 'Detail Acara Situs';
		} else if (page.route.id === '/abdi/sekretariat/anggota/daftaranggota/tambah') {
			return 'Tambah Abdi';
		} else if (page.route.id === '/abdi/sekretariat/anggota/daftaranggota/ubah') {
			return 'Edit Abdi';
		} else if (page.route.id === '/abdi/sekretariat/organisasi/daftarorganisasi/buat') {
			return 'Tambah Organisasi';
		} else if (page.route.id === '/abdi/sekretariat/organisasi/daftarorganisasi') {
			return 'Daftar Organisasi';
		} else if (page.route.id === '/abdi/sekretariat/organisasi/daftarorganisasi/edit') {
			return 'Edit Organisasi';
		} else if (page.route.id === '/abdi/sekretariat/komunitas/daftarkomunitas/buat') {
			return 'Tambah Komunitas';
		} else if (page.route.id === '/abdi/sekretariat/organisasi/daftarorganisasi/edit') {
			return 'Edit Komunitas';
		} else if (page.route.id === '/abdi/sekretariat/acara/detail') {
			return 'Detail Acara';
		} else if (page.route.id === '/abdi/sekretariat/acara/edit') {
			return 'Edit Acara';
		} else if (page.route.id === '/abdi/sekretariat/acara/buat') {
			return 'Buat Acara';
		} else if (page.route.id === '/abdi/sekretariat/anggota/daftaranggota') {
			return 'Daftar Anggota';
		} else if (page.route.id === '/abdi/sekretariat/anggota/pelantikan') {
			return 'Pelantikan Abdi';
		} else if (page.route.id === '/abdi/sekretariat/anggota/bintangjasa') {
			return 'Bintang Jasa';
		} else if (page.route.id === '/abdi/sekretariat/komunitas/daftarkomunitas') {
			return 'Daftar Komunitas';
		} else if (page.route.id === '/abdi/sekretariat/komunitas/daftaranggota') {
			return 'Daftar Anggota';
		} else if (page.route.id === '/abdi/sekretariat/acara') {
			return 'Daftar Acara';
		} else if (page.route.id === '/abdi/sekretariat/situs') {
			return 'Daftar Situs';
		} else if (page.route.id === '/abdi/sekretariat/tugas') {
			return 'Daftar Tugas';
		} else if (page.route.id === '/abdi/dashboard/situs/daftaracara/buat') {
			return 'Buat Acara di Situs';
		} else if (page.route.id === '/abdi/dashboard/komunitas/acara') {
			return 'Daftar Acara di Komunitas';
		} else if (page.route.id === '/abdi/sekretariat/landingpage') {
			return 'Edit Landing Page';
		} else if (page.route.id === '/abdi/sekretariat/landingpage/mobile') {
			return 'Fitur Mobile';
		} else if (page.route.id === '/abdi/dashboard/organisasi/tambah') {
			return 'Tambah Organisasi';
		} else if (page.route.id === '/abdi/dashboard/organisasi/acara/tambah') {
			return 'Tambah Acara Organisasi';
		} else if (page.route.id === '/abdi/dashboard/organisasi/acara/ubah') {
			return 'Ubah Acara Organisasi';
		} else if (page.route.id === '/abdi/sekretariat/organisasi/daftaranggota') {
			return 'Daftar Anggota Organisasi';
		} else if (page.route.id === '/abdi/sekretariat/organisasi/daftarorganisasi') {
			return 'Daftar Organisasi';
		} else if (page.route.id === '/abdi/sekretariat/acara/laporan') {
			return 'Laporan';
		} else if (page.route.id === '/abdi/sekretariat/situs/buat') {
			return 'Buat Situs';
		} else if (page.route.id === '/abdi/sekretariat/situs/detail') {
			return 'Detail Situs';
		} else if (page.route.id === '/abdi/sekretariat/situs/bukutamu') {
			return 'Buku Tamu';
		} else if (page.route.id === '/abdi/sekretariat/masterdata') {
			return 'Master Data';
		} else if (page.route.id === '/abdi/sekretariat/situs/edit') {
			return 'Edit Situs';
		} else if (page.route.id === '/abdi/sekretariat/organisasi/daftarorganisasi/edit') {
			return 'Edit Organisasi';
		} else if (page.route.id === '/abdi/sekretariat/organisasi/daftarorganisasi/buat') {
			return 'Tambah Organisasi';
		} else if (page.route.id === '/abdi/sekretariat/organisasi/daftarorganisasi') {
			return 'Daftar Organisasi';
		} else if (page.route.id === '/abdi/sekretariat/komunitas/daftarkomunitas/edit') {
			return 'Edit Komunitas';
		}  else if (page.route.id === '/abdi/sekretariat/organisasi/daftaranggota/edit') {
			return 'Edit Anggota';
		} else if (page.route.id === '/abdi/sekretariat/landingpage/aset') {
			return 'Tambah Aset';
		} else if (page.route.id === '/abdi/sekretariat/organisasi/daftarOrganisasi') {
			return 'Daftar Organisasi';
		} else if (page.route.id === '/abdi/sekretariat/organisasi/daftarOrganisasi/buat') {
			return 'Tambah Organisasi';
		} 		
		else if (page.route.id === '/abdi/dashboard/situs/daftaracara/edit') {
			return 'Edit Acara Situs';
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
			{#if page.route.id?.startsWith('/abdi/dashboard/komunitas')}
				<Sidebar>
					<SidebarMenu
						href="/abdi/dashboard"
						icon="mdi:home"
						anchor="Dashboard"
						active={isActive('/abdi/dashboard')}
					/>
					<SidebarMenu
						href="/abdi/dashboard/komunitas/beranda"
						icon="mdi:people"
						anchor="Komunitas"
						hasChildren={true}
					>
						<SidebarMenu
							href="/abdi/dashboard/komunitas/detail"
							icon="mdi:book"
							anchor="Detail komunitas"
							active={page.route.id?.startsWith('/abdi/dashboard/komunitas/detail')}
						/>
						<SidebarMenu
							href="/abdi/dashboard/komunitas/daftaranggota"
							icon="mdi:crown"
							anchor="Daftar Anggota"
							active={page.route.id?.startsWith('/abdi/dashboard/komunitas/daftaranggota')}
						/>
						<SidebarMenu
							href="/abdi/dashboard/komunitas/acara"
							icon="mdi:crown"
							anchor="Acara"
							active={page.route.id?.startsWith('/abdi/dashboard/komunitas/acara')}
						/>
					</SidebarMenu>
				</Sidebar>
			{:else if page.route.id?.startsWith('/abdi/dashboard/organisasi')}
				<Sidebar>
					<SidebarMenu
						href="/abdi/dashboard"
						icon="mdi:home"
						anchor="Dashboard"
						active={isActive('/abdi/dashboard')}
					/>
					<SidebarMenu
						href="/abdi/dashboard/organisasi/beranda"
						icon="mdi:people"
						anchor="Organisasi"
						hasChildren={true}
					>
						<SidebarMenu
							href="/abdi/dashboard/organisasi/daftarorganisasi"
							icon="mdi:book"
							anchor="Daftar Organisasi"
							active={page.route.id?.startsWith('/abdi/dashboard/organisasi/daftarorganisasi')}
						/>
						<SidebarMenu
							href="/abdi/dashboard/organisasi/daftaranggota"
							icon="mdi:crown"
							anchor="Daftar Anggota"
							active={page.route.id?.startsWith('/abdi/dashboard/organisasi/daftaranggota')}
						/>
						<SidebarMenu
							href="/abdi/dashboard/organisasi/acara"
							icon="mdi:crown"
							anchor="Acara"
							active={page.route.id?.startsWith('/abdi/dashboard/organisasi/acara')}
						/>
					</SidebarMenu>
				</Sidebar>
			{:else if page.route.id?.startsWith('/abdi/dashboard/situs')}
				<Sidebar>
					<SidebarMenu
						href="/abdi/dashboard/"
						icon="mdi:home"
						anchor="Dashboard"
						active={isActive('/abdi/dashboard/')}
					/>
					<SidebarMenu
						href="/abdi/dashboard/situs/beranda"
						icon="mdi:people"
						anchor="Situs"
						hasChildren={true}
					>
						<SidebarMenu
							href="/abdi/dashboard/situs/daftaracara"
							icon="mdi:book"
							anchor="Daftar Acara"
							active={page.route.id?.startsWith('/abdi/dashboard/situs/daftaracara')}
						/>
						<SidebarMenu
							href="/abdi/dashboard/situs/bukutamu"
							icon="mdi:book"
							anchor="Buku Tamu"
							active={page.route.id?.startsWith('/abdi/dashboard/situs/bukutamu')}
						/>
						<SidebarMenu
							href="/abdi/dashboard/situs/detail"
							icon="mdi:book"
							anchor="Detail Situs"
							active={page.route.id?.startsWith('/abdi/dashboard/situs/detail')}
						/>
					</SidebarMenu>
				</Sidebar>
			{:else if page.route.id?.startsWith('/abdi/sekretariat')}
				<Sidebar>
					<SidebarMenu
						href="/abdi/dashboard/"
						icon="mdi:home"
						anchor="Dashboard"
						active={isActive('/abdi/dashboard/')}
					/>
					<SidebarMenu href="" icon="mdi:people" anchor="Anggota" hasChildren={true}>
						<SidebarMenu
							href="/abdi/sekretariat/anggota/daftaranggota"
							icon="mdi:book"
							anchor="Daftar Anggota"
							active={window.location.pathname.startsWith(
								'/abdi/sekretariat/anggota/daftaranggota'
							)}
						/>
						<SidebarMenu
							href="/abdi/sekretariat/anggota/pelantikan"
							icon="mdi:book"
							anchor="Pelantikan"
							active={page.route.id?.startsWith('/abdi/sekretariat/anggota/pelantikan')}
						/>
						<SidebarMenu
							href="/abdi/sekretariat/anggota/bintangjasa"
							icon="mdi:book"
							anchor="Bintang Jasa"
							active={page.route.id?.startsWith('/abdi/sekretariat/anggota/bintangjasa')}
						/>
					</SidebarMenu>

					<SidebarMenu href="" icon="mdi:people" anchor="Komunitas" hasChildren={true}>
						<SidebarMenu
							href="/abdi/sekretariat/komunitas/daftarkomunitas"
							icon="mdi:book"
							anchor="Daftar Komunitas"
							active={page.route.id?.startsWith('/abdi/sekretariat/komunitas/daftarkomunitas')}
						/>
						<SidebarMenu
							href="/abdi/sekretariat/komunitas/daftaranggota"
							icon="mdi:book"
							anchor="Daftar Anggota"
							active={page.route.id?.startsWith('/abdi/sekretariat/komunitas/daftaranggota')}
						/>
					</SidebarMenu>
					<SidebarMenu href="" icon="mdi:people" anchor="Organisasi" hasChildren={true}>
						<SidebarMenu
							href="/abdi/sekretariat/organisasi/daftarorganisasi"
							icon="mdi:book"
							anchor="Daftar Organisasi"
							active={page.route.id?.startsWith('/abdi/sekretariat/anggota/daftarorganisasi')}
						/>
						<SidebarMenu
							href="/abdi/sekretariat/organisasi/daftaranggota"
							icon="mdi:book"
							anchor="Daftar Anggota"
							active={page.route.id?.startsWith('/abdi/sekretariat/organisasi/daftaranggota')}
						/>
					</SidebarMenu>
					<SidebarMenu
						href="/abdi/sekretariat/acara"
						icon="mdi:book"
						anchor="Acara"
						active={page.route.id?.startsWith('/abdi/sekretariat/acara')}
						hasChildren={false}
					></SidebarMenu>
					<SidebarMenu
						href="/abdi/sekretariat/situs"
						icon="mdi:book"
						anchor="Situs"
						active={page.route.id?.startsWith('/abdi/sekretariat/situs')}
						hasChildren={false}
					></SidebarMenu>
					<SidebarMenu
						href="/abdi/sekretariat/tugas"
						icon="mdi:book"
						anchor="Tugas"
						active={page.route.id?.startsWith('/abdi/sekretariat/tugas')}
						hasChildren={false}
					></SidebarMenu>
					<SidebarMenu
						href="/abdi/sekretariat/masterdata"
						icon="mdi:book"
						anchor="Master Data"
						active={page.route.id?.startsWith('/abdi/sekretariat/masterdata')}
						hasChildren={false}
					></SidebarMenu>
					<SidebarMenu
						href="/abdi/sekretariat/landingpage"
						icon="mdi:book"
						anchor="Landinig Page"
						active={page.route.id?.startsWith('/abdi/sekretariat/landingpage')}
						hasChildren={false}
					></SidebarMenu>
				</Sidebar>
			{/if}
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
					href="/abdi/dashboard"
					icon="mdi:home"
					anchor="Dashboard"
					active={isActive('/abdi/dashboard')}
				/>
				<SidebarMenu
					href="/abdi/dashboard/komunitas/beranda"
					icon="mdi:people"
					anchor="Komunitas"
					hasChildren={true}
				>
					<SidebarMenu
						href="/abdi/dashboard/komunitas/detail"
						icon="mdi:book"
						anchor="Detail komunitas"
						active={page.route.id?.startsWith('/abdi/dashboard/komunitas/detail')}
					/>
					<SidebarMenu
						href="/abdi/dashboard/komunitas/daftaranggota"
						icon="mdi:crown"
						anchor="Daftar Anggota"
						active={page.route.id?.startsWith('/abdi/dashboard/komunitas/daftaranggota')}
					/>
					<SidebarMenu
						href="/abdi/dashboard/komunitas/acara"
						icon="mdi:crown"
						anchor="Acara"
						active={page.route.id?.startsWith('/abdi/dashboard/komunitas/acara')}
					/>
				</SidebarMenu>
			</Sidebar>
		{/if}

		{#if page.route.id?.startsWith('/abdi/dashboard/organisasi')}
			<Sidebar>
				<SidebarMenu
					href="/abdi/dashboard"
					icon="mdi:home"
					anchor="Dashboard"
					active={isActive('/abdi/dashboard')}
				/>
				<SidebarMenu
					href="/abdi/dashboard/organisasi/beranda"
					icon="mdi:people"
					anchor="Organisasi"
					hasChildren={true}
				>
					<SidebarMenu
						href="/abdi/dashboard/organisasi/daftarorganisasi"
						icon="mdi:book"
						anchor="Daftar Organisasi"
						active={page.route.id?.startsWith('/abdi/dashboard/organisasi/daftarorganisasi')}
					/>
					<SidebarMenu
						href="/abdi/dashboard/organisasi/daftaranggota"
						icon="mdi:crown"
						anchor="Daftar Anggota"
						active={page.route.id?.startsWith('/abdi/dashboard/organisasi/daftaranggota')}
					/>
					<SidebarMenu
						href="/abdi/dashboard/organisasi/acara"
						icon="mdi:crown"
						anchor="Acara"
						active={page.route.id?.startsWith('/abdi/dashboard/organisasi/acara')}
					/>
				</SidebarMenu>
			</Sidebar>
		{/if}

		{#if page.route.id?.startsWith('/abdi/dashboard/situs')}
			<Sidebar>
				<SidebarMenu
					href="/abdi/dashboard/"
					icon="mdi:home"
					anchor="Dashboard"
					active={isActive('/abdi/dashboard/')}
				/>
				<SidebarMenu
					href="/abdi/dashboard/situs/beranda"
					icon="mdi:people"
					anchor="Situs"
					hasChildren={true}
				>
					<SidebarMenu
						href="/abdi/dashboard/situs/daftaracara"
						icon="mdi:book"
						anchor="Daftar Acara"
						active={page.route.id?.startsWith('/abdi/dashboard/situs/daftaracara')}
					/>
					<SidebarMenu
						href="/abdi/dashboard/situs/bukutamu"
						icon="mdi:book"
						anchor="Buku Tamu"
						active={page.route.id?.startsWith('/abdi/dashboard/situs/bukutamu')}
					/>
					<SidebarMenu
						href="/abdi/dashboard/situs/detail"
						icon="mdi:book"
						anchor="Detail Situs"
						active={page.route.id?.startsWith('/abdi/dashboard/situs/detail')}
					/>
				</SidebarMenu>
			</Sidebar>
		{/if}

		{#if page.route.id?.startsWith('/abdi/sekretariat')}
			<Sidebar>
				<SidebarMenu
					href="/abdi/dashboard/"
					icon="mdi:home"
					anchor="Dashboard"
					active={isActive('/abdi/dashboard/')}
				/>
				<SidebarMenu href="" icon="mdi:people" anchor="Anggota" hasChildren={true}>
					<SidebarMenu
						href="/abdi/sekretariat/anggota/daftaranggota"
						icon="mdi:book"
						anchor="Daftar Anggota"
						active={window.location.pathname.startsWith('/abdi/sekretariat/anggota/daftaranggota')}
					/>
					<SidebarMenu
						href="/abdi/sekretariat/anggota/pelantikan"
						icon="mdi:book"
						anchor="Pelantikan"
						active={page.route.id?.startsWith('/abdi/sekretariat/anggota/pelantikan')}
					/>
					<SidebarMenu
						href="/abdi/sekretariat/anggota/bintangjasa"
						icon="mdi:book"
						anchor="Bintang Jasa"
						active={page.route.id?.startsWith('/abdi/sekretariat/anggota/bintangjasa')}
					/>
				</SidebarMenu>

				<SidebarMenu href="" icon="mdi:people" anchor="Komunitas" hasChildren={true}>
					<SidebarMenu
						href="/abdi/sekretariat/komunitas/daftarkomunitas"
						icon="mdi:book"
						anchor="Daftar Komunitas"
						active={page.route.id?.startsWith('/abdi/sekretariat/komunitas/daftarkomunitas')}
					/>
					<SidebarMenu
						href="/abdi/sekretariat/komunitas/daftaranggota"
						icon="mdi:book"
						anchor="Daftar Anggota"
						active={page.route.id?.startsWith('/abdi/sekretariat/komunitas/daftaranggota')}
					/>
				</SidebarMenu>
				<SidebarMenu href="" icon="mdi:people" anchor="Organisasi" hasChildren={true}>
					<SidebarMenu
						href="/abdi/sekretariat/organisasi/daftarOrganisasi"
						icon="mdi:book"
						anchor="Daftar Organisasi"
						active={page.route.id?.startsWith('/abdi/sekretariat/anggota/daftarOrganisasi')}
					/>
					<SidebarMenu
						href="/abdi/sekretariat/organisasi/daftaranggota"
						icon="mdi:book"
						anchor="Daftar Anggota"
						active={page.route.id?.startsWith('/abdi/sekretariat/organisasi/daftaranggota')}
					/>
				</SidebarMenu>
				<SidebarMenu
					href="/abdi/sekretariat/acara"
					icon="mdi:book"
					anchor="Acara"
					active={page.route.id?.startsWith('/abdi/sekretariat/acara')}
					hasChildren={false}
				></SidebarMenu>
				<SidebarMenu
					href="/abdi/sekretariat/situs"
					icon="mdi:book"
					anchor="Situs"
					active={page.route.id?.startsWith('/abdi/sekretariat/situs')}
					hasChildren={false}
				></SidebarMenu>
				<SidebarMenu
					href="/abdi/sekretariat/tugas"
					icon="mdi:book"
					anchor="Tugas"
					active={page.route.id?.startsWith('/abdi/sekretariat/tugas')}
					hasChildren={false}
				></SidebarMenu>
				<SidebarMenu
					href="/abdi/sekretariat/masterdata"
					icon="mdi:book"
					anchor="Master Data"
					active={page.route.id?.startsWith('/abdi/sekretariat/masterdata')}
					hasChildren={false}
				></SidebarMenu>
				<SidebarMenu
					href="/abdi/sekretariat/landingpage"
					icon="mdi:book"
					anchor="Landinig Page"
					active={page.route.id?.startsWith('/abdi/sekretariat/landingpage')}
					hasChildren={false}
				></SidebarMenu>
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
	@media (max-width: 1400px) {
		.ri--menu-line {
			display: block;
		}

		.buttonshow {
			visibility: visible;
		}
	}
</style>
