import { env } from "$env/dynamic/private";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    try {
        // komunitas
        const resKom = await fetch(`${env.URL_KERAJAAN}/komunitas`);
        if (!resKom.ok) {
            throw new Error(`HTTP Error! Status: ${resKom.status}`);
        }
        const data = await resKom.json();
        const filterKomunitas = data.filter((item: any) => item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at);
        console.log("komunitas", filterKomunitas);

        // organisasi
        const resOrg = await fetch(`${env.URL_KERAJAAN}/organisasi`);
        if (!resOrg.ok) {
            throw new Error(`HTTP Error! Status: ${resOrg.status}`);
        }
        const dataOrg = await resOrg.json();
        const filterOrganisasi = dataOrg.filter((item: any) => item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at);
        console.log("komunitas", filterOrganisasi);

        async function fetchProfileImage(item: any, idField: string) {
            let profileUrl = null;
            
            if (item.profile) {
                try {
                    const filePathResponse = await fetch(`${env.URL_KERAJAAN}/doc/${item.profile}`);
                    if (filePathResponse.ok) {
                        const filePathData = await filePathResponse.json();
                        const filePath = filePathData.file_dokumentasi;
                        
                        if (filePath) {
                            profileUrl = `${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(filePath)}`;
                        }
                    }
                } catch (fileError) {
                    console.error(`Error fetching profile for item ${item[idField]}:`, fileError);
                }
            }
            
            return {
                ...item,
                profileUrl
            };
        }
        
        // Fetch profile images for each komunitas
        const finalKomunitas = await Promise.all(filterKomunitas.map(async (item: any) => {
            return await fetchProfileImage(item, 'id_komunitas');
        }));
        console.log(finalKomunitas)
        return {
            komunitas: finalKomunitas,
            // organisasi: organisasiWithProfiles
        };
        // return { data };
    }
    catch (error) {
        
    }
};