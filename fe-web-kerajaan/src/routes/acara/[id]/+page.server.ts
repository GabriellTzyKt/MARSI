import { env } from "$env/dynamic/private";
import { filterArsip,formatDatetoUI, formatDateTime,formatDate,formatTime } from "$lib";
import { detail_acara } from "$lib/dummy";
import type { PageServerLoad } from "./$types";

function formatTimeToHHMM(isoString: string): string {
    if (!isoString) return '-';
    const date = new Date(isoString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}
export const load: PageServerLoad = async ({ params, cookies }) => {
    let cookie = cookies.get("userSession") ? JSON.parse(cookies.get("userSession") as string) : '';
    try {
        console.log("Fetching acara with ID:", params.id);
        const acara = await fetch(`${env.URL_KERAJAAN}/acara/detail/${params.id}`);
        
        if (!acara.ok) {
            console.error(`HTTP Error! Status: ${acara.status}`);
            throw new Error(`HTTP Error! Status: ${acara.status}`);
        }
        
        const detil_acara = await acara.json();
        console.log("Raw API response:", detil_acara);
        
        // Pastikan detil_acara adalah array
        const acaraArray = Array.isArray(detil_acara) ? detil_acara : [detil_acara];
        
        // Hanya ambil foto tanpa formatting lainnya
        const processedData = [];
        
        for (const item of acaraArray) {
            // Buat objek dasar dengan data asli
            const processedItem = { ...item, imageUrls: [] };
            
            // Proses foto jika ada
            if (item.foto_acara && item.foto_acara.trim() !== '') {
                try {
                    const docIds = item.foto_acara.split(',').map(id => id.trim());
                    console.log("Document IDs:", docIds);
                    
                    for (const id of docIds) {
                        if (!id) continue;
                        
                        console.log(`Fetching document with ID: ${id}`);
                        const docRes = await fetch(`${env.URL_KERAJAAN}/doc/${id}`);
                        
                        if (docRes.ok) {
                            const docData = await docRes.json();
                            console.log(`Document data for ID ${id}:`, docData);
                            
                            const filePath = docData.file_dokumentasi || docData;
                            
                            if (typeof filePath === 'string') {
                                const imageUrl = `${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(filePath)}`;
                                processedItem.imageUrls.push(imageUrl);
                                console.log("Added image URL:", imageUrl);
                            } else if (Array.isArray(filePath)) {
                                filePath.forEach(path => {
                                    if (typeof path === 'string') {
                                        const imageUrl = `${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(path)}`;
                                        processedItem.imageUrls.push(imageUrl);
                                        console.log("Added image URL from array:", imageUrl);
                                    }
                                });
                            }
                        } else {
                            console.error(`Failed to fetch document with ID ${id}: ${docRes.status}`);
                        }
                    }
                } catch (error) {
                    console.error(`Error processing images for event ${item.id_acara}:`, error);
                }
            }
            
            // console.log("Processed item with images:", processedItem);
            processedData.push(processedItem);
        }
        let userData = await fetch(`${env.PUB_PORT}/user/${detil_acara.id_penanggung_jawab}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${cookie.token}`
            }
        })
        let user = await userData.json();
        // console.log(`user : ${detil_acara.id_penanggung_jawab} adalah ${user.nama_lengkap}`)
        // console.log("Final processed data:", processedData[0]);
        function formatTimeToHHMM_UTC(isoString: string): string {
            if (!isoString || isoString === '0001-01-01T00:00:00Z') return '-';
            const date = new Date(isoString);
            const hours = String(date.getUTCHours()).padStart(2, '0');
            const minutes = String(date.getUTCMinutes()).padStart(2, '0');
            return `${hours}:${minutes}`;
        }
        const final = {
            ...processedData[0],
            tanggal_mulai: formatDate(processedData[0].waktu_mulai),
            nama_penanggung_jawab: user.nama_lengkap,
            tanggal_selesai: formatDatetoUI(processedData[0].waktu_selesai),
            waktu_mulai: formatTimeToHHMM_UTC(processedData[0].waktu_mulai),  
            waktu_selesai: formatTimeToHHMM_UTC(processedData[0].waktu_selesai),  
            waktu_mulai_full: formatDateTime(processedData[0].waktu_mulai),  
            waktu_selesai_full: formatDateTime(processedData[0].waktu_selesai),  
            tanggal_mulai_format: formatDatetoUI(processedData[0].waktu_mulai),
            tanggal_selesai_format: formatDatetoUI(processedData[0].waktu_mulai),
            waktu_mulai_original: processedData[0].waktu_mulai,  
            waktu_selesai_original: processedData[0].waktu_selesai,
        }
        return { data: final };
    }
    catch (error) {
        console.error("Error in load function:", error);
        
        // Fallback to dummy data if API fails
        try {
            const id = Number(params.id);
            const detil_acara = detail_acara.find((acara) => acara.id === id);
            
            if (!detil_acara) {
                throw new Error(`Data tidak ditemukan untuk ID: ${id}`);
            }
            
            console.log("Using fallback dummy data:", detil_acara);
            return { data: [detil_acara] };
        } catch (fallbackError) {
            console.error("Fallback also failed:", fallbackError);
            return { data: [], error: "Data tidak ditemukan" };
        }
    }
}
