<script lang="ts">
	let { status } = $props();
</script>

<div
	class="rounded-full px-2 py-1 text-center"
	class:bg-berlangsung={status === 'Berlangsung'}
	class:bg-disetujui={status === 'Disetujui'}
	class:bg-ditolak={status === 'Ditolak'}
	class:bg-selesai={status === 'Selesai'}
	class:bg-pending={status === 'Pending'}
>
	<p>{status}</p>
</div>

<style>
	.bg-berlangsung {
		background-color: #9dd4fb;
	}
	.bg-disetujui {
		background-color: #87ec80;
	}
	.bg-ditolak {
		background-color: #e58d8d;
	}
	.bg-selesai {
		background-color: #a1a1a1;
	}
	.bg-pending {
		background-color: #eaec6e;
	}
</style>
