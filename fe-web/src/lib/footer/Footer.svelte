<script lang="ts">
	import marsi from '../../asset/logo_MARSI.png';
	import fb from '../../asset/umum/icon/Facebook.png';
	import twt from '../../asset/umum/icon/Twitter.png';
	import ig from '../../asset/umum/icon/Instagram.png';
</script>

<div class="bg-footer flex flex-row items-center justify-center">
	<div class=" me-32 flex w-1/2 flex-row items-center justify-end">
		<div>
			<img src={marsi} alt="" class="w-32" />
		</div>
		<div class=" my-8 ms-8 flex flex-col gap-y-2 text-white">
			<div>
				<p class="text-xl font-[600] text-white">Navigasi</p>
			</div>
			<div>
				<a href="">Beranda</a>
			</div>
			<div>
				<a href="">Daftar Kerajaan</a>
			</div>
			<div>
				<a href="">Situs Kerajaan</a>
			</div>
			<div>
				<a href="">Asset Kerajaan</a>
			</div>
			<div>
				<a href="">Acara</a>
			</div>
		</div>
	</div>
	<div class="flex w-1/2 flex-col justify-center text-left text-white">
		<div class="">
			<p class="text-xl font-[600]">Hubungi Kami</p>
		</div>
		<div class="mt-6">
			<p>(031) 5043462</p>
		</div>
		<div class="mt-4 w-1/2 break-words">
			<p>Jl. Ketintang Wiyata, Ketintang, Kec. Gayungan, Surabaya, Jawa Timur 60231</p>
		</div>
		<div class="mt-4 flex flex-row gap-6">
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
