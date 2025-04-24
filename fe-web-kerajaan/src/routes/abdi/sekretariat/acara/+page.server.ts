import { env } from "$env/dynamic/private";
import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

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
        return { data: [] };
    }
};
export const actions: Actions = {
    delete: async ({ request }) => { 
        let deleteres
        const data = await request.formData()
        const id = data.get("id_acara")
        console.log(data)
        try {
            const res = await fetch(`${env.URL_KERAJAAN}/acara/detail/${id}`, {
                method: "GET"
            })
            if (res.ok) {
                const eventData = await res.json()
                console.log(eventData)
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
                

                const formattedEvents = {
                    id_acara: eventData.id_acara,
                    id_kerajaan: eventData.id_kerajaan,
                    nama_acara: eventData.nama_acara,
                    deskripsi_acara: eventData.deskripsi_acara,
                    tujuan_acara: eventData.tujuan_acara,
                    lokasi_acara: eventData.lokasi_acara,
                    alamat_acara: eventData.alamat_acara,
                    waktu_mulai: formatDateTime(eventData.waktu_mulai),
                    waktu_selesai: formatDateTime(eventData.waktu_selesai),
                    penanggung_jawab: eventData.penanggung_jawab,
                    jenis_acara: eventData.jenis_acara,
                    kapasitas_acara: eventData.kapasitas_acara,
                    foto_acara: eventData.foto_acara,
                    status: eventData.status
                   
                }
                console.log("Formatted events:", formattedEvents)
                const delres = await fetch(`${env.URL_KERAJAAN}/acara/detail/${id}`, {
                    method: "DELETE",
                    body: JSON.stringify(formattedEvents)
                })
                if (delres.ok) {
                    deleteres = await delres.json()
                    console.log("berhasil")
                    return true
                }
                return fail(406,{error: `${delres.status} ${deleteres.message}`})
            }
        }
        catch (error) {
            
        }
        console.log(id)
    }
};