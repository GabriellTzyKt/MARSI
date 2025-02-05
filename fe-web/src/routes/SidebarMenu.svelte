<script lang="ts">
    import { fly } from 'svelte/transition';
    import  Icon  from "@iconify/svelte";
    import { createEventDispatcher } from 'svelte'; // Import event dispatcher

    const dispatch = createEventDispatcher(); // Buat instance event dispatcher

    let { children = null, anchor, hasChildren = false, href, icon, active = false } = $props();

    let display = $state("hidden");
    let isOpen = $state(false);

    function handleClick() {
        reveal();
        dispatch('menuClick', anchor); // Dispatch event dengan anchor sebagai data
    }

    function reveal(){
        isOpen = true;
        display = isOpen ? " " : "hidden";
    }

    function hide(){
        display = "hidden";
        isOpen = false;
    }
</script>

<div class="relative group">
    <div transition:fly={{ y: 20, duration: 300 }}
        class="mr-5 mt-2 flex items-center justify-between p-3 hover:cursor-pointer hover:bg-gray-100 rounded-md ml-7 hover:bg-gray-200 transition-all duration-300 {active ? 'active-class' : ''}"
        onclick={handleClick}>  
        <a {href} class="flex items-center space-x-2">
            <Icon icon={icon} class="text-lg text-gray-700 hover:text-blue-600 transition-colors duration-300" />
            <span class="text-gray-800 font-semibold">{anchor}</span>
        </a>
        {#if hasChildren}
            <span class="mr-2 text-gray-600 hover:text-blue-600 transition-all">{isOpen ? '⬆️' : '⬇️'}</span>
        {/if}
    </div>

    <!-- Bagian Child -->
    {#if hasChildren}
        {#if display === " "}
            <div transition:fly={{ x: -20, duration: 300 }} class="ml-7 mt-2 flex-col text-black p-2" onclick={reveal} onmouseleave={hide}>
                <div class="space-y-2">  
                    {@render children()}
                </div>
            </div>
        {/if}
    {/if}
</div>

<style>
    .transition-all {
        transition: all 0.3s ease; 
    }
    .active-class {
        background: #eee4e4; /* Warna emas untuk menu aktif */
        border-left: 5px solid #b8860b; /* Garis penanda menu aktif */
        font-weight: bold;
    }
</style>
