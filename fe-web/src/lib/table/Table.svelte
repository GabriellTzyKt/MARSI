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

<div class="mt-4 flex items-center justify-center rounded-xl">
	<table class="mx-6 w-full table-auto border-separate border-spacing-0 rounded-xl border md:mx-20">
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
</div>

<style>
	.marsi {
		background-color: #f9d48b;
	}
</style>
