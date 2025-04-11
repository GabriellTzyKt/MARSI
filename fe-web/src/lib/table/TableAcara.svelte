<script lang="ts">
	import { string } from 'zod';

	interface IProps {
		table_data: Record<string, any>[];
		table_header: (string | string[])[];
	}
	let { table_data, table_header }: IProps = $props();
</script>

<div class="mt-4 flex w-full flex-col overflow-x-auto rounded-xl">
	<table class=" w-full table-auto rounded-xl border">
		<thead class="">
			<tr>
				<th class="whitespace-nowrap px-4 py-2 text-left">No</th>
				{#each table_header as header, i}
					{#if typeof header === 'string'}
						<th class="whitespace-nowrap px-4 py-2 text-left">{header}</th>
					{:else}
						<th class="whitespace-nowrap px-4 py-2 text-left">{header[1]}</th>
					{/if}
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each table_data as data, i}
				<tr class={i % 2 === 0 ? 'bg-white' : 'bg-gray-300'}>
					<td class="whitespace-nowrap px-4 py-2">{i + 1}</td>
					{#each table_header as header, b}
						{#if typeof header === 'string'}
							<td class="whitespace-nowrap px-4 py-2">{data[header]}</td>
						{:else}
							<td class="whitespace-nowrap px-4 py-2">{data[header[0]]}</td>
						{/if}
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
