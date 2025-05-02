import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";

export const load: PageServerLoad = async ({ }) => {
    try {
        const komunitasResponse = await fetch(`${env.URL_KERAJAAN}/komunitas`);
        if (!komunitasResponse.ok) {
            throw error(komunitasResponse.status, `Failed to fetch komunitas: ${komunitasResponse.statusText}`);
        }
        
        const komunitasList = await komunitasResponse.json();
        console.log("komunitas : ", komunitasList);

        const filteredList = komunitasList.filter((doc: any) => {
            return doc.deleted_at === '0001-01-01T00:00:00Z' && doc.deleted_at !== null;
        });
        
        // Array untuk menyimpan semua data acara dari semua komunitas
        let allAcara : any= [];
        
        // Iterasi melalui setiap komunitas untuk mengambil acaranya
        for (const komunitas of filteredList) {
            try {
                const acaraResponse = await fetch(`${env.URL_KERAJAAN}/acara/komunitas/${komunitas.id_komunitas}`);
                if (acaraResponse.ok) {
                    const acaraList = await acaraResponse.json();
                    console.log(`Acara komunitas ${komunitas.id_komunitas}:`, acaraList);
                    
                    // Tambahkan informasi komunitas ke setiap acara
                    const acaraWithKomunitas = acaraList.map((acara : any) => ({
                        ...acara,
                        nama_komunitas: komunitas.nama_komunitas,
                        alamat : komunitas.alamat,
                        id_komunitas: komunitas.id_komunitas
                    }));
                    
                    // Gabungkan dengan array utama
                    allAcara = [...allAcara, ...acaraWithKomunitas];
                }
            } catch (acaraError) {
                console.error(`Error fetching acara for komunitas ${komunitas.id_komunitas}:`, acaraError);
                // Lanjutkan ke komunitas berikutnya meskipun ada error
            }
        }
        console.log("all acara : " , allAcara)

        return {
            komunitasList,
            allAcara
        };
    } catch (error) {
        console.error("Error in load function:", error);
        throw error;
    }
};
