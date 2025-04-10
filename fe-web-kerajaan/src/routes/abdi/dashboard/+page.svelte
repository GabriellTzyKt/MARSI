<script lang="ts">
	import gambartemp from '$lib/asset/kerajaan/gambar_temp.jpg';
	import org from '$lib/asset/icon/org.png';
	import kom from '$lib/asset/icon/com.png';
	import situs from '$lib/asset/icon/landmark.png';
	import sekre from '$lib/asset/icon/gov.png';
	let total = $state(16);
</script>

<div class="mx-4 mb-2 mt-5 flex h-full w-full flex-col">
	<div class="">
		<p class="text-xl font-[600]">Menu Manajemen</p>
	</div>
	<div class="mt-4 grid md:grid-cols-2 sm:grid-cols-1 items-center justify-center gap-4 lg:grid-cols-3">
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

		<a href="/abdi/sekretariat/anggota/daftaranggota" class="md:col-start-2">
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
