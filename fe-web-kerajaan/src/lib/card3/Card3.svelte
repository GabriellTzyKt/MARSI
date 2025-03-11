<script lang="ts">
	let { gambar, header } = $props();
</script>

<div class="h-full max-full overflow-hidden rounded bg-white shadow-lg">
	<div class="w-full">
		<img
			class=" mx-auto mt-3 h-full w-[300px] border-2 border-black p-1"
			src={gambar}
			alt="awawwa"
		/>
	</div>
	<div class="px-6 py-4 text-center">
		<h1 class="text-2xl">{header}</h1>
		<div class="flex flex-col">
			<div class="flex h-fit w-full justify-center lg:justify-end mt-5">
				<a
					href="/"
					class="my-2 flex items-center gap-2 rounded-full border-2 px-2 py-1 text-blue-500"
				>
					Selanjutnya
					<span class="fluent--arrow-right-12-filled"></span>
				</a>
			</div>
		</div>
	</div>
</div>

<style>
	.fluent--arrow-right-12-filled {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath fill='%23007dff' d='M1.5 6a.75.75 0 0 1 .75-.75h5.94L6.22 3.28a.75.75 0 0 1 1.06-1.06l3.25 3.25a.75.75 0 0 1 0 1.06L7.28 9.78a.75.75 0 0 1-1.06-1.06l1.97-1.97H2.25A.75.75 0 0 1 1.5 6'/%3E%3C/svg%3E");
	}
</style>
