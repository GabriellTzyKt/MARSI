<!-- Buat Request Aplikasi ( jadiin component kalo mau ) -->
<div class="w-full px-5">
	{#if berhasil === 'ayaya2'}
		<div class="mt-4 w-full">
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="flex w-full cursor-pointer items-center justify-between rounded-t-lg border bg-gray-100 px-4 py-3"
			>
				<p class="font-medium">Request Aplikasi</p>
				<span class="basil--cross-outline"></span>
			</div>
			<div
				class="rounded-b-lg border-x border-b bg-white p-4 transition-all duration-300 ease-in-out"
			>
				<!-- Website Kerajaan Section -->
				<div class="mb-6">
					<div class="mb-2 grid grid-cols-12">
						<h3 class="col-span-8 text-lg font-semibold">Website Kerajaan</h3>
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div
							class="col-span-2 cursor-pointer border-r border-gray-300 text-center font-medium"
							class:active={showWebsiteFeatures}
							onclick={() => (showWebsiteFeatures = true)}
						>
							Ya
						</div>
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div
							class="col-span-2 cursor-pointer text-center font-medium"
							class:active={!showWebsiteFeatures}
							onclick={() => (showWebsiteFeatures = false)}
						>
							Tidak
						</div>
					</div>

					{#if showWebsiteFeatures}
						<div class="border-t border-gray-200 pt-2">
							<!-- Fitur Situs -->
							<div class="grid grid-cols-12 py-2">
								<div class="col-span-8">Fitur Situs</div>
								<div class="col-span-2 flex justify-center border-r border-gray-300">
									<span class="text-customOrange2 text-xl">✓</span>
								</div>
								<div class="col-span-2"></div>
							</div>

							<!-- Fitur Acara -->
							<div class="grid grid-cols-12 py-2">
								<div class="col-span-8">Fitur Acara</div>
								<div class="col-span-2 flex justify-center border-r border-gray-300">
									<span class="text-customOrange2 text-xl">✓</span>
								</div>
								<div class="col-span-2"></div>
							</div>

							<!-- Fitur Aset -->
							<div class="grid grid-cols-12 py-2">
								<div class="col-span-8">Fitur Aset</div>
								<div class="col-span-2 border-r border-gray-300"></div>
								<div class="col-span-2 flex justify-center">
									<span class="text-customOrange2 text-xl">✓</span>
								</div>
							</div>

							<!-- Fitur Komunitas -->
							<div class="grid grid-cols-12 py-2">
								<div class="col-span-8">Fitur Komunitas</div>
								<div class="col-span-2 flex justify-center">
									<span class="text-customOrange2 text-xl">✓</span>
								</div>
								<div class="col-span-2 border-l border-gray-300"></div>
							</div>

							<!-- Fitur Organisasi -->
							<div class="grid grid-cols-12 py-2">
								<div class="col-span-8">Fitur Organisasi</div>
								<div class="col-span-2 flex justify-center border-r border-gray-300">
									<span class="text-customOrange2 text-xl">✓</span>
								</div>
								<div class="col-span-2"></div>
							</div>

							<!-- Fitur Tugas -->
							<div class="grid grid-cols-12 py-2">
								<div class="col-span-8">Fitur Tugas</div>
								<div class="col-span-2 border-r border-gray-300"></div>
								<div class="col-span-2 flex justify-center">
									<span class="text-customOrange2 text-xl">✓</span>
								</div>
							</div>
						</div>
					{/if}
				</div>

				<div class="border-t border-gray-300 pt-4">
					<div class="mb-2 grid grid-cols-12">
						<h3 class="col-span-8 text-lg font-semibold">Aplikasi Mobile Kerajaan</h3>
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div
							class="col-span-2 cursor-pointer border-r border-gray-300 text-center font-medium"
							class:active={showMobileFeatures}
							onclick={() => (showMobileFeatures = true)}
						>
							Ya
						</div>
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div
							class="col-span-2 cursor-pointer text-center font-medium"
							class:active={!showMobileFeatures}
							onclick={() => (showMobileFeatures = false)}
						>
							Tidak
						</div>
					</div>

					{#if showMobileFeatures}
						<div class="border-t border-gray-200 pt-2">
							<!-- Fitur Penanggalan -->
							<div class="grid grid-cols-12 py-2">
								<div class="col-span-8">Fitur Penanggalan</div>
								<div class="col-span-2 flex justify-center">
									<span class="text-customOrange2 text-xl">✓</span>
								</div>
								<div class="col-span-2 border-l border-gray-300"></div>
							</div>

							<!-- Fitur Tugas Pribadi -->
							<div class="grid grid-cols-12 py-2">
								<div class="col-span-8">Fitur Tugas Pribadi</div>
								<div class="col-span-2 flex justify-center">
									<span class="text-customOrange2 text-xl">✓</span>
								</div>
								<div class="col-span-2 border-l border-gray-300"></div>
							</div>

							<!-- Fitur Tugas Acara -->
							<div class="grid grid-cols-12 py-2">
								<div class="col-span-8">Fitur Tugas Acara</div>
								<div class="col-span-2 flex justify-center">
									<span class="text-customOrange2 text-xl">✓</span>
								</div>
								<div class="col-span-2 border-l border-gray-300"></div>
							</div>

							<!-- Fitur Situs Kerajaan -->
							<div class="grid grid-cols-12 py-2">
								<div class="col-span-8">Fitur Situs Kerajaan</div>
								<div class="col-span-2 flex justify-center">
									<span class="text-customOrange2 text-xl">✓</span>
								</div>
								<div class="col-span-2 border-l border-gray-300"></div>
							</div>

							<!-- Fitur Check-In Situs -->
							<div class="grid grid-cols-12 py-2">
								<div class="col-span-8">Fitur Check-In Situs</div>
								<div class="col-span-2 border-r border-gray-300"></div>
								<div class="col-span-2 flex justify-center">
									<span class="text-customOrange2 text-xl">✓</span>
								</div>
							</div>

							<!-- Fitur Acara Kerajaan -->
							<div class="grid grid-cols-12 py-2">
								<div class="col-span-8">Fitur Acara Kerajaan</div>
								<div class="col-span-2 border-r border-gray-300"></div>
								<div class="col-span-2 flex justify-center">
									<span class="text-customOrange2 text-xl">✓</span>
								</div>
							</div>

							<!-- Fitur Group Chat -->
							<div class="grid grid-cols-12 py-2">
								<div class="col-span-8">Fitur Group Chat</div>
								<div class="col-span-2 flex justify-center border-r border-gray-300">
									<span class="text-customOrange2 text-xl">✓</span>
								</div>
								<div class="col-span-2"></div>
							</div>

							<!-- Fitur Forum -->
							<div class="grid grid-cols-12 py-2">
								<div class="col-span-8">Fitur Forum</div>
								<div class="col-span-2 flex justify-center">
									<span class="text-customOrange2 text-xl">✓</span>
								</div>
								<div class="col-span-2 border-l border-gray-300"></div>
							</div>
						</div>
						<div class="h-0.5 w-full bg-gray-400 opacity-40"></div>
					{/if}

					<div class="mt-8 flex w-full justify-end">
						<button
							class="bg-customGold mr-5 w-auto rounded-lg px-12 py-1 text-center text-white"
							type="submit"
						>
							Proses
						</button>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<!-- Buat Detail Request ( Jadiin component kalo mau ) -->
<div class="w-full px-5">
	{#if berhasil === 'ayaya2'}
		<div class="mt-4 w-full">

			<div
				class="flex w-full cursor-pointer items-center justify-between rounded-t-lg border bg-gray-100 px-4 py-3"
			>
				<p class="font-medium">Detail Request</p>
				<span class="basil--cross-outline"></span>
			</div>
			<div
				class="rounded-b-lg border-x border-b bg-white p-4 transition-all duration-300 ease-in-out"
			>
				<!-- Website Kerajaan Section -->
				<div class="mb-6">
					<div class="mb-2 grid grid-cols-12">
						<h3 class="col-span-8 text-lg font-semibold">Website Kerajaan</h3>
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div
							class="col-span-2 cursor-pointer border-r border-gray-300 text-center font-medium"
							class:active={showWebsiteFeatures}
							onclick={() => (showWebsiteFeatures = true)}
						>
							Ya
						</div>
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div
							class="col-span-2 cursor-pointer text-center font-medium"
							class:active={!showWebsiteFeatures}
							onclick={() => (showWebsiteFeatures = false)}
						>
							Tidak
						</div>
					</div>

					{#if showWebsiteFeatures}
						<div class="border-t border-gray-200 pt-2">
							<!-- Fitur Situs -->
							<div class="grid grid-cols-12 py-2">
								<div class="col-span-8">Fitur Situs</div>
								<div class="col-span-2 flex justify-center border-r border-gray-300">
									<span class="text-customOrange2 text-xl">✓</span>
								</div>
								<div class="col-span-2"></div>
							</div>

							<!-- Fitur Acara -->
							<div class="grid grid-cols-12 py-2">
								<div class="col-span-8">Fitur Acara</div>
								<div class="col-span-2 flex justify-center border-r border-gray-300">
									<span class="text-customOrange2 text-xl">✓</span>
								</div>
								<div class="col-span-2"></div>
							</div>

							<!-- Fitur Aset -->
							<div class="grid grid-cols-12 py-2">
								<div class="col-span-8">Fitur Aset</div>
								<div class="col-span-2 border-r border-gray-300"></div>
								<div class="col-span-2 flex justify-center">
									<span class="text-customOrange2 text-xl">✓</span>
								</div>
							</div>

							<!-- Fitur Komunitas -->
							<div class="grid grid-cols-12 py-2">
								<div class="col-span-8">Fitur Komunitas</div>
								<div class="col-span-2 flex justify-center">
									<span class="text-customOrange2 text-xl">✓</span>
								</div>
								<div class="col-span-2 border-l border-gray-300"></div>
							</div>

							<!-- Fitur Organisasi -->
							<div class="grid grid-cols-12 py-2">
								<div class="col-span-8">Fitur Organisasi</div>
								<div class="col-span-2 flex justify-center border-r border-gray-300">
									<span class="text-customOrange2 text-xl">✓</span>
								</div>
								<div class="col-span-2"></div>
							</div>

							<!-- Fitur Tugas -->
							<div class="grid grid-cols-12 py-2">
								<div class="col-span-8">Fitur Tugas</div>
								<div class="col-span-2 border-r border-gray-300"></div>
								<div class="col-span-2 flex justify-center">
									<span class="text-customOrange2 text-xl">✓</span>
								</div>
							</div>
						</div>
					{/if}
				</div>

				<div class="border-t border-gray-300 pt-4">
					<div class="mb-2 grid grid-cols-12">
						<h3 class="col-span-8 text-lg font-semibold">Aplikasi Mobile Kerajaan</h3>
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div
							class="col-span-2 cursor-pointer border-r border-gray-300 text-center font-medium"
							class:active={showMobileFeatures}
							onclick={() => (showMobileFeatures = true)}
						>
							Ya
						</div>
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div
							class="col-span-2 cursor-pointer text-center font-medium"
							class:active={!showMobileFeatures}
							onclick={() => (showMobileFeatures = false)}
						>
							Tidak
						</div>
					</div>

					{#if showMobileFeatures}
						<div class="border-t border-gray-200 pt-2">
							<!-- Fitur Penanggalan -->
							<div class="grid grid-cols-12 py-2">
								<div class="col-span-8">Fitur Penanggalan</div>
								<div class="col-span-2 flex justify-center">
									<span class="text-customOrange2 text-xl">✓</span>
								</div>
								<div class="col-span-2 border-l border-gray-300"></div>
							</div>

							<!-- Fitur Tugas Pribadi -->
							<div class="grid grid-cols-12 py-2">
								<div class="col-span-8">Fitur Tugas Pribadi</div>
								<div class="col-span-2 flex justify-center">
									<span class="text-customOrange2 text-xl">✓</span>
								</div>
								<div class="col-span-2 border-l border-gray-300"></div>
							</div>

							<!-- Fitur Tugas Acara -->
							<div class="grid grid-cols-12 py-2">
								<div class="col-span-8">Fitur Tugas Acara</div>
								<div class="col-span-2 flex justify-center">
									<span class="text-customOrange2 text-xl">✓</span>
								</div>
								<div class="col-span-2 border-l border-gray-300"></div>
							</div>

							<!-- Fitur Situs Kerajaan -->
							<div class="grid grid-cols-12 py-2">
								<div class="col-span-8">Fitur Situs Kerajaan</div>
								<div class="col-span-2 flex justify-center">
									<span class="text-customOrange2 text-xl">✓</span>
								</div>
								<div class="col-span-2 border-l border-gray-300"></div>
							</div>

							<!-- Fitur Check-In Situs -->
							<div class="grid grid-cols-12 py-2">
								<div class="col-span-8">Fitur Check-In Situs</div>
								<div class="col-span-2 border-r border-gray-300"></div>
								<div class="col-span-2 flex justify-center">
									<span class="text-customOrange2 text-xl">✓</span>
								</div>
							</div>

							<!-- Fitur Acara Kerajaan -->
							<div class="grid grid-cols-12 py-2">
								<div class="col-span-8">Fitur Acara Kerajaan</div>
								<div class="col-span-2 border-r border-gray-300"></div>
								<div class="col-span-2 flex justify-center">
									<span class="text-customOrange2 text-xl">✓</span>
								</div>
							</div>

							<!-- Fitur Group Chat -->
							<div class="grid grid-cols-12 py-2">
								<div class="col-span-8">Fitur Group Chat</div>
								<div class="col-span-2 flex justify-center border-r border-gray-300">
									<span class="text-customOrange2 text-xl">✓</span>
								</div>
								<div class="col-span-2"></div>
							</div>

							<!-- Fitur Forum -->
							<div class="grid grid-cols-12 py-2">
								<div class="col-span-8">Fitur Forum</div>
								<div class="col-span-2 flex justify-center">
									<span class="text-customOrange2 text-xl">✓</span>
								</div>
								<div class="col-span-2 border-l border-gray-300"></div>
							</div>
						</div>
						<div class="h-0.5 w-full bg-gray-400 opacity-40"></div>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>

<div class="flex flex-col">
	<div class="w-full px-5">
		{#if berhasil === 'ayaya2'}
			<div class="mt-4 w-full">
				<div
					class="flex w-full cursor-pointer items-center justify-between rounded-t-lg border bg-gray-100 px-4 py-3"
				>
					<p class="font-medium">Selesaikan Request</p>
					<span class="basil--cross-outline"></span>
				</div>
				<div
					class="rounded-b-lg border-x border-b bg-white p-4 transition-all duration-300 ease-in-out"
				>
					<div>
						<p>Upload Link Website Kerajaan</p>
						<input
							type="text"
							class="mt-2 w-full rounded-lg border border-gray-400 py-2 pe-2 ps-2 focus:border-gray-400 focus:outline-none focus:ring-0"
							name=""
							placeholder="https://kerajaan.com"
							id=""
						/>
					</div>
					<div class="w-full flex-col">
						<p class="mt-5">Upload Aplikasi Mobile Kerajaan</p>
						<div
							class="upload-container relative mt-4 h-[44px] w-full flex-shrink-0 overflow-hidden rounded-lg border-2 border-black bg-gray-200"
						>
							<input
								type="file"
								id="fileVideo"
								class="hidden"
								name="inputvideo"
								accept="video/*"
								onchange={(e) => handleFileChange(e, 'video')}
							/>
							<label
								for="fileVideo"
								class="absolute left-0 top-0 flex h-full w-full cursor-pointer flex-col items-center justify-center"
							>
							</label>
							<div class="flex h-full w-full items-center justify-between">
								<p class="max-w-[60%] truncate px-2">{videoName}</p>
								<button class="bg-customOrange2 h-full px-4 font-semibold text-white">
									Choose file
								</button>
							</div>
						</div>
						<p class="text-red-600 text-md">
							Pastikan Link atau FIle yang anda masukan sudah benar karena tidak akan bisa di edit
							atau diubah!
						</p>
					</div>
                    <div class="mt-8 flex w-full justify-end">
						<button
							class="bg-customGold mr-5 w-auto rounded-lg px-12 py-1 text-center text-white"
							type="submit"
						>
							Selesaikan
						</button>
					</div>
				</div>
			</div>
		{/if}
	</div>

	<div class="w-full px-5">
		{#if berhasil === 'ayaya2'}
			<div class="mt-4 w-full">
				<div
					class="flex w-full cursor-pointer items-center justify-between rounded-t-lg border bg-gray-100 px-4 py-3"
				>
					<p class="font-medium">Detail Aplikasi Kerajaan</p>
					<span class="basil--cross-outline"></span>
				</div>
				<div
					class="rounded-b-lg border-x border-b bg-white p-4 transition-all duration-300 ease-in-out"
				>
					<div>
						<p>Link Website Kerajaan</p>
						<input
							type="text"
							class="mt-2 w-full rounded-lg border border-gray-400 py-2 pe-2 ps-2 focus:border-gray-400 focus:outline-none focus:ring-0"
							name=""
							placeholder="https://kerajaan.com"
							id=""
						/>
					</div>

					<div>
						<p>Aplikasi Kerajaan</p>
						<input
							type="text"
							class="mt-2 w-full rounded-lg border border-gray-400 py-2 pe-2 ps-2 focus:border-gray-400 focus:outline-none focus:ring-0"
							name=""
							placeholder="kerajaantest.apk"
							id=""
						/>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div> 



<!-- BUAT MANAJEMEN WEBSITE ^ -->