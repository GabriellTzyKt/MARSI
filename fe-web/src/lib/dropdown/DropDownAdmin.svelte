<script lang="ts">
	import { easeBack } from 'd3';
	import jd from '../../asset/profile/jdpp.jpg';
	import { slide } from 'svelte/transition';
	import DeleteModal from '$lib/popup/DeleteModal.svelte';
	import ModalAdmin from '$lib/popup/ModalAdmin.svelte';
	import { enhance } from '$app/forms';
	import SModal from '$lib/popup/SModal.svelte';
	let open = $state(false);
	let value = $state(false);
	let timer: number;
	// let edit = $state(false);
	let isAktif = $state(true);
	let valo = $state(false);
	let { data = null, edit = $bindable(), error = null } = $props();

	function isAktiforNon(event: Event) {
		event.stopPropagation();
		if (isAktif == true) {
			isAktif = false;
		} else {
			isAktif = true;
		}
	}

	function toggle() {
		if (!open) open = true;
		else open = false;
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->

<div
	class="flex w-full max-w-[800px] flex-col place-self-start rounded-lg border border-[#76768033] bg-white shadow-2xl"
>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div class="mx-2 flex lg:flex-row flex-col cursor-pointer justify-between gap-3 p-4" onclick={() => toggle()}>
		<div class="flex items-center">
			<img src={jd} class="h-auto max-w-[55px] rounded-full" alt="" />
		</div>
		<div class="flex grow flex-col justify-center gap-4">
			<div>
				<p class="ml-2 text-lg font-[600]">Eric Yoel</p>
			</div>
			<div class="flex w-full items-center justify-between text-nowrap px-2">
				<div>
					<p class="text-md mr-5">Super Admin</p>
				</div>
				<div
					class="status cursor-pointer rounded-md px-3 py-1 {isAktif ? 'aktif' : 'non-aktif'}"
					onclick={isAktiforNon}
				>
					<p class="font-[500]">{isAktif ? 'Aktif' : 'Non-Aktif'}</p>
				</div>
			</div>
		</div>
		<div class="flex items-center transition-transform duration-150" class:rotate-180={open}>
			<svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24"
				><path
					fill="currentColor"
					d="M19.109 14.905a.75.75 0 0 1-1.061 0l-5.72-5.72l-5.72 5.72a.75.75 0 0 1-1.06-1.06l6.25-6.25a.75.75 0 0 1 1.06 0l6.25 6.25a.75.75 0 0 1 0 1.06"
				/></svg
			>
		</div>
	</div>
	{#if open}
		<div
			class="  flex w-full flex-col rounded-lg border border-[#76768033] shadow-2xl"
			transition:slide={{ duration: 180 }}
		>
			<div class=" grid w-full grid-cols-2 items-center justify-center p-4">
				<!-- No Telponm -->
				<div>
					<p class="font-[500]">No Telepon</p>
				</div>
				<div>
					<p class="text-sm text-[#5B5B5B]">No Telepon</p>
				</div>
				<!-- Jenis Kelamin-->
				<div>
					<p class="font-[500]">Jenis Kelamin</p>
				</div>
				<div>
					<p class="text-sm text-[#5B5B5B]">Perempuan</p>
				</div>
				<!-- TTL -->
				<div>
					<p class="font-[500]">Tempat, Tanggal Lahir</p>
				</div>
				<div>
					<p class="text-sm text-[#5B5B5B]">Sukowono, 22 Desember 2004</p>
				</div>
				<!-- Email -->
				<div>
					<p class="font-[500]">Email</p>
				</div>
				<div>
					<p class="text-sm text-[#5B5B5B]">jd3@gmail.com</p>
				</div>
				<!-- Afiliasi -->
				<div>
					<p class="font-[500]">Afiliasi</p>
				</div>
				<div>
					<p class="text-sm text-[#5B5B5B]">MARSI</p>
				</div>
			</div>
			<div class="flex w-full justify-end gap-4 p-4">
				<div>
					<!-- svelte-ignore a11y_consider_explicit_label -->
					<button
						class="flex gap-1 rounded-lg bg-red-500 px-6 py-2 text-white"
						onclick={() => {
							value = true;
						}}
						><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
							><path
								fill="currentColor"
								d="M14.722 12.759a.75.75 0 0 0-1.498-.074L13 17.24a.75.75 0 0 0 1.498.074zm-4.734-.786a.75.75 0 0 0-.712.785l.224 4.557a.75.75 0 1 0 1.498-.074l-.224-4.556a.75.75 0 0 0-.786-.712"
							/><path
								fill="currentColor"
								d="M10.249 2a2.25 2.25 0 0 0-2.25 2.25V5H5.5a2.25 2.25 0 0 0-.587 4.423l.628 10.462A2.25 2.25 0 0 0 7.787 22h8.424a2.25 2.25 0 0 0 2.246-2.115l.628-10.462A2.25 2.25 0 0 0 18.498 5h-2.499v-.75A2.25 2.25 0 0 0 13.749 2zm4.25 3h-5v-.75a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 .75.75zM5.5 6.5h12.998a.75.75 0 1 1 0 1.5H5.5a.75.75 0 0 1 0-1.5m.92 3h11.158l-.618 10.295a.75.75 0 0 1-.749.705H7.787a.75.75 0 0 1-.749-.705z"
							/></svg
						> Hapus</button
					>
				</div>
				<div>
					<!-- svelte-ignore a11y_consider_explicit_label -->
					<button
						class="flex gap-1 rounded-lg bg-[#FFA600] px-6 py-2 text-white"
						onclick={() => {
							edit = true;
						}}
						><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
							><path
								fill="currentColor"
								d="M19.303 3.78a2.25 2.25 0 0 0-3.182 0L14.35 5.551l-.033.033l-8.483 8.483a2.25 2.25 0 0 0-.562.936l-1.22 4.01a.75.75 0 0 0 .936.935l4.009-1.22c.353-.108.675-.3.936-.562L20.22 7.88a2.25 2.25 0 0 0 0-3.182zm-4.44 3.378l1.979 1.978l-7.97 7.97a.75.75 0 0 1-.312.187l-2.664.81l.811-2.663a.75.75 0 0 1 .187-.312zm3.04.918l-1.978-1.978L17.18 4.84a.75.75 0 0 1 1.061 0l.917.917a.75.75 0 0 1 0 1.06z"
							/></svg
						>Ubah</button
					>
				</div>
			</div>
		</div>
	{/if}
</div>
{#if value}
	<DeleteModal
		bind:value
		choose="arsip"
		text="Apakah Adna Ingin Mengarsip Admin?"
		successText="Admin Berhasil Dihapus"
	></DeleteModal>
{/if}
{#if edit}
	<form action="?/ubah" method="POST" use:enhance={() => {
		return async ({ result }) => {
			console.log(result);
			if (result.type === 'success') {
				valo = true;
				clearTimeout(timer);
				timer = setTimeout(() => {
					valo = false;
					edit = false;
				}, 3000);
			} else if (result.type === 'failure') {
				error = result?.data?.errors;
			}
		};
	}}>
		<ModalAdmin textM="Ubah" bind:value={edit} bind:open={valo} errors={error} {data}></ModalAdmin>
	</form>
{/if}
{#if valo}
	<SModal text="Admin Berhasil Dirubah"></SModal>
{/if}

<style>
	.aktif {
		background-color: #22c55e;
	}

	.non-aktif {
		background-color: #ef4444;
	}

	.status {
		transition: background-color 0.4s ease-in-out;
	}
</style>
