<script lang="ts">
    import { onMount } from 'svelte';
    import logo_marsi from '../../../asset/logo_MARSI.png';
    import SearchNav from './SearchNav.svelte';

    let pos = 0;
    let hidden = false;
    let menuOpen = false;

    onMount(() => {
        const handleScroll = () => {
            let curr = window.scrollY;
            hidden = pos < curr;
            pos = curr;
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    });
</script>

<nav class="nav fixed top-0 z-50 w-screen bg-white py-2 px-4 lg:px-10" style:top={hidden ? '-60px' : '0'}>
    <div class="flex justify-between items-center">
        <div class="flex items-center gap-4">
            <img src={logo_marsi} class="h-auto w-10" alt="" />
            <p class="text-3xl font-medium">MARSI</p>
        </div>
        
        <div class="hidden lg:flex items-center gap-6">
            <SearchNav />
            <div class="flex gap-4">
                <a href="beranda" class="nav-link">Beranda</a>
                <a href="daftarkerajaan" class="nav-link">Daftar Kerajaan</a>
                <a href="situskerajaan" class="nav-link">Situs Kerajaan</a>
                <a href="asetkerajaan" class="nav-link">Aset Kerajaan</a>
                <a href="acara" class="nav-link">Acara</a>
            </div>
        </div>
        
        <button class="lg:hidden" on:click={() => menuOpen = !menuOpen}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
        </button>
    </div>
    
    <div class="lg:hidden absolute w-full left-0 bg-white shadow-md transition-all" style:display={menuOpen ? 'block' : 'none'}>
        <a href="beranda" class="block py-2 px-4 border-b">Beranda</a>
        <a href="daftarkerajaan" class="block py-2 px-4 border-b">Daftar Kerajaan</a>
        <a href="situskerajaan" class="block py-2 px-4 border-b">Situs Kerajaan</a>
        <a href="asetkerajaan" class="block py-2 px-4 border-b">Aset Kerajaan</a>
        <a href="acara" class="block py-2 px-4">Acara</a>
    </div>
</nav>

<style>
    .nav {
        transition: top 0.35s;
    }
    .nav-link {
        padding: 8px 16px;
        transition: border-bottom 0.2s;
    }
    .nav-link:hover {
        border-bottom: 2px solid gray;
    }
    @media (max-width: 1000px) {
        .lg\:hidden {
            display: block;
        }
        .lg\:flex {
            display: none;
        }
    }
</style>
