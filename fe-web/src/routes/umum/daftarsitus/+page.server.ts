import { tempdata } from "$lib/dummy";
import { env } from "$env/dynamic/private"
import type { PageServerLoad } from "./$types";

// Tambahkan fungsi extractPlaceName
const extractPlaceName = (address: string) => {
    const regions = ['sulawesi', 'bali', 'sumatera', 'papua', 'surabaya','jawa', 'surakarta', 'banten',
        'kalimantan', 'java', 'indonesia', 'jakarta', 'yogyakarta'];

    const addressLower = address.toLowerCase();
    // console.log("address : ", addressLower)
    for (const region of regions) {
        if (addressLower.includes(region)) {
            // kalo ada ambil huruf pertama, dibuat kapital + ngambil sisanya
            return region.charAt(0).toUpperCase() + region.slice(1);
        }
    }
    return address;
};

export const load: PageServerLoad = async ({fetch}) => {
    try {
        const res = await fetch(env.BASE_URL_8008 + "/situs?limit=200");
        if (!res.ok) {
            throw new Error(`HTTP Error! Status: ${res.status}`);
        }
        const situsData = await res.json();
        console.log("Raw situs data:", situsData);
        
        // Filter out deleted situs
        const filteredSitusData = situsData.filter((situs: any) => {
            return situs.deleted_at === '0001-01-01T00:00:00Z' || situs.deleted_at === null;
        });
        console.log("Filtered situs data count:", filteredSitusData.length);
        
        // Process situs data to add region and image URLs
        const processedSitus = await Promise.all(filteredSitusData.map(async (situs: any) => {
            // Create new object with original situs data
            const processedItem = { ...situs, region: '', imageUrls: [] };
            
            // Extract region from situs address if available
            if (situs.alamat) {
                processedItem.region = extractPlaceName(situs.alamat);
                console.log(`Extracted region for ${situs.nama_situs}: ${processedItem.region}`);
            }
            
            // Process foto_situs to get image URLs if available
            if (situs.foto_situs && situs.foto_situs.trim() !== '') {
                try {
                    // Handle both string and array formats
                    const docIds = typeof situs.foto_situs === 'string' 
                        ? situs.foto_situs.split(',').map((id: string) => id.trim())
                        : situs.foto_situs;
                    
                    if (docIds && docIds.length > 0) {
                        for (const docId of docIds) {
                            if (!docId) continue;
                            
                            const res = await fetch(`${env.BASE_URL_8008}/doc/${docId}`);
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
            
            return processedItem;
        }));
        
        return { detil_situs: processedSitus };
    } catch (error) {
        console.error("Error fetching data:", error);
        return { detil_situs: [] }; 
    }
};
