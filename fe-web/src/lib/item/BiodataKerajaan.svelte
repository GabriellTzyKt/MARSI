<script lang="ts">
	import temp from '../../asset/gambarTemp.jpg';

	let { href, data } = $props();
	console.log('Data : ', data);
    let dataambil = data?.dataKerajaan && data.dataKerajaan.length > 0 ? data.dataKerajaan[0] : {};
</script>

<a {href}>
	<div
		class="flex w-full items-center justify-between gap-2 rounded-md border border-[#76768033] bg-white p-4 shadow-xl"
	>
		<div class="flex items-center justify-center">
			{#if dataambil.imageUrl != ''}
				<img src={dataambil.imageUrl} class="h-[60px] w-[60px] rounded-full" alt="" />
			{:else}
				<img src={temp} class="h-[60px] w-[60px] rounded-full" alt="" />
			{/if}
		</div>
		<div class="flex grow flex-col justify-start gap-2">
			<div class="flex">
				<p class="text-lg">{dataambil.nama_kerajaan}</p>
			</div>
			<div class="flex items-center justify-start gap-1">
				<div>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
						><path
							fill="currentColor"
							d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7M7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.92 16.21 7 11.85 7 9"
						/><circle cx="12" cy="9" r="2.5" fill="currentColor" /></svg
					>
				</div>
				<div class="flex">
					<p>{dataambil.place_name}</p>
				</div>
			</div>
		</div>
		<div class="flex items-center justify-between">
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
				><path fill="currentColor" d="M6.23 20.23L8 22l10-10L8 2L6.23 3.77L14.46 12z" /></svg
			>
		</div>
	</div>
</a>
