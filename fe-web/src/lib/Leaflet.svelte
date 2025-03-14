<script lang="ts">
	import { onMount, onDestroy, setContext, createEventDispatcher, tick } from 'svelte';
	import L from 'leaflet';
	import 'leaflet/dist/leaflet.css';

	let { bounds = null, view, zoom, children } = $props();
	// jarak kiri kanan atas bawah peta = bounds
	// liatnya di posisi mana = view
	// dizoom berapa jauh dari view = zoom

	// mengirim elemen ke komponen induk
	const dispatch = createEventDispatcher();

	// map nya
	let map: L.Map | undefined = $state(undefined);
	// tempat map akan dirender
	let mapElement: HTMLElement;

	// onMount itu jalanin kode setelah sudah elemen HTML sudah ada
	onMount(() => {
		// periksa view, zoom dan bounds apakah ada nilainya
		if (!bounds && (!view || !zoom)) {
			throw new Error('Must set either bounds, or view and zoom.');
		}

		// fungsi bawaaan dari leaflet utk membuat peta
		map = L.map(mapElement)
			// komponen induk akan menangani zoom
			.on('zoom', (e) => dispatch('zoom', e))
			// setelah popup muncul, ada jeda hingga selesai dimuat ( menunggu UI )
			.on('popupopen', async (e) => {
				await tick();
				e.popup.update();
			});

		// memilih + menampilkan map berdasarkan bantuan z(zoom) x,y ( horizontal , vertikal ) dan r(membuat hasil lebih tajam ( opsional ))
		L.tileLayer(
			'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
			{}
		).addTo(map);

		if (map) {
			if (bounds) {
				map.fitBounds(bounds);
			} else if (view && zoom) {
				map.setView(view, zoom);
			}
		}
	});

	// ngehapus map kalo ada ( tdk undefined ) lalu dijadikan undefined jika ada
	onDestroy(() => {
		map?.remove();
		map = undefined;
	});

	// supaya map nanti bisa di panggil di komponen anak lainnya
	setContext('map', {
		getMap: () => map
	});
</script>

<div class="h-full w-full" bind:this={mapElement}>
	{#if map}
		{@render children()}
	{/if}
</div>
