<script lang="ts">
	import { goto } from '$app/navigation';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	import { fade } from 'svelte/transition';
	let { value = $bindable(), text = '', successText = '', errors = $bindable() } = $props();
	let total = $state(8);
	let open = $state(false);
	let timer: number;
	let jenisTugas = $state('');
	let today = $state(String(new Date().toISOString().split('T')[0]));
	function setTimer() {
		open = true;
		if (timer) {
			clearTimeout(timer);
		}
		if (open)
			timer = setTimeout(() => {
				open = false;
				value = false;
				goto('/abdi/sekretariat/tugas');
			}, 3000);
	}
</script>

<div
	class="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black/75"
	transition:fade={{ duration: 100 }}
>
	<div class="relative flex w-full max-w-[600px] flex-col rounded-lg border bg-white p-6">
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="absolute right-0 top-0 me-4 mt-7 cursor-pointer p-2"
			onclick={() => {
				value = false;
				errors = null;
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-8"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
			</svg>
		</div>
		<div class="my-4 flex justify-self-start">
			<p class=" text-xl font-[500]">{text}</p>
		</div>
		<div class="flex w-full flex-col">
			<div>
				<p class="text-sm">Pemberi Tugas</p>
			</div>
			<!-- Pemberi Tugas -->
			<div class="mt-1 flex justify-between rounded-lg border border-gray-700 bg-white">
				<div class="grow">
					<input
						type="text"
						class="my-2 w-full pe-2 ps-2 focus:outline-none"
						placeholder="Jane Doe"
						name="pemberi_tugas"
						id=""
					/>
				</div>
				<div class="me-2 ms-2 flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="gray"
						class="size-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
						/>
					</svg>
				</div>
			</div>
			{#if errors}
				{#each errors.pemberi_tugas as e}
					<p class="text-left text-red-500">{e}</p>
				{/each}
			{/if}
		</div>
		<div class="mt-2 flex w-full flex-col">
			<div>
				<p class="text-sm">Nama Tugas</p>
			</div>
			<!-- nama Tugas -->
			<div class="mt-1 flex justify-between rounded-lg border border-gray-700 bg-white">
				<div class="grow">
					<input
						type="text"
						class="my-2 w-full pe-2 ps-2 focus:outline-none"
						placeholder="Jane Doe"
						name="nama_tugas"
						id=""
					/>
				</div>
				<div class="me-2 ms-2 flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="gray"
						class="size-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
						/>
					</svg>
				</div>
			</div>
			{#if errors}
				{#each errors.nama_tugas as e}
					<p class="text-left text-red-500">{e}</p>
				{/each}
			{/if}
		</div>
		<div class="mt-2 flex w-full flex-col">
			<div>
				<p class="text-sm">Tanggal Penugasan</p>
			</div>
			<!-- Anggota yang ditugaskan -->
			<div class="mt-1 flex justify-between rounded-lg border border-gray-700 bg-white">
				<div class="grow">
					<input
						type="date"
						class="my-2 w-full pe-2 ps-2 focus:outline-none"
						placeholder="13-12-2001"
						name="tanggal_penugasan"
						value={today}
						id=""
					/>
				</div>
			</div>
			{#if errors}
				{#each errors.tanggal_penugasan as e}
					<p class="text-left text-red-500">{e}</p>
				{/each}
			{/if}
		</div>
		<div class="mt-2 flex w-full flex-col">
			<div>
				<p class="text-sm">Anggota yang Ditugaskan</p>
			</div>
			<!-- nama Tugas -->
			<div class="mt-1 flex justify-between rounded-lg border border-gray-700 bg-white">
				<div class="grow">
					<input
						type="text"
						class="my-2 w-full pe-2 ps-2 focus:outline-none"
						placeholder="Jane Doe"
						name="anggota_yg_ditugaskan"
						id=""
					/>
				</div>
				<div class="me-2 ms-2 flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="gray"
						class="size-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
						/>
					</svg>
				</div>
			</div>
			{#if errors}
				{#each errors.anggota_yg_ditugaskan as e}
					<p class="text-left text-red-500">{e}</p>
				{/each}
			{/if}
		</div>

		<div class="flex-col">
			<label for="tugas">Jenis Tugas</label>

			<select
				name="tugas"
				id="tugas"
				bind:value={jenisTugas}
				class="w-full rounded-lg border-2 border-black px-2 py-2"
			>
				<option disabled value = ""> Pilih Jenis! </option>
				<option value="pribadi" selected>Tugas Pribadi</option>
				<option value="acara">Tugas Acara</option>
			</select>
		</div>

		{#if jenisTugas === 'pribadi'}
			<div class="mt-2 flex w-full flex-col">
				<div>
					<p class="text-sm">Nama Situs :</p>
				</div>
				<!-- nama Tugas -->
				<div class="mt-1 flex justify-between rounded-lg border border-gray-700 bg-white">
					<div class="grow">
						<input
							type="text"
							class="my-2 w-full pe-2 ps-2 focus:outline-none"
							placeholder="Jane Doe"
							name="nama_situs"
							id=""
						/>
					</div>
					<div class="me-2 ms-2 flex items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="2"
							stroke="gray"
							class="size-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
							/>
						</svg>
					</div>
				</div>
				{#if errors}
					<!-- {#each errors.anggota_yg_ditugaskan as e}
						<p class="text-left text-red-500">{e}</p>
					{/each} -->
				{/if}
			</div>

			<div class="mt-2 flex w-full flex-col">
				<div>
					<p class="text-sm">Deskripsi Tugas</p>
				</div>
				<!-- nama Tugas -->
				<div class="mt-1 flex justify-between rounded-lg border border-gray-700 bg-white">
					<div class="grow">
						<textarea
							name="deskripsi_tugas"
							class="w-full pe-2 ps-2 pt-2 focus:outline-none"
							placeholder="Deskripsi"
							id=""
							rows="5"
						></textarea>
					</div>
				</div>
				{#if errors}
					{#each errors.deskripsi_tugas as e}
						<p class="text-left text-red-500">{e}</p>
					{/each}
				{/if}
			</div>
		{/if}

		{#if jenisTugas === 'acara'}
			<div class="mt-2 flex w-full flex-col">
				<div>
					<p class="text-sm">Nama Acara :</p>
				</div>
				<!-- nama Tugas -->
				<div class="mt-1 flex justify-between rounded-lg border border-gray-700 bg-white">
					<div class="grow">
						<input
							type="text"
							class="my-2 w-full pe-2 ps-2 focus:outline-none"
							placeholder="Jane Doe"
							name="nama_acara"
							id=""
						/>
					</div>
					<div class="me-2 ms-2 flex items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="2"
							stroke="gray"
							class="size-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
							/>
						</svg>
					</div>
				</div>
				{#if errors}
					<!-- {#each errors.anggota_yg_ditugaskan as e}
					<p class="text-left text-red-500">{e}</p>
				{/each} -->
				{/if}
			</div>

			<div class="mt-2 flex w-full flex-col">
				<div>
					<p class="text-sm">Deskripsi Tugas</p>
				</div>
				<!-- nama Tugas -->
				<div class="mt-1 flex justify-between rounded-lg border border-gray-700 bg-white">
					<div class="grow">
						<textarea
							name="deskripsi_tugas"
							class="w-full pe-2 ps-2 pt-2 focus:outline-none"
							placeholder="Deskripsi"
							id=""
							rows="5"
						></textarea>
					</div>
				</div>
				{#if errors}
					{#each errors.deskripsi_tugas as e}
						<p class="text-left text-red-500">{e}</p>
					{/each}
				{/if}
			</div>
		{/if}

		<div class="mt-4 flex w-full lg:justify-end">
			<button
				class="w-full cursor-pointer rounded-lg bg-green-500 px-4 py-2 text-white lg:w-auto"
				type="submit">{text}</button
			>
		</div>
	</div>
</div>
{#if open}
	<SuccessModal text={successText}></SuccessModal>
{/if}
