<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Loader from '$lib/loader/Loader.svelte';
	import DeleteModal from '$lib/popup/DeleteModal.svelte';
	import Modal from '$lib/popup/Modal.svelte';
	import SModal from '$lib/popup/SModal.svelte';
	import KerajaanPopup from '$lib/popup/KerajaanPopup.svelte';
	import type { Snippet } from 'svelte';
	import { any } from 'zod';
	import Input from './Input.svelte';
	let loading = $state(false);
	let success = $state(false);
	let timer: number;
	let error : any = $state();
	let { data = null, name = '', tipe = '', del = false, edit = false, id = null } = $props();
	console.log('Tipe : ', tipe);
	console.log('Data : ', data);
	console.log('ID : ', id);
	// let edit = $state(false);
	// let del = $state(false);
</script>

<div class=" me-4 flex justify-end gap-2">
	<button
		class="flex gap-2 rounded-lg bg-[#FFA600] px-4 py-2 text-white"
		onclick={() => {
			edit = true;
		}}
	>
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
	<button
		class="flex gap-2 rounded-lg bg-[#FF5E5E] px-4 py-2 text-white"
		onclick={() => {
			del = true;
		}}
	>
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
{#if del}
	{#if tipe === 'arsip'}
		<form
			action="?/hapus"
			method="post"
			use:enhance={() => {
				loading = true;
				return async ({ result }) => {
					loading = false;
					if (result.type === 'success') {
						del = false;
						success = true;
						invalidateAll();
						clearTimeout(timer);
						timer = setTimeout(() => {
							success = false;
							del = false;
							invalidateAll();
						}, 3000);
					}
					if (result.type === 'failure') {
						console.log(result.data?.error);
					}
				};
			}}
		>
			<input type="hidden" name="id_jenis_arsip" value={data.id_jenis_arsip} />

			<DeleteModal bind:value={del} text="Apakah Yakin ingin di delete?" data={data.id_jenis_arsip}
			></DeleteModal>
		</form>
	{/if}

	{#if tipe === 'jenis_kerajaan'}
		<form
			action="?/hapusKerajaan"
			method="post"
			use:enhance={() => {
				loading = true;
				return async ({ result }) => {
					loading = false;
					if (result.type === 'success') {
						del = false;
						success = true;
						invalidateAll();
						clearTimeout(timer);
						timer = setTimeout(() => {
							success = false;
							del = false;
							invalidateAll();
						}, 3000);
					}
					if (result.type === 'failure') {
						console.log(result.data?.error);
					}
				};
			}}
		>
			<input type="hidden" name="id_jenis_kerajaan" value={data.id_jenis_kerajaan} />

			<DeleteModal
				bind:value={del}
				text="Apakah Yakin ingin di delete?"
				data={data.id_jenis_kerajaan}
			></DeleteModal>
		</form>
	{/if}

	{#if tipe === 'gelar'}
		<form
			action="?/hapusGelar"
			method="post"
			use:enhance={() => {
				loading = true;
				return async ({ result }) => {
					loading = false;
					if (result.type === 'success') {
						del = false;
						success = true;
						invalidateAll();
						clearTimeout(timer);
						timer = setTimeout(() => {
							success = false;
							del = false;
							invalidateAll();
						}, 3000);
					}
					if (result.type === 'failure') {
						console.log(result.data?.error);
					}
				};
			}}
		>
			<input type="hidden" name="id_gelar" value={data.id_gelar} />

			<DeleteModal bind:value={del} text="Apakah Yakin ingin di delete?" data={data.id_gelar}
			></DeleteModal>
		</form>
	{/if}
{/if}

{#if loading}
	<Loader></Loader>
{/if}
{#if edit}
	{#if tipe === 'arsip'}
		<form
			action="?/ubah"
			method="post"
			use:enhance={() => {
				loading = true;
				return async ({ result }) => {
					loading = false;
					if (result.type === 'success') {
						success = true;
						invalidateAll();
						clearTimeout(timer);
						timer = setTimeout(() => {
							success = false;
							edit = false;
							invalidateAll();
						}, 3000);
					}
					if (result.type === 'failure') {
						error = result.data?.error;
						console.log(error);
					}
				};
			}}
		>
			<Input
				bind:value={data}
				name="nama_jenis"
				{error}
				bind:input={edit}
				header="Nama Gelar"
				tipe="arsip"
			></Input>
		</form>
	{/if}

	{#if tipe === 'jenis_kerajaan'}
		<form
			action="?/ubahKerajaan"
			method="post"
			use:enhance={() => {
				loading = true;
				return async ({ result }) => {
					loading = false;
					if (result.type === 'success') {
						success = true;
						invalidateAll();
						clearTimeout(timer);
						timer = setTimeout(() => {
							success = false;
							edit = false;
							invalidateAll();
						}, 3000);
					}
					if (result.type === 'failure') {
						error = result.data?.error;
						console.log(error);
					}
				};
			}}
		>
			<Input
				bind:value={data}
				name="nama_jenis_kerajaan"
				{error}
				bind:input={edit}
				header="Jenis Kerajaan"
				tipe="jenis_kerajaan"
			></Input>
		</form>
	{/if}

	{#if tipe === 'gelar'}
		<form
			action="?/ubahGelar"
			method="post"
			use:enhance={() => {
				loading = true;
				return async ({ result }) => {
					loading = false;
					if (result.type === 'success') {
						success = true;
						invalidateAll();
						clearTimeout(timer);
						timer = setTimeout(() => {
							success = false;
							edit = false;
							invalidateAll();
						}, 3000);
					}
					if (result.type === 'failure') {
						error = result.data?.error;
						console.log(error);
					}
				};
			}}
		>
			<Input
				bind:value={data}
				name="nama_gelar"
				{error}
				bind:input={edit}
				header="Jenis Kerajaan"
				tipe="gelar"
			></Input>
		</form>
	{/if}

	{#if tipe === 'anggota'}
		<form
			action="?/ubahKerajaan"
			method="post"
			use:enhance={() => {
				loading = true;
				return async ({ result }) => {
					loading = false;
					if (result.type === 'success') {
						success = true;
						invalidateAll();
						clearTimeout(timer);
						timer = setTimeout(() => {
							success = false;
							edit = false;
							invalidateAll();
						}, 3000);
					}
					if (result.type === 'failure') {
						error = result.data?.error;
						console.log(error);
					}
				};
			}}
		>
			<KerajaanPopup
				{data}
				bind:value={edit}
				bind:error
				type="Ubah"
				dataGelar={data.gelar}
			></KerajaanPopup>
		</form>
	{/if}
{/if}
{#if success}
	<SModal text="sukses!"></SModal>
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
