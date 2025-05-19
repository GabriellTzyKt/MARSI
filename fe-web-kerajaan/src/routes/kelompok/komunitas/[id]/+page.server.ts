import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";

export const load: PageServerLoad = async ({ params, cookies }) => {
    const id = params.id;
    const token = cookies.get("userSession") ? JSON.parse(cookies.get("userSession") as string) : '';
    
    try {
        // Fetch komunitas data from API
        const komunitasResponse = await fetch(`${env.URL_KERAJAAN}/komunitas/${id}`);
        
        if (!komunitasResponse.ok) {
            throw error(komunitasResponse.status, `Failed to fetch komunitas: ${komunitasResponse.statusText}`);
        }
        
        const komunitasData = await komunitasResponse.json();
        console.log("Komunitas data:", komunitasData);
        
        // Fetch profile image if available
        let profileUrl = null;
        if (komunitasData.profile) {
            try {
                const filePathResponse = await fetch(`${env.URL_KERAJAAN}/doc/${komunitasData.profile}`);
                if (filePathResponse.ok) {
                    const filePathData = await filePathResponse.json();
                    
                    const filePath = filePathData.file_dokumentasi;
                    if (filePath) {
                        profileUrl = `${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(filePath)}`;
                    }
                }
            } catch (fileError) {
                console.error("Error fetching profile:", fileError);
            }
        }

        // Fetch foto_komunitas images if available
        let imageUrls = [];
        if (komunitasData.foto_komunitas && komunitasData.foto_komunitas.trim() !== '') {
            try {
                const docIds = komunitasData.foto_komunitas.split(',').map(id => id.trim());
                console.log("Document IDs:", docIds);
                
                for (const docId of docIds) {
                    if (!docId) continue;
                    
                    console.log(`Fetching document with ID: ${docId}`);
                    const docRes = await fetch(`${env.URL_KERAJAAN}/doc/${docId}`);
                    
                    if (docRes.ok) {
                        const docData = await docRes.json();
                        console.log("Document data:", docData);
                        
                        if (docData.file_dokumentasi) {
                            const imageUrl = `${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(docData.file_dokumentasi)}`;
                            imageUrls.push(imageUrl);
                        }
                    }
                }
            } catch (error) {
                console.error("Error processing foto_komunitas:", error);
            }
        }

        // Fetch additional user data for penanggung_jawab, pembina, and pelindung
        const [penanggungJawabData, pembinaData, pelindungData, lokasiData] = await Promise.all([
            fetchUserData(komunitasData.penanggung_jawab, token),
            fetchUserData(komunitasData.pembina, token),
            fetchUserData(komunitasData.pelindung, token),
            fetchLokasiData(komunitasData.lokasi, token)
        ]);

        return {
            data: {
                komunitas: komunitasData,
                profileUrl,
                imageUrls,
                penanggungJawab: penanggungJawabData,
                pembina: pembinaData,
                pelindung: pelindungData,
                lokasi: lokasiData
            }
        };
    } catch (err) {
        console.error("Error in load function:", err);
        throw error(500, "Failed to load komunitas details");
    }
};

// Helper function to fetch user data
async function fetchUserData(userId: number | string, token: any) {
    if (!userId || userId === '0') return null;
    
    try {
        const response = await fetch(`${env.PUB_PORT}/user/${userId}`, {
            headers: {
                "Authorization": `Bearer ${token?.token}`
            }
        });
        
        if (response.ok) {
            return await response.json();
        }
        console.error(`Failed to fetch user ${userId}: ${response.statusText}`);
        return null;
    } catch (error) {
        console.error(`Error fetching user ${userId}:`, error);
        return null;
    }
}

// Helper function to fetch lokasi data
async function fetchLokasiData(lokasiId: number | string, token: any) {
    if (!lokasiId || lokasiId === '0') return null;
    
    try {
        const response = await fetch(`${env.URL_KERAJAAN}/lokasi/${lokasiId}`, {
            headers: {
                "Authorization": `Bearer ${token?.token}`
            }
        });
        
        if (response.ok) {
            return await response.json();
        }
        console.error(`Failed to fetch lokasi ${lokasiId}: ${response.statusText}`);
        return null;
    } catch (error) {
        console.error(`Error fetching lokasi ${lokasiId}:`, error);
        return null;
    }
}