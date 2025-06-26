<script lang="ts">
	import { enhance } from '$app/forms';
	import { navigating } from '$app/state';
	import Loader from '$lib/loader/Loader.svelte';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	let errors = $state();
	let open = $state(false);
	let timer: number;
	let loading = $state(false);
</script>

{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
{#if loading}
	<Loader></Loader>
{/if}
<div class="mx-6 flex w-full flex-col">
	<form
		action="?/tambahMobile"
		method="post"
		use:enhance={() => {
			loading = true;
			return async ({ result }) => {
				loading = false;
				if (result.type === 'success') {
					open = true;
					clearTimeout(timer);
					timer = setTimeout(() => {
						open = false;
					}, 3000);
				}
				if (result.type === 'failure') {
					console.log(errors);
					errors = result.data?.errors;
				}
			};
		}}
	>
		<div class=" my-4 flex">
			<p class="text-2xl font-[600]">Pilih Fitur yang Anda Butuhkan</p>
		</div>
		<div class="grid w-full grid-cols-1 gap-4 rounded-lg border p-4 lg:grid-cols-3">
			<!-- roe 1 -->
			<div class="flex flex-col gap-4 justify-self-center lg:place-self-start">
				<!-- penanggalan -->
				<div class="flex flex-col items-center lg:items-start">
					<div class="">
						<p class="text-xl font-[500]">Penanggalan</p>
					</div>
					<div class="mt-2 flex flex-row gap-4">
						<div class="flex gap-1">
							<input type="radio" name="penanggalan" id="" />
							<p>Ya</p>
						</div>
						<div class="flex gap-1">
							<input type="radio" name="penanggalan" id="" />
							<p>Tidak</p>
						</div>
					</div>
					<div class="flex">
						{#if errors}
							{#each errors as e}
								<p class="text-left text-red-500">{e.penanggalan}</p>
							{/each}
						{/if}
					</div>
				</div>
				<!-- tambahan penanggalan -->
				<div class=" flex flex-col items-center gap-2 lg:items-start">
					<div>
						<p class="text-xl font-[500]">
							Tambahan Penanggalan <span class="text-sm text-gray-500">(pilih salah satu)</span>
						</p>
					</div>
					<div class="grid grid-cols-2 gap-2">
						<div class="flex">
							<input type="radio" name="tambahan_penanggalan" class="me-2" id="" />
							<p>Penanggalan Jawa</p>
						</div>
						<div class="flex">
							<input type="radio" name="tambahan_penanggalan" class="me-2" id="" />
							<p>Penanggalan Cina</p>
						</div>
						<div class="flex">
							<input type="radio" name="tambahan_penanggalan" class="me-2" id="" />
							<p>Penanggalan Hindu</p>
						</div>
						<div class="flex">
							<input type="radio" name="tambahan_penanggalan" class="me-2" id="" />
							<p>Penanggalan Arab</p>
						</div>
					</div>
					<div class="flex">
						{#if errors}
							{#each errors as e}
								<p class="text-left text-red-500">{e.tambahan_penanggalan}</p>
							{/each}
						{/if}
					</div>
				</div>
				<!-- Tugas Pribadi -->
				<div class="flex flex-col items-center gap-1 lg:items-start">
					<div>
						<p class="text-xl font-[500]">Tugas Pribadi</p>
					</div>
					<div class="mt-2 flex flex-row gap-4">
						<div class="flex gap-1">
							<input type="radio" name="pribadi" id="" />
							<p>Ya</p>
						</div>
						<div class="flex gap-1">
							<input type="radio" name="pribadi" id="" />
							<p>Tidak</p>
						</div>
					</div>
					<div class="flex">
						{#if errors}
							{#each errors as e}
								<p class="text-left text-red-500">{e.pribadi}</p>
							{/each}
						{/if}
					</div>
				</div>
				<!-- Tugas Acara -->
				<div class="mb-6 flex flex-col items-center gap-1 lg:mb-0 lg:items-start">
					<div>
						<p class="text-xl font-[500]">Tugas Acara</p>
					</div>
					<div class="mt-2 flex flex-row gap-4">
						<div class="flex gap-1">
							<input type="radio" name="acara" id="" />
							<p>Ya</p>
						</div>
						<div class="flex gap-1">
							<input type="radio" name="acara" id="" />
							<p>Tidak</p>
						</div>
					</div>
					<div class="flex">
						{#if errors}
							{#each errors as e}
								<p class="text-left text-red-500">{e.acara}</p>
							{/each}
						{/if}
					</div>
				</div>
			</div>

			<!-- row 2 -->
			<div class="flex flex-col gap-4 justify-self-center">
				<!-- situs kerajaan -->
				<div class="flex flex-col items-center lg:items-start">
					<div class="">
						<p class="text-xl font-[500]">Situs Kerajaan</p>
					</div>
					<div class="mt-2 flex flex-row gap-4">
						<div class="flex gap-1">
							<input type="radio" name="situs_kerajaan" id="" />
							<p>Ya</p>
						</div>
						<div class="flex gap-1">
							<input type="radio" name="situs_kerajaan" id="" />
							<p>Tidak</p>
						</div>
					</div>
					<div class="flex">
						{#if errors}
							{#each errors as e}
								<p class="text-left text-red-500">{e.situs_kerajaan}</p>
							{/each}
						{/if}
					</div>
				</div>
				<!-- chek in situs -->
				<div class="flex flex-col items-center lg:items-start">
					<div class="">
						<p class="text-xl font-[500]">Check In Situs</p>
					</div>
					<div class="mt-2 flex flex-row gap-4">
						<div class="flex gap-1">
							<input type="radio" name="check_in_situs" id="" />
							<p>Ya</p>
						</div>
						<div class="flex gap-1">
							<input type="radio" name="check_in_situs" id="" />
							<p>Tidak</p>
						</div>
					</div>
					<div class="flex">
						{#if errors}
							{#each errors as e}
								<p class="text-left text-red-500">{e.check_in_situs}</p>
							{/each}
						{/if}
					</div>
				</div>
				<!-- acara kerajaan-->
				<div class="flex flex-col items-center lg:items-start">
					<div class="">
						<p class="text-xl font-[500]">Acara Kerajaan</p>
					</div>
					<div class="mt-2 flex flex-row gap-4">
						<div class="flex gap-1">
							<input type="radio" name="acara_kerajaan" id="" />
							<p>Ya</p>
						</div>
						<div class="flex gap-1">
							<input type="radio" name="acara_kerajaan" id="" />
							<p>Tidak</p>
						</div>
					</div>
					<div class="flex">
						{#if errors}
							{#each errors as e}
								<p class="text-left text-red-500">{e.acara_kerajaan}</p>
							{/each}
						{/if}
					</div>
				</div>
				<!-- grup chat-->
				<div class="mb-6 flex flex-col items-center lg:mb-0 lg:items-start">
					<div class="">
						<p class="text-xl font-[500]">Grup Chat</p>
					</div>
					<div class="mt-2 flex flex-row gap-4">
						<div class="flex gap-1">
							<input type="radio" name="grup_chat" id="" />
							<p>Ya</p>
						</div>
						<div class="flex gap-1">
							<input type="radio" name="grup_chat" id="" />
							<p>Tidak</p>
						</div>
					</div>
					<div class="flex">
						{#if errors}
							{#each errors as e}
								<p class="text-left text-red-500">{e.grup_chat}</p>
							{/each}
						{/if}
					</div>
				</div>
			</div>
			<!-- row 3 -->
			<div class="flex flex-col gap-4 justify-self-center">
				<!-- grup chat-->
				<div class="flex flex-col items-center lg:items-start">
					<div class="">
						<p class="text-xl font-[500]">Forum</p>
					</div>
					<div class="mt-2 flex flex-row gap-4">
						<div class="flex gap-1">
							<input type="radio" name="forum" id="" />
							<p>Ya</p>
						</div>
						<div class="flex gap-1">
							<input type="radio" name="forum" id="" />
							<p>Tidak</p>
						</div>
					</div>
					<div class="flex">
						{#if errors}
							{#each errors as e}
								<p class="text-left text-red-500">{e.forum}</p>
							{/each}
						{/if}
					</div>
				</div>
				<!-- profil -->
				<div class=" flex flex-col items-center gap-2 lg:items-start">
					<div>
						<p class="text-xl font-[500]">
							Profil <span class="text-sm text-gray-500">(pilih sesuai kebutuhan)</span>
						</p>
					</div>
					<div class=" grid grid-cols-2 items-center gap-2">
						<div class="flex">
							<input type="radio" name="profil" class="me-2" id="" />
							<p>Semua</p>
						</div>
						<div class="flex">
							<input type="radio" name="profil" class="me-2" id="" />
							<p>Profil dan Riwayat Kelompok</p>
						</div>
						<div class="flex">
							<input type="radio" name="profil" class="me-2" id="" />
							<p>Profil dan Riwayat Acara</p>
						</div>
						<div class="flex">
							<input type="radio" name="profil" class="me-2" id="" />
							<p>Profil Saja</p>
						</div>
					</div>
					<div class="flex">
						{#if errors}
							{#each errors as e}
								<p class="text-left text-red-500">{e.profil}</p>
							{/each}
						{/if}
					</div>
				</div>
				<!-- Permohonan-->
				<div class="flex flex-col items-center lg:items-start">
					<div class="">
						<p class="text-xl font-[500]">Permohonan</p>
					</div>
					<div class="mt-2 flex flex-row gap-4">
						<div class="flex gap-1">
							<input type="radio" name="permohonan" id="" />
							<p>Ya</p>
						</div>
						<div class="flex gap-1">
							<input type="radio" name="permohonan" id="" />
							<p>Tidak</p>
						</div>
					</div>
					<div class="flex">
						{#if errors}
							{#each errors as e}
								<p class="text-left text-red-500">{e.permohonan}</p>
							{/each}
						{/if}
					</div>
				</div>
			</div>
		</div>
		<div class="mt-4 flex justify-center lg:justify-end">
			<button class="bg-badran-bdg w-full rounded-lg px-6 py-2 text-white lg:w-auto" type="submit"
				>Simpan Data</button
			>
		</div>
	</form>
</div>
{#if open}
	<SuccessModal text="Movile Berhasil Di Save"></SuccessModal>
{/if}
