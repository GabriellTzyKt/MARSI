<script lang="ts">
	import { enhance } from "$app/forms";
	let openmodaledit = $state(false);
	let timer: number;
	let error: any = $state('');
	let success = $state(false);

	function closeModal() {
		if (openmodaledit === true) {
			openmodaledit = false;
		}
	}
	
</script>

<div class=" me-4 flex justify-end gap-2">
	<button class="flex gap-2 rounded-lg bg-[#FFA600] px-4 py-2 text-white" type="button" onclick={() => openmodaledit = true}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="white"
			class="size-6"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
			/>
		</svg>

		Edit</button
	>
	<button class="flex gap-2 rounded-lg bg-[#FF5E5E] px-4 py-2 text-white">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="white"
			class="size-6"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
			/>
		</svg>

		Delete</button
	>
</div>
{#if openmodaledit}
	<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
		<div class="max-h-[90vh] w-[70%] overflow-y-auto rounded-lg bg-white p-5 shadow-lg">
			<form
				method="post"
				action="?/tambah"
				use:enhance={() => {
					return async ({ result }) => {
						console.log(result);
						if (result.type === 'success') {
							success = true;
							clearTimeout(timer);
							timer = setTimeout(() => {
								success = false;
								openmodaledit = false;
							}, 3000);
						} else if (result.type === 'failure') {
							error = result?.data?.errors;
						}
					};
				}}
			>
				<div class="flex justify-between">
					<h2 class="font-bold lg:text-xl">Edit Anggota</h2>
					<!-- svelte-ignore a11y_consider_explicit_label -->
					<button onclick={closeModal}>
						<span class="carbon--close-outline items-center"></span>
					</button>
				</div>
				<div class="h-1 bg-gray-300"></div>
				<div class="mt-5 flex flex-col">
					<label for="gelar"> Nama Gelar : </label>
					<div class="relative w-full">
						<input
							id="gelar"
							class="w-full rounded-lg border px-3 py-2 pr-12"
							placeholder="Masukkan Gelar"
						/>
					</div>
					<div class="flex w-full justify-end">
						<button class="mt-12 w-fit rounded-lg bg-yellow-600 px-5 py-3 text-white">
							Simpan data
						</button>
					</div>
				</div>
			</form>
		</div>
	</div>
{/if}

<style>
	.carbon--close-outline {
		display: inline-block;
		width: 24px;
		height: 24px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath fill='%23bba5a5' d='M16 2C8.2 2 2 8.2 2 16s6.2 14 14 14s14-6.2 14-14S23.8 2 16 2m0 26C9.4 28 4 22.6 4 16S9.4 4 16 4s12 5.4 12 12s-5.4 12-12 12'/%3E%3Cpath fill='%23bba5a5' d='M21.4 23L16 17.6L10.6 23L9 21.4l5.4-5.4L9 10.6L10.6 9l5.4 5.4L21.4 9l1.6 1.6l-5.4 5.4l5.4 5.4z'/%3E%3C/svg%3E");
	}
</style>