<script lang="ts">
	import gambar2 from '$lib/asset/kerajaan/temp_login.png';
    import gambarprofile from '$lib/asset/kerajaan/gambar_temp.jpg'
	import { page } from '$app/state';

    let id = Number();

    $inspect(page);
</script>


<section class="h-fit w-full bg-blue-900">
	<div class="flex items-center justify-between self-center">
		<img src={gambar2} class=" h-[60px] w-fit p-2 ml-3" alt="" />
        <div class="flex space-x-20 text-white">
            <a href="/beranda" class:underline={page.route.id === '/beranda'}>Beranda</a>
            <a href="/situs" class:underline={page.route.id?.startsWith('/situs')}>Situs</a>
            <a href="/acara" class:underline={page.route.id?.startsWith('/acara')}>Acara</a>
            <a href="/kelompok" class:underline={page.route.id?.startsWith('/kelompok')}>Kelompok</a>
            <a href="/" class:underline={page.route.id === '/'}>Beranda</a>
          </div>
		<img src={gambarprofile} alt="" class="ml-5 mr-5 h-10 w-10 rounded-full">
	</div>
</section>

<style>
    
</style>