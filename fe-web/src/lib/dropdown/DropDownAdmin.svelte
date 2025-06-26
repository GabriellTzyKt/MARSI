<script lang="ts">
	import { easeBack } from 'd3';
	import jd from '../../asset/profile/jdpp.jpg';
	import { slide } from 'svelte/transition';
	import DeleteModal from '$lib/popup/DeleteModal.svelte';
	import ModalAdmin from '$lib/popup/ModalAdmin.svelte';
	import { enhance } from '$app/forms';
	import SModal from '$lib/popup/SModal.svelte';
	import { invalidateAll } from '$app/navigation';
	import Loader from '$lib/loader/Loader.svelte';
	interface Actions {
		action?: () => void;
	}
	let {
		data = null,
		edit = $bindable(),
		actions = $bindable<Actions[]>([]),
		error = null
	} = $props();

	let open = $state(false);
	let value = $state(false);
	let timer: number;
	let valo = $state(false);
	let statusUpdated = $state(false);
	let statusUpdated2 = $state(false);
	let loading = $state(false);
	let isAktif: any = $state(false);

	$effect(() => {
		if (data) {
			isAktif = data.status_aktif === 1 ? 1 : 0;
			console.log('Setting isAktif to:', isAktif, 'based on data.status:', data.status_aktif);
		}
	});

	function isAktiforNon(event: Event) {
		event.stopPropagation();
		if (isAktif == true) {
			isAktif = false;
		} else {
			isAktif = true;
		}
	}
	function handleEdit() {
		if (!data || !data.id_admin) {
			console.error('Missing admin ID, cannot edit');
			return;
		}
		console.log('Opening edit modal for admin ID:', data.id_admin);
		edit = true;
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
	<div
		class="mx-2 flex cursor-pointer flex-col justify-between gap-3 p-4 lg:flex-row"
		onclick={() => toggle()}
	>
		<div class="flex items-center">
			<img src={jd} class="h-auto max-w-[55px] rounded-full" alt="" />
		</div>
		<div class="flex grow flex-col justify-center gap-4">
			<div>
				<p class="ml-2 text-lg font-[600]">{data.nama_lengkap}</p>
			</div>
			<div class="flex w-full items-center justify-between text-nowrap px-2">
				<div>
					<p class="text-md mr-5">{data?.jenis_admin}</p>
				</div>
				<form
					method="POST"
					action="?/updateStatus"
					use:enhance={() => {
						loading = true;
						console.log('Submitting form for:', data?.nama_lengkap, data?.id_admin);
						return async ({ result }) => {
							loading = false;
							console.log('Form result for:', data?.nama_lengkap, data?.id_admin, result);
							if (result.type === 'success') {
								statusUpdated = true;
								isAktif = !isAktif;
								clearTimeout(timer);
								timer = setTimeout(() => {
									statusUpdated = false;
								}, 3000);
								await invalidateAll();
							}
						};
					}}
				>
					<input type="hidden" name="id_admin" value={data?.id_admin} />
					<input type="hidden" name="id_kerajaan" value={data?.id_kerajaan} />
					<input type="hidden" name="nama_lengkap" value={data?.nama_lengkap} />
					<input type="hidden" name="jenis_kelamin" value={data?.jenis_kelamin} />
					<input type="hidden" name="tempat_lahir" value={data?.tempat_lahir} />
					<input type="hidden" name="tanggal_lahir" value={data?.tanggal_lahir} />
					<input type="hidden" name="username" value={data?.username} />
					<input type="hidden" name="password" value={data?.password} />
					<input type="hidden" name="email" value={data?.email} />
					<input type="hidden" name="no_telp" value={data?.no_telp} />
					<input type="hidden" name="jenis_admin" value={data?.jenis_admin} />
					<input type="hidden" name="status_aktif" value={isAktif ? 1 : 0} />
					<button
						type="submit"
						class="status cursor-pointer rounded-md px-3 py-1 {isAktif ? 'aktif' : 'non-aktif'}"
						onclick={(e) => {
							console.log('Status button clicked for:', data?.nama_lengkap, data?.id_admin);
							e.stopPropagation();
						}}
					>
						<p class="font-[500]">{isAktif ? 'Aktif' : 'Non-Aktif'}</p>
					</button>
				</form>
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
					<p class="text-sm text-[#5B5B5B]">{data.no_telp}</p>
				</div>
				<!-- Jenis Kelamin-->
				<div>
					<p class="font-[500]">Jenis Kelamin</p>
				</div>
				<div>
					<p class="text-sm text-[#5B5B5B]">{data.jenis_kelamin}</p>
				</div>
				<!-- TTL -->
				<div>
					<p class="font-[500]">Tempat, Tanggal Lahir</p>
				</div>
				<div>
					<p class="text-sm text-[#5B5B5B]">
						{data.tempat_lahir}, {data.tanggal_lahir
							? data.tanggal_lahir.split('T')[0]
							: data.tanggal_lahir}
					</p>
				</div>
				<!-- Email -->
				<div>
					<p class="font-[500]">Email</p>
				</div>
				<div>
					<p class="text-sm text-[#5B5B5B]">{data.email}</p>
				</div>
				<!-- Afiliasi -->
				<div>
					<p class="font-[500]">Afiliasi</p>
				</div>
				<div>
					{#if data.jenis_admin === 'super admin'}
						<p class="text-sm text-[#5B5B5B]">MARSI</p>
					{/if}
					{#if data.jenis_admin === 'admin kerajaan'}
						<p class="text-sm text-[#5B5B5B]">Kerajaan</p>
					{/if}
				</div>
			</div>
			<div class="flex w-full justify-end gap-4 p-4">
				<div>
					<!-- svelte-ignore a11y_consider_explicit_label -->
					<button
						class="flex gap-1 rounded-lg bg-red-500 px-6 py-2 text-white"
						onclick={(e) => {
							e.stopPropagation();
							if (!data || !data.id_admin) {
								console.error('Missing admin ID, cannot delete');
								return;
							}
							console.log('Opening delete confirmation for admin ID:', data.id_admin);
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
						type="submit"
						onclick={() => {
							for (const action of actions) {
								action.action();
							}
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
	<form
		action="?/delete"
		method="POST"
		use:enhance={() => {
			loading = true;
			if (!data || !data.id_admin) {
				console.error('Missing admin ID, cannot delete');
				return;
			}

			console.log('Deleting admin ID:', data.id_admin);

			return async ({ result }) => {
				loading = true;
				console.log(result);
				if (result.type === 'success') {
					value = false;
					// Show success message
					statusUpdated2 = true;
					// clearTimeout(timer);
					await invalidateAll().then(() => {
						setTimeout(() => {
							statusUpdated2 = false;
						}, 3000);
					});
				}
			};
		}}
	>
		<input type="hidden" name="id_admin" value={data?.id_admin} />
		<DeleteModal bind:value text="Apakah Anda Ingin Menghapus Admin?"></DeleteModal>
	</form>
{/if}

{#if valo}
	<SModal text="Admin Berhasil Dirubah"></SModal>
{/if}

{#if statusUpdated}
	<SModal text="Status berhasil diubah"></SModal>
{/if}

{#if statusUpdated2}
	<SModal text="Data berhasil dihapus"></SModal>
{/if}

{#if loading}
	<Loader></Loader>
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
