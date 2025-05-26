import { env } from "$env/dynamic/private";
import { data_flipcard2 } from "$lib/dummy";
import { data_showraja } from "$lib/dummy";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, fetch }) => {
    const id = Number(params.id);
    console.log("ID Url : ", id);
    
    try {
        // Fetch data dari API endpoint
        const [kerajaanResponse, historyRajaResponse] = await Promise.all([
            fetch(`${env.BASE_URL}/kerajaan?limit=200`, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            }),
            fetch(`${env.BASE_URL}/history-raja?limit=200`, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            })
        ]);

        if (!kerajaanResponse.ok) {
            throw new Error(`HTTP Error! Status: ${kerajaanResponse.status}`);
        }
        
        if (!historyRajaResponse.ok) {
            console.error(`Error fetching history raja: ${historyRajaResponse.status}`);
        }

        const allKerajaan = await kerajaanResponse.json();
        console.log("Data kerajaan berhasil diambil:", allKerajaan.length);
        
        // Get history raja data and filter by kerajaan ID
        let historyRaja = [];
        try {
            const allHistoryRaja = await historyRajaResponse.json();
            // Filter history raja for this kerajaan and not deleted
            historyRaja = allHistoryRaja.filter((raja: any) => {
                const notDeleted = raja.deleted_at === '0001-01-01T00:00:00Z' || !raja.deleted_at;
                const matchesKerajaan = raja.id_kerajaan === id;
                return notDeleted && matchesKerajaan;
            });
            
            // Process images for each raja
            for (let i = 0; i < historyRaja.length; i++) {
                const raja = historyRaja[i];
                if (raja.dokumentasi && raja.dokumentasi.trim() !== '') {
                    try {
                        const docRes = await fetch(`${env.BASE_URL}/doc/${raja.dokumentasi}`);
                        if (docRes.ok) {
                            const docData = await docRes.json();
                            const filePath = docData.file_dokumentasi || docData;
                            
                            if (typeof filePath === 'string') {
                                raja.imageUrl = `${env.BASE_URL}/file?file_path=${encodeURIComponent(filePath)}`;
                            } else if (Array.isArray(filePath) && filePath.length > 0) {
                                raja.imageUrl = `${env.BASE_URL}/file?file_path=${encodeURIComponent(filePath[0])}`;
                            }
                        }
                    } catch (error) {
                        console.error(`Error fetching image for raja ${raja.nama_raja}:`, error);
                    }
                }
                
                // Format periode menjabat
                raja.periodeMenjabat = '';
                if (raja.mulai_menjabat) {
                    const mulaiYear = new Date(raja.mulai_menjabat).getFullYear();
                    let selesaiYear : any = 'Sekarang';
                    
                    if (raja.selesai_menjabat && raja.selesai_menjabat !== '0001-01-01T00:00:00Z') {
                        selesaiYear = new Date(raja.selesai_menjabat).getFullYear();
                    }
                    
                    raja.periodeMenjabat = `${mulaiYear} - ${selesaiYear}`;
                }
            }
            
            console.log(`Found ${historyRaja.length} history raja records for this kerajaan`);
        } catch (error) {
            console.error("Error processing history raja data:", error);
        }
        
        // Cari kerajaan dengan ID yang sesuai
        const detil_kerajaan = allKerajaan.find((kerajaan : any) => kerajaan.id === id || kerajaan.id_kerajaan === id);
        const detil_flip = data_flipcard2;

        if (!detil_kerajaan) {
            console.error(`Data tidak ditemukan untuk ID: ${id}`);
            throw new Error(`Data tidak ditemukan untuk ID: ${id}`);
        }

        console.log("Detail kerajaan ditemukan:", detil_kerajaan.nama_kerajaan);
        
        // Inisialisasi array dan URL untuk media
        let imageUrls = [];
        let benderaUrl = '';
        let lambangUrl = '';
        let videoUrl = '';
        
        // Process foto_umum (multiple items)
        if (detil_kerajaan.foto_umum && detil_kerajaan.foto_umum.trim() !== '') {
            const photoIds = detil_kerajaan.foto_umum.split(',').map((id: string) => id.trim());

            // Fetch file path for each photo ID
            for (const photoId of photoIds) {
                if (!photoId) continue;

                try {
                    const docRes = await fetch(`${env.BASE_URL}/doc/${photoId}`);

                    if (docRes.ok) {
                        const docData = await docRes.json();
                        const filePath = docData.file_dokumentasi || docData;

                        if (typeof filePath === 'string') {
                            imageUrls.push(`${env.BASE_URL}/file?file_path=${encodeURIComponent(filePath)}`);
                        } else if (Array.isArray(filePath)) {
                            filePath.forEach(path => {
                                if (typeof path === 'string') {
                                    imageUrls.push(`${env.BASE_URL}/file?file_path=${encodeURIComponent(path)}`);
                                }
                            });
                        }
                    }
                } catch (error) {
                    console.error(`Error fetching document with ID ${photoId}:`, error);
                }
            }
        }

        // Process bendera_kerajaan (single item)
        if (detil_kerajaan.bendera_kerajaan && detil_kerajaan.bendera_kerajaan.trim() !== '') {
            try {
                const docRes = await fetch(`${env.BASE_URL}/doc/${detil_kerajaan.bendera_kerajaan}`);

                if (docRes.ok) {
                    const docData = await docRes.json();
                    const filePath = docData.file_dokumentasi || docData;

                    if (typeof filePath === 'string') {
                        benderaUrl = `${env.BASE_URL}/file?file_path=${encodeURIComponent(filePath)}`;
                    } else if (Array.isArray(filePath)) {
                        benderaUrl = `${env.BASE_URL}/file?file_path=${encodeURIComponent(filePath[0])}`;
                    }
                }
            } catch (error) {
                console.error(`Error fetching bendera with ID ${detil_kerajaan.bendera_kerajaan}:`, error);
            }
        }

        // Process lambang_kerajaan (single item)
        if (detil_kerajaan.lambang_kerajaan && detil_kerajaan.lambang_kerajaan.trim() !== '') {
            try {
                const docRes = await fetch(`${env.BASE_URL}/doc/${detil_kerajaan.lambang_kerajaan}`);

                if (docRes.ok) {
                    const docData = await docRes.json();
                    const filePath = docData.file_dokumentasi || docData;

                    if (typeof filePath === 'string') {
                        lambangUrl = `${env.BASE_URL}/file?file_path=${encodeURIComponent(filePath)}`;
                    } else if (Array.isArray(filePath)) {
                        lambangUrl = `${env.BASE_URL}/file?file_path=${encodeURIComponent(filePath[0])}`;
                    }
                }
            } catch (error) {
                console.error(`Error fetching lambang with ID ${detil_kerajaan.lambang_kerajaan}:`, error);
            }
        }

        // Process video_kerajaan (single item)
        if (detil_kerajaan.video_kerajaan && detil_kerajaan.video_kerajaan.trim() !== '') {
            try {
                const docRes = await fetch(`${env.BASE_URL}/doc/${detil_kerajaan.video_kerajaan}`);

                if (docRes.ok) {
                    const docData = await docRes.json();
                    const filePath = docData.file_dokumentasi || docData;

                    if (typeof filePath === 'string') {
                        videoUrl = `${env.BASE_URL}/file?file_path=${encodeURIComponent(filePath)}`;
                    } else if (Array.isArray(filePath)) {
                        videoUrl = `${env.BASE_URL}/file?file_path=${encodeURIComponent(filePath[0])}`;
                    }
                }
            } catch (error) {
                console.error(`Error fetching video with ID ${detil_kerajaan.video_kerajaan}:`, error);
            }
        }

        // Add all media URLs to the kerajaan data
        const kerajaanWithMedia = {
            ...detil_kerajaan,
            imageUrls,
            benderaUrl,
            lambangUrl,
            videoUrl
        };

        return { 
            detil_kerajaan: kerajaanWithMedia, 
            detil_flip, 
            show_raja: historyRaja 
        };
        
    } catch (error) {
        console.error("Error saat mengambil data:", error);
        
        // Fallback ke data dummy jika API gagal
        console.log("Menggunakan data dummy sebagai fallback");
        const tempdata = (await import("$lib/dummy")).tempdata;
        const detil_kerajaan = tempdata.find((kerajaan) => kerajaan.id === id);
        const detil_flip = data_flipcard2;
        const show_raja = data_showraja; // Still use dummy data as fallback

        if (!detil_kerajaan) {
            throw new Error(`Data tidak ditemukan untuk ID: ${id}`);
        }

        return { detil_kerajaan, detil_flip, show_raja };
    }
};
