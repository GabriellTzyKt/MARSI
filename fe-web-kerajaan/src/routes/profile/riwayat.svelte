<div class=" flex flex-col pb-4">
	<div class="rounded-md border p-2">
		<!-- Riwayat Acara -->
		<div class="border-badran-bt flex flex-col rounded-md border px-4 py-2">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-badran-bt ms-2 text-xl font-[500]">Riwayat Acara</p>
				</div>
				<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
					<!-- cari -->
					<div class=" mx-2 flex items-center rounded-lg border px-2">
						<input
							type="text"
							placeholder="Cari.."
							class=" w-full bg-transparent px-2 py-2 focus:outline-none"
						/>

						<!-- svelte-ignore a11y_consider_explicit_label -->
						<button class="text-gray-600 hover:text-gray-800">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-6"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
								/>
							</svg>
						</button>
					</div>
					<!-- Dropdown -->
					<div class="flex w-full items-center rounded-lg border px-3 py-1">
						<select
							name="Keterangan"
							id=""
							value="Keterangan"
							class="w-full bg-transparent p-2 focus:outline-none"
						>
							<option value="Keterangan">Keterangan</option>
							<option value="Sekarang">Sekarang</option>
							<option value="Bulan Lalu">Bulan Lalu</option>
							<option value="Minggu Ini">Minggu Ini</option>
						</select>
					</div>
				</div>
			</div>
			<div class=" mt-4 h-64 w-auto overflow-y-auto rounded-lg">
				{#each events as e}
					<Items {...e}></Items>
				{/each}
			</div>
		</div>

		<!-- Organisasi -->
		<div class="border-badran-bt mt-6 flex flex-col rounded-md border px-4 py-2">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-badran-bt ms-2 text-xl font-[500]">Organisasi</p>
				</div>
				<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
					<!-- cari -->
					<!-- cari -->
					<div class=" mx-2 flex items-center rounded-lg border px-2">
						<input
							type="text"
							placeholder="Cari.."
							class=" w-full bg-transparent px-2 py-2 focus:outline-none"
						/>

						<!-- svelte-ignore a11y_consider_explicit_label -->
						<button class="text-gray-600 hover:text-gray-800">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-6"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
								/>
							</svg>
						</button>
					</div>
					<!-- Dropdown -->
					<div class="flex w-full items-center rounded-lg border px-3 py-1">
						<select
							name="Keterangan"
							id=""
							value="Keterangan"
							class="w-full bg-transparent p-2 focus:outline-none"
						>
							<option value="Keterangan">Keterangan</option>
							<option value="Sekarang">Sekarang</option>
							<option value="Bulan Lalu">Bulan Lalu</option>
							<option value="Minggu Ini">Minggu Ini</option>
						</select>
					</div>
				</div>
			</div>
			<div class=" mt-4 h-64 w-auto overflow-y-auto rounded-lg">
				{#each events as e}
					<Items {...e}></Items>
				{/each}
			</div>
		</div>

		<!-- Komunitas -->
		<div class="border-badran-bt mt-6 flex flex-col rounded-md border px-4 py-2">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-badran-bt ms-2 text-xl font-[500]">Komunitas</p>
				</div>
				<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
					<!-- cari -->
					<div class=" mx-2 flex items-center rounded-lg border px-2">
						<input
							type="text"
							placeholder="Cari.."
							class=" w-full bg-transparent px-2 py-2 focus:outline-none"
						/>

						<!-- svelte-ignore a11y_consider_explicit_label -->
						<button class="text-gray-600 hover:text-gray-800">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-6"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
								/>
							</svg>
						</button>
					</div>
					<!-- Dropdown -->
					<div class="flex w-full items-center rounded-lg border px-3 py-1">
						<select
							name="Keterangan"
							id=""
							value="Keterangan"
							class="w-full bg-transparent p-2 focus:outline-none"
						>
							<option value="Keterangan">Keterangan</option>
							<option value="Sekarang">Sekarang</option>
							<option value="Bulan Lalu">Bulan Lalu</option>
							<option value="Minggu Ini">Minggu Ini</option>
						</select>
					</div>
				</div>
			</div>
			<div class=" mt-4 h-64 w-auto overflow-y-auto rounded-lg">
				{#each events as e}
					<Items {...e}></Items>
				{/each}
			</div>
		</div>
	</div>
</div>
