<script lang="ts">
	import BiodataKerajaan from '$lib/item/BiodataKerajaan.svelte';
	import jd from '../../../asset/profile/jdpp.jpg';

	let { data } = $props()
	console.log("Data " , data)
	console.log("Data kerajaan : ", data.id_kerajaan)
</script>

<div class="flex w-full flex-col gap-4 px-6 py-4">
	<div class="flex flex-col justify-center gap-4 md:flex-row md:justify-between md:gap-0">
		<div class="my-3 flex justify-center md:justify-start">
			<p class="text-[36px] font-[700]">Biodata Kerajaan</p>
		</div>
	</div>
	<div class="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			<BiodataKerajaan 
				href={`biodata/${data.id_kerajaan}`} 
				data={data}
			></BiodataKerajaan>
	</div>
</div>
