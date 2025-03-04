<script lang="ts">
	import SekreAbdiInput from '$lib/input/SekreAbdiInput.svelte';
	import { slide } from 'svelte/transition';
	let { nama = null } = $props();
	let drop = $state(false);
	const togle = () => {
		if (!drop) {
			drop = true;
		} else drop = false;
		console.log(drop);
	};
</script>

<!-- abdi yang akan dilantik -->
<div class="bg-badran/60 mx-3 mb-3 flex flex-col rounded-xl pb-3">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="bg-badran/80 flex cursor-pointer rounded-t-xl py-3" onclick={togle}>
		<p class="ms-3 text-gray-200">{nama}</p>
	</div>
	{#if drop}
		<!-- nama abdi/ id abdi -->
		<div
			class="mx-3 mt-3 grid grid-cols-1 gap-4 lg:grid-cols-4"
			transition:slide={{ duration: 150 }}
		>
			<SekreAbdiInput span="1" placeholder="Nama Abdi/ID Abdi"></SekreAbdiInput>
			<SekreAbdiInput span="1" placeholder="Nama Acara"></SekreAbdiInput>
			<SekreAbdiInput span="1" placeholder="Dilantik oleh Siapa"></SekreAbdiInput>
			<SekreAbdiInput span="1" placeholder="Bukti Pelantikan" img={true}></SekreAbdiInput>
			<SekreAbdiInput span="2" placeholder="Nama Abdi Dalam yang lama"></SekreAbdiInput>
			<SekreAbdiInput span="2" placeholder="Nama Abdi Dalam yang baru"></SekreAbdiInput>
		</div>
	{/if}
</div>
