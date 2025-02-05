<script lang="ts">
	import Modal from '$lib/popup/Modal.svelte';
	let pop = $state(false);
	function setpop() {
		pop = true;
	}
	function dispop() {
		pop = false;
	}
</script>

<button class="ms-3 mt-3 bg-yellow-600 p-3 text-white" onclick={setpop}> Click me </button>
<Modal {pop} nama="Halo" on:close={dispop}></Modal>
