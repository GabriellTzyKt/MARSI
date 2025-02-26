<script lang="ts">
	import Navbar from '$lib/navbar/Navbar.svelte';
	import jd from '$lib/asset/profile/jdpp.jpg';
	import { accounts, dummyOrganisasi } from '$lib/dummy';
	import Footer from '$lib/footer/Footer.svelte';
	import ListOrganisasi from '$lib/input/ListOrganisasi.svelte';

	let search = $state('');
</script>

<Navbar></Navbar>
<div class="mt-10 text-center">
	<p class="text-2xl font-[500]">Cari Abdi</p>
</div>

<div class="mx-6 mt-8 flex items-center gap-3">
	<div>
		<p>ID Abdi</p>
	</div>
	<div>
		<input
			type="text"
			class="rounded-md border px-3 py-2 shadow-2xl focus:outline-none"
			placeholder="ID abdi"
			bind:value={search}
			name=""
			id=""
		/>
	</div>
	<button class="bg-badran-bt rounded-xl px-8 py-2 text-white hover:cursor-pointer">Cari</button>
</div>

<div class="bg-badran/25 mx-6 mb-6 mt-4 flex rounded-lg p-8">
	<div class="grid w-full grid-cols-1 gap-4 xl:grid-cols-3">
		<!-- profile -->
		<div class=" flex w-full flex-col gap-y-4 rounded-xl bg-white py-4">
			<div class="my-8 flex items-center justify-center">
				<img src={jd} class="h-24 w-auto rounded-full" alt="" />
			</div>
			<!-- nama -->
			<div class="ms-6 flex flex-col">
				<p class=" font-[450] text-gray-400">Nama</p>
				<p class="text-badran/75 text-lg font-[500]">{accounts[0].nama_lengkap}</p>
			</div>
			<!-- nama dalem -->
			<div class="ms-6 flex flex-col">
				<p class=" font-[450] text-gray-400">Nama Dalem</p>
				<p class="text-badran/75 text-lg font-[500]">{accounts[0].asma_dalem}</p>
			</div>
			<!-- jenis kelamin -->
			<div class="ms-6 flex flex-col">
				<p class=" font-[450] text-gray-400">Jenis Kelamin</p>
				<p class="text-badran/75 text-lg font-[500]">{accounts[0].jenis_kelamin}</p>
			</div>
			<!-- no telp -->
			<div class="ms-6 flex flex-col">
				<p class=" font-[450] text-gray-400">Nomer Telepon</p>
				<p class="text-badran text-lg font-[600]">{accounts[0].nomer_telpon}</p>
			</div>
			<!-- hobi -->
			<div class="ms-6 flex flex-col">
				<p class=" font-[450] text-gray-400">Hobi</p>
				<p class="text-badran/75 text-lg font-[500]">{accounts[0].hobi}</p>
			</div>
			<!-- Jabatan Org -->
			<div class="ms-6 flex flex-col">
				<p class=" font-[450] text-gray-400">Jabatan Organisasi</p>
				<p class="text-badran/75 text-lg font-[500]">-</p>
			</div>
			<!-- Jabatan kom -->
			<div class="ms-6 flex flex-col">
				<p class=" font-[450] text-gray-400">Jabatan Komunitas</p>
				<p class="text-badran/75 text-lg font-[500]">-</p>
			</div>
			<!-- Jabatan kom -->
			<div class="ms-6 flex flex-col">
				<p class=" font-[450] text-gray-400">Gelar</p>
				<p class="text-badran/75 text-lg font-[500]">{accounts[0].gelar}</p>
			</div>
		</div>
		<div class="flex w-full flex-col gap-y-4 rounded-xl bg-white py-4">
			<div class=" ms-4 pt-6">
				<p class="text-badran text-xl">Organisasi</p>
			</div>
			<div class="h-[600px] overflow-y-auto">
				{#each dummyOrganisasi as d}
					<ListOrganisasi
						data={[
							['judul', d.nama_organisasi],
							[`Tanggal Berdiri : ${d.tanggal_berdiri}`],
							[`Penanggung Jawab : ${d.penanggungjawab}`],
							[`Pelindung : ${d.pelindung}`]
						]}
					></ListOrganisasi>
				{/each}
			</div>
		</div>
		<div class="flex w-full flex-col gap-y-4 rounded-xl bg-white py-4">
			<div class=" ms-4 pt-6">
				<p class="text-badran text-xl">Komunitas</p>
			</div>
			<div class="h-[600px] overflow-y-auto">
				{#each dummyOrganisasi as d}
					<ListOrganisasi
						data={[
							['judul', d.nama_organisasi],
							[`Tanggal Berdiri : ${d.tanggal_berdiri}`],
							[`Penanggung Jawab : ${d.penanggungjawab}`],
							[`Pelindung : ${d.pelindung}`]
						]}
					></ListOrganisasi>
				{/each}
			</div>
		</div>
	</div>
</div>
<Footer></Footer>
