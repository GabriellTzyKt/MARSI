<script lang="ts">
    // Accept props for index and error handling using Svelte 5 syntax
    const { index = 0, errors = {} } = $props();
</script>

<div class="flex h-auto flex-col rounded-lg border-2 border-gray-300 bg-white p-4 mb-4 shadow-sm">
    <div class="flex justify-between items-center mb-2">
        <h3 class="font-medium">Tamu {index + 1}</h3>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex flex-col">
            <label for={`tamu_nama_${index}`} class="mb-1">Nama Lengkap</label>
            <input 
                type="text" 
                id={`tamu_nama_${index}`}
                name={`tamu_nama_${index}`} 
                class="rounded-lg border-2 px-2 py-2" 
                placeholder="Masukkan nama tamu" 
            />
            {#if errors[`tamu_nama_${index}`]}
                <p class="text-left text-red-500 text-sm mt-1">- {errors[`tamu_nama_${index}`]}</p>
            {/if}
        </div>

        <div class="flex flex-col">
            <label for={`tamu_jeniskelamin_${index}`} class="mb-1">Jenis Kelamin</label>
            <select
                id={`tamu_jeniskelamin_${index}`}
                name={`tamu_jeniskelamin_${index}`}
                class="rounded-lg border-2 px-2 py-2"
            >
                <option value="" disabled selected>Pilih Jenis Kelamin</option>
                <option value="Laki-Laki">Laki-Laki</option>
                <option value="Perempuan">Perempuan</option>
            </select>
            {#if errors[`tamu_jeniskelamin_${index}`]}
                <p class="text-left text-red-500 text-sm mt-1">- {errors[`tamu_jeniskelamin_${index}`]}</p>
            {/if}
        </div>
    </div>

    <div class="mt-4 flex flex-col">
        <label for={`tamu_telepon_${index}`} class="mb-1">Nomor Telepon</label>
        <input 
            type="text" 
            id={`tamu_telepon_${index}`}
            name={`tamu_telepon_${index}`} 
            class="rounded-lg border-2 px-2 py-2" 
            placeholder="Masukkan nomor telepon tamu" 
             
        />
        {#if errors[`tamu_telepon_${index}`]}
            <p class="text-left text-red-500 text-sm mt-1">- {errors[`tamu_telepon_${index}`]}</p>
        {/if}
    </div>
</div>
