<script lang="ts">
	let { judul, lokasi, gambar, linkTo } = $props();
</script>

<div class=" w-xl flex h-auto flex-col justify-center rounded shadow-lg">
	<img class="h-64 w-full object-cover text-center" src={gambar} alt="Sunset in the mountains" />
	<div class="mx-6 py-4">
		<div class="mb-2 text-xl font-bold">{judul}</div>
		<div class="flex justify-between">
			<div class="flex items-center">
				<span class="bx--map"></span>
				<p class="text-base text-gray-700">{lokasi}</p>
			</div>
			<a href={linkTo} class="flex text-center text-blue-600">
				Selanjutnya <span class="formkit--arrowright justify-center self-center"></span>
			</a>
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
		margin-top: 3px;
		display: inline-block;
		width: 30px;
		height: 15px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Cpath fill='%230E8FEB' d='M12.5 5h-9c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h9c.28 0 .5.22.5.5s-.22.5-.5.5'/%3E%3Cpath fill='%230E8FEB' d='M10 8.5a.47.47 0 0 1-.35-.15c-.2-.2-.2-.51 0-.71l3.15-3.15l-3.15-3.15c-.2-.2-.2-.51 0-.71s.51-.2.71 0l3.5 3.5c.2.2.2.51 0 .71l-3.5 3.5c-.1.1-.23.15-.35.15Z'/%3E%3C/svg%3E");
	}
</style>
