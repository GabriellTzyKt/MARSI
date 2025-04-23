<script lang="ts">
	let { currPage = $bindable(), entries = $bindable(), totalItems = $bindable() } = $props();
	let total_pages = $derived(Math.ceil(totalItems / entries));
</script>

<div class="mt-4 flex w-full flex-col gap-y-2 md:gap-y-0 lg:flex-row lg:justify-between">
	<div class=" flex w-full justify-center md:w-auto md:justify-start">
		<p>
			Showing {(currPage - 1) * entries + 1}
			to {Math.min(currPage * entries, totalItems)}
			of {totalItems}
		</p>
	</div>
	<div class="flex flex-col items-center gap-3 md:flex-row">
		<div class="w-full">
			<button
				class="mx-2 w-full rounded-lg bg-white px-3 py-2 hover:bg-[#F9D48B] hover:text-white md:mx-0 md:w-auto"
				disabled={currPage === 1}
				onclick={() => {
					currPage--;
				}}>Previous</button
			>
		</div>
		<div class="flex w-full justify-center gap-2 md:justify-start">
			{#if total_pages <= 5}
				{#each Array(total_pages) as _, i}
					<button
						class="rounded-lg p-3 hover:bg-[#F9D48B] hover:text-white"
						class:bg-[#F9D48B]={currPage === i + 1}
						class:text-white={currPage === i + 1}
						onclick={() => (currPage = i + 1)}>{i + 1}</button
					>
				{/each}
			{:else}
				<button
					class="rounded-lg p-3 hover:bg-[#F9D48B] hover:text-white"
					class:bg-[#F9D48B]={currPage === 1}
					class:text-white={currPage === 1}
					onclick={() => (currPage = 1)}>1</button
				>

				<!-- Ellipsis after first page if current page is far enough -->
				{#if currPage > 3}
					<span class="flex items-center px-2">...</span>
				{/if}

				<!-- Pages around current page -->
				{#each Array(Math.min(3, total_pages - 2)) as _, i}
					{#if currPage > 2 && currPage < total_pages - 1}
						<!-- Show pages around current page -->
						{#if currPage - 1 + i > 1 && currPage - 1 + i < total_pages}
							<button
								class="rounded-lg p-3 hover:bg-[#F9D48B] hover:text-white"
								class:bg-[#F9D48B]={currPage === currPage - 1 + i}
								class:text-white={currPage === currPage - 1 + i}
								onclick={() => (currPage = currPage - 1 + i)}>{currPage - 1 + i}</button
							>
						{/if}
					{:else if currPage <= 2}
						<!-- Show first few pages -->
						{#if i + 2 < total_pages}
							<button
								class="rounded-lg p-3 hover:bg-[#F9D48B] hover:text-white"
								class:bg-[#F9D48B]={currPage === i + 2}
								class:text-white={currPage === i + 2}
								onclick={() => (currPage = i + 2)}>{i + 2}</button
							>
						{/if}
					{:else}
						<!-- Show last few pages -->
						{#if total_pages - 3 + i > 1}
							<button
								class="rounded-lg p-3 hover:bg-[#F9D48B] hover:text-white"
								class:bg-[#F9D48B]={currPage === total_pages - 3 + i}
								class:text-white={currPage === total_pages - 3 + i}
								onclick={() => (currPage = total_pages - 3 + i)}>{total_pages - 3 + i}</button
							>
						{/if}
					{/if}
				{/each}

				<!-- Ellipsis before last page if current page is far enough -->
				{#if currPage < total_pages - 2}
					<span class="flex items-center px-2">...</span>
				{/if}

				<!-- Last page -->
				<button
					class="rounded-lg p-3 hover:bg-[#F9D48B] hover:text-white"
					class:bg-[#F9D48B]={currPage === total_pages}
					class:text-white={currPage === total_pages}
					onclick={() => (currPage = total_pages)}>{total_pages}</button
				>
			{/if}
		</div>
		<div class="w-full">
			<button
				class="mx-2 w-full rounded-lg bg-white px-3 py-2 hover:bg-[#F9D48B] hover:text-white md:mx-0 md:w-auto"
				disabled={currPage === total_pages}
				onclick={() => {
					currPage++;
				}}>Next</button
			>
		</div>
	</div>
</div>
<!-- <div
	class="mt-3 flex w-full flex-col items-center justify-center gap-2 md:flex-row md:justify-between"
>
	<div>
		<p>
			Showing {(currPage - 1) * entries + 1} to {Math.min(
				currPage * entries,
				filterD(dummyAnggota).length
			)} of {total_pages} entries
		</p>
	</div>
	<div class="flex flex-row">
		<button
			class=" hover:bg-[#F9D48B] me-3 rounded-lg bg-white px-6 py-2 hover:text-white"
			disabled={currPage === 1}
			onclick={() => {
				currPage--;
			}}>Previous</button
		>
		{#each Array(total_pages) as _, i}
			<button
				class="hover:bg-[#F9D48B] mx-1 rounded-lg px-3 py-2 hover:text-white {i + 1 === currPage
					? 'bg-[#F9D48B] text-white'
					: 'bg-white'}"
				onclick={() => (currPage = i + 1)}>{i + 1}</button
			>
		{/each}

		<button
			class="hover:bg-[#F9D48B] ms-3 rounded-lg bg-white px-6 py-2 hover:text-white"
			disabled={currPage === total_pages}
			onclick={() => {
				currPage++;
			}}>Next</button
		>
	</div>
</div> -->
