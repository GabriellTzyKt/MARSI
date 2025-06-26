<script lang="ts">
	let { status } = $props();
</script>

<div
	class="mx-2 rounded-full px-2 py-1 text-center"
	class:bg-diajukan={status === 'Diajukan'}
	class:bg-diproses={status === 'Sedang Diproses'}
	class:bg-selesai={status === 'Selesai'}
>
	<p class="text-sm font-[700] text-white">{status}</p>
</div>

<style>
	.bg-diajukan {
		background-color: #007bffcc;
	}
	.bg-diproses {
		background-color: #ffc107cc;
	}

	.bg-selesai {
		background-color: #28a745cc;
	}
</style>
