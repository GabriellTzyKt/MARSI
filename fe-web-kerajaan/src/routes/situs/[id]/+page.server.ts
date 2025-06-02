import { env } from "$env/dynamic/private";
import type { PageServerLoad } from "./$types";
import { formatTime } from "$lib";

export const load: PageServerLoad = async ({ params, cookies }) => {
    const id = params.id;
    let cookie = JSON.parse(cookies.get("userSession") as string)
    try {
        const res = await fetch(`${env.URL_KERAJAAN}/situs/${id}`);
        if (!res.ok) {
            throw new Error(`HTTP Error! Status: ${res.status}`);
        }
        const data = await res.json();
        let juRes = await fetch(`${env.PUB_PORT}/user/${data.juru_kunci}`, {
            method: "GET",
            headers: {
                "Authorization" :`Bearer ${cookie.token}`
            }
        })
        let juru = await juRes.json()
        console.log(data);
        // Format time fields from HH:MM:SS to HH:MM
        const formatTimeField = (timeString) => {
            if (!timeString) return '';
            // If it's already in HH:MM format, return as is
            if (/^\d{1,2}:\d{2}$/.test(timeString)) return timeString;
            // If it's in HH:MM:SS format, remove the seconds
            return timeString.replace(/^(\d{1,2}:\d{2}):\d{2}$/, '$1');
        };
        
        const formattedItem = {
            ...data,
            jam_buka: formatTimeField(data.jam_buka),
            jam_tutup: formatTimeField(data.jam_tutup),
            jenis_situs: '',
            juru_kunci_nama: juru.nama_lengkap,
            imageUrls: []
        };

        // Fetch all jenis_situs and filter for the matching one
        try {
            if (data.id_jenis_situs) {
                const jenisRes = await fetch(`${env.URL_KERAJAAN}/situs/jenis`);
                if (jenisRes.ok) {
                    const jenisDataList = await jenisRes.json();
                    // Find the matching jenis_situs by id
                    const matchingJenis = jenisDataList.find(item => 
                        item.id_jenis_situs === data.id_jenis_situs || 
                        item.id === data.id_jenis_situs
                    );
                    
                    if (matchingJenis) {
                        formattedItem.jenis_situs = matchingJenis.jenis_situs || matchingJenis.jenis || '';
                    } else {
                        console.error(`No matching jenis_situs found for ID ${data.id_jenis_situs}`);
                    }
                } else {
                    console.error(`Failed to fetch jenis situs list: ${jenisRes.status}`);
                }
            }
        } catch (error) {
            console.error(`Error fetching jenis situs list:`, error);
        }

        try {
            if (data.foto_situs) {
                // Handle both string and array formats
                const docIds = typeof data.foto_situs === 'string' 
                    ? data.foto_situs.split(',').map(id => id.trim())
                    : data.foto_situs;
                
                if (docIds && docIds.length > 0) {
                    for (const docId of docIds) {
                        const res = await fetch(`${env.URL_KERAJAAN}/doc/${docId}`);
                        if (!res.ok) {
                            console.error(`Failed to fetch doc/${docId}: ${res.status}`);
                            continue;
                        }
                        
                        const docData = await res.json();
                        const filePaths = docData.file_dokumentasi || docData;
                        const pathsArray = Array.isArray(filePaths) ? filePaths : [filePaths];
                        
                        for (const path of pathsArray) {
                            if (typeof path === 'string') {
                                formattedItem.imageUrls.push(
                                    `${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(path)}`
                                );
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error(`Error processing images for situs ${id}:`, error);
        }
        console.log(formattedItem)
        return { detil_kelompok: formattedItem };
    } catch (error) {
        console.error(`Error fetching situs with ID ${id}:`, error);
        throw new Error(`Data tidak ditemukan untuk ID: ${id}`);
    }
};
