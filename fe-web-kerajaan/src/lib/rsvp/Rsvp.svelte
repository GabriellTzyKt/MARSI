<script lang="ts">
    import { onMount } from 'svelte';

    const { index = 0, errors = {}, datauser = [] } = $props();

    console.log("datauser: ", datauser);
    
    let selectedUser: any = $state(null);

    function handleUserSelect(event: Event) {
        const input = event.target as HTMLInputElement;
        const selectedName = input.value;
        selectedUser = datauser.find(user => user.nama_lengkap === selectedName) || null;
    }
</script>

<div class="flex h-auto flex-col rounded-lg border-2 border-gray-300 bg-white p-4 mb-4 shadow-sm">
    <div class="flex justify-between items-center mb-2">
        <h3 class="font-medium">Tamu {index + 1}</h3>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Nama Lengkap Dropdown -->
        <div class="flex flex-col">
            <label for={`tamu_nama_${index}`} class="mb-1">Nama Lengkap</label>
            <input 
                list={`datalist_nama_${index}`}
                id={`tamu_nama_${index}`}
                name={`tamu_nama_${index}`} 
                class="rounded-lg border-2 px-2 py-2" 
                placeholder="Pilih nama tamu"
                onchange={handleUserSelect}
            />
            <datalist id={`datalist_nama_${index}`}>
                {#each datauser as user}
                    <!-- svelte-ignore element_invalid_self_closing_tag -->
                    <option value={user.nama_lengkap} />
                {/each}
            </datalist>
            {#if errors[`tamu_nama_${index}`]}
                <p class="text-left text-red-500 text-sm mt-1">- {errors[`tamu_nama_${index}`]}</p>
            {/if}
        </div>

        <!-- Jenis Kelamin -->
        <div class="flex flex-col">
            <label for={`tamu_jeniskelamin_${index}`} class="mb-1">Jenis Kelamin</label>
            <input
                type="text"
                id={`tamu_jeniskelamin_${index}`}
                name={`tamu_jeniskelamin_${index}`}
                class="rounded-lg border-2 px-2 py-2 bg-gray-100"
                readonly
                value={selectedUser?.jenis_kelamin ?? ''}
            />
            {#if errors[`tamu_jeniskelamin_${index}`]}
                <p class="text-left text-red-500 text-sm mt-1">- {errors[`tamu_jeniskelamin_${index}`]}</p>
            {/if}
        </div>
    </div>

    <!-- Telepon -->
    <div class="mt-4 flex flex-col">
        <label for={`tamu_telepon_${index}`} class="mb-1">Nomor Telepon</label>
        <input 
            type="text" 
            id={`tamu_telepon_${index}`}
            name={`tamu_telepon_${index}`} 
            class="rounded-lg border-2 px-2 py-2 bg-gray-100" 
            readonly
            value={selectedUser?.no_telp ?? ''}
        />
        {#if errors[`tamu_telepon_${index}`]}
            <p class="text-left text-red-500 text-sm mt-1">- {errors[`tamu_telepon_${index}`]}</p>
        {/if}
    </div>

    {#if selectedUser}
        <input type="hidden" name={`tamu_id_${index}`} value={selectedUser.id_user} />
    {/if}
</div>
