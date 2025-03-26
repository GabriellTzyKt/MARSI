<script lang="ts">
	import type { Snippet } from 'svelte';
	import { slide } from 'svelte/transition';

	interface IProps {
		table_data: Record<string, any>[];
		table_header: (string | string[])[];
		children?: Snippet<[any]>;
		details?: Snippet<[any]>;
		isdrop?: Boolean;
	}
	function ifDrop(p: number) {
		dropdown = dropdown === p ? null : p;
	}
	let dropdown: number | null = $state(null);

	let { table_data, table_header, children, details, isdrop = false }: IProps = $props();
</script>

<div class="mt-4 flex w-full flex-col overflow-x-auto rounded-xl">
	<table class=" w-full table-auto border-separate border-spacing-0 rounded-xl border">
		<thead class="marsi rounded-xl">
			<tr class=" rounded-xl">
				{#if isdrop}
					<th class="rounded-tl-xl px-2 py-3 text-left"> </th>
				{/if}
				<th class="px-2 py-3 text-left">No</th>
				{#each table_header as header, i}
					{#if typeof header === 'string'}
						<th class={`py-3 pe-2 text-left ${header[2]}`}>{header}</th>
					{:else}
						<th
							class={`py-3 pe-2 text-left ${header[2]}`}
							class:rounded-tr-xl={i === table_header.length - 1}>{header[1]}</th
						>
					{/if}
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each table_data as data, i}
				<tr class="">
					{#if isdrop}
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<td
							class=" py-3 text-center"
							class:border-y={i !== table_data.length - 1}
							class:border-bl-xl={i === table_data.length - 1}
							class:border-br-xl={i === table_data.length - 1}
						>
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-6"
								onclick={() => ifDrop(i)}
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="m4.5 15.75 7.5-7.5 7.5 7.5"
								/>
							</svg>
						</td>
					{/if}
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

				{#if isdrop && dropdown === i}
					<tr>
						<td colspan={isdrop ? table_header.length + 2 : table_header.length + 1} class="">
							{@render details?.({ data, index: i })}
						</td>
					</tr>
				{/if}
			{/each}
		</tbody>
	</table>
</div>

<style>
	.marsi {
		background-color: #f9d48b;
	}
	.m:hover {
		background-color: #f9d48b;
	}
</style>
