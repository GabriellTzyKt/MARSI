<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	$inspect(page);

	let path: string = $state('');
	onMount(() => {
		// Mengatur path berdasarkan route id
		if (page.route.id === '/umum/daftarsitus') {
			path = '/umum/daftarsitus';
		} else if (page.route.id === '/umum/daftarkerajaan') {
			path = '/umum/daftarkerajaan';
		} else if (page.route.id === '/umum/daftaraset') {
			path = '/umum/daftaraset';
		} else if (page.route.id === '/umum/daftaracara') {
			path = '/umum/daftaracara';
		}
	});

	let { judul, lokasi, gambar, id, tahun = null } = $props();
	console.log("Gamar : ", gambar)
</script>

<div class="grid grid-cols-1 gap-6">
	<div class="w-xl flex h-full min-h-[350px] flex-col justify-between rounded shadow-lg">
		{#if gambar[0]}
			<img
				class="h-64 w-full object-cover text-center"
				src={gambar || gambar[0]}
				alt="Sunset in the mountains"
			/>
		{:else}
			<div class="h-64 w-full object-cover text-center">
				<p class="text-gray-600">No Images</p>
			</div>
		{/if}
		<div class="mx-6 flex flex-grow flex-col py-4">
			<div
				class="mb-2 overflow-hidden text-ellipsis whitespace-nowrap text-xl font-bold"
				title={judul}
			>
				{judul} ({tahun})
			</div>
			<div class="flex flex-grow flex-col lg:flex-row lg:justify-between">
				<div class="flex items-center">
					<span class="bx--map mr-3"></span>
					<input
						type="text"
						readonly
						maxlength="30"
						value={lokasi}
						title={lokasi}
						class="no-border w-full cursor-default text-ellipsis bg-transparent text-base text-gray-700 focus:outline-none focus:ring-0"
					/>
				</div>
				<a href="{path}/{id}" class="mt-3 flex items-center text-blue-600 lg:mt-0">
					<span class="align-middle">Selanjutnya</span>
					<span class="formkit--arrowright ml-1 mt-1 self-center"></span>
				</a>
			</div>
		</div>
	</div>
</div>

<style>
	.bx--map {
		display: inline-block;
		width: 20px;
		height: 20px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23131313' d='M12 14c2.206 0 4-1.794 4-4s-1.794-4-4-4s-4 1.794-4 4s1.794 4 4 4m0-6c1.103 0 2 .897 2 2s-.897 2-2 2s-2-.897-2-2s.897-2 2-2'/%3E%3Cpath fill='%23131313' d='M11.42 21.814a1 1 0 0 0 1.16 0C12.884 21.599 20.029 16.44 20 10c0-4.411-3.589-8-8-8S4 5.589 4 9.995c-.029 6.445 7.116 11.604 7.42 11.819M12 4c3.309 0 6 2.691 6 6.005c.021 4.438-4.388 8.423-6 9.73c-1.611-1.308-6.021-5.294-6-9.735c0-3.309 2.691-6 6-6'/%3E%3C/svg%3E");
	}

	.formkit--arrowright {
		display: inline-block;
		width: 20px;
		height: 20px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-position: center;
		vertical-align: middle;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Cpath fill='%230E8FEB' d='M12.5 5h-9c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h9c.28 0 .5.22.5.5s-.22.5-.5.5'/%3E%3Cpath fill='%230E8FEB' d='M10 8.5a.47.47 0 0 1-.35-.15c-.2-.2-.2-.51 0-.71l3.15-3.15l-3.15-3.15c-.2-.2-.2-.51 0-.71s.51-.2.71 0l3.5 3.5c.2.2.2.51 0 .71l-3.5 3.5c-.1.1-.23.15-.35.15Z'/%3E%3C/svg%3E");
	}

	/* Menghilangkan border pada input */
	.no-border {
		border: none;
		border-width: 0;
		outline: none;
		box-shadow: none;
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
	}

	/* Menghilangkan border saat focus */
	.no-border:focus {
		border: none;
		border-width: 0;
		outline: none;
		box-shadow: none;
	}

	/* Menghilangkan background autofill */
	input:-webkit-autofill,
	input:-webkit-autofill:hover,
	input:-webkit-autofill:focus {
		-webkit-box-shadow: 0 0 0px 1000px white inset;
		transition: background-color 5000s ease-in-out 0s;
	}
</style>
