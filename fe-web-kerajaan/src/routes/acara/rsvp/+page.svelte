<script lang="ts">
	import Footer from '$lib/footer/Footer.svelte';
	import Navbar from '$lib/navbar/Navbar.svelte';
	import Rsvp from '$lib/rsvp/Rsvp.svelte';

	let value = $state('');
	let number = $state(1);
	let show = $state(false);

	function showdaftar() {
		show = true;
	}

	function closedaftar() {
		show = false;
	}

	function increase() {
		number += 1;
	}
</script>

<div class="relative">
	<Navbar></Navbar>
</div>

<section class="min-h-screen w-full bg-gray-100 pb-10 pt-10">
	<div class="relative flex items-center justify-between self-center pt-10 text-center">
		<a href="/acara"><span class="solar--arrow-left-outline absolute ml-8"></span></a>
		<p class="mx-auto items-center justify-center text-center text-xl font-semibold">RSVP</p>
	</div>
	<p class="mx-auto mt-10 items-center justify-center text-center text-xl font-semibold">
		Nama Acara
	</p>
	<div class="grid grid-cols-1 gap-8 px-10 py-10 md:grid-cols-2">
		<div>
			<div class="flex flex-col">
				<p>Jenis Kelamin</p>
				<div>
					<select
						bind:value
						placeholder="Jenis Kelamin"
						class="border-full block w-full rounded border border-gray-300 bg-white px-5 py-2 text-left text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					>
						<option value="" disabled selected>Jenis Kelamin</option>
						<option>Laki-Laki</option>
						<option>Perempuan</option>
					</select>
				</div>
			</div>

			<div class="mt-4 flex flex-col">
				<p>Nama Lengkap</p>
				<input type="text" class="rounded-lg border-2 px-2 py-2" placeholder="Masukkan nama" />
			</div>

			<div class="mt-4 flex flex-col">
				<p>Nomor telepon</p>
				<input
					type="text"
					class="rounded-lg border-2 px-2 py-2"
					placeholder="Masukkan nomor telepon"
				/>
			</div>
		</div>

		<div>
			<div class="mb-2 flex items-center justify-between">
				<p>Apakah ada tamu lain?</p>
				<div class="flex">
					<div class="mx-2 flex items-center justify-center">
						<input
							id="default-radio-1"
							type="radio"
							value=""
							name="default-radio"
							class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
							onclick={showdaftar}
						/>
						<label for="default-radio-1" class="ms-2 text-sm font-medium text-gray-900">Ya</label>
					</div>
					<div class="mx-2 flex items-center justify-center">
						<input
							checked
							id="default-radio-2"
							type="radio"
							value=""
							name="default-radio"
							class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
							onclick={closedaftar}
						/>
						<label for="default-radio-2" class="ms-2 text-sm font-medium text-black">Tidak</label>
					</div>
				</div>
				<button
					class="flex w-fit items-center justify-center rounded-lg bg-green-700 px-2 py-2 text-center text-white"
					onclick={increase}
				>
					+Tambah data
				</button>
			</div>

			{#if show == true}
				{#each Array(number) as _}
					<Rsvp></Rsvp>
				{/each}
                <div class="w-full flex justify-end">
                    <button class="rounded-lg bg-blue-600 px-4 py-2 text-white">
                        Simpan
                    </button>
                </div>
			{/if}

		</div>
	</div>
</section>

<section class="h-fot flex min-w-full overflow-hidden">
	<Footer></Footer>
</section>

<style>
	.solar--arrow-left-outline {
		display: inline-block;
		width: 32px;
		height: 32px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' fill-rule='evenodd' d='M10.53 5.47a.75.75 0 0 1 0 1.06l-4.72 4.72H20a.75.75 0 0 1 0 1.5H5.81l4.72 4.72a.75.75 0 1 1-1.06 1.06l-6-6a.75.75 0 0 1 0-1.06l6-6a.75.75 0 0 1 1.06 0' clip-rule='evenodd'/%3E%3C/svg%3E");
	}
</style>
