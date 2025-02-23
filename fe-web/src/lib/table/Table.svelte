<script lang="ts">
	import type { Snippet } from 'svelte';

	interface IProps {
		table_data: Record<string, any>[];
		table_header: (string | string[])[];
		children?: Snippet<[any]>;
	}

	let { table_data, table_header, children }: IProps = $props();
	console.log(table_data);
</script>

<div class="mt-4 flex w-full flex-col overflow-x-auto rounded-xl">
	<table class=" w-full table-auto border-separate border-spacing-0 rounded-xl border">
		<thead class="marsi rounded-xl">
			<tr class=" rounded-xl">
				<th class="rounded-tl-xl px-2 py-3 text-left">No</th>
				{#each table_header as header, i}
					{#if typeof header === 'string'}
						<th class="py-3 pe-2 text-left">{header}</th>
					{:else}
						<th class="py-3 pe-2 text-left" class:rounded-tr-xl={i === table_header.length - 1}
							>{header[1]}</th
						>
					{/if}
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each table_data as data, i}
				<tr class="">
					<td
						class=" py-3 text-center"
						class:border-y={i !== table_data.length - 1}
						class:border-bl-xl={i === table_data.length - 1}
						class:border-br-xl={i === table_data.length - 1}
					>
						{i + 1}
					</td>
					{#each table_header as header, b}
						{#if typeof header === 'string'}
							<td
								class=" py-3 text-left"
								class:border-y={i !== table_data.length - 1}
								class:border-bl-xl={i === table_data.length - 1 && b === table_header.length - 1}
								class:border-br-xl={i === table_data.length - 1 && b === table_header.length - 1}
								>{data[header]}</td
							>
						{:else if header[0] === 'children'}
							<td
								class=" py-3 text-left"
								class:border-y={i !== table_data.length - 1}
								class:border-bl-xl={i === table_data.length - 1 && b === table_header.length - 1}
								class:border-br-xl={i === table_data.length - 1 && b === table_header.length - 1}
								>{@render children?.({ data, header: header[1], index: i })}</td
							>
						{:else}
							<td
								class=" py-3 text-left"
								class:border-y={i !== table_data.length - 1}
								class:border-bl-xl={i === table_data.length - 1 && b === table_header.length - 1}
								class:border-br-xl={i === table_data.length - 1 && b === table_header.length - 1}
								>{data[header[0]]}
							</td>
						{/if}
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
	<div class="mt-4 flex w-full flex-col md:flex-row md:justify-between">
		<div>
			<p class=" text-gray-500">Showing 1 to 10 of 20 entries</p>
		</div>
		<div class="flex flex-row">
			<div>
				<button class=" m border-badran-bt hover:bg-badran-bt border p-2">Previous</button>
			</div>
			<div>
				<button class="border-badran-bt hover:bg-marsi m border p-2">1</button>
			</div>
			<div>
				<button class="border-badran-bt hover:bg-badran-bt m border p-2">2</button>
			</div>
			<div>
				<button class="border-badran-bt hover:bg-badran-bt m border p-2">3</button>
			</div>
			<div>
				<button class="border-badran-bt hover:bg-badran-bt m border p-2">4</button>
			</div>
			<div>
				<button class="border-badran-bt hover:bg-badran-bt m border p-2">...</button>
			</div>
			<div>
				<button class="border-badran-bt hover:bg-badran-bt m border p-2">10</button>
			</div>
			<div>
				<button class="border-badran-bt hover:bg-badran-bt m border p-2">Next</button>
			</div>
		</div>
	</div>
</div>

<style>
	.marsi {
		background-color: #f9d48b;
	}
	.m:hover {
		background-color: #f9d48b;
	}
</style>
