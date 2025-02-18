<script lang="ts">
	import { page } from '$app/state';
	import Navbar from '$lib/navbar/Navbar.svelte';

	const { data } = $props();
	const akun = data.akun;
</script>

<Navbar></Navbar>
<div class=" mt-18">
	<p class="text-center text-2xl font-[500]">Ubah Profil</p>
</div>
