<script lang="ts">
	import { page } from '$app/state';
	import badran from '$lib/assets/icon/badran.png';
	// let halo: string = "jjj"
</script>

<nav class=" bg-color-badran w-screen left-0 top-0 z-10 py-2 text-white overflow-hidden">
	<div class=" grid grid-cols-2">
		<div class="ms-4 flex justify-start">
			<img src={badran} class="h-12 w-auto" alt="" />
		</div>
		<div class="mb-2 me-4 mt-2 flex items-center justify-end">
			<div class="text-center">
				{#if page.route.id === '/login'}
					<a href="/signup" class=" rounded-lg px-3 py-2 text-yellow-400 hover:bg-gray-400"
						>Daftar</a
					>
				{:else}
					<a href="/login" class=" rounded-lg px-3 py-2 text-yellow-400 hover:bg-gray-400">Masuk</a>
				{/if}
			</div>
		</div>
	</div>
</nav>
