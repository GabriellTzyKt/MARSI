import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types"; 
import { env } from "$env/dynamic/private";

export const load: PageServerLoad = async ({ params, cookies }) => {
    try {
        const id = params.id;
        let cookie = cookies.get("userSession") ? JSON.parse(cookies.get("userSession") as string) : '';
        // Fetch komunitas data
        const komunitasResponse = await fetch(`${env.URL_KERAJAAN}/komunitas/${id}`);
        if (!komunitasResponse.ok) {
            throw error(komunitasResponse.status, `Failed to fetch komunitas: ${komunitasResponse.statusText}`);
        }
        const komunitasData = await komunitasResponse.json();
        console.log("Komunitas data:", komunitasData);

        // Fetch anggota data
        const dataanggota = await fetch(`${env.URL_KERAJAAN}/komunitas/anggota/${id}`);
        if (!dataanggota.ok) {
            throw error(dataanggota.status, `Failed to fetch komunitas anggota: ${dataanggota.statusText}`);
        }
        const dataanggotajson = await dataanggota.json();
        let [ppRes, pbRes, plRes] = await Promise.all([
            fetch(`${env.PUB_PORT}/user/${komunitasData.penanggung_jawab}`, {
                
                headers: {
                    "Authorization": `Bearer ${cookie?.token}`
                }
            }),
            fetch(`${env.PUB_PORT}/user/${komunitasData.pelindung}`, {
                
                headers: {
                    "Authorization": `Bearer ${cookie?.token}`
                }
            }),
            fetch(`${env.PUB_PORT}/user/${komunitasData.pembina}`,{
                
                headers: {
                    "Authorization": `Bearer ${cookie?.token}`
                }
            }),

        ])
        let ppData = await ppRes.json()
        let pbData = await pbRes.json();
        let plData = await plRes.json();

        // Fetch profile image if available
        let fileDetails = null;
        if (komunitasData.profile) {
            try {
                const filePathResponse = await fetch(`${env.URL_KERAJAAN}/doc/${komunitasData.profile}`);
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

        // Fetch foto_komunitas images if available
        let fotoKomunitasDetails = [];
        if (komunitasData.foto_komunitas) {
            // Split the comma-separated string into an array of IDs
            const fotoIds = komunitasData.foto_komunitas.split(',').map((id : any) => id.trim());
            
            fotoKomunitasDetails = await Promise.all(
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
            fotoKomunitasDetails = fotoKomunitasDetails.filter(detail => detail !== null);
        }
        console.log("foto: " ,fotoKomunitasDetails)

        return {
            komunitas: komunitasData,
            dataanggota: dataanggotajson,
            fileDetails,
            fotoKomunitasDetails,
            pelindung: plData.nama_lengkap || "-",
            penanggungjawab: ppData.nama_lengkap || "-",
            pembina: pbData.nama_lengkap || "-"
        };
    } catch (err) {
        console.error("Error in load function:", err); 
        throw error(500, "Failed to load komunitas details");
    }
};













