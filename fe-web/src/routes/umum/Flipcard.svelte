<script lang="ts">
	let { gambar, kerajaan, judul, lokasi, isi } = $props();

	import { onMount } from 'svelte';

	onMount(() => {
		document.querySelectorAll('.flip-button').forEach((button) => {
			const lastSpan = button.querySelector('span:last-child') as HTMLElement | null;
			const firstSpan = button.querySelector('span:first-child') as HTMLElement | null;
			const icon = button.querySelector('i') as HTMLElement | null;

			if (lastSpan && firstSpan && icon) {
				lastSpan.addEventListener('mouseenter', () => {
					firstSpan.style.color = 'white';
				});

				lastSpan.addEventListener('mouseleave', () => {
					firstSpan.style.color = '';
				});

				icon.addEventListener('mouseenter', () => {
					icon.style.backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='%23000000' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M4 12h16m0 0l-6-6m6 6l-6 6'/%3E%3C/svg%3E")`;
				});

				icon.addEventListener('mouseleave', () => {
					icon.style.backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='%23ff7700' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M4 12h16m0 0l-6-6m6 6l-6 6'/%3E%3C/svg%3E")`;
				});
			}
		});
	});
</script>

<div class="perspective group h-[520px] w-[360px] cursor-pointer rounded-full bg-transparent">
	<div
		class="preserve-3d group-hover:my-rotate-y-180 relative h-full w-full rounded-full duration-1000"
	>
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
			class="my-rotate-y-180 backface-hidden absolute flex h-full w-full flex-col rounded-lg bg-gray-100 p-8 text-red-600"
		>
			<div class="flex flex-col">
				<h1 class="text-start text-xl font-semibold">{judul}</h1>
				<p class="line-clamp-7 text-md w-full max-w-[340px] overflow-hidden text-ellipsis">
					{isi}
				</p>
				<div class="flex w-full justify-center lg:justify-end">
					<a
						href="/"
						class="flip-button relative my-2 flex items-center gap-2 overflow-hidden rounded-full px-5 py-3 text-orange-500 transition-all duration-500"
					>
						<span class="relative z-10 pr-5 transition-colors duration-500"> Selengkapnya </span>
						<span
							class="absolute right-0 flex h-7 w-7 items-center justify-end rounded-full border-2 border-orange-400 px-1 pt-0.5 transition-all duration-500 ease-in-out hover:h-full hover:w-full hover:bg-orange-400"
						>
							<i
								class="solar--arrow-right-linear right-1 text-2xl text-orange-400 transition-colors duration-500 hover:text-white"
							></i>
						</span>
					</a>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	/* Default icon */
	.solar--arrow-right-linear {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='%23dc7e00' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M4 12h16m0 0l-6-6m6 6l-6 6'/%3E%3C/svg%3E");
		transition: background-image 0.3s ease-in-out;
	}

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
