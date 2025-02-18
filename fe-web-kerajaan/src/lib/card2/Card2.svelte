<script lang="ts">
	import { page } from '$app/state';

	let { situs, header, isi, icon, id } = $props();

	$inspect('test');
	$inspect(page);
</script>

<div class="h-full max-w-sm overflow-hidden rounded bg-white shadow-lg">
	<div class="w-full">
		<img
			class=" mx-auto mt-3 h-full w-[300px] border-2 border-black p-1"
			src={situs}
			alt="awawwa"
		/>
	</div>
	<div class="relative px-6 py-4">
		<h1 class="text-nowrap text-2xl">{header}</h1>
		<div class="flex flex-col">
			<p class="multiline-ellipsis mb-5 mt-5 h-[100px] text-sm text-gray-700">
				{isi}
			</p>
			<div class="flex h-fit w-full justify-center lg:justify-end">
				{#if icon == 'tempatIstirahat'}
					<span class="flex h-10 w-10 items-center justify-center rounded-full bg-red-400 p-2">
						<i class="material-symbols--bed-outline-rounded text-lg text-white"></i>
					</span>
				{:else if icon == 'air'}
					<span class="flex h-10 w-10 items-center justify-center rounded-full bg-red-400 p-2">
						<i class="mingcute--wave-fill text-lg text-white"></i>
					</span>
				{:else if icon == 'tempatBersejarah'}
					<span class="flex h-10 w-10 items-center justify-center rounded-full bg-red-400 p-2">
						<i class="material-symbols--castle text-lg text-white"></i>
					</span>
				{/if}

				{#if id != 0}
					{#if page.route.id == '/situs'}
						<a
							href="/situs/{id}"
							class="my-2 ml-auto flex items-center gap-2 rounded-full border-2 px-2 py-1 text-blue-500"
						>
							Selanjutnya
							<span class="fluent--arrow-right-12-filled"></span>
						</a>
					{:else if page.route.id == '/acara'}
						<a
							href="/acara/{id}"
							class="my-2 ml-auto flex items-center gap-2 rounded-full border-2 px-2 py-1 text-blue-500"
						>
							Selanjutnya
							<span class="fluent--arrow-right-12-filled"></span>
						</a>
					{:else if page.route.id == '/kelompok'}
					<a
						href="/kelompok/{id}"
						class="my-2 ml-auto flex items-center gap-2 rounded-full border-2 px-2 py-1 text-blue-500"
					>
						Selanjutnya
						<span class="fluent--arrow-right-12-filled"></span>
					</a>
				{/if}

				{:else if id == 0}
					<a
						href="/"
						class="my-2 ml-auto flex items-center gap-2 rounded-full border-2 px-2 py-1 text-blue-500"
					>
						Selanjutnya
						<span class="fluent--arrow-right-12-filled"></span>
					</a>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.multiline-ellipsis {
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 5; /* Ganti 3 dengan jumlah baris yang diinginkan */
	}

	.fluent--arrow-right-12-filled {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath fill='%23007dff' d='M1.5 6a.75.75 0 0 1 .75-.75h5.94L6.22 3.28a.75.75 0 0 1 1.06-1.06l3.25 3.25a.75.75 0 0 1 0 1.06L7.28 9.78a.75.75 0 0 1-1.06-1.06l1.97-1.97H2.25A.75.75 0 0 1 1.5 6'/%3E%3C/svg%3E");
	}

	.material-symbols--castle {
		display: inline-block;
		width: 16px;
		height: 16px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23fff' d='M1 21V9h2v2h2V3h2v2h2V3h2v2h2V3h2v2h2V3h2v8h2V9h2v12h-9v-3q0-.825-.587-1.412T12 16t-1.412.588T10 18v3zm8-9h2V9H9zm4 0h2V9h-2z'/%3E%3C/svg%3E");
	}

	.mingcute--wave-fill {
		display: inline-block;
		width: 16px;
		height: 16px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cg fill='none'%3E%3Cpath d='m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z'/%3E%3Cpath fill='%23fff' d='M18.147 6.733a10.6 10.6 0 0 0-5.244.528l-.346.132a13.6 13.6 0 0 1-7.16.84c-1.038-.16-2.12-.418-3.068-.891a1.5 1.5 0 0 1 1.202-2.745l.132.058c.682.32 1.45.499 2.19.613c1.344.206 3.183.22 5.244-.529l.346-.132a13.6 13.6 0 0 1 7.16-.84c1.038.16 2.119.419 3.066.89a1.514 1.514 0 0 1 .672 2.014c-.369.738-1.122.907-2.005.674l-2.19-.612Zm0 6a10.6 10.6 0 0 0-5.244.528l-.346.132a13.6 13.6 0 0 1-7.16.84c-1.038-.16-2.12-.418-3.068-.891a1.5 1.5 0 0 1 1.202-2.745l.132.058c.682.32 1.45.499 2.19.613c1.344.206 3.183.22 5.244-.529l.346-.132a13.6 13.6 0 0 1 7.16-.84c1.038.16 2.119.419 3.066.89a1.514 1.514 0 0 1 .672 2.014c-.369.739-1.122.907-2.005.674l-2.19-.612Zm-5.954 6.8l.364-.14a10.6 10.6 0 0 1 5.59-.66l2.19.612c.882.233 1.635.065 2.005-.674a1.514 1.514 0 0 0-.673-2.013c-.947-.472-2.028-.73-3.066-.89a13.6 13.6 0 0 0-6.797.7l-.363.14c-2.202.88-4.172.878-5.59.66c-.634-.098-1.29-.243-1.893-.484l-.297-.13a1.5 1.5 0 0 0-1.334 2.688c.947.473 2.03.731 3.068.89c1.752.27 4.143.28 6.796-.7Z'/%3E%3C/g%3E%3C/svg%3E");
	}

	.material-symbols--bed-outline-rounded {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23fff' d='M2 18v-5q0-.675.275-1.225T3 10.8V8q0-1.25.875-2.125T6 5h4q.575 0 1.075.213T12 5.8q.425-.375.925-.587T14 5h4q1.25 0 2.125.875T21 8v2.8q.45.425.725.975T22 13v5q0 .425-.288.713T21 19t-.712-.288T20 18v-1H4v1q0 .425-.288.713T3 19t-.712-.288T2 18m11-8h6V8q0-.425-.288-.712T18 7h-4q-.425 0-.712.288T13 8zm-8 0h6V8q0-.425-.288-.712T10 7H6q-.425 0-.712.288T5 8zm-1 5h16v-2q0-.425-.288-.712T19 12H5q-.425 0-.712.288T4 13zm16 0H4z'/%3E%3C/svg%3E");
	}
</style>
