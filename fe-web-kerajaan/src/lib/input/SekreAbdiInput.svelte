<script lang="ts">
	let { span, placeholder, img = null, gelar = null } = $props();
	let s = span as string;
	let namagelar = $state('');
</script>

{#if gelar == null}
	<div
		class="col-span-1 flex w-full justify-between rounded-md border border-gray-600 bg-white {span ===
		'1'
			? 'lg:col-span-1'
			: 'lg:col-span-2'}"
	>
		<input
			type="text"
			name=""
			{placeholder}
			class="w-full rounded-lg py-2 pe-2 ps-2 focus:outline-none"
			id=""
		/>
		<div class="me-2 flex items-center">
			{#if img}
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
						d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
					/>
				</svg>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class=" size-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
					/>
				</svg>
			{/if}
		</div>
	</div>
{:else}
	<div class="flex h-full w-full">
		<div class="w-full">
			<div class="relative">
				<select
					class="w-full rounded-lg border-2 border-black px-2 py-2 bg-white"
					name="namagelar"
					bind:value={namagelar}
				>
					<option value="" selected disabled>Nama Gelar</option>
					<option value="YAYA">...</option>
					<option value=" ">---</option>
				</select>
				<!-- {#if error}
				{#each error.agama as a}
					<p class="text-left text-red-500">{a}</p>
				{/each}
			{/if} -->
			</div>
		</div>
	</div>
{/if}
