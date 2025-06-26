<script lang="ts">
	import L from 'leaflet';
	import 'leaflet/dist/leaflet.css';
	import { onMount } from 'svelte';
	// import {indonesia} from '$lib/indonesia-cities.json'
	let map; // Variabel untuk menyimpan instance peta
	let mapElement; // Binding elemen div untuk Leaflet
	let popup = L.popup();
	let marker;
	onMount(() => {
		// Pastikan elemen sudah tersedia sebelum Leaflet diinisialisasi
		if (!mapElement) return;

		map = L.map(mapElement).setView([-2.5, 118.0], 5);

		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 24,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		}).addTo(map);

		// L.geoJson(indonesia).addTo(map);
		// L.geoJson(indonesia, {style: style}).addTo(map);
		marker = L.marker([1.5, 120.09]).addTo(map);
		marker.bindPopup('<b>Hello world!</b><br>I am a popup.').openPopup();
		console.log('Leaflet Map Loaded:', map);
		map.on('click', onMapClick);
	});
	function onMapClick(e) {
		popup
			.setLatLng(e.latlng)
			.setContent('You clicked the map at ' + e.latlng.toString())
			.openOn(map);
	}
	function getColor(d) {
		return d > 1000
			? '#800026'
			: d > 500
				? '#BD0026'
				: d > 200
					? '#E31A1C'
					: d > 100
						? '#FC4E2A'
						: d > 50
							? '#FD8D3C'
							: d > 20
								? '#FEB24C'
								: d > 10
									? '#FED976'
									: '#FFEDA0';
	}
	function style(feature) {
		return {
			fillColor: getColor(feature.properties.density),
			weight: 2,
			opacity: 1,
			color: 'white',
			dashArray: '3',
			fillOpacity: 0.7
		};
	}
</script>

<!-- Gunakan bind:this untuk memastikan elemen tersedia -->
<div bind:this={mapElement} class="map"></div>

<style>
	.map {
		height: 100vh;
		width: 100%;
	}
</style>
