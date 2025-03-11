<script>
	import Input from '$lib/input/Input.svelte';
	import g1 from '$lib/asset/kerajaan/aboutUs1.png';
	import { goto } from '$app/navigation';
</script>

<div class="my-6 me-6 ms-6 flex w-full flex-col">
	<div class="flex gap-4">
		<div class="my-2">
			<button
				onclick={() => goto('landingpage/mobile')}
				class="bg-badran-bt cursor-pointer rounded-full px-8 py-2 text-white">Setting Mobile</button
			>
		</div>
		<div class="my-2">
			<button
				onclick={() => goto('landingpage/aset')}
				class="bg-badran-bt cursor-pointer rounded-full px-8 py-2 text-white"
				>Setting CMS Situs</button
			>
		</div>
	</div>

	<div class="mb-3 mt-2">
		<p class="text-2xl">Bagian 1 - Halaman Landasan</p>
	</div>
	<form action="">
		<div class="grid w-full grid-cols-1 gap-4 xl:grid-cols-4">
			<!-- judul halaman -->
			<div class=" flex flex-col xl:col-span-3">
				<div>
					<p>Judul Halaman</p>
				</div>
				<div class="mt-1">
					<Input type="text" value="Maha Mentri Keraton Surabaya"></Input>
				</div>
			</div>
			<div></div>
			<!-- deskripsi halaman -->
			<div class="flex flex-col xl:col-span-3">
				<div>
					<p>Deskripsi Halaman</p>
				</div>
				<div class="mt-1">
					<textarea
						name=""
						class="min-h-[200px] w-full rounded-lg border border-gray-500 bg-white focus:outline-none"
						placeholder="Deskripsi singkat"
						rows="5"
						id=""
					></textarea>
				</div>
			</div>
			<!-- isi halaman 1 -->
			<div class="relative flex flex-col justify-center">
				<div>
					<p>Gambar Background</p>
				</div>

				<img src={g1} alt="" class=" min-h-[200px] w-full" />
				<div class="bg-badran-yellow right-26 absolute top-14 rounded-lg p-1 xl:right-10 xl:top-10">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="white"
						class="size-6 xl:size-4"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
						/>
					</svg>
				</div>
				<div class="bg-badran-bdr absolute right-10 top-14 rounded-lg p-1 xl:right-2 xl:top-10">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="white"
						class="size-6 xl:size-4"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
						/>
					</svg>
				</div>
			</div>
		</div>
		<div class="mb-4 mt-4 flex">
			<p class="text-2xl">Bagian 2 - Tentang Kami</p>
		</div>

		<div class="grid grid-cols-1 gap-4 xl:grid-cols-4">
			<!-- card 1 -->
			<!--  -->
			<div class="flex flex-col xl:col-span-3">
				<div>
					<p class="text-xl">Card 1</p>
					<p class="text-md">Deskripsi Kartu</p>
				</div>
				<div class="mt-1">
					<textarea
						name=""
						class="min-h-[200px] w-full rounded-lg border border-gray-500 bg-white focus:outline-none"
						placeholder="Deskripsi singkat"
						rows="5"
						id=""
					></textarea>
				</div>
			</div>
			<!-- isi halaman 1 -->
			<div class="relative flex flex-col justify-end">
				<img src={g1} alt="" class="mb-1 min-h-[200px] w-full" />
				<div class="bg-badran-yellow right-26 xl:top-18 absolute top-14 rounded-lg p-1 xl:right-10">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="white"
						class="size-6 xl:size-4"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
						/>
					</svg>
				</div>
				<div class="bg-badran-bdr xl:top-18 absolute right-10 top-14 rounded-lg p-1 xl:right-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="white"
						class="size-6 xl:size-4"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
						/>
					</svg>
				</div>
			</div>
			<!-- card 2 -->
			<!--  -->
			<div class="flex flex-col xl:col-span-3">
				<div>
					<p class="text-xl">Card 2</p>
					<p class="text-md">Deskripsi Kartu</p>
				</div>
				<div class="mt-1">
					<textarea
						name=""
						class="min-h-[200px] w-full rounded-lg border border-gray-500 bg-white focus:outline-none"
						placeholder="Deskripsi singkat"
						rows="5"
						id=""
					></textarea>
				</div>
			</div>
			<!-- isi halaman 2 -->
			<div class="relative flex flex-col justify-end">
				<img src={g1} alt="" class="mb-1 min-h-[200px] w-full" />
				<div class="bg-badran-yellow right-26 xl:top-18 absolute top-14 rounded-lg p-1 xl:right-10">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="white"
						class="size-6 xl:size-4"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
						/>
					</svg>
				</div>
				<div class="bg-badran-bdr xl:top-18 absolute right-10 top-14 rounded-lg p-1 xl:right-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="white"
						class="size-6 xl:size-4"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
						/>
					</svg>
				</div>
			</div>
			<!-- card 3 -->
			<!--  -->
			<div class="flex flex-col xl:col-span-3">
				<div>
					<p class="text-xl">Card 3</p>
					<p class="text-md">Deskripsi Kartu</p>
				</div>
				<div class="mt-1">
					<textarea
						name=""
						class="min-h-[200px] w-full rounded-lg border border-gray-500 bg-white focus:outline-none"
						placeholder="Deskripsi singkat"
						rows="5"
						id=""
					></textarea>
				</div>
			</div>
			<!-- isi halaman 3-->
			<div class="relative flex flex-col justify-end">
				<img src={g1} alt="" class="mb-1 min-h-[200px] w-full" />
				<div class="bg-badran-yellow right-26 xl:top-18 absolute top-14 rounded-lg p-1 xl:right-10">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="white"
						class="size-6 xl:size-4"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
						/>
					</svg>
				</div>
				<div class="bg-badran-bdr xl:top-18 absolute right-10 top-14 rounded-lg p-1 xl:right-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="white"
						class="size-6 xl:size-4"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
						/>
					</svg>
				</div>
			</div>
		</div>
	</form>
</div>
