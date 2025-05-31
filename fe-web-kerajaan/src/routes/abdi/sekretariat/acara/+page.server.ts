import { env } from "$env/dynamic/private";
import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import {
    formatDateTime, formatDate, formatTime
    
 } from "$lib";

export const load: PageServerLoad = async ({cookies}) => {
    try {
        let token = JSON.parse(cookies.get("userSession") as string);
        let res = await fetch(`${env.URL_KERAJAAN}/acara?limit=500`);
        if (!res.ok) {
            throw new Error(`HTTP Error! Status: ${res.status}`);
        }
        let data = await res.json();
        // console.log("acara",data)
     data = data.filter(item => item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at);
        let formatDateTime = (isoString) => {
    if (!isoString || isoString === '0001-01-01T00:00:00Z') return '-';
    let date = new Date(isoString);
    
    // Format date: dd-mm-yyyy
    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let year = date.getFullYear();
    
    // Format time: HH:MM:SS
    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');
    let seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

         let formatDate = (isoString) => {
            if (!isoString || isoString === '0001-01-01T00:00:00Z') return '-';
            let date = new Date(isoString);
            let day = String(date.getDate()).padStart(2, '0');
            let month = String(date.getMonth() + 1).padStart(2, '0');
            let year = date.getFullYear();
            return `${day}-${month}-${year}`;
        };
        let mergedData = data.map((event: any) => ({
            ...event,
            waktu_mulai: formatDate(event.waktu_mulai),
                waktu_selesai: formatDate(event.waktu_selesai),
                waktu_mulai_full: formatDateTime(event.waktu_mulai),
                waktu_selesai_full: formatDateTime(event.waktu_selesai),
            // lokasi_detail: locationMap.get(event.lokasi_acara) || { nama_lokasi: 'Lokasi tidak ditemukan' },
            // penanggungjawab_detail: personMap.get(event.penanggung_jawab) || { nama: 'PJ tidak ditemukan' }
        }));
        // let finalData = await Promise.all(mergedData.map(async (item) => {
        //     let resLoc = await fetch(`${env.URL_KERAJAAN}/situs/${item.id_lokasi}`);
        //     if (!resLoc.ok) {
        //     }
        //     let locData = await resLoc.json();
        //     // console.log("Found Lokasi : ", locData)
              

        //     const formattedItem = {
        //         ...item,
        //         tanggal_mulai: formatDate(item.waktu_mulai),
        //         tanggal_selesai: formatDate(item.waktu_selesai),
        //         waktu_mulai: formatTime(item.waktu_mulai),
        //         waktu_selesai: formatTime(item.waktu_selesai),
        //         waktu_mulai_full: formatDateTime(item.waktu_mulai),
        //         waktu_selesai_full: formatDateTime(item.waktu_selesai),
        //         waktu_mulai_original: item.waktu_mulai,
        //         waktu_selesai_original: item.waktu_selesai,
        //     };
        //     return formattedItem;
        // }));

        // console.log("Merged Data:",mergedData)
        let finalData = await Promise.all(
            mergedData.map(async (item) => {
                // Example: fetch additional d etails if needed
                let userDetails = await fetch(`${env.PUB_PORT}/user/${item.id_penanggung_jawab}`, {
                    headers: {
                        "Authorization": `Bearer ${token?.token}`
                    }
                });
                let resuser = await userDetails.json();
                console.log("User Details:", resuser)
                if (!resuser.ok) {
                    console.error("Failed to fetch user details:", item.id_penanggung_jawab);
                   
                }
                return {
                    ...item,
                    nama_penanggung_jawab: resuser.nama_lengkap || ''
                }
            })
        )
        return { data: finalData };
    }
    catch (error) {
        console.error("Error fetching data:", error);
        return { errors: "Error fetching data" };
    }
};
export let actions: Actions = {
    delete: async ({ request }) => { 
        let data = await request.formData()
        console.log(data)
        let id = data.get("id_acara")
        //   console.log("Deleting acara with ID:", id);
        try {
            let res = await fetch(`${env.URL_KERAJAAN}/acara/detail/${id}`, {
                method: "GET"
            })
            if (!res.ok) {
               console.error(`Failed to find event: ${res.status}`);
                return fail(404, { error: "Acara tidak ditemukan" });
            }
           
              let eventData = await res.json()
                console.log(eventData)
            
                let delres = await fetch(`${env.URL_KERAJAAN}/acara/${id}`, {
                    method: "DELETE",
                   
                    // body: JSON.stringify(formattedEvents)
                })
                if (!delres.ok) {
                  let errorData = await delres.json().catch(() => ({}));
                console.error("Delete failed:", delres.status, errorData);
                return fail(delres.status, { 
                    error: errorData.message || `Gagal menghapus acara (${delres.status})` 
                });
                }
                 let successData = await delres.json().catch(() => ({ message: "Success" }));
            console.log("Delete successful:", successData);

            
            // Return success with the updated data
            return {
                success: true,
                message: "Acara berhasil dihapus"
            };
        }
        catch (error) {
            
        }
        console.log(id)
    }
};