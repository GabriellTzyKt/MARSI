import { env } from "$env/dynamic/private";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, fetch }) => {
    const id = Number(params.id);
    
    try {
        // Fetch all aset data
        const res = await fetch(`${env.BASE_URL_8008}/aset?limit=200`);
        if (!res.ok) {
            throw new Error(`HTTP Error! Status: ${res.status}`);
        }
        
        const asetData = await res.json();
        console.log(`Searching for aset with ID: ${id}`);
        
        // Find the aset with matching ID
        const aset = asetData.find((item: any) => 
            Number(item.id_aset) === id || Number(item.id) === id
        );
        
        if (!aset) {
            throw new Error(`Data tidak ditemukan untuk ID: ${id}`);
        }
        
        console.log(`Found aset: ${aset.nama_aset || aset.nama}`);
        
        // Process the aset to add media URLs
        const processedAset = { 
            ...aset, 
            imageUrls: [],
            videoUrls: [],
            audioUrls: []
        };
        
        // Process dokumentasi to get media URLs if available
        if (aset.dokumentasi && aset.dokumentasi.trim() !== '') {
            try {
                // Handle both string and array formats
                const docIds = typeof aset.dokumentasi === 'string' 
                    ? aset.dokumentasi.split(',').map((id: string) => id.trim())
                    : aset.dokumentasi;
                
                if (docIds && docIds.length > 0) {
                    for (const docId of docIds) {
                        if (!docId) continue;
                        
                        const docRes = await fetch(`${env.BASE_URL_8008}/doc/${docId}`);
                        if (!docRes.ok) {
                            console.error(`Failed to fetch doc/${docId}: ${docRes.status}`);
                            continue;
                        }
                        
                        const docData = await docRes.json();
                        const filePaths = docData.file_dokumentasi || docData;
                        const pathsArray = Array.isArray(filePaths) ? filePaths : [filePaths];
                        
                        for (const path of pathsArray) {
                            if (typeof path === 'string') {
                                const fileUrl = `${env.BASE_URL_8008}/file?file_path=${encodeURIComponent(path)}`;
                                
                                // Categorize files based on extension
                                const lowerPath = path.toLowerCase();
                                if (lowerPath.endsWith('.mp4') || lowerPath.endsWith('.webm') || lowerPath.endsWith('.mov')) {
                                    processedAset.videoUrls.push(fileUrl);
                                } else if (lowerPath.endsWith('.mp3') || lowerPath.endsWith('.wav') || lowerPath.endsWith('.ogg')) {
                                    processedAset.audioUrls.push(fileUrl);
                                } else if (lowerPath.endsWith('.jpg') || lowerPath.endsWith('.jpeg') || 
                                          lowerPath.endsWith('.png') || lowerPath.endsWith('.gif') || 
                                          lowerPath.endsWith('.webp')) {
                                    processedAset.imageUrls.push(fileUrl);
                                } else {
                                    // Default to images for unknown types
                                    processedAset.imageUrls.push(fileUrl);
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                console.error(`Error processing media for aset ${aset.id_aset}:`, error);
            }
        }
        
        // Fetch jenis_aset data if id_jenis_aset is available
        if (aset.id_jenis_aset) {
            try {
                const jenisRes = await fetch(`${env.BASE_URL_8008}/aset/jenis/${aset.id_jenis_aset}`);
                if (jenisRes.ok) {
                    const jenisData = await jenisRes.json();
                    processedAset.jenis_aset = jenisData.kategori_aset || jenisData.jenis || '';
                    console.log(`Found jenis_aset: ${processedAset.jenis_aset}`);
                } else {
                    console.error(`Failed to fetch jenis aset: ${jenisRes.status}`);
                }
            } catch (error) {
                console.error(`Error fetching jenis aset:`, error);
            }
        }
        
        return { detil_aset: processedAset };
    } catch (error) {
        console.error(`Error fetching aset with ID ${id}:`, error);
        throw new Error(`Data tidak ditemukan untuk ID: ${id}`);
    }
};
