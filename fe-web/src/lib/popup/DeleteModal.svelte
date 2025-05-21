<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import gambar from '../../asset/icons/exclamationmark.png';
	import SuccessModal from './SucessModal.svelte';
	import SModal from './SModal.svelte';

	let { text, value = $bindable() } = $props();

	console.log('name : ', name);

	let success = $state(false);

	const dispatch = createEventDispatcher();

	function handleSubmit() {
		// console.log('DeleteModal submitting with data:', itemData);
		// dispatch('submit', { id: itemData });
	}

	function handleCancel() {
		value = false;
		// dispatch('close');
	}
</script>

{#if value}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
		<div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
			<img src={gambar} alt="gambar" class="mx-auto mb-4 h-32 w-32" />

			<p class="mb-6 text-center">{text}</p>

			<!-- {console.log('Rendering hidden input with fixed value:', itemData)} -->

			<div class="flex justify-center gap-12 space-x-2">
				<button type="button" class="mx-2 rounded-lg bg-gray-200 px-4 py-2" onclick={handleCancel}>
					Batal
				</button>
				<button
					type="submit"
					class="mx-2 rounded-lg bg-red-500 px-4 py-2 text-white"
					onclick={handleSubmit}
				>
					Hapus
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.btn-batal {
		background-color: #909090;
	}
	.btn-setuju {
		background-color: #ff2626;
	}
</style>
