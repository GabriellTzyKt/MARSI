import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";

export const load: PageServerLoad = async ({ params, cookies }) => {
    const id = params.id;
    const cookie = cookies.get("userSession") ? JSON.parse(cookies.get("userSession") as string) : '';
    
    try {
        // Fetch organisasi data
        const organisasiRes = await fetch(`${env.URL_KERAJAAN}/organisasi/${id}`);
        if (!organisasiRes.ok) {
            throw error(organisasiRes.status, `Failed to fetch organisasi: ${organisasiRes.statusText}`);
        }
        
        const organisasi = await organisasiRes.json();
        console.log("Organisasi data:", organisasi);
        
        // Process image URLs
        let imageUrls = [];
        
        // Fetch profile image if available
        let profileUrl = null;
        if (organisasi.profile) {
            try {
                const profileRes = await fetch(`${env.URL_KERAJAAN}/doc/${organisasi.profile}`);
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
        
        // Fetch foto_organisasi images
        if (organisasi.foto_organisasi && organisasi.foto_organisasi.trim() !== '') {
            const docIds = organisasi.foto_organisasi.split(',').map(id => id.trim()).filter(id => id);
            
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
        if (organisasi.penanggung_jawab && organisasi.penanggung_jawab !== '0') {
            try {
                const userRes = await fetch(`${env.URL_KERAJAAN}/anggota/${organisasi.penanggung_jawab}`);
                if (userRes.ok) {
                    penanggungJawab = await userRes.json();
                }
            } catch (err) {
                console.error("Error fetching penanggung_jawab:", err);
            }
        }
        
        // Fetch pembina data
        let pembina = null;
        if (organisasi.pembina && organisasi.pembina !== '0') {
            try {
                const userRes = await fetch(`${env.PUB_PORT}/user/${organisasi.pembina}`, {
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
        if (organisasi.pelindung && organisasi.pelindung !== '0') {
            try {
                const userRes = await fetch(`${env.PUB_PORT}/user/${organisasi.pelindung}`, {
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
        if (organisasi.lokasi && organisasi.lokasi !== '0') {
            try {
                const lokasiRes = await fetch(`${env.URL_KERAJAAN}/situs/${organisasi.lokasi}`);
                if (lokasiRes.ok) {
                    lokasi = await lokasiRes.json();
                }
            } catch (err) {
                console.error("Error fetching lokasi:", err);
            }
        }
        
        return {
            organisasi,
            imageUrls,
            profileUrl,
            penanggungJawab,
            pembina,
            pelindung,
            lokasi
        };
    } catch (err) {
        console.error("Error in load function:", err);
        throw error(500, "Failed to load organisasi details");
    }
}

