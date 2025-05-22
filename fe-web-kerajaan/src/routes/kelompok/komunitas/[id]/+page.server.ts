import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";

export const load: PageServerLoad = async ({ params, cookies }) => {
    const id = params.id;
    const cookie = cookies.get("userSession") ? JSON.parse(cookies.get("userSession") as string) : '';
    
    try {
        // Fetch komunitas data
        const komunitasRes = await fetch(`${env.URL_KERAJAAN}/komunitas/${id}`);
        if (!komunitasRes.ok) {
            throw error(komunitasRes.status, `Failed to fetch komunitas: ${komunitasRes.statusText}`);
        }
        
        const komunitas = await komunitasRes.json();
        console.log("Komunitas data:", komunitas);
        
        // Process image URLs
        let imageUrls = [];
        
        // Fetch profile image if available
        let profileUrl = null;
        if (komunitas.profile) {
            try {
                const profileRes = await fetch(`${env.URL_KERAJAAN}/doc/${komunitas.profile}`);
                if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    if (profileData.file_dokumentasi) {
                        profileUrl = `${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(profileData.file_dokumentasi)}`;
                    }
                }
            } catch (err) {
                console.error("Error fetching profile image:", err);
            }
        }
        
        // Fetch foto_komunitas images
        if (komunitas.foto_komunitas && komunitas.foto_komunitas.trim() !== '') {
            const docIds = komunitas.foto_komunitas.split(',').map(id => id.trim()).filter(id => id);
            
            for (const docId of docIds) {
                try {
                    const docRes = await fetch(`${env.URL_KERAJAAN}/doc/${docId}`);
                    if (docRes.ok) {
                        const docData = await docRes.json();
                        if (docData.file_dokumentasi) {
                            imageUrls.push(`${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(docData.file_dokumentasi)}`);
                        }
                    }
                } catch (err) {
                    console.error(`Error fetching document ${docId}:`, err);
                }
            }
        }
        
        // Fetch penanggung_jawab data
        let penanggungJawab = null;
        if (komunitas.penanggung_jawab && komunitas.penanggung_jawab !== '0') {
            try {
                const userRes = await fetch(`${env.PUB_PORT}/user/${komunitas.penanggung_jawab}`, {
                    headers: {
                        "Authorization": `Bearer ${cookie?.token}`
                    }
                });
                if (userRes.ok) {
                    penanggungJawab = await userRes.json();
                }
            } catch (err) {
                console.error("Error fetching penanggung_jawab:", err);
            }
        }
        
        // Fetch pembina data
        let pembina = null;
        if (komunitas.pembina && komunitas.pembina !== '0') {
            try {
                const userRes = await fetch(`${env.PUB_PORT}/user/${komunitas.pembina}`, {
                    headers: {
                        "Authorization": `Bearer ${cookie?.token}`
                    }
                });
                if (userRes.ok) {
                    pembina = await userRes.json();
                }
            } catch (err) {
                console.error("Error fetching pembina:", err);
            }
        }
        
        // Fetch pelindung data
        let pelindung = null;
        if (komunitas.pelindung && komunitas.pelindung !== '0') {
            try {
                const userRes = await fetch(`${env.PUB_PORT}/user/${komunitas.pelindung}`, {
                    headers: {
                        "Authorization": `Bearer ${cookie?.token}`
                    }
                });
                if (userRes.ok) {
                    pelindung = await userRes.json();
                }
            } catch (err) {
                console.error("Error fetching pelindung:", err);
            }
        }
        
        // Fetch lokasi data
        let lokasi = null;
        if (komunitas.lokasi && komunitas.lokasi !== '0') {
            try {
                const lokasiRes = await fetch(`${env.URL_KERAJAAN}/lokasi/${komunitas.lokasi}`);
                if (lokasiRes.ok) {
                    lokasi = await lokasiRes.json();
                }
            } catch (err) {
                console.error("Error fetching lokasi:", err);
            }
        }
        
        return {
            komunitas,
            imageUrls,
            profileUrl,
            penanggungJawab,
            pembina,
            pelindung,
            lokasi
        };
    } catch (err) {
        console.error("Error in load function:", err);
        throw error(500, "Failed to load komunitas details");
    }
}
