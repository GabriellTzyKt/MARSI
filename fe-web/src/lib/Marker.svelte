<script lang="ts">
	import { onMount, onDestroy, getContext, setContext } from 'svelte';
	import L from 'leaflet';

	// panjang lebar dan koordinat
	let { width, height, latLng, children } = $props();

	// marker / penanda di map
	let marker: L.Marker | undefined = $state(undefined);
	// elemen html yg akan diisi dengan icon
	let markerElement: HTMLElement;

	// ngambil map dari induk ( leaflet.svelte )
	const { getMap }: { getMap: () => L.Map | undefined } = getContext('map');
	// menyimpan map dari induk kedalam variabel
	const map = getMap();

	// layer itu marker / penanda yang ditambahkan ke map
	setContext('layer', {
		getLayer: () => marker
	});

	onMount(() => {
		if (map) {
			// membuat icon berdasarkan elemen html ( markerElement ) => ini ngikut ke elemen didalam <marker> di +page.svelte yaitu svg
			let icon = L.divIcon({
				html: markerElement,
				className: 'map-marker',
				iconSize: L.point(width, height)
			});
			// menambahkan marker dengan koordinat dan icon yang sudah diberikan kedalam map
			marker = L.marker(latLng, { icon }).addTo(map);
		}
	});

	// apus marker
	onDestroy(() => {
		marker?.remove();
		marker = undefined;
	});
</script>

<div bind:this={markerElement}>
	{#if marker}
		{@render children()}
	{/if}
</div>
