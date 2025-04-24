import { env } from "$env/dynamic/private";
import type { PageServerLoad } from "../../$types";

export const load: PageServerLoad = async ({params}) => {
    try {
        const res = await fetch(`${env.URL_KERAJAAN}/acara/detail/${params.id}`);
        console.log(res)
        if (res.ok) {
            const data = await res.json()
            console.log(data)
            const formatDate = (isoString) => {
            if (!isoString || isoString === '0001-01-01T00:00:00Z') return '-';
            const date = new Date(isoString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        };
        const mergedData = data
            .map(event => ({
            
                // Keep only items where deleted_at is the default value (not deleted)
            ...event,
            waktu_mulai: formatDate(event.waktu_mulai),
            waktu_selesai: formatDate(event.waktu_selesai),
            // lokasi_detail: locationMap.get(event.lokasi_acara) || { nama_lokasi: 'Lokasi tidak ditemukan' },
            // penanggungjawab_detail: personMap.get(event.penanggung_jawab) || { nama: 'PJ tidak ditemukan' }
        }));
        console.log(mergedData)
        return { data: mergedData };
           
        }
    }
    catch (e) {
        if (e instanceof Error) return console.log(e.message)
    }
};