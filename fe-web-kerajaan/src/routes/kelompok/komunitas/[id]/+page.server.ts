import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";

export const load: PageServerLoad = async ({ params }) => {
    const id = params.id;
    
    try {
        // Fetch komunitas data from API
        const komunitasResponse = await fetch(`${env.URL_KERAJAAN}/komunitas/${id}`);
        
        if (!komunitasResponse.ok) {
            throw error(komunitasResponse.status, `Failed to fetch komunitas: ${komunitasResponse.statusText}`);
        }
        
        const komunitasData = await komunitasResponse.json();
        console.log("Komunitas data:", komunitasData);
        
        // Fetch anggota data
        const anggotaResponse = await fetch(`${env.URL_KERAJAAN}/komunitas/${id}`);
        
        if (!anggotaResponse.ok) {
            throw error(anggotaResponse.status, `Failed to fetch komunitas anggota: ${anggotaResponse.statusText}`);
        }
        
        const anggotaData = await anggotaResponse.json();
        
        // Fetch profile image if available
        let fileDetails = null;
        if (komunitasData.profile) {
            try {
                const filePathResponse = await fetch(`${env.URL_KERAJAAN}/doc/${komunitasData.profile}`);
                if (filePathResponse.ok) {
                    const filePathData = await filePathResponse.json();
                    
                    const filePath = filePathData.file_dokumentasi;
                    if (filePath) {
                        fileDetails = {
                            path: filePath,
                            url: `${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(filePath)}`,
                            name: filePath.split('/').pop()
                        };
                    }
                }
            } catch (fileError) {
                console.error("Error fetching file details:", fileError);
            }
        }
        
        // Fetch foto komunitas if available
        let fotoKomunitasDetails = [];
        if (komunitasData.foto_komunitas) {
            // Handle both string and array formats
            const fotoIds = typeof komunitasData.foto_komunitas === 'string'
                ? komunitasData.foto_komunitas.split(',').map(id => id.trim())
                : Array.isArray(komunitasData.foto_komunitas)
                    ? komunitasData.foto_komunitas
                    : [komunitasData.foto_komunitas]; // Handle single value that's not a string
            
            if (fotoIds.length > 0) {
                fotoKomunitasDetails = await Promise.all(
                    fotoIds.map(async (fotoId) => {
                        try {
                            const filePathResponse = await fetch(`${env.URL_KERAJAAN}/doc/${fotoId}`);
                            if (filePathResponse.ok) {
                                const filePathData = await filePathResponse.json();
                                const filePath = filePathData.file_dokumentasi;
                                
                                if (filePath) {
                                    return {
                                        path: filePath,
                                        url: `${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(filePath)}`,
                                        name: filePath.split('/').pop()
                                    };
                                }
                            }
                            return null;
                        } catch (fileError) {
                            console.error(`Error fetching foto_komunitas ${fotoId}:`, fileError);
                            return null;
                        }
                    })
                );
                // Filter out null values
                fotoKomunitasDetails = fotoKomunitasDetails.filter(detail => detail !== null);
            }
        }

        return {
            komunitas: komunitasData,
            anggota: anggotaData,
            fileDetails,
            fotoKomunitasDetails
        };
    } catch (err) {
        console.error("Error in load function:", err);
        throw error(500, "Failed to load komunitas details");
    }
};
