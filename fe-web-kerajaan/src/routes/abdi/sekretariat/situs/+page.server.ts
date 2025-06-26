import { env } from "$env/dynamic/private";
import { filterArsip } from "$lib";
import type { PageServerLoad } from "./$types";


export const load: PageServerLoad = async () => {
    try {
        const res = await fetch(`${env.URL_KERAJAAN}/situs`);
        if (!res.ok) {
            throw new Error(`HTTP Error! Status: ${res.status}`);
        }
        const data = await res.json();
        const formattedData = data.filter(item => item.deleted_at === "0001-01-01T00:00:00Z")

        // const processedData = await Promise.all(data.map(async (item: any) => {
        //     if (item.id_lokasi) {
        //         try {
        //             const locResponse = await fetch(`${env.URL_KERAJAAN}/loc/${item.id_lokasi}`, {
        //                 method: "GET",
        //                 headers: {
        //                     "Accept": "application/json"
        //                 }
        //             });
        //             if(locResponse.ok) {
        //                 const locData = await locResponse.json();
        //                 return {
        //                     ...item,
        //                     lokasi: locData.nama_lokasi
        //                 };
        //             }
        //          }
        //         catch {
        //             console.error(`Error fetching location for id ${item.id_lokasi}:`, locError);
        //             }
        //     }
        // }))
        console.log(formattedData)
        return { data: formattedData };
    }
    catch (error) {
        
    }
};