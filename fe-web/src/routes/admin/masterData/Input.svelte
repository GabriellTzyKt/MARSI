<script lang="ts">
	import { fade } from 'svelte/transition';

	let { input = $bindable(), error = null, value = $bindable(), name = 'gelar' } = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black/70"
	onclick={() => (input = false)}
	transition:fade={{ duration: 200 }}
>
	<div
		class="flex w-full max-w-[800px] flex-col rounded bg-white"
		onclick={(e) => e.stopPropagation()}
	>
		<div class="mx-4 mt-4 flex items-center justify-between">
			<div>
				<p class="text-2xl">Add Jenis Arsip</p>
			</div>
			<div
				class="rounded-full p-2 hover:bg-gray-500"
				onclick={() => {
					input = false;
				}}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-6"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
				</svg>
			</div>
		</div>
		<div class="my-4 h-[1px] w-full bg-gray-500"></div>
		<div class="mx-4 flex flex-col">
			<p>Jenis Arsip</p>
			<input
				type="text"
				{name}
				class="mt-1 rounded-lg px-2 focus:outline-none"
				bind:value={value.nama_jenis}
				placeholder="jenis..."
				id=""
			/>
			<input type="text" name="id_jenis_arsip" hidden value={value.id_jenis_arsip} />
			{#if error}
				<p class="text-red-500">{error}</p>
			{/if}
		</div>
		<div class="my-4 flex justify-center md:justify-end">
			<button
				type="submit"
				class="w-full rounded-lg bg-yellow-400 py-2 text-white md:me-4 md:w-auto md:px-6"
				>Tambah Data</button
			>
		</div>
	</div>
</div>
