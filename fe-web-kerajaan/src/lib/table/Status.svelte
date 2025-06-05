<script lang="ts">
	let { status } = $props();
</script>

<div
	class="mx-1 flex justify-center rounded-full px-2 py-1"
	class:bg-berlangsung={status === 'Berlangsung' || status === 'Ditugaskan'}
	class:bg-disetujui={status === 'Disetujui' || status === 'Selesai'}
	class:bg-ditolak={status === 'Ditolak'}
	class:bg-pending={status === 'Pending'}
	class:bg-diajukan={status === 'Diajukan'}
	class:bg-tugas-berlangsung={status === 'Ditugaskan'}
	class:bg-tugas-selesai={status === 'Selesai'}
>
	<p class="text-center text-xs font-[700]">{status}</p>
</div>

<style>
	.bg-berlangsung {
		background-color: #9dd4fb;
	}
	.bg-diajukan {
		background-color: #8cff08;
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
	.bg-tugas-selesai {
		background-color: #629a34a6;
	}
	.bg-tugas-berlangsung {
		background-color: #00b7ff80;
	}
</style>
