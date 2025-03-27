<script lang="ts">
	import { dummyGelar, dummyJenisKerajaan, dummyDokumen, dummyRoleAdmin } from '$lib/dummy';
	import Table from '$lib/table/Table.svelte';
	import CustomBtn from './CustomBtn.svelte';
	import Input from './Input.svelte';
	let opt = ['Gelar', 'Jenis Kerajaan', 'Arsip'];
	let { data } = $props();
	const data_role = data.dataArsip;
	console.log(data_role);
	let select = $state('Gelar');
	let input = $state(false);
	function change(p: string) {
		select = p;
	}
</script>

<div class="flex w-full flex-col gap-4 xl:mx-4">
	<div class="flex flex-col justify-center gap-2 xl:flex-row xl:justify-between xl:gap-0">
		<div class="flex flex-col justify-center gap-4 xl:flex-row xl:justify-start">
			{#each opt as o}
				<div class="flex flex-col">
					<button
						class=" w-full min-w-[200px] rounded-md border border-[#FFA600] py-2 font-[700] transition-colors duration-100 ease-in-out hover:bg-[#FFA600] hover:text-white"
						class:bg-[#FFA600]={select === o}
						class:text-white={select === o}
						onclick={() => change(o)}
						>{o}
					</button>
				</div>
			{/each}

			<!-- <div class="flex flex-row gap-4">
				<button
					class=" w-full min-w-[200px] rounded-md border border-[#FFA600] py-2 font-[700] transition-colors duration-100 ease-in-out hover:bg-[#FFA600] hover:text-white"
					>Jenis Kerajaan</button
				>
			</div>
			<div class="flex flex-row gap-4">
				<button
					class="  w-full min-w-[200px] rounded-md border border-[#FFA600] py-2 font-[700] transition-colors duration-100 ease-in-out hover:bg-[#FFA600] hover:text-white"
					>Dokumen</button
				>
			</div>
			<div class="flex flex-row gap-4">
				<button
					class="  w-full min-w-[200px] rounded-md border border-[#FFA600] py-2 font-[700] transition-colors duration-100 ease-in-out hover:bg-[#FFA600] hover:text-white"
					>Role Admin</button
				>
			</div> -->
		</div>
		<div class="flex items-center justify-center">
			<button
				class="border-md w-full rounded-md border bg-[#FFA600] px-6 py-2 font-[700] text-white xl:w-auto"
				onclick={() => (input = true)}>+ Tambah Data</button
			>
		</div>
	</div>
	<div class="h-[2px] w-full bg-[#949494]"></div>
	<div class="flex flex-col items-center justify-center gap-3 xl:flex-row xl:justify-end">
		<div class="flex justify-between gap-3 rounded-lg border border-[#818181] bg-white">
			<div class="ms-2 flex grow">
				<input
					type="text"
					class="border-none focus:outline-none focus:ring-0"
					placeholder={`cari ${select}`}
					name=""
					id=""
				/>
			</div>
			<div class="me-2 flex items-center">
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
						d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
					/>
				</svg>
			</div>
		</div>
		<div class="flex items-center gap-3">
			<p>Show</p>
			<input
				type="number"
				class="flex w-16 justify-center rounded-lg border border-[#818181] bg-white focus:outline-none"
				name=""
				id=""
			/>
			<p>entries</p>
		</div>
	</div>
	<div>
		{#if select === 'Gelar'}
			<Table
				table_header={[
					['gelar', 'Gelar', 'justify-start flex grow'],
					['children', 'Aksi', 'text-right pe-48']
				]}
				table_data={dummyGelar}
			>
				{#snippet children({ header, data, index })}
					{#if header === 'Aksi'}
						<CustomBtn></CustomBtn>
					{/if}
				{/snippet}
			</Table>
		{:else if select === 'Jenis Kerajaan'}
			<Table
				table_header={[
					['jenis', 'Jenis Kerajaan', 'justify-start flex grow'],
					['children', 'Aksi', 'text-right pe-48']
				]}
				table_data={dummyJenisKerajaan}
			>
				{#snippet children({ header, data, index })}
					{#if header === 'Aksi'}
						<CustomBtn></CustomBtn>
					{/if}
				{/snippet}
			</Table>
		{:else if select === 'Arsip'}
			<Table
				table_header={[
					['nama_jenis', 'Jenis Arsip', 'justify-start flex grow'],
					['children', 'Aksi', 'text-right pe-48']
				]}
				table_data={data_role}
			>
				{#snippet children({ header, data, index })}
					{#if header === 'Aksi'}
						<CustomBtn></CustomBtn>
					{/if}
				{/snippet}
			</Table>
		{/if}
	</div>
	{#if input}
		{#if select === 'Arsip'}
			<Input bind:input name={'nama_jenis'}></Input>
		{/if}
	{/if}
</div>
