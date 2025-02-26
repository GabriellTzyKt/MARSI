<script lang="ts">
	import L from 'leaflet';
	import 'leaflet/dist/leaflet.css';
	import { onMount } from 'svelte';

	let map; // Variabel untuk menyimpan instance peta
	let mapElement; // Binding elemen div untuk Leaflet

	onMount(() => {
		// Pastikan elemen sudah tersedia sebelum Leaflet diinisialisasi
		if (!mapElement) return;

		map = L.map(mapElement).setView([-2.5, 118.0], 5);

		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		}).addTo(map);

		console.log('Leaflet Map Loaded:', map);
	});
</script>

<!-- Gunakan bind:this untuk memastikan elemen tersedia -->
<div bind:this={mapElement} class="map"></div>

<style>
	.map {
		height: 100vh;
		width: 100%;
	}
</style>
