<script lang="ts">
	let { gambar, kerajaan, judul, lokasi, isi } = $props();
</script>

<div class="perspective group h-[420px] w-[300px] cursor-pointer rounded-full bg-transparent">
	<div class="preserve-3d group-hover:my-rotate-y-180 relative h-full w-full duration-1000">
		<div class="backface-hidden absolute h-full w-full">
			<div
				class="text-md absolute bottom-0 flex h-fit w-full flex-col rounded-full p-2 font-semibold text-white"
			>
				<p class="inline-flex w-full items-center text-sm">
					{kerajaan}
					<span class="fluent--arrow-circle-up-right-16-regular ml-auto mr-5"></span>
				</p>

				<p class="inline-flex items-center gap-2">
					<span class="bxs--map"></span>
					{lokasi}
				</p>
			</div>
			<img src={gambar} alt="duar" class="h-full w-full" />
		</div>

		<div
			class="my-rotate-y-180 backface-hidden absolute flex h-full w-full flex-col items-center justify-center bg-gray-100 px-2 text-center text-red-600"
		>
			<h1 class="text-2xl font-semibold">{judul}</h1>
			<p class="my-2 text-lg">10.0 Rating</p>
			<p class="line-clamp-4 w-full max-w-[240px] overflow-hidden text-ellipsis">
				{isi}
			</p>
			<button
				class="absolute -bottom-20 mt-20 scale-0 rounded-full bg-teal-500
            px-6 py-2 font-semibold text-white delay-500 duration-1000 group-hover:bottom-10 group-hover:scale-125"
			>
				Detail?
			</button>
		</div>
	</div>
</div>

<style>
	.fluent--arrow-circle-up-right-16-regular {
		display: inline-block;
		width: 24px;
		height: 24px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%23ffa807' d='M2 8a6 6 0 1 1 12 0A6 6 0 0 1 2 8m6-7a7 7 0 1 0 0 14A7 7 0 0 0 8 1m3 4.5a.5.5 0 0 0-.5-.5H6a.5.5 0 0 0 0 1h3.293L5.646 9.646a.5.5 0 0 0 .708.708L10 6.707V10a.5.5 0 0 0 1 0z'/%3E%3C/svg%3E");
	}
	.bxs--map {
		display: inline-block;
		width: 12px;
		height: 12px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23faf8f5' d='M12 2C7.589 2 4 5.589 4 9.995C3.971 16.44 11.696 21.784 12 22c0 0 8.029-5.56 8-12c0-4.411-3.589-8-8-8m0 12c-2.21 0-4-1.79-4-4s1.79-4 4-4s4 1.79 4 4s-1.79 4-4 4'/%3E%3C/svg%3E");
	}
</style>
