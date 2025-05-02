<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import xbutton from '../../asset/icons/xbutton.png';
	import dangerbtn from '../../asset/icons/exclamationmark.png';
	import { dummyAcara } from '$lib/dummy';
	import { dummydata } from '$lib/dummy';
	import SucessModal from './SucessModal.svelte';

	let { id_arsip, pop, data, text, link, successText, value = $bindable() } = $props();
	let success = $state(false);
	const toggle = () => {
		if (!success) {
			success = true;
		} else success = false;
	};

	const dispatch = createEventDispatcher();
	const close = () => {
		pop = false;
		dispatch('close');
	};

	const arsip = () => {
		// if (tipe === 'anggota') {
		// 	const index = dummydata.findIndex((d) => d.id === data.id);

		// 	if (index !== -1) {
		// 		dummydata.splice(index, 1);
		// 	}
		// } else {
		// 	const index = dummyAcara.findIndex((d) => d.id === data.id);

		// 	if (index !== -1) {
		// 		dummyAcara.splice(index, 1);
		// 	}
		// }

		close();
		toggle();
	};
</script>

{#if pop || value}
	{console.log("id_arsip dari modal : " , id_arsip)}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore event_directive_deprecated -->
	<div
		class="fixed left-0 top-0 flex min-h-full min-w-full items-center justify-center bg-black bg-opacity-65"
	>
		<div
			class="relative flex flex-col items-center rounded-3xl border bg-white"
			in:fade={{ duration: 100 }}
			out:fade={{ duration: 100 }}
			on:click|stopPropagation
		>
			<div class="absolute right-0 top-0 me-8 mt-8">
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<img
					src={xbutton}
					alt="x-button"
					class="h-8 w-auto rounded-full p-2 hover:cursor-pointer hover:bg-gray-400"
					on:click={close}
				/>
			</div>

			<div class="mt-8 p-4">
				<img src={dangerbtn} alt="danger-button" class="h-auto w-16" />
			</div>
			<div class=" mt-8 px-10">
				<p class="text-xl font-[475]">{text}</p>
			</div>
			<div class="mb-8 mt-16 grid grid-cols-2 items-center justify-center gap-10">
				<div class="flex">
					<button
						class=" btn-batal rounded-xl px-10 py-3 font-[500] text-white hover:cursor-pointer hover:ring hover:ring-gray-600"
						on:click={close}>Batalkan</button
					>
				</div>
				<div class="flex">
					<button
						class="btn-setuju rounded-xl px-8 py-3 font-[500] text-white hover:cursor-pointer hover:ring hover:ring-gray-600"
						on:click={arsip}>Iya, arispkan</button
					>
				</div>
			</div>
		</div>
	</div>
{/if}
{#if success}
	<div in:fade={{ duration: 300 }} out:fade={{ duration: 300 }}>
		<SucessModal open={success} text={successText} to={link} on:close={toggle}></SucessModal>
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
