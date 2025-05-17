<script lang="ts">
	import BiodataKerajaan from '$lib/item/BiodataKerajaan.svelte';
	import jd from '../../../asset/profile/jdpp.jpg';

	let { data } = $props()
	let dataKerajaan : any = data.dataKerajaan
	console.log("Data kerajaan : ", dataKerajaan)
</script>

<div class="flex w-full flex-col gap-4 px-6 py-4">
	<div class="flex flex-col justify-center gap-4 md:flex-row md:justify-between md:gap-0">
		<div class="my-3 flex justify-center md:justify-start">
			<p class="text-[36px] font-[700]">Biodata Kerajaan</p>
		</div>
		<div class="flex flex-row items-center justify-center gap-2">
			<div>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
					><path
						fill="currentColor"
						d="M7 6h10l-5.01 6.3zm-2.75-.39C6.27 8.2 10 13 10 13v6c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-6s3.72-4.8 5.74-7.39A.998.998 0 0 0 18.95 4H5.04c-.83 0-1.3.95-.79 1.61"
					/></svg
				>
			</div>
			<div>
				<p class="text-lg">Filtered By:</p>
			</div>
			<div class="flex max-w-[300px] items-center justify-center">
				<select name="None" class="w-40 rounded-lg py-2 text-center focus:outline-none" id="">
					<option value="None">None</option>
					<option value="Kerajaan">Kerajaan</option>
					<option value="MARSI">MARSI</option>
				</select>
			</div>
		</div>
	</div>
	<div class="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each dataKerajaan as kerajaan, i}
			<BiodataKerajaan 
				href="biodata/{kerajaan.id_kerajaan}" 
				data={kerajaan}
			></BiodataKerajaan>
		{/each}
	</div>
</div>
