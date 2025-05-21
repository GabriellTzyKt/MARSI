import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";

export const load: PageServerLoad = async ({ }) => {
    try {
        const situsResponse = await fetch(`${env.URL_KERAJAAN}/situs?limit=1000`);
        if (!situsResponse.ok) {
            throw error(situsResponse.status, `Failed to fetch situsResponse: ${situsResponse.statusText}`);
        }
        
        const situsList = await situsResponse.json();
        console.log("situs : ", situsList);

        const filteredList = situsList.filter((doc: any) => {
            return doc.deleted_at == '0001-01-01T00:00:00Z' && doc.deleted_at !== null;
        });

        // Fetch profile images for each situs
        const situsWithProfiles = await Promise.all(
            filteredList.map(async (situs: any) => {
                let profileUrl = null;
                
                if (situs.foto_situs) {
                    try {
                        const firstPhotoId = situs.foto_situs.split(',')[0].trim();
                        
                        const filePathResponse = await fetch(`${env.URL_KERAJAAN}/doc/${firstPhotoId}`);
                        if (filePathResponse.ok) {
                            const filePathData = await filePathResponse.json();
                            const filePath = filePathData.file_dokumentasi;
                            
                            if (filePath) {
                                profileUrl = `${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(filePath)}`;
                            }
                        }
                    } catch (fileError) {
                        console.error(`Error fetching profile for situs ${situs.id_situs}:`, fileError);
                    }
                }
                
                return {
                    ...situs,
                    profileUrl
                };
            })
        );

        console.log("situs with profiles:", situsWithProfiles);

        return {
            filteredList: situsWithProfiles
        };
    } catch (error) {
        console.error("Error in load function:", error);
        throw error;
    }
};
