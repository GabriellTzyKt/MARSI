import { env } from "$env/dynamic/private";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
    const id = params.id;
    
    try {
        // Fetch situs details for the header
        const situsRes = await fetch(`${env.URL_KERAJAAN}/situs/${id}`);
        if (!situsRes.ok) {
            throw error(situsRes.status, `Failed to fetch Situs: ${situsRes.statusText}`);
        }
        const situsData = await situsRes.json();
        
        // Fetch acara for this situs
        const acaraRes = await fetch(`${env.URL_KERAJAAN}/acara/situs/${id}`);
        if (!acaraRes.ok) {
            throw error(acaraRes.status, `Failed to fetch Acara: ${acaraRes.statusText}`);
        }
        const acaraData = await acaraRes.json();
        console.log("Data",acaraData)
        // Process acara data to include images
        const processedAcara = await Promise.all(acaraData.map(async (acara: any) => {
            const processedItem = {
                ...acara,
                imageUrls: []
            };
            
            try {
                if (acara.foto_acara) {
                    // Handle both string and array formats
                    const docIds = typeof acara.foto_acara === 'string' 
                        ? acara.foto_acara.split(',').map(id => id.trim())
                        : acara.foto_acara;
                    
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
                                    processedItem.imageUrls.push(
                                        `${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(path)}`
                                    );
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                console.error(`Error processing images for acara ${acara.id_acara}:`, error);
            }
            
            return processedItem;
        }));
        console.log(processedAcara)
        return {
            situs: situsData,
            acara: processedAcara
        };
    } catch (err) {
        console.error("Error in load function:", err);
        throw error(500, "Failed to load situs and acara data");
    }
};
