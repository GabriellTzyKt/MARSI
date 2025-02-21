<script lang="ts">
    let {id = 0} = $props();
</script>

<div
	class="lg:grid-cols-15 mt-5 grid h-fit w-fit grid-cols-5 gap-2 rounded-lg border-2 border-gray-100 bg-gray-300 px-2"
>
	<p class="col-span-1 ml-2 flex h-full items-center">{id}</p>
	<div class="col-span-5 mt-5 lg:mb-5">
		<div class="flex flex-col">
			<div class="relative flex items-center">
				<input
					type="text"
					class="h-10 w-full rounded-lg border-2 border-gray-200 px-2 pr-7"
					placeholder="Nama Kunjungan"
				/>
				<span class="line-md--pencil absolute right-2"></span>
			</div>
			<div class="relative mt-5 flex items-center">
				<input
					type="text"
					class="py-8.5 lg:py-9.5 h-10 w-full rounded-lg border-2 border-gray-200 px-2 pr-7"
					placeholder="Keterangan kunjungan"
				/>
				<span class="line-md--pencil absolute right-2"></span>
			</div>
		</div>
	</div>

	<div class="col-span-7 mb-5 mt-5">
		<div class="flex flex-col">
			<div class="grid grid-cols-7 gap-2">
				<div class="relative col-span-4 flex items-center">
					<input
						type="text"
						class="h-10 w-full rounded-lg border-2 border-gray-200 px-2 pr-7"
						placeholder="No Telepon"
					/>
					<span class="line-md--pencil absolute right-2"></span>
				</div>
				<div class="relative col-span-3 flex items-center">
					<input
						type="text"
						class="h-10 w-full rounded-lg border-2 border-gray-200 px-2 pr-7"
						placeholder="Kota asal"
					/>
					<span class="line-md--pencil absolute right-2"></span>
				</div>
			</div>

			<!-- Radio Button -->
			<div class="mt-5 flex items-center">
				<p class="mb-2 text-nowrap text-sm lg:mt-3">Menemui Seseorang?</p>
				<div class="mb-2 flex items-center lg:mb-0">
					<div class="mx-2 flex items-center justify-center">
						<input
							id="default-radio-1"
							type="radio"
							value=""
							name="default-radio"
							class="h-3 w-3 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
						/>
						<label for="default-radio-1" class="ms-2 text-sm font-medium text-gray-900">Ya</label>
					</div>
					<div class="flex items-center justify-center">
						<input
							checked
							id="default-radio-2"
							type="radio"
							value=""
							name="default-radio"
							class="h-3 w-3 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
						/>
						<label for="default-radio-2" class="ms-2 text-sm font-medium text-black">Tidak</label>
					</div>
				</div>
			</div>

			<!-- Grid untuk input field -->
			<div class="grid grid-cols-1 gap-2 lg:grid-cols-7">
				<div class="relative flex items-center lg:col-span-4">
					<input
						type="text"
						class="h-10 w-full rounded-lg border-2 border-gray-200 px-2 pr-7"
						placeholder="Orang Yang Ingin Ditemui"
					/>
					<span class="line-md--pencil absolute right-2"></span>
				</div>

				<div class="relative flex items-center lg:col-span-3">
					<input
						type="text"
						class="h-10 w-full rounded-lg border-2 border-gray-200 px-2 pr-7"
						placeholder="Tujuan Kunjungan"
					/>
					<span class="line-md--pencil absolute right-2"></span>
				</div>
			</div>
		</div>
	</div>

	<div class="col-span-6 mx-auto mb-5 flex h-full items-center lg:col-span-1">
		<span class="flex h-10 w-10 items-center justify-center rounded-lg bg-red-400 p-2">
			<i class="gg--trash z-10 items-center text-2xl text-white"></i>
		</span>
	</div>
</div>

<style>
	.gg--trash {
		display: inline-block;
		width: 48px;
		height: 48px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cg fill='%23fff6f6'%3E%3Cpath fill-rule='evenodd' d='M17 5V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v1H4a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V7h1a1 1 0 1 0 0-2zm-2-1H9v1h6zm2 3H7v11a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1z' clip-rule='evenodd'/%3E%3Cpath d='M9 9h2v8H9zm4 0h2v8h-2z'/%3E%3C/g%3E%3C/svg%3E");
	}

	.line-md--pencil {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cg fill='none' stroke='%23101010' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'%3E%3Cpath stroke-dasharray='56' stroke-dashoffset='56' d='M3 21l2 -6l11 -11c1 -1 3 -1 4 0c1 1 1 3 0 4l-11 11l-6 2'%3E%3Canimate fill='freeze' attributeName='stroke-dashoffset' dur='0.6s' values='56;0'/%3E%3C/path%3E%3Cpath stroke-dasharray='8' stroke-dashoffset='8' d='M15 5l4 4'%3E%3Canimate fill='freeze' attributeName='stroke-dashoffset' begin='0.6s' dur='0.2s' values='8;0'/%3E%3C/path%3E%3Cpath stroke-dasharray='6' stroke-dashoffset='6' stroke-width='1' d='M6 15l3 3'%3E%3Canimate fill='freeze' attributeName='stroke-dashoffset' begin='0.6s' dur='0.2s' values='6;0'/%3E%3C/path%3E%3C/g%3E%3C/svg%3E");
	}
</style>
