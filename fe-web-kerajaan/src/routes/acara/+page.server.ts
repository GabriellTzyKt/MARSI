import type { PageServerLoad } from "./[id]/$types";
import { env } from "$env/dynamic/private";
import { filterArsip, formatDateTime,formatDate,formatTime } from "$lib";


export const load: PageServerLoad = async () => {
    try {
        const res = await fetch(`${env.URL_KERAJAAN}/acara`);
        if (!res.ok) {
            throw new Error(`HTTP Error! Status: ${res.status}`);
        }
        const data = await res.json();
        

        const formattedData = data.filter((event) => {
                // Keep only items where deleted_at is the default value (not deleted)
                return event.deleted_at === '0001-01-01T00:00:00Z' || !event.deleted_at;
        })
        const final = await Promise.all(formattedData.map(async (item) => {
            const formattedItem = {
                ...item,
                tanggal_mulai: formatDate(item.waktu_mulai),
                tanggal_selesai: formatDate(item.waktu_selesai),
                waktu_mulai: formatTime(item.waktu_mulai),
                waktu_selesai: formatTime(item.waktu_selesai),
                waktu_mulai_full: formatDateTime(item.waktu_mulai),
                waktu_selesai_full: formatDateTime(item.waktu_selesai),
                waktu_mulai_original: item.waktu_mulai,
                waktu_selesai_original: item.waktu_selesai,
                imageUrls: []
            };

            if (item.foto_acara && item.foto_acara.trim() !== '') {
                try {
                    const docIds = item.foto_acara.split(',').map(id => id.trim());
                    const imageUrls = await Promise.all(docIds.map(async (id) => {
                        const docRes = await fetch(`${env.URL_KERAJAAN}/doc/${id}`);
                        if (docRes.ok) {
                            const docData = await docRes.json();
                            const filePath = docData.file_dokumentasi || docData;
                            if (typeof filePath === 'string') {
                                return `${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(filePath)}`;
                            } else if (Array.isArray(filePath)) {
                                return filePath.map(path => {
                                    if (typeof path === 'string') {
                                        return `${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(path)}`;
                                    }
                                    return '';
                                });
                            }
                        }
                        return '';
                    }));
                    formattedItem.imageUrls = imageUrls.flat();

                } catch (error) {
                    console.error(`Error processing images for event ${item.id_acara}:`, error);
                }
            }

            return formattedItem;
        }));

       
      
        

        console.log(final)
        return { data: final };
        
    }
    catch {
        
    }
};