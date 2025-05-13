<script lang="ts">
	import Status from '$lib/table/Status.svelte';
	import Table from '$lib/table/Table.svelte';
	import { dummyWebsiteRequests } from '$lib/dummy';
	import StatusWeb from '$lib/table/StatusWeb.svelte';
</script>

<div class="flex w-full flex-col">
	<div class=" mb-4 mt-4">
		<p class="text-2xl font-semibold">Permintaan Website Kerajaan</p>
	</div>
	<div class="mb-4 h-[0.2px] w-full bg-gray-600"></div>
	<div class="my-4 flex items-center justify-end gap-2">
		<div class="flex justify-between rounded-lg border border-black bg-white px-2">
			<div>
				<input type="text" class="flex rounded-lg border-none focus:outline-none focus:ring-0" />
			</div>
			<div class="flex items-center">
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
		<div class="flex flex-row items-center gap-2">
			<div>
				<p>Show</p>
			</div>
			<div>
				<input
					type="number"
					class="flex h-auto w-16 rounded-lg border border-gray-700 px-2 py-2 focus:outline-none"
				/>
			</div>
			<div>
				<p>entries</p>
			</div>
		</div>
	</div>
	<div class="flex flex-col">
		<Table
			table_header={[
				['asal_kerajaan', 'Asal Kerajaan'],
				['link_website', 'Link Website'],
				['tanggal_request', 'Tanggal Request Dibuat'],
				['tanggal_selesai', 'Tanggal Request Selesai'],
				['children', 'Status'],
				['children', 'Aksi']
			]}
			table_data={dummyWebsiteRequests}
		>
			{#snippet children({ header, data, index })}
				{#if header === 'Status'}
					<StatusWeb status={data.status}></StatusWeb>
				{/if}
				{#if header === 'Aksi'}
					<button class="rounded-lg bg-blue-500 px-2 py-1 text-white">Detail</button>
				{/if}
			{/snippet}
		</Table>
	</div>
</div>
