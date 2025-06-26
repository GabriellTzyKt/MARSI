import { env } from "$env/dynamic/private";
import { filterArsip, formatDateTime,formatDate,formatTime } from "$lib";
import type { PageServerLoad } from "../acara/[id]/$types";


export const load: PageServerLoad = async () => {
    try {
        const res = await fetch(`${env.URL_KERAJAAN}/aset`);
        if (!res.ok) {
            throw new Error(`HTTP Error! Status: ${res.status}`);
        }
        const data = await res.json();
        

        const formattedData = data.filter((event : any) => {
                // Keep only items where deleted_at is the default value (not deleted)
                return event.deleted_at === '0001-01-01T00:00:00Z' || !event.deleted_at;
        })
        const final = await Promise.all(formattedData.map(async (item) => {
            const formattedItem = {
                ...item,
                imageUrls: []
            };
    
            try {
                
                    const res = await fetch(`${env.URL_KERAJAAN}/doc/${item.dokumentasi}`);
                    if (!res.ok) {
                        throw new Error(`HTTP Error! Status: ${res.status}`);
                    }
                    const docData = await res.json();
                let filePath = docData.file_dokumentasi || docData;
                
                // Handle both string and array responses
                if (typeof filePath === 'string') {
                    filePath = filePath.split(',').map(path => path.trim());
                }
                
                if (Array.isArray(filePath)) {
                    for (const path of filePath) {
                        const imagePath = typeof path === 'string' ? 
                            path : 
                            path.file_dokumentasi;
                            
                        if (imagePath) {
                            formattedItem.imageUrls.push(
                                `${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(imagePath)}`
                            );
                        }
                    }
                }
            } catch (error) {
                console.error(`Error processing images for aset ${item.id_aset}:`, error);
            }
    
            return formattedItem;
        }));
       console.log(final)
        return { data: final };
        
    }
    catch {
        
    }
};
