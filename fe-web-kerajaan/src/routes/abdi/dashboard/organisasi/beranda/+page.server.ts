import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";

export const load: PageServerLoad = async ({ }) => {
    try {
        const organisasiResponse = await fetch(`${env.URL_KERAJAAN}/organisasi?limit=200`);
        if (!organisasiResponse.ok) {
            throw error(organisasiResponse.status, `Failed to fetch Organisasi: ${organisasiResponse.statusText}`);
        }
        
        const organisasiList = await organisasiResponse.json();
        console.log("Organisasi : ", organisasiList);

        const filteredList = organisasiList.filter((doc: any) => {
            return doc.deleted_at == '0001-01-01T00:00:00Z' && doc.deleted_at !== null;
        });

        // Fetch profile images for each komunitas
        const organisasiWithProfiles = await Promise.all(
            filteredList.map(async (organisasi: any) => {
                let profileUrl = null;
                
                if (organisasi.profile) {
                    try {
                        // const firstPhotoId = organisasi.foto_organisasi.split(',')[0].trim();
                        
                        const filePathResponse = await fetch(`${env.URL_KERAJAAN}/doc/${organisasi.profile}`);
                        if (filePathResponse.ok) {
                            const filePathData = await filePathResponse.json();
                            const filePath = filePathData.file_dokumentasi;
                            
                            if (filePath) {
                                profileUrl = `${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(filePath)}`;
                            }
                        }
                    } catch (fileError) {
                        console.error(`Error fetching profile for organisasi ${organisasi.id_organisasi}:`, fileError);
                    }
                }
                
                return {
                    ...organisasi,
                    profileUrl
                };
            })
        );

        console.log("komunitas with profiles:", organisasiWithProfiles);

        return {
            filteredList: organisasiWithProfiles
        };
    } catch (error) {
        console.error("Error in load function:", error);
        throw error;
    }
};
