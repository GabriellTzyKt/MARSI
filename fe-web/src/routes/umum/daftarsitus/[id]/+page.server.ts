import { env } from "$env/dynamic/private";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, fetch }) => {
    const id = Number(params.id);
    
    try {
        // Fetch all situs data
        const res = await fetch(`${env.BASE_URL_8008}/situs?limit=200`);
        if (!res.ok) {
            throw new Error(`HTTP Error! Status: ${res.status}`);
        }
        
        const situsData = await res.json();
        console.log(`Searching for situs with ID: ${id}`);
        
        // Find the situs with matching ID
        const situs = situsData.find((item: any) => 
            Number(item.id_situs) === id || Number(item.id) === id
        );
        
        if (!situs) {
            throw new Error(`Data tidak ditemukan untuk ID: ${id}`);
        }
        
        console.log(`Found situs: ${situs.nama_situs || situs.nama}`);
        
        // Process the situs to add image URLs and jenis_situs
        const processedSitus = { 
            ...situs, 
            imageUrls: [],
            jenis_situs: ''
        };
        
        // Fetch jenis_situs data if id_jenis_situs is available
        if (situs.id_jenis_situs) {
            try {
                const jenisRes = await fetch(`${env.BASE_URL_8008}/situs/jenis?limit=200`);
                if (jenisRes.ok) {
                    const jenisDataList = await jenisRes.json();
                    // Find the matching jenis_situs by id
                    const matchingJenis = jenisDataList.find((item: any) => 
                        item.id_jenis_situs === situs.id_jenis_situs || 
                        item.id === situs.id_jenis_situs
                    );
                    
                    if (matchingJenis) {
                        processedSitus.jenis_situs = matchingJenis.jenis_situs || matchingJenis.jenis || '';
                        console.log(`Found jenis_situs: ${processedSitus.jenis_situs}`);
                    } else {
                        console.error(`No matching jenis_situs found for ID ${situs.id_jenis_situs}`);
                    }
                } else {
                    console.error(`Failed to fetch jenis situs list: ${jenisRes.status}`);
                }
            } catch (error) {
                console.error(`Error fetching jenis situs list:`, error);
            }
        }
        
        // Process foto_situs to get image URLs if available
        if (situs.profile && situs.profile.trim() !== '') {
            try {
                // Handle both string and array formats
                const docIds = typeof situs.foto_situs === 'string' 
                    ? situs.profile.split(',').map((id: string) => id.trim())
                    : situs.profile;
                
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
                                processedSitus.imageUrls.push(
                                    `${env.BASE_URL_8008}/file?file_path=${encodeURIComponent(path)}`
                                );
                            }
                        }
                    }
                }
            } catch (error) {
                console.error(`Error processing images for situs ${situs.id_situs}:`, error);
            }
        }
        
        return { detil: processedSitus };
    } catch (error) {
        console.error(`Error fetching situs with ID ${id}:`, error);
        throw new Error(`Data tidak ditemukan untuk ID: ${id}`);
    }
};
