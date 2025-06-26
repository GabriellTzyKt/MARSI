<script>
  import { writable } from 'svelte/store';
  
  // Create stores for edit/delete state
  const editState = writable({ isOpen: false, userId: null });
  const deleteState = writable({ isOpen: false, userId: null });
  
  function openEditModal(userId) {
    $editState = { isOpen: true, userId };
  }
  
  function openDeleteModal(userId) {
    $deleteState = { isOpen: true, userId };
  }
</script>

<!-- In your dropdown -->
<DropDown
  items={[
    ['Edit', () => openEditModal(data.id_user)],
    ['children', 'Arsipkan', () => openDeleteModal(data.id_user)]
  ]}
  id={`id-${index}`}
  {data}
/>

<!-- Modals controlled by state -->
{#if $editState.isOpen}
  <EditModal userId={$editState.userId} />
{/if}

{#if $deleteState.isOpen}
  <DeleteModal userId={$deleteState.userId} />
{/if}