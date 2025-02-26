<script lang="ts">
	import L from 'leaflet';
	import 'leaflet/dist/leaflet.css';
	import { onDestroy, onMount, setContext } from 'svelte';
	let map: L.Map | undefined;
	let mapElement: HTMLElement;
	onMount(() => {
		map = L.map(mapElement);
		L.tileLayer();
	});
	onDestroy(() => {
		map?.remove();
		map = undefined;
	});
	setContext('map', {
		getMap: () => map
	});
</script>

<div class="h-full w-full" bind:this={mapElement}>
	{#if map}
		<slot></slot>
	{/if}
</div>
