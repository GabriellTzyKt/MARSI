<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import gambar from '../../asset/icons/exclamationmark.png'
	import SuccessModal from './SucessModal.svelte';
	import SModal from './SModal.svelte';
	
	let { text, successText, choose, value = $bindable(), name, data } = $props();

	console.log("name : ", name)

	let success = $state(false)
	
	const itemData = data;
	console.log("DeleteModal initialized with fixed data:", itemData);
	
	const dispatch = createEventDispatcher();
	
	function handleSubmit() {
		console.log("DeleteModal submitting with data:", itemData);
		dispatch('submit', { id: itemData });
	}
	
	function handleCancel() {
		value = false;
		dispatch('close');
	}
</script>

{#if value}
	<div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
		<div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">

			<img src={gambar} alt="gambar" class="w-32 h-32 mx-auto mb-4">

			<p class="mb-6 text-center">{text}</p>
			
			<input type="hidden" name={name} value={itemData}>
			{console.log("Rendering hidden input with fixed value:", itemData)}
			
			<div class="flex justify-center space-x-2 gap-12">
				<button 
					type="button" 
					class="px-4 py-2 bg-gray-200 rounded-lg mx-2" 
					onclick={handleCancel}
				>
					Batal
				</button>
				<button 
					type="submit" 
					class="px-4 py-2 bg-red-500 text-white rounded-lg mx-2"
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
