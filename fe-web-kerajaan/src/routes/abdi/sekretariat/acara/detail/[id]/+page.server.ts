import { env } from "$env/dynamic/private";
import type { PageServerLoad } from "../../$types";

export const load: PageServerLoad = async ({params}) => {
    try {
        const res = await fetch(`${env.URL_KERAJAAN}/acara/detail/${params.id}`);
        const resUndangan = await fetch(`${env.URL_KERAJAAN}/undangan/${params.id}`);
        const resPanit = await fetch(`${env.URL_KERAJAAN}/acara/panitia/${params.id}`);
        console.log(res)
        if (res.ok && resUndangan.ok && resPanit.ok) {
            const data = await res.json()
            const undangan = await resUndangan.json()
            const panit = await resPanit.json()
            console.log(data, undangan, panit)
            const formatDate = (isoString) => {
                if (!isoString || isoString === '0001-01-01T00:00:00Z') return '-';
                const date = new Date(isoString);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
            };
            const formatTime = (isoString) => {
                if (!isoString || isoString === '0001-01-01T00:00:00Z') return '-';
                const date = new Date(isoString);
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                return `${hours}:${minutes}`;
            };

            const formattedData = {
                    ...data,
                    tanggal_mulai: formatDate(data.waktu_mulai),
                    tanggal_selesai: formatDate(data.waktu_selesai),
                    waktu_mulai: formatTime(data.waktu_mulai),
                    waktu_selesai: formatTime(data.waktu_selesai),
                    waktu_mulai_original: data.waktu_mulai,
                    waktu_selesai_original: data.waktu_selesai
                };
                
            
                console.log(formattedData)
                console.log(undangan)
                console.log(panit)
                return { data: formattedData, undangan: undangan, panit: panit };
           
        }
    }
    catch (e) {
        if (e instanceof Error) return console.log(e.message)
    }
};