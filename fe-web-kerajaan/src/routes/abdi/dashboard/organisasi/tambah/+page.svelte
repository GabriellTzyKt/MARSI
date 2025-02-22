<script lang="ts">
	import jd from '$lib/asset/profile/jdpp.jpg';
	import Input from '$lib/input/Input.svelte';
</script>

<div class="flex w-full flex-col">
	<div class=" mt-8 w-full">
		<div class="flex justify-center">
			<div class="relative">
				<img src={jd} class="h-24 w-auto rounded-full" alt="" />
				<!-- Tombol Edit Foto -->
				<!-- svelte-ignore a11y_consider_explicit_label -->
				<button class="absolute bottom-0 right-0 rounded-xl bg-white p-2 shadow-md">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
						/>
					</svg>
				</button>
			</div>
		</div>
	</div>
	<form action="">
		<div class="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-6">
			<!-- nama organisasi -->
			<div class="flex flex-col xl:col-span-3">
				<div class="">
					<p>Nama Organisasi</p>
				</div>
				<div class="mt-2">
					<Input type="text" value="Nama Organisasi"></Input>
				</div>
			</div>
			<!-- Penanggung Jawab -->
			<div class="flex flex-col xl:col-span-3">
				<div class="">
					<p>Penanggung Jawab</p>
				</div>
				<div class="mt-2">
					<Input type="text" value="Penanggung Jawab"></Input>
				</div>
			</div>
			<!-- Alamat -->
			<div class="flex flex-col xl:col-span-3">
				<div class="">
					<p>Alamat</p>
				</div>
				<div class="mt-2">
					<Input type="adress" value="Alamat"></Input>
				</div>
			</div>
			<!-- Pembina -->
			<div class="flex flex-col xl:col-span-2">
				<div class="">
					<p>Pembina</p>
				</div>
				<div class="mt-2">
					<Input type="name" value="Pembina"></Input>
				</div>
			</div>
			<!-- button permohonan -->
			<div class="flex items-end">
				<button class="bg-badran-bt w-full rounded-xl py-2 text-white">Permohonan</button>
			</div>
			<!-- Email -->
			<div class="flex flex-col xl:col-span-3">
				<div class="">
					<p>Email</p>
				</div>
				<div class="mt-2">
					<Input type="email" value="Email"></Input>
				</div>
			</div>
			<!-- Pembina -->
			<div class="flex flex-col xl:col-span-2">
				<div class="">
					<p>Pelindung</p>
				</div>
				<div class="mt-2">
					<Input type="name" value="Pelindung"></Input>
				</div>
			</div>
			<!-- button permohonan -->
			<div class="flex items-end">
				<button class="bg-badran-bt w-full rounded-xl py-2 text-white">Permohonan</button>
			</div>
		</div>
		<!-- deskripsi organisasi -->
		<div class="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-4">
			<div class="flex flex-col xl:col-span-2">
				<div>
					<p class="text-xl">Deskripsi Organisasi</p>
				</div>
				<div class="mt-2">
					<textarea
						maxlength="500"
						placeholder="deskripsi orgqanisasi.... "
						rows="5"
						class="w-full rounded-lg border border-gray-500 bg-white py-2 ps-2 text-gray-500 focus:outline-none"
					></textarea>
				</div>
			</div>
			<!-- no telepon -->
			<div class="flex flex-col">
				<div>
					<p class="text-xl">No Telepon</p>
				</div>
				<div class="mt-2">
					<Input type="phone" value="xxxxxxxxxxxx"></Input>
				</div>
			</div>
			<!-- Jumlah Anggota -->
			<div class="flex flex-col">
				<div>
					<p class="text-xl">Jumlah Anggota</p>
				</div>
				<div class="mt-2">
					<Input type="number" value="100"></Input>
				</div>
			</div>
		</div>
		<div class="mt-8 flex w-full justify-end">
			<button class=" bg-badran-bdg w-full rounded-lg px-3 py-2 text-white xl:w-auto"
				>Buat Organisasi</button
			>
		</div>
	</form>
</div>
