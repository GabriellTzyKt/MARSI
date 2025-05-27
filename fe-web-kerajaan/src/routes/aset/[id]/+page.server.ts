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
                imageUrls: [],
                videoUrls: [],
                audioUrls: []
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
                    const mediaUrls = await Promise.all(docIds.map(async (id) => {
                        if (!id) return { type: 'unknown', url: '' };
                        
                        const docRes = await fetch(`${env.URL_KERAJAAN}/doc/${id}`);
                        if (!docRes.ok) return { type: 'unknown', url: '' };
                        
                        const docData = await docRes.json();
                        const filePath = docData.file_dokumentasi || docData;
                        
                        if (typeof filePath === 'string') {
                            const url = `${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(filePath)}`;
                            // Determine file type based on extension
                            if (filePath.match(/\.(mp4|webm|mov|avi)$/i)) {
                                return { type: 'video', url };
                            } else if (filePath.match(/\.(mp3|wav|ogg|m4a)$/i)) {
                                return { type: 'audio', url };
                            } else {
                                return { type: 'image', url };
                            }
                        } else if (Array.isArray(filePath)) {
                            return filePath.map(path => {
                                if (typeof path === 'string') {
                                    const url = `${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(path)}`;
                                    // Determine file type based on extension
                                    if (path.match(/\.(mp4|webm|mov|avi)$/i)) {
                                        return { type: 'video', url };
                                    } else if (path.match(/\.(mp3|wav|ogg|m4a)$/i)) {
                                        return { type: 'audio', url };
                                    } else {
                                        return { type: 'image', url };
                                    }
                                }
                                return { type: 'unknown', url: '' };
                            });
                        }
                        return { type: 'unknown', url: '' };
                    }));
                    
                    // Flatten the array and filter out empty strings
                    const flattenedMedia = mediaUrls.flat().filter(item => item.url);
                    
                    // Separate by media type
                    formattedItem.imageUrls = flattenedMedia
                        .filter(item => item.type === 'image')
                        .map(item => item.url);
                    
                    formattedItem.videoUrls = flattenedMedia
                        .filter(item => item.type === 'video')
                        .map(item => item.url);
                    
                    formattedItem.audioUrls = flattenedMedia
                        .filter(item => item.type === 'audio')
                        .map(item => item.url);
                }
            } catch (error) {
                console.error(`Error processing media for aset ${item.id_aset}:`, error);
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
