<script lang="ts">
	let { text = '' } = $props();
</script>

<div
	class="fixed left-0 top-0 z-30 flex h-full w-full flex-col items-center justify-center gap-2 bg-black/75"
>
	<div class="loader"></div>
	<div class="flex w-full justify-center">
		<p class="text-white">
			{text}
		</p>
	</div>
</div>

<style>
	.loader {
		width: 44.8px;
		height: 44.8px;
		color: #554cb5;
		position: relative;
		background: radial-gradient(11.2px, currentColor 94%, #0000);
	}

	.loader:before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: 50%;
		background:
			radial-gradient(10.08px at bottom right, #0000 94%, currentColor) top left,
			radial-gradient(10.08px at bottom left, #0000 94%, currentColor) top right,
			radial-gradient(10.08px at top right, #0000 94%, currentColor) bottom left,
			radial-gradient(10.08px at top left, #0000 94%, currentColor) bottom right;
		background-size: 22.4px 22.4px;
		background-repeat: no-repeat;
		animation: loader 1.5s infinite cubic-bezier(0.3, 1, 0, 1);
	}

	@keyframes loader {
		33% {
			inset: -11.2px;
			transform: rotate(0deg);
		}

		66% {
			inset: -11.2px;
			transform: rotate(90deg);
		}

		100% {
			inset: 0;
			transform: rotate(90deg);
		}
	}
</style>
