import { env } from "$env/dynamic/private";
import type { PageServerLoad } from "./$types";
import { detail_situs } from "$lib/dummy"

export const load: PageServerLoad = async () => {
    try {
        const res = await fetch(`${env.URL_KERAJAAN}/situs`);
        if (!res.ok) {
            throw new Error(`HTTP Error! Status: ${res.status}`);
        }
        const data = await res.json();
        
        const formattedData = await Promise.all(data.map(async (item: any) => {
            const formattedItem = {
                ...item,
                imageUrls: []
            };
    
            try {
                if (item.foto_situs) {
                    // Handle both string and array formats
                    const docIds = typeof item.foto_situs === 'string' 
                        ? item.foto_situs.split(',').map(id => id.trim())
                        : item.foto_situs;
                    
                    if (docIds && docIds.length > 0) {
                        for (const docId of docIds) {
                            const res = await fetch(`${env.URL_KERAJAAN}/doc/${docId}`);
                            if (!res.ok) {
                                console.error(`Failed to fetch doc/${docId}: ${res.status}`);
                                continue;
                            }
                            
                            const docData = await res.json();
                            const filePaths = docData.file_dokumentasi || docData;
                            const pathsArray = Array.isArray(filePaths) ? filePaths : [filePaths];
                            
                            for (const path of pathsArray) {
                                if (typeof path === 'string') {
                                    formattedItem.imageUrls.push(
                                        `${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(path)}`
                                    );
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                console.error(`Error processing images for situs ${item.id}:`, error);
            }
    
            return formattedItem;
        }));

        return {
            data: formattedData
        };
    }
    catch (error) {
        console.error("Error fetching situs data:", error);
        return { data: [] };
    }
};
