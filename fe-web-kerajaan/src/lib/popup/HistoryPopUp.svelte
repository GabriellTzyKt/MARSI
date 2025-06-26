<script lang="ts">
	import Table from '$lib/table/Table.svelte';

	let { value = $bindable(), data, header, title } = $props();
</script>

<div class="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black/65">
	<div class="relative flex max-h-[700px] flex-col overflow-y-auto rounded-lg border bg-white p-4">
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="absolute right-0 top-0 mr-4 mt-6 hover:cursor-pointer"
			onclick={() => {
				value = false;
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-8"
				onclick={() => {
					value = false;
				}}
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
			</svg>
		</div>
		<div class=" mt-6 text-center">
			<p class="text-2xl font-[500]">{title}</p>
		</div>
		<div class="mb-6 mt-6 flex flex-col items-center justify-center gap-3 md:mx-6 md:flex-row">
			<div>
				<select
					name="Keterangan"
					class="rounded-lg border border-gray-700 px-8 py-2 focus:outline-none"
					id=""
					value="Keterangan"
				>
					<option value="Keterangan">Keterangan</option>
				</select>
			</div>
			<div class="flex items-center justify-between rounded-lg border border-gray-700">
				<div class="flex grow">
					<input
						type="text"
						placeholder="Cari Nama {title === 'History Gelar' ? 'Gelar' : 'Bintang Jasa'}"
						class="flex w-full px-2 py-2 focus:outline-none"
						name=""
						id=""
					/>
				</div>
				<div class="pe-2">
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
			<div class="flex items-center justify-between rounded-lg border border-gray-700">
				<div class="flex grow">
					<input
						type="text"
						placeholder="Cari Nama Acara.."
						class="flex w-full px-2 py-2 focus:outline-none"
						name=""
						id=""
					/>
				</div>
				<div class="pe-2">
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
			<div class="flex flex-row items-center gap-3">
				<div>
					<p>Show</p>
				</div>
				<div>
					<input
						type="number"
						class="flex h-auto w-16 rounded-lg border border-gray-700 px-2 py-2 focus:outline-none"
						placeholder="8"
						name=""
						id=""
					/>
				</div>
				<div>
					<p>Entries</p>
				</div>
			</div>
		</div>
		<div class="  overflow-x-auto md:mx-6">
			<Table table_header={header} table_data={data}></Table>
		</div>
	</div>
</div>
