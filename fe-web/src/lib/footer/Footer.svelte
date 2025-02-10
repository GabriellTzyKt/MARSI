<script lang="ts">
	import marsi from '../../asset/logo_MARSI.png';
	import fb from '../../asset/umum/icon/Facebook.png';
	import twt from '../../asset/umum/icon/Twitter.png';
	import ig from '../../asset/umum/icon/Instagram.png';
</script>

<div class="bg-footer flex flex-col items-center justify-center md:flex-row">
	<div class=" flex flex-col items-center md:me-32 md:w-1/2 md:flex-row md:justify-end">
		<div class="mb-4 md:mb-0">
			<img src={marsi} alt="" class="w-32" />
		</div>
		<div
			class=" flex flex-row items-center gap-y-2 text-white md:my-8 md:ms-8 md:flex-col md:items-start"
		>
			<div>
				<p class="mx-2 text-xl font-[600] text-white md:mx-0 md:me-0">Navigasi</p>
			</div>
			<div
				class="mx-3 my-2 grid grid-cols-3 items-center rounded-xl border-2 text-center md:mx-0 md:my-0 md:grid-cols-1 md:items-start md:rounded-none md:border-none md:text-start"
			>
				<div class="p-2 md:mx-0 md:flex md:p-0">
					<a href="">Beranda</a>
				</div>
				<div class="p-2 md:mx-0 md:flex md:p-0">
					<a href="">Daftar Kerajaan</a>
				</div>
				<div class="p-2 md:mx-0 md:flex md:p-0">
					<a href="">Situs Kerajaan</a>
				</div>
				<div class="p-2 md:mx-0 md:flex md:p-0">
					<a href="">Asset Kerajaan</a>
				</div>
				<div class="p-2 md:mx-0 md:flex md:p-0">
					<a href="">Acara</a>
				</div>
			</div>
		</div>
	</div>
	<div
		class="flex flex-col items-center justify-center text-left text-white md:w-1/2 md:items-start"
	>
		<div class="">
			<p class="text-xl font-[600]">Hubungi Kami</p>
		</div>
		<div class="mt-6">
			<p>(031) 5043462</p>
		</div>
		<div class="mt-4 text-center md:w-1/2 md:break-words md:text-start">
			<p>Jl. Ketintang Wiyata, Ketintang, Kec. Gayungan, Surabaya, Jawa Timur 60231</p>
		</div>
		<div class="mb-4 mt-4 flex flex-row gap-6 text-center md:mb-0">
			<a href="facebook.com"><img src={fb} alt="" /></a>
			<a href="x.com"><img src={twt} alt="" /></a>
			<a href="instagram.com"><img src={ig} alt="" /></a>
		</div>
	</div>
</div>

<style>
	.bg-footer {
		background-color: #857d68;
	}
</style>
