<script lang="ts">
	import '../../app.css';
    import { page } from '$app/state';
	import Navbar from './nav/Navbar.svelte';
	let { children } = $props();
</script>

<div>
    <Navbar></Navbar>
</div>
<div>
    {@render children()}    
</div>
