<script lang="ts">
    import { navigating } from '$app/state';
    import gambartemp from '$lib/asset/kerajaan/gambar_temp.jpg';
    import Loader from '$lib/loader/Loader.svelte';
    let { data } = $props();
    let dataambil = data.filteredList
    console.log("data : " , dataambil)
</script>

{#if navigating.to}
    <Loader text="Navigating..."></Loader>
{/if}
<div
    class="mx-auto grid gap-12 overflow-auto sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
>
    {#each dataambil as komunitas}
        <div class="relative min-h-full">
            <div class="block h-[75%] w-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div class="mx-auto flex w-full items-center justify-center">
                    <img src={gambartemp} class="h-25 w-25 ml-5 mr-5 rounded-full" alt="" />
                </div>
                <h5 class="mb-2 mt-2 text-center text-md font-bold tracking-tight text-black">
                    {komunitas.nama_komunitas || 'Nama Komunitas'}
                </h5>
                <a href={`/abdi/dashboard/komunitas/beranda/${komunitas.id_komunitas}/detail`}>
                    <button
                        class="absolute right-0 mr-3 mt-8 w-20 rounded-lg bg-blue-500 px-2 py-1 text-white"
                    >
                        Detail
                    </button>
                </a>
            </div>
        </div>
    {/each}
</div>