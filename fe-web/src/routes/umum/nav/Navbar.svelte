<script lang="ts">
	// import Search from '$lib/table/Search.svelte';
	import { onMount } from 'svelte';
    import logo_marsi from '../../../asset/logo_MARSI.png'
	import SearchNav from './SearchNav.svelte';
	// import { svelte } from '@sveltejs/vite-plugin-svelte';
	// import { handlers } from 'svelte/legacy';

    let pos = $state(0)
    let hidden = $state(false)

    onMount(()=> {
        const handleScroll = ()=> {
            let curr = window.scrollY
            if (pos > curr){
                hidden = false
            }
            else{
                hidden = true
            }
            pos = curr
        }

        window.addEventListener('scroll',handleScroll)
        return ()=>{
            window.removeEventListener('scroll',handleScroll)
        }
        
    })
</script>

<nav class="nav w-full top-0 fixed bg-white py-2 z-50"
    style:top = {hidden? '-60px' : '0'}
>
    <div class="flex justify-between">
        <div class="flex flex-row gap-4 items-center me-16">
            <div class="ms-4">
                <img src={logo_marsi} class="w-10 h-auto" alt="">
            </div>
            <div class="">
                <p class="text-3xl font-[500]">MARSI</p>
            </div>
        </div>
        <div class="flex gap-6 me-14 items-center">

            <div>
               <SearchNav></SearchNav>
            </div>
            <div class="flex flex-row flex-grow items-center justify-evenly">
                <div class="">
                    <a href="" class="px-4 py-2 mx-2 hover:border-b-gray-800 hover:border-b-2 transition-all duration-100 ease-in-out ">Beranda</a>
                </div>
                <div>
                    <a href="" class="px-4 py-2 mx-2  hover:border-b-gray-800 hover:border-b-2 transition-all duration-100 ease-in-out">Daftar Kerajaan</a>
                </div>
                <div>
                    <a href="" class="px-4 py-2 mx-2  hover:border-b-gray-800 hover:border-b-2 transition-all duration-100 ease-in-out">Situs Kerajaan</a>
                </div>
                <div>
                    <a href="" class="px-4 py-2 mx-2  hover:border-b-gray-800 hover:border-b-2 transition-all duration-100 ease-in-out">Aset Kerajaan</a>
                </div>
                <div>
                    <a href="" class="px-4 py-2 mx-2  hover:border-b-gray-800 hover:border-b-2 transition-all duration-100 ease-in-out">Acara</a>
                </div>
         
            </div>
        </div>
    </div>
</nav>

<style>
    .nav{
        transition: top 0.35s;
    }
</style>