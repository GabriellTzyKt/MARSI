<script lang="ts">
	import { dummyHistoryGelar } from '$lib/dummy';
	import BuktiLaporan from '$lib/popup/BuktiLaporan.svelte';
	import HistoryPopUp from '$lib/popup/HistoryPopUp.svelte';
	import TambahTugas from '$lib/popup/TambahTugas.svelte';
	let open = $state(false);
	let openJ = $state(false);
</script>

<button
	onclick={() => {
		open = true;
	}}>open Gelar</button
>
<button
	onclick={() => {
		openJ = true;
	}}>open Bintang Jasa</button
>
{#if open}
	<HistoryPopUp
		bind:value={open}
		title="History Gelar"
		data={dummyHistoryGelar}
		header={[
			['nama_gelar', 'Nama Gelar'],
			['nama_pelantik', 'Nama Pelantik'],
			['tanggal_dilantik', 'Tanggal Dilantik'],
			['acara', 'Acara'],
			['children', 'Sertifikat']
		]}
	></HistoryPopUp>
{/if}
{#if openJ}
	<HistoryPopUp
		bind:value={openJ}
		title="History Bintang jasa"
		data={dummyHistoryGelar}
		header={[
			['nama_gelar', 'Nama Bintang Jasa'],
			['nama_pelantik', 'Pemberi Bintang Jasa'],
			['tanggal_dilantik', 'Tanggal Bintang Jasa'],
			['acara', 'Acara'],
			['children', 'Sertifikat']
		]}
	></HistoryPopUp>
{/if}
<!-- <TambahTugas></TambahTugas> -->
<BuktiLaporan></BuktiLaporan>
