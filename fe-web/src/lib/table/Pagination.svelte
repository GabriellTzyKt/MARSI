<script lang="ts">
	let { value = $bindable() } = $props();
	
</script>

<input
	type="number"
	name=""
	id=""
	bind:value
	min="1"
	class="flex w-16 rounded-md text-center shadow-inner"
/>
