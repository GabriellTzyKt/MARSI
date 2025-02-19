<script lang="ts">
	import { page } from '$app/state';

	let { type, value } = $props();
</script>

{#if page.route.id === '/profile'}
	<input
		{type}
		name=""
		class="w-full rounded-lg border border-gray-500 bg-white py-2 ps-2 text-gray-500 focus:outline-none"
		id=""
		{value}
		readonly
	/>
{:else}
	<input
		{type}
		name=""
		class="w-full rounded-lg border border-gray-500 bg-white py-2 ps-2 text-gray-500 focus:outline-none"
		id=""
		{value}
	/>
{/if}
