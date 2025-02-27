<script lang="ts">
	import { page } from '$app/state';

	const { children } = $props();
</script>

<!-- <h3 class="p-6">Menu Organisasi</h3> -->
{#if page.route.id?.startsWith('/abdi/dashboard/organisasi')}
	<h3 class="p-6">Menu Organisasi</h3>
{:else if page.route.id?.startsWith('/abdi/dashboard/komunitas')}
	<h3 class="p-6">Menu Komunitas</h3>
{:else if page.route.id?.startsWith('/abdi/dashboard/situs')}
	<h3 class="p-6">Menu Situs</h3>
{:else if page.route.id?.startsWith('/abdi/sekretariat')}
	<h3 class="p-6">Menu Sekretariat</h3>
{:else}
	<h3 class="p-6">Menu Manajemen</h3>
{/if}

{@render children()}

<style>
	h3 {
		font-size: medium;
		color: white;
		font-weight: bold;
	}
</style>
