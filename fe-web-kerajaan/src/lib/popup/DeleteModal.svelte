<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import xbutton from '$lib/asset/icon/xbutton.png';
	import dangerbtn from '$lib/asset/icon/exclamationmark.png';
	import SuccessModal from '../modal/SuccessModal.svelte';

	let { value = $bindable(), text, successText, choose, name = '', data = null } = $props();
	let open = $state(false);
	let timer: number;
	function setTimer() {
		open = true;
		if (timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => {
			open = false;
			value = false;
		}, 3000);
	}
</script>

{#if value}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore event_directive_deprecated -->
	<div
		class="fixed left-0 top-0 flex min-h-full min-w-full items-center justify-center bg-black/75"
	>
		<div
			class="relative flex flex-col items-center rounded-3xl border bg-white"
			in:fade={{ duration: 100 }}
			out:fade={{ duration: 100 }}
		>
			<div class="absolute right-0 top-0 me-8 mt-8" onclick={() => (value = false)}>
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<img
					src={xbutton}
					alt="x-button"
					class="h-8 w-auto rounded-full p-2 hover:cursor-pointer hover:bg-gray-400"
				/>
			</div>

			<div class="mt-8 p-4">
				<img src={dangerbtn} alt="danger-button" class="h-auto w-16" />
			</div>
			<div class=" mt-8 px-10">
				<p class="text-xl font-[475]">{text}</p>
			</div>
			<div class="mb-8 mt-16 grid grid-cols-2 items-center justify-center gap-10 px-10">
				<div class="flex">
					<button
						class=" btn-batal rounded-xl px-10 py-3 font-[500] text-white hover:cursor-pointer hover:ring hover:ring-gray-600"
						type="button"
						onclick={() => {
							value = false;
						}}>Batalkan</button
					>
				</div>
				<div class="flex">
					{#if choose == 'arsip'}
						<button
							class="btn-setuju rounded-xl px-8 py-3 font-[500] text-white hover:cursor-pointer hover:ring hover:ring-gray-600"
							onclick={() => {
								setTimer();
							}}>Iya, arispkan</button
						>
					{:else if choose == 'delete'}
						<button
							class="btn-setuju rounded-xl px-8 py-3 font-[500] text-white hover:cursor-pointer hover:ring hover:ring-gray-600"
							formaction="?/hapus">Iya, hapus</button
						>
					{/if}
				</div>
				<input type="text" hidden {name} value={data} id="" />
			</div>
		</div>
	</div>
{/if}
{#if open}
	<SuccessModal text={successText}></SuccessModal>
{/if}

<style>
	.btn-batal {
		background-color: #909090;
	}
	.btn-setuju {
		background-color: #ff2626;
	}
</style>
