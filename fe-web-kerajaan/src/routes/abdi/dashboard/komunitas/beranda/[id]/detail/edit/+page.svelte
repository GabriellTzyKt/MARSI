<script lang="ts">
	import gambartemp from '$lib/asset/kerajaan/gambar_temp.jpg';
	import gambardefault from '$lib/asset/kerajaan/default.jpg';
	import { goto } from '$app/navigation';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';

	let namakomunitas = $state('');
	let alamat = $state('');
	let email = $state('');
	let deskripsikomunitas = $state('');
	let penanggungjawab = $state('');
	let pembina = $state('');
	let pelindung = $state('');
	let notelepon = $state('');
	let jumlahanggota = $state('');

	let { form } = $props();
	console.log('form data', form?.formData);

	if (form?.formData) {
		namakomunitas = form.formData.namakomunitas;
		notelepon = form.formData.notelepon;
		email = form.formData.email;
		deskripsikomunitas = form.formData.deskripsikomunitas;
		penanggungjawab = form.formData.penanggungjawab;
		pembina = form.formData.pembina;
		pelindung = form.formData.pelindung;
		alamat = form.formData.alamat;
		jumlahanggota = form.formData.jumlahanggota;
	}

	let open = $state(false);
	let timer: any;
	let error : any = $state('')

</script>

<div class="h-full w-full">
	<form method="post" action="?/edit" use:enhance={() => {
		return async ({ result }) => {
			console.log(result);
			if (result.type === 'success') {
				open = true;
				clearTimeout(timer);
				timer = setTimeout(() => {
					open = false;
					goto('/abdi/dashboard/komunitas/detail');
				}, 3000);
			} else if (result.type === 'failure') {
				error = result.data?.errors;
			}
		};
	}}>
		<div class="relative mx-auto flex w-full items-center justify-center">
			<img src={gambardefault} class="h-25 w-25 relative ml-5 mr-5 rounded-full" alt="" />
			<span class="mdi--edit absolute"></span>
		</div>
		<div class="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
			<!-- 1 -->
			<div>
				<div>
					<p>Nama Komunitas:</p>
					<div class="relative">
						<input
							type="text"
							name="namakomunitas"
							bind:value={namakomunitas}
							placeholder="Masukkan Nama"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
						/>
						<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
					</div>
					{#if error}
						{#each error.namakomunitas as a}
							<p class="text-left text-red-500">{a}</p>
						{/each}
					{/if}
				</div>

				<div>
					<p class="mt-5">Alamat:</p>
					<div class="relative">
						<input
							type="text"
							name="alamat"
							bind:value={alamat}
							placeholder="Masukkan Nama"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
						/>
						<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
					</div>
					{#if error}
						{#each error.alamat as a}
							<p class="text-left text-red-500">{a}</p>
						{/each}
					{/if}
				</div>

				<div>
					<p class="mt-5">Email:</p>
					<div class="relative">
						<input
							type="text"
							name="email"
							bind:value={email}
							placeholder="Masukkan Nama"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
						/>
						<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
					</div>
					{#if error}
						{#each error.email as a}
							<p class="text-left text-red-500">{a}</p>
						{/each}
					{/if}
				</div>

				<div>
					<p class="mt-5">Deskripsi Komunitas:</p>
					<div class="relative w-full">
						<textarea
							placeholder="Masukkan nama"
							name="deskripsikomunitas"
							bind:value={deskripsikomunitas}
							class="mt-2 h-32 w-full resize-none rounded-md border-2 px-3 py-3 text-lg"
						></textarea>
						<div class="h-full">
							<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
						</div>
					</div>
					{#if error}
						{#each error.deskripsikomunitas as a}
							<p class="text-left text-red-500">{a}</p>
						{/each}
					{/if}
				</div>
			</div>

			<!-- 2 -->
			<div>
				<div>
					<p>Penanggung Jawab:</p>
					<div class="relative">
						<input
							type="text"
							bind:value={penanggungjawab}
							name="penanggungjawab"
							placeholder="Masukkan Penanggung Jawab"
							class="mt-2 w-full rounded-lg border-2 border-black bg-slate-500 px-2 py-2 text-start"
						/>
					</div>
					{#if error}
						{#each error.penanggungjawab as a}
							<p class="text-left text-red-500">{a}</p>
						{/each}
					{/if}
				</div>

				<div class="mt-5">
					<p>Pembina:</p>
					<div class="relative">
						<input
							type="text"
							bind:value={pembina}
							name="pembina"
							placeholder="Masukkan Pembina"
							class="mt-2 w-full rounded-lg border-2 border-black bg-slate-500 px-2 py-2 text-start"
						/>
					</div>
					{#if error}
						{#each error.pembina as a}
							<p class="text-left text-red-500">{a}</p>
						{/each}
					{/if}
				</div>

				<div class="mt-5">
					<p>Pelindung:</p>
					<div class="relative">
						<input
							type="text"
							name="pelindung"
							bind:value={pelindung}
							placeholder="Masukkan Pelindung"
							class="mt-2 w-full rounded-lg border-2 border-black bg-slate-500 px-2 py-2 text-start"
						/>
					</div>
					{#if error}
						{#each error.pelindung as a}
							<p class="text-left text-red-500">{a}</p>
						{/each}
					{/if}
				</div>

				<div class="mt-5 flex flex-col gap-4 lg:flex-row">
					<div class="w-full">
						<p>No telepon :</p>
						<input
							type="text"
							name="notelepon"
							bind:value={notelepon}
							placeholder="Masukkan nama"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
						/>
						{#if error}
							{#each error.notelepon as a}
								<p class="text-left text-red-500">{a}</p>
							{/each}
						{/if}
					</div>
					<div class="w-full">
						<p>Jumlah Anggota :</p>
						<input
							type="text"
							name="jumlahanggota"
							bind:value={jumlahanggota}
							placeholder="Masukkan nama"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
						/>
						{#if error}
							{#each error.jumlahanggota as a}
								<p class="text-left text-red-500">{a}</p>
							{/each}
						{/if}
					</div>
				</div>
			</div>
		</div>

		<div class="relative flex w-full justify-center lg:justify-end">
			<button
				class="w-50 t-0 mt-10 rounded-lg border-2 border-black bg-green-500 px-2 py-2 text-white"
				type="submit">Simpan Data</button
			>
		</div>
	</form>
</div>

{#if open}
	<div transition:fade={{ duration: 100 }}>
		<SuccessModal text="Komunitas Berhasil diedit"></SuccessModal>
	</div>
{/if}

<style>
	.raphael--edit {
		display: inline-block;
		width: 28px;
		height: 28px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath fill='%23a59494' d='M27.87 7.863L23.024 4.82l-7.89 12.566l4.843 3.04zM14.395 21.25l-.107 2.855l2.527-1.337l2.35-1.24l-4.673-2.936zM29.163 3.24L26.63 1.647a1.364 1.364 0 0 0-1.88.43l-1 1.588l4.843 3.042l1-1.586c.4-.64.21-1.483-.43-1.883zm-3.965 23.82c0 .275-.225.5-.5.5h-19a.5.5 0 0 1-.5-.5v-19a.5.5 0 0 1 .5-.5h13.244l1.884-3H5.698c-1.93 0-3.5 1.57-3.5 3.5v19c0 1.93 1.57 3.5 3.5 3.5h19c1.93 0 3.5-1.57 3.5-3.5V11.097l-3 4.776v11.19z'/%3E%3C/svg%3E");
	}

	.mdi--edit {
		display: inline-block;
		width: 32px;
		height: 32px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z'/%3E%3C/svg%3E");
	}
</style>
