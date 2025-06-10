import { env } from "$env/dynamic/private";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    try {
        // komunitas
        const resKom = await fetch(`${env.URL_KERAJAAN}/komunitas?limit=600`);
        if (!resKom.ok) {
            throw new Error(`HTTP Error! Status: ${resKom.status}`);
        }
        const data = await resKom.json();
        const filterKomunitas = data.filter((item: any) => item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at || item.deleted_at == null);
        console.log("komunitas", filterKomunitas);

        // organisasi
        const resOrg = await fetch(`${env.URL_KERAJAAN}/organisasi?limit=600`);
        if (!resOrg.ok) {
            throw new Error(`HTTP Error! Status: ${resOrg.status}`);
        }
        const dataOrg = await resOrg.json();
        const filterOrganisasi = dataOrg.filter((item: any) => item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at || item.deleted_at === null);
        console.log("organisais", filterOrganisasi);

        async function fetchProfileImages(item: any, idField: string) {
            let profileUrls: string[] = [];

            if (item.profile) {
                const ids = item.profile.split(',').map((id: string) => id.trim()).filter(Boolean);
                for (const id of ids) {
                    try {
                        const filePathResponse = await fetch(`${env.URL_KERAJAAN}/doc/${id}`);
                        if (filePathResponse.ok) {
                            const filePathData = await filePathResponse.json();
                            const filePath = filePathData.file_dokumentasi;
                            if (filePath) {
                                if (Array.isArray(filePath)) {
                                    filePath.forEach((path: string) => {
                                        if (path) profileUrls.push(`${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(path)}`);
                                    });
                                } else {
                                    profileUrls.push(`${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(filePath)}`);
                                }
                            }
                        }
                    } catch (fileError) {
                        console.error(`Error fetching profile for item ${item[idField]}:`, fileError);
                    }
                }
            }

            return {
                ...item,
                profileUrls:  Array.isArray(profileUrls) ? profileUrls : [] // array of all profile image URLs
            };
        }
        
        // Fetch profile images for each komunitas
        const finalKomunitas = await Promise.all(filterKomunitas.map(async (item: any) => {
            return await fetchProfileImages(item, 'id_komunitas');
        }));
        const finalOrganisasi = await Promise.all(filterOrganisasi.map(async (item: any) => {
            return await fetchProfileImages(item, 'id_organisasi');
        }));
        console.log(finalKomunitas)
        console.log("Final Org",finalOrganisasi)
        return {
            komunitas: finalKomunitas,
            organisasi: finalOrganisasi
        };
        // return { data };
    }
    catch (error) {
        
    }
};