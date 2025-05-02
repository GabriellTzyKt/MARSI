import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";

export const load: PageServerLoad = async ({ params }) => {
    try {
        const id = params.id;

        // Fetch komunitas data
        const situsResponse = await fetch(`${env.URL_KERAJAAN}/situs/${id}`);
        if (!situsResponse.ok) {
            throw error(situsResponse.status, `Failed to fetch Situs: ${situsResponse.statusText}`);
        }
        const situsData = await situsResponse.json();
        console.log("Situs data:", situsData);
        
        // ambil foto profil dari foto situs, ambil yg foto 1 aja
        let fileDetails = null;
        if (situsData.foto_situs !== "") {
            try {
                const firstPhotoId = situsData.foto_situs.split(',')[0].trim();

                const filePathResponse = await fetch(`${env.URL_KERAJAAN}/doc/${firstPhotoId}`);
                if (filePathResponse.ok) {
                    const filePathData = await filePathResponse.json();
                    console.log("File path data:", filePathData);
                    
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

        // ambil smua foto yg ada
        let fotoSitusDetails = [];
        if (situsData.foto_situs) {
            // Split the comma-separated string into an array of IDs
            const fotoIds = situsData.foto_situs.split(',').map((id : any) => id.trim());
            
            fotoSitusDetails = await Promise.all(
                fotoIds.map(async (fotoId : any) => {
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
            fotoSitusDetails = fotoSitusDetails.filter(detail => detail !== null);
        }
        console.log("foto: " ,fotoSitusDetails)

        return {
            situs: situsData,
            fileDetails,
            fotoSitusDetails
        };
    } catch (err) {
        console.error("Error in load function:", err); 
        throw error(500, "Failed to load komunitas details");
    }
};