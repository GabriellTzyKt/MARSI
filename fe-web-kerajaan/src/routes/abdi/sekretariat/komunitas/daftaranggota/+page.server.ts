import { env } from "$env/dynamic/private";
import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ }) => {
    try {
        const komunitasResponse = await fetch(`${env.URL_KERAJAAN}/komunitas`);
        if (!komunitasResponse.ok) {
            throw error(komunitasResponse.status, `Failed to fetch komunitas: ${komunitasResponse.statusText}`);
        }
        
        const komunitasList = await komunitasResponse.json();
        console.log("komunitas : ", komunitasList);
        
        // Array untuk menyimpan semua data anggota dari semua komunitas
        let allAnggota : any= [];
        
        // Iterasi melalui setiap komunitas untuk mengambil anggotanya
        for (const komunitas of komunitasList) {
            try {
                const anggotaResponse = await fetch(`${env.URL_KERAJAAN}/komunitas/anggota/${komunitas.id_komunitas}`);
                if (anggotaResponse.ok) {
                    const anggotaList = await anggotaResponse.json();
                    console.log(`Anggota komunitas ${komunitas.id_komunitas}:`, anggotaList);
                    
                    // Tambahkan informasi komunitas ke setiap anggota
                    const anggotaWithKomunitas = anggotaList.map((anggota : any) => ({
                        ...anggota,
                        nama_komunitas: komunitas.nama_komunitas,
                        id_komunitas: komunitas.id_komunitas
                    }));
                    
                    // Gabungkan dengan array utama
                    allAnggota = [...allAnggota, ...anggotaWithKomunitas];
                }
            } catch (anggotaError) {
                console.error(`Error fetching anggota for komunitas ${komunitas.id_komunitas}:`, anggotaError);
                // Lanjutkan ke komunitas berikutnya meskipun ada error
            }
        }

        return {
            komunitasList,
            allAnggota
        };
    } catch (error) {
        console.error("Error in load function:", error);
        throw error;
    }
};
