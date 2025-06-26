<script lang="ts">
	import { dummydata } from '$lib/dummy';

	let { keyword = $bindable(), data = $bindable() } = $props();

	function filter() {
		if (keyword !== '') {
			data = dummydata.filter((d) => {
				d.nama.toLowerCase().includes(keyword.toLowerCase().trim()) ||
					d.email.toLowerCase().includes(keyword.toLowerCase().trim()) ||
					d.telepon.toLowerCase().includes(keyword.toLowerCase().trim());
			});
		} else {
			data = dummydata;
		}
	}
</script>

<input
	type="text"
	name=""
	id=""
	placeholder="search.."
	bind:value={keyword}
	class="rounded-md shadow-inner"
	onchange={() => filter()}
/>
