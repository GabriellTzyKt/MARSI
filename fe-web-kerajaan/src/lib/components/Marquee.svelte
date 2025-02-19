<script>
	let { reverse = false, pauseOnHover = false, children } = $props();
</script>

<div class="marquee" style={`--duration: 20s`}>
	<div class="marquee-content" class:reverse class:paused={pauseOnHover}>
			{@render children()}
	</div>
</div>

<style>
	.marquee {
		overflow: hidden;
		white-space: nowrap;
		position: relative;
		display: flex;
	}

	.marquee-content {
		display: flex;
		gap: 1.5rem;
		animation: marquee var(--duration) linear infinite;
	}

	.reverse {
		animation-direction: reverse;
	}

	.paused:hover {
		animation-play-state: paused;
	}

	@keyframes marquee {
		from {
			transform: translateX(100%);
		}
		to {
			transform: translateX(-100%);
		}
	}
</style>
