<!-- <script lang="ts">
    import Hover from "./Hoverpopup.svelte"

	const { id, text, location, link, position, hoveredIcons, setHover } = $props();

</script>

<div
	class={"absolute " + position}
	tabindex="0"
	role="button"
	onmouseenter={() => setHover(id, true)}
	onmouseleave={() => setHover(id, false)}
>
	<span class="mdi--map-marker-radius text-3xl"></span>

	{#if hoveredIcons.has(id)}
		<Hover text={text} location={location} link={link} isHovered="true" />
	{/if}
</div> -->
