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
                // Check if dokumentasi exists and is not empty
                if (item.dokumentasi && item.dokumentasi.trim() !== '') {
                    // Split the comma-separated IDs
                    const docIds = item.dokumentasi.split(',').map(id => id.trim());
                    console.log(`Processing dokumentasi for asset ${item.id_aset}:`, docIds);
                    
                    // Process each document ID
                    for (const docId of docIds) {
                        try {
                            console.log(`Fetching document ID: ${docId}`);
                            const res = await fetch(`${env.URL_KERAJAAN}/doc/${docId}`);
                            
                            if (!res.ok) {
                                console.error(`Failed to fetch doc/${docId}: ${res.status}`);
                                continue;
                            }
                            
                            const docData = await res.json();
                            console.log(`Document data for ID ${docId}:`, docData);
                            
                            let filePath = docData.file_dokumentasi || docData;
                            console.log(`File path for ID ${docId}:`, filePath);
                            
                            if (typeof filePath === 'string') {
                                const imageUrl = `${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(filePath)}`;
                                console.log(`Adding image URL: ${imageUrl}`);
                                formattedItem.imageUrls.push(imageUrl);
                            } else if (Array.isArray(filePath)) {
                                for (const path of filePath) {
                                    const imagePath = typeof path === 'string' ? path : path.file_dokumentasi;
                                    
                                    if (imagePath) {
                                        const imageUrl = `${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(imagePath)}`;
                                        console.log(`Adding image URL from array: ${imageUrl}`);
                                        formattedItem.imageUrls.push(imageUrl);
                                    }
                                }
                            }
                        } catch (docError) {
                            console.error(`Error processing document ID ${docId}:`, docError);
                        }
                    }
                } else {
                    console.log(`No dokumentasi found for asset ${item.id_aset}`);
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
