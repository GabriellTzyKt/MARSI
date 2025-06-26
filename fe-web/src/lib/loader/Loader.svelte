<script lang="ts">
	let { text = '' } = $props();
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	class="fixed left-0 top-0 z-[200] flex h-full w-full cursor-wait flex-col items-center justify-center bg-black/60"
	onclick={(e) => e.stopPropagation()}
>
	<div class="loader"></div>
	<div class="text center mt-4">
		<p class="text-gray-200">{text}</p>
	</div>
</div>

<style>
	.loader {
		width: 50px;
		aspect-ratio: 1;
		display: grid;
		border: 4px solid #0000;
		border-radius: 50%;
		border-right-color: #c1a411;
		animation: l15 1s infinite linear;
	}
	.loader::before,
	.loader::after {
		content: '';
		grid-area: 1/1;
		margin: 2px;
		border: inherit;
		border-radius: 50%;
		animation: l15 2s infinite;
	}
	.loader::after {
		margin: 8px;
		animation-duration: 3s;
	}
	@keyframes l15 {
		100% {
			transform: rotate(1turn);
		}
	}
</style>
