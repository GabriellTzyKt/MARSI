<script lang="ts">
	import { onMount, onDestroy, getContext } from 'svelte';
	import L from 'leaflet';

	let { text, location, link, image } = $props();

	// popup object dari leaflet
	let popup: L.Popup | undefined;
	// elemen html utk konten pop up
	let popupElement: HTMLElement;
	let open = $state(false);

	// Ambil layer dari marker.svelte
	const { getLayer }: { getLayer: () => L.Layer | undefined } = getContext('layer');
	const layer = getLayer() as L.Marker;

	// Ambil map dari Leaflet.svelte
	const { getMap }: { getMap: () => L.Map | undefined } = getContext('map');
	const map = getMap();

	let initialZoom = 14;
	let zoomLevel = 18; // zoom lebbih dekat pas di klik

	onMount(() => {
		if (map) {
			// Ambil zoom awal saat pertama kali komponen dipasang
			initialZoom = map.getZoom();
		}

		popup = L.popup().setContent(popupElement);

		if (layer) {
			layer.bindPopup(popup);

			layer.on('popupopen', () => {
				open = true;
				if (map) {
					// Zoom in ke lokasi marker
					map.setView(layer.getLatLng(), zoomLevel, { animate: true });
				}
			});

			layer.on('popupclose', () => {
				open = false;
				if (map) {
					// Kembalikan zoom ke posisi awal
					map.setView(layer.getLatLng(), initialZoom, { animate: true });
				}
			});
		}
	});

	onDestroy(() => {
		layer?.unbindPopup();
		popup?.remove();
		popup = undefined;
	});
</script>

<div bind:this={popupElement} class="popup-container">
	{#if open}
		<div class="popup-content flex w-full flex-col">
			<!-- svelte-ignore a11y_img_redundant_alt -->
			<div class="flex">
				<img src={image} alt="Popup Image" class="h-12 w-12" />
				<h3 class="ml-3 text-lg font-bold mt-3">{text}</h3>
			</div>
			<p class="text-gray-700">📍 {location}</p>
			<a href={link} class="text-blue-500">Lihat Detail →</a>
		</div>
	{/if}
</div>
