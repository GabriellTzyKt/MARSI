import { env } from "$env/dynamic/private";
import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import {
    formatDateTime, formatDate, formatTime
    
 } from "$lib";

export const load: PageServerLoad = async () => {
    try {
        const res = await fetch(`${env.URL_KERAJAAN}/acara`);
        if (!res.ok) {
            throw new Error(`HTTP Error! Status: ${res.status}`);
        }
        const data = await res.json();
        console.log(data)

        const formatDateTime = (isoString) => {
    if (!isoString || isoString === '0001-01-01T00:00:00Z') return '-';
    const date = new Date(isoString);
    
    // Format date: dd-mm-yyyy
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    // Format time: HH:MM:SS
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

         const formatDate = (isoString) => {
            if (!isoString || isoString === '0001-01-01T00:00:00Z') return '-';
            const date = new Date(isoString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        };
        const mergedData = data.filter((event) => {
                // Keep only items where deleted_at is the default value (not deleted)
                return event.deleted_at === '0001-01-01T00:00:00Z' || !event.deleted_at;
            }).map(event => ({
            ...event,
            waktu_mulai: formatDate(event.waktu_mulai),
                waktu_selesai: formatDate(event.waktu_selesai),
                waktu_mulai_full: formatDateTime(event.waktu_mulai),
                waktu_selesai_full: formatDateTime(event.waktu_selesai),
            // lokasi_detail: locationMap.get(event.lokasi_acara) || { nama_lokasi: 'Lokasi tidak ditemukan' },
            // penanggungjawab_detail: personMap.get(event.penanggung_jawab) || { nama: 'PJ tidak ditemukan' }
        }));
        console.log(mergedData)
        return { data: mergedData };
    }
    catch (error) {
        console.error("Error fetching data:", error);
        return { errors: "Error fetching data" };
    }
};
export const actions: Actions = {
    delete: async ({ request }) => { 
        const data = await request.formData()
        console.log(data)
        const id = data.get("id_acara")
        //   console.log("Deleting acara with ID:", id);
        try {
            const res = await fetch(`${env.URL_KERAJAAN}/acara/detail/${id}`, {
                method: "GET"
            })
            if (!res.ok) {
               console.error(`Failed to find event: ${res.status}`);
                return fail(404, { error: "Acara tidak ditemukan" });
            }
           
              const eventData = await res.json()
                console.log(eventData)
            
                const delres = await fetch(`${env.URL_KERAJAAN}/acara/${id}`, {
                    method: "DELETE",
                   
                    // body: JSON.stringify(formattedEvents)
                })
                if (!delres.ok) {
                  const errorData = await delres.json().catch(() => ({}));
                console.error("Delete failed:", delres.status, errorData);
                return fail(delres.status, { 
                    error: errorData.message || `Gagal menghapus acara (${delres.status})` 
                });
                }
                 const successData = await delres.json().catch(() => ({ message: "Success" }));
            console.log("Delete successful:", successData);

            
            // Return success with the updated data
            return {
                success: true,
                message: "Acara berhasil dihapus"
            };
        }
        catch (error) {
            
        }
        console.log(id)
    }
};