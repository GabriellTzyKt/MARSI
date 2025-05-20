<script lang="ts">
	import type { Snippet } from 'svelte';

	interface IProps {
		table_data: Record<string, any>[];
		table_header: (string | string[])[];
		children?: Snippet<[any]>;
		picture?: Snippet<[any]>;
	}

	let { table_data, table_header, children, picture }: IProps = $props();
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
						class=" mx-2 whitespace-normal break-words py-3 text-center"
						class:border-y={i !== table_data.length - 1}
						class:border-bl-xl={i === table_data.length - 1}
						class:border-br-xl={i === table_data.length - 1}
					>
						{i + 1 || '-'}
					</td>
					{#each table_header as header, b}
						{#if typeof header === 'string'}
							<td
								class="  whitespace-normal break-words px-2 py-3 text-left"
								class:border-y={i !== table_data.length - 1}
								class:border-bl-xl={i === table_data.length - 1 && b === table_header.length - 1}
								class:border-br-xl={i === table_data.length - 1 && b === table_header.length - 1}
								>{data[header] || '-'}</td
							>
						{:else if header[0] === 'children'}
							<td
								class="  whitespace-normal break-words px-2 py-3 text-left"
								class:border-y={i !== table_data.length - 1}
								class:border-bl-xl={i === table_data.length - 1 && b === table_header.length - 1}
								class:border-br-xl={i === table_data.length - 1 && b === table_header.length - 1}
								>{@render children?.({ data, header: header[1], index: i })}</td
							>
						{:else if header[0] === 'picture'}
							<td
								class=" whitespace-normal break-words px-2 py-3 text-left"
								class:border-y={i !== table_data.length - 1}
								class:border-bl-xl={i === table_data.length - 1 && b === table_header.length - 1}
								class:border-br-xl={i === table_data.length - 1 && b === table_header.length - 1}
								>{@render picture?.({ data, header: header[1], index: i })}</td
							>
						{:else}
							<td
								class="  whitespace-normal break-words px-2 py-3 text-left"
								class:border-y={i !== table_data.length - 1}
								class:border-bl-xl={i === table_data.length - 1 && b === table_header.length - 1}
								class:border-br-xl={i === table_data.length - 1 && b === table_header.length - 1}
								>{data[header[0]] || '-'}
							</td>
						{/if}
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.marsi {
		background-color: #89d8eb;
	}
</style>
