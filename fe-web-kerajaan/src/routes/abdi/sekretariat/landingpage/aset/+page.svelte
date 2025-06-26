<script lang="ts">
	import { slide } from 'svelte/transition';
	import img from '$lib/asset/profile/jdpp.jpg';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import Input from '$lib/input/Input.svelte';
	import { events } from '$lib/dummy';
	import { navigating } from '$app/state';
	import Loader from '$lib/loader/Loader.svelte';

	let { judulSection } = $props();
	let errors = $state();
	let files = $state([]);
	let input = $state();
	let pict = $state([]);
	// let f: { name: string; url: string }[] = $state([]);
	let open = $state(false);
	let timer: number;
	let total = $state();
	// function setTimer() {
	// 	open = true;
	// 	if (timer) {
	// 		clearTimeout(timer);
	// 	}
	// 	if (open)
	// 		timer = setTimeout(() => {
	// 			open = false;
	// 			goto('/landingpage/aset');
	// 		}, 3000);
	// }
	// function onchange(e) {
	// 	let imageFiles = Array.from(e.target.files);

	// 	let promise = imageFiles.map((file) => {
	// 		return new Promise((resolve) => {
	// 			let reader = new FileReader();
	// 			reader.onload = (e) => {
	// 				resolve({ name: file.name, url: e.target?.result });
	// 			};
	// 			reader.readAsDataURL(file);
	// 		});
	// 	});
	// 	Promise.all(promise).then((res) => {
	// 		files = [...files, ...res];
	// 		pict = files.map((f) => f.url);
	// 	});
	// 	pict = res;
	// }
	$effect(() => {
		if (files) {
			for (const file of files) {
				console.log(`${file.name}:${file.size}`);
			}
		}
	});
	// function handleFileChange(event: Event) {
	// 	const input = event.target as HTMLInputElement;
	// 	if (input.files) {
	// 		const file = input.files[0];
	// 		if (file) {
	// 			const fileurl = URL.createObjectURL(file);

	// 			files = [...f, { name: file.name, url: fileurl }];
	// 		}
	// 	}
	// }
	// function rmfile(index: number) {
	// 	files = f.filter((_, i) => i !== index);
	// }

	let value = $state(false);
	function toggle() {
		if (!value) value = true;
		else value = false;
	}
	let loading = $state(false);
</script>

{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
{#if loading}
	<Loader></Loader>
{/if}
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class=" flex w-full flex-col">
	<div class="flex">
		<p class="text-2xl font-[700]">Asset Kerajaan</p>
	</div>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="mt-4 w-full rounded-lg bg-gray-400">
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<form
			action="?/tambahAset"
			method="post"
			enctype="multipart/form-data"
			use:enhance={() => {
				loading = true;
				return async ({ result, update }) => {
					loading = false;
					if (result.type === 'success') {
						open = true;
						clearTimeout(timer);
						timer = setTimeout(() => {
							open = false;
						}, 3000);
					}
					if (result.type === 'failure') {
						errors = result.data?.errors;
					}
				};
			}}
		>
			<div class="flex flex-col rounded-xl border border-gray-500 p-4 pb-6">
				<div class=" flex flex-col">
					<div class="">
						<p class="text-xl">Header Section</p>
					</div>
					<div class="mt-1">
						<input
							type="text"
							class="w-full rounded-lg border border-gray-200 bg-white py-2 pe-2 ps-2 shadow-xl focus:border-gray-400 focus:outline-none focus:ring-0"
							name="header_section"
							placeholder="John Doe"
							id=""
						/>
						{#if errors?.header_section}
							{#each errors.header_section as e}
								<p class="text-left text-red-500">{e}</p>
							{/each}
						{/if}
					</div>
				</div>
				<div class=" mt-6 flex flex-col">
					<div class="">
						<p class="text-xl">Deskripsi Section</p>
					</div>
					<div class="mt-1">
						<textarea
							name="deskripsi_section"
							class="w-full rounded-lg border border-gray-400 bg-white p-2 shadow-xl focus:border-gray-400 focus:outline-none focus:ring-0"
							id=""
							placeholder="Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur qui maxime eligendi veritatis ducimus hic harum magni ea, dignissimos accusamus inventore. Totam laborum repellendus incidunt quo nesciunt, aut accusamus asperiores."
							rows="5"
						></textarea>
						{#if errors?.deskripsi_section}
							{#each errors.deskripsi_section as e}
								<p class="text-left text-red-500">{e}</p>
							{/each}
						{/if}
					</div>
				</div>
				<div class="my-4 flex w-full flex-col">
					<div class="flex w-full">
						<p class="text-left text-xl">Gambar Section</p>
					</div>
					<div class=" flex max-h-40 w-full max-w-[1500px] gap-3 overflow-x-auto whitespace-nowrap">
						<div class="flex h-32 min-w-40 max-w-[800px] shrink-0">
							<label
								class="relative flex h-auto w-full items-center justify-center rounded-xl bg-gray-500"
							>
								<!-- Input file yang disembunyikan -->
								<input
									type="file"
									name="gambar_section"
									class="absolute inset-0 cursor-pointer opacity-0"
									onchange={(e) => onchange(e)}
									multiple
									accept=".jpg, .jpeg, .png, .webp"
								/>

								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="white"
									class="size-10"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
									/>
								</svg>
							</label>
						</div>

						{#if files.length > 0}
							{#each files as file, i}
								{console.log(file)}
								<!-- items -->
								<div class="relative flex h-32 min-w-40 shrink-0">
									<img src={file.url} class="h-auto w-full rounded-xl" alt="" />
									<!-- svelte-ignore a11y_no_static_element_interactions -->
									<div class="absolute right-2 top-2 rounded-xl bg-red-500 p-2">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="1.5"
											stroke="white"
											class="size-4"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
											/>
										</svg>
									</div>
									<div class="absolute right-12 top-2 rounded-xl bg-yellow-500 p-2">
										<input type="file" class="absolute inset-0 cursor-pointer opacity-0" />
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="1.5"
											stroke="white"
											class="size-4"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
											/>
										</svg>
									</div>
								</div>
							{/each}
						{/if}

						<!-- items -->
						<div class="relative flex h-32 min-w-40 shrink-0">
							<img src={img} class="h-auto w-full rounded-xl" alt="" />
							<div class="absolute right-2 top-2 rounded-xl bg-red-500 p-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="white"
									class="size-4"
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
					<div>
						<p class=" italic">*Foto di urutan pertama akan menjadi foto besar awalan</p>
					</div>
					<div class="flex w-full justify-center text-center lg:justify-end">
						<button
							class="bg-badran-bdg flex w-full justify-center rounded-lg px-8 py-2 text-center text-white lg:w-auto"
							type="submit">Simpan Data</button
						>
					</div>
				</div>
			</div>
		</form>
	</div>
</div>
{#if open}
	<SuccessModal text="Data Berhasil Disimpan"></SuccessModal>
{/if}
