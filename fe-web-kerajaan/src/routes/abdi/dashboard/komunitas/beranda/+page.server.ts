import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";

export const load: PageServerLoad = async ({ }) => {
    try {
        const komunitasResponse = await fetch(`${env.URL_KERAJAAN}/komunitas?limit=200`);
        if (!komunitasResponse.ok) {
            throw error(komunitasResponse.status, `Failed to fetch komunitas: ${komunitasResponse.statusText}`);
        }
        
        const komunitasList = await komunitasResponse.json();
        // console.log("komunitas : ", komunitasList);

        const filteredList = komunitasList.filter((doc: any) => {
            return doc.deleted_at == '0001-01-01T00:00:00Z' && doc.deleted_at !== null;
        });

        // Fetch profile images for each komunitas
        const komunitasWithProfiles = await Promise.all(
            filteredList.map(async (komunitas: any) => {
                let profileUrl = null;
                
                if (komunitas.profile) {
                    try {
                        const filePathResponse = await fetch(`${env.URL_KERAJAAN}/doc/${komunitas.profile}`);
                        if (filePathResponse.ok) {
                            const filePathData = await filePathResponse.json();
                            const filePath = filePathData.file_dokumentasi;
                            
                            if (filePath) {
                                profileUrl = `${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(filePath)}`;
                            }
                        }
                    } catch (fileError) {
                        console.error(`Error fetching profile for komunitas ${komunitas.id_komunitas}:`, fileError);
                    }
                }
                
                return {
                    ...komunitas,
                    profileUrl
                };
            })
        );

        // console.log("komunitas with profiles:", komunitasWithProfiles);

        return {
            filteredList: komunitasWithProfiles
        };
    } catch (error) {
        console.error("Error in load function:", error);
        throw error;
    }
};
