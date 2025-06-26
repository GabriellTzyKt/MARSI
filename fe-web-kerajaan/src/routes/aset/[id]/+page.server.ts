import type { PageServerLoad } from "../$types";
import situs1 from '$lib/asset/kerajaan/situs1.png';
import { env } from "$env/dynamic/private";

export const load: PageServerLoad = async ({params}) => {
    try {
        const res = await fetch(`${env.URL_KERAJAAN}/aset/${params.id}`);
        if (!res.ok) {
            throw new Error(`HTTP Error! Status: ${res.status}`);
        }
        
        const data = await res.json();
        
        // Check if data is an array or a single object
        const itemsToProcess = Array.isArray(data) 
            ? data.filter(item => item.deleted_at === "0001-01-01T00:00:00Z")
            : [data]; // If it's a single object, wrap it in an array
        
        const finalData = await Promise.all(itemsToProcess.map(async (item) => {
            const formattedItem = {
                ...item,
                jenis_aset:'',
                imageUrls: []
            };
            try {
                const jenis = await fetch(`${env.URL_KERAJAAN}/aset/jenis/${item.id_jenis_aset}`);
                if (!jenis.ok) {
                    throw new Error(`HTTP Error! Status: ${jenis.status}`);
                }
                const jenisData = await jenis.json();
                formattedItem.jenis_aset = jenisData.kategori_aset;
            } catch (error) {
                
            }
            try {
                // Check if dokumentasi exists and is not empty
                if (item.dokumentasi && item.dokumentasi.length > 0) {
                    // Handle both string and array formats
                    const docIds = Array.isArray(item.dokumentasi) 
                        ? item.dokumentasi 
                        : item.dokumentasi.split(',').map(id => id.trim());
                    
                    // Process each document ID
                    const imageUrls = await Promise.all(docIds.map(async (id) => {
                        if (!id) return '';
                        
                        const docRes = await fetch(`${env.URL_KERAJAAN}/doc/${id}`);
                        if (!docRes.ok) return '';
                        
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
                        return '';
                    }));
                    
                    // Flatten the array and filter out empty strings
                    formattedItem.imageUrls = imageUrls.flat().filter(url => url);
                }
            } catch (error) {
                console.error(`Error processing images for aset ${item.id_aset}:`, error);
            }
    
            return formattedItem;
        }));    
        console.log(finalData)
        return { data: finalData[0] };    
    } catch (error) {
        console.error("Error fetching asset data:", error);
        return { data: [] };
    }
};
