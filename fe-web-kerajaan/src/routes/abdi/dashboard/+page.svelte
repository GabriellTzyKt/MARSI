<script lang="ts">
	import gambartemp from '$lib/asset/kerajaan/gambar_temp.jpg';
	import org from '$lib/asset/icon/org.png';
	import kom from '$lib/asset/icon/com.png';
	import situs from '$lib/asset/icon/landmark.png';
	import sekre from '$lib/asset/icon/gov.png';
	import { navigating } from '$app/state';
	import Loader from '$lib/loader/Loader.svelte';
	import { redirect } from '@sveltejs/kit';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { env } from '$env/dynamic/public';
	let { data } = $props();
	console.log(data);
	console.log('data.user : ', data.user);
	let user = $state(data?.data);
	console.log(user);
	// let adminData = $state();
	// async function fetchuser() {
	// 	try {
	// 		let adminRes = await fetch(`${env.PUBLIC_URL_KERAJAAN}/admin?limit=500`, {
	// 			method: 'GET'
	// 		});
	// 		let admin = await adminRes.json();

	// 		admin = admin.filter(
	// 			(item) => item.status_aktif == 1 && item.deleted_at == '0001-01-01T00:00:00Z'
	// 		);
	// 		console.log(admin);
	// 		adminData = admin;
	// 	} catch (error) {}
	// }
	// onMount(() => {
	// 	fetchuser();
	// 	let find = adminData?.filter((item) => item.id_user === user.id_user);
	// 	if (!find) {
	// 		goto('/beranda');
	// 	}
	// });
	let total = $state(16);
</script>

{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
<div class="mx-4 mb-2 mt-5 flex h-full w-full flex-col">
	<div class="">
		<p class="text-xl font-[600]">Menu Manajemen</p>
	</div>
	<div
		class="mt-4 grid items-center justify-center gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
	>
		<!-- <a href="/abdi/dashboard/organisasi/beranda">
			<div
				class="an border-badran-bt mx-2 flex flex-col rounded-lg border p-8 hover:cursor-pointer"
			>
				<div class=" mb-3 flex items-center justify-center">
					<img src={org} alt="" />
				</div>
				<div class="bg-badran-bt flex items-center justify-center rounded-full">
					<p class="px-3 py-2 text-center text-xl text-white">Manajemen Organisasi</p>
				</div>
			</div>
		</a>

		<a href="/abdi/dashboard/komunitas/beranda">
			<div
				class="an border-badran-bdr mx-2 flex flex-col rounded-lg border p-8 hover:cursor-pointer"
			>
				<div class=" mb-3 flex items-center justify-center">
					<img src={kom} alt="" />
				</div>
				<div class=" bg-badran-bdr flex items-center justify-center rounded-full">
					<p class="px-3 py-2 text-center text-xl text-white">Manajemen Komunitas</p>
				</div>
			</div>
		</a>

		<a href="/abdi/dashboard/situs/beranda">
			<div
				class="an border-badran-bdy mx-2 flex flex-col rounded-lg border p-8 hover:cursor-pointer"
			>
				<div class=" mb-3 flex items-center justify-center">
					<img src={situs} alt="" />
				</div>
				<div class="bg-badran-bdy flex items-center justify-center rounded-full">
					<p class="px-3 py-2 text-center text-xl text-white">Manajemen Situs</p>
				</div>
			</div>
		</a>
		<a href="/abdi/sekretariat/anggota/daftaranggota" class="">
			<div
				class="an border-badran-bdg mx-2 flex flex-col rounded-lg border p-8 hover:cursor-pointer"
			>
				<div class=" mb-3 flex items-center justify-center">
					<img src={sekre} alt="" />
				</div>
				<div class="bg-badran-bdg flex items-center justify-center rounded-full">
					<p class="px-3 py-2 text-center text-xl text-white">Sekretariat</p>
				</div>
			</div>
		</a> -->
		{#if data?.data?.status_admin_aktif === 0}
			<div class=" flex justify-center text-center">
				<p class="text-red-500">Anda di Non-aktifkan</p>
			</div>
		{:else if data?.data?.jenis_admin === 'Admin Organisasi'}
			<a href="/abdi/dashboard/organisasi/beranda">
				<div
					class="an border-badran-bt mx-2 flex flex-col rounded-lg border p-8 hover:cursor-pointer"
				>
					<div class=" mb-3 flex items-center justify-center">
						<img src={org} alt="" />
					</div>
					<div class="bg-badran-bt flex items-center justify-center rounded-full">
						<p class="px-3 py-2 text-center text-xl text-white">Manajemen Organisasi</p>
					</div>
				</div>
			</a>
		{:else if data?.data?.jenis_admin === 'Admin Komunitas'}
			<a href="/abdi/dashboard/komunitas/beranda">
				<div
					class="an border-badran-bdr mx-2 flex flex-col rounded-lg border p-8 hover:cursor-pointer"
				>
					<div class=" mb-3 flex items-center justify-center">
						<img src={kom} alt="" />
					</div>
					<div class=" bg-badran-bdr flex items-center justify-center rounded-full">
						<p class="px-3 py-2 text-center text-xl text-white">Manajemen Komunitas</p>
					</div>
				</div>
			</a>
		{:else if data?.data?.jenis_admin === 'Admin Situs'}
			<a href="/abdi/dashboard/situs/beranda">
				<div
					class="an border-badran-bdy mx-2 flex flex-col rounded-lg border p-8 hover:cursor-pointer"
				>
					<div class=" mb-3 flex items-center justify-center">
						<img src={situs} alt="" />
					</div>
					<div class="bg-badran-bdy flex items-center justify-center rounded-full">
						<p class="px-3 py-2 text-center text-xl text-white">Manajemen Situs</p>
					</div>
				</div>
			</a>
		{:else if data?.data?.jenis_admin === 'Super Admin'}
			<a href="/abdi/sekretariat/anggota/daftaranggota" class="">
				<div
					class="an border-badran-bdg mx-2 flex flex-col rounded-lg border p-8 hover:cursor-pointer"
				>
					<div class=" mb-3 flex items-center justify-center">
						<img src={sekre} alt="" />
					</div>
					<div class="bg-badran-bdg flex items-center justify-center rounded-full">
						<p class="px-3 py-2 text-center text-xl text-white">Sekretariat</p>
					</div>
				</div>
			</a>
		{/if}
	</div>
</div>

<style>
	.an {
		transition: all 0.2s;
	}
	.an:hover {
		transform: translateY(-10px);
		box-shadow: 0 0 30px gray;
	}
</style>
