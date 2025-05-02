import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types"; 
import { env } from "$env/dynamic/private";

export const load: PageServerLoad = async ({ params }) => {
    try {
        const id = params.id;

        // Fetch komunitas data
        const organisasiResponse = await fetch(`${env.URL_KERAJAAN}/organisasi/${id}`);
        if (!organisasiResponse.ok) {
            throw error(organisasiResponse.status, `Failed to fetch komunitas: ${organisasiResponse.statusText}`);
        }
        const organisasiData = await organisasiResponse.json();
        console.log("organisasi data:", organisasiData);

        // Fetch anggota data
        const dataanggota = await fetch(`${env.URL_KERAJAAN}/organisasi/anggota/${id}`);
        if (!dataanggota.ok) {
            throw error(dataanggota.status, `Failed to fetch organisasi anggota: ${dataanggota.statusText}`);
        }
        const dataanggotajson = await dataanggota.json();
        
        // Fetch profile image if available
        let fileDetails = null;
        if (organisasiData.profile) {
            try {
                const filePathResponse = await fetch(`${env.URL_KERAJAAN}/doc/${organisasiData.profile}`);
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

        // Fetch foto_organisasi images if available
        let fotoOrganisasiDetails = [];
        if (organisasiData.foto_organisasi) {
            try {
                const fotoIds = organisasiData.foto_organisasi.includes(',') 
                    ? organisasiData.foto_organisasi.split(',').map((id: any) => id.trim())
                    : [organisasiData.foto_organisasi.trim()];
                
                fotoOrganisasiDetails = await Promise.all(
                    fotoIds.map(async (fotoId: any) => {
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
                            console.error(`Error fetching foto_organisasi ${fotoId}:`, fileError);
                            return null;
                        }
                    })
                );
                // Filter out null values
                fotoOrganisasiDetails = fotoOrganisasiDetails.filter(detail => detail !== null);
            } catch (error) {
                console.error("Error processing foto_organisasi:", error);
            }
        }
        console.log("foto: " ,fotoOrganisasiDetails)

        return {
            organisasi: organisasiData,
            fileDetails,
            dataanggota: dataanggotajson,
            fotoOrganisasiDetails
        };
    } catch (err) {
        console.error("Error in load function:", err); 
        throw error(500, "Failed to load komunitas details");
    }
};













