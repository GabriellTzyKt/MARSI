import { env } from "$env/dynamic/private";
import { fail } from "@sveltejs/kit";
import { filterArsip } from "$lib";
import type { Actions, PageServerLoad } from "./$types";
import type { late } from "zod";


export const load: PageServerLoad = async () => {
    try {
        let res = await fetch(`${env.URL_KERAJAAN}/situs`);
        if (!res.ok) {
            throw new Error(`HTTP Error! Status: ${res.status}`);
        }
        let data = await res.json();
        let formattedData = data.filter(item => item.deleted_at === "0001-01-01T00:00:00Z")

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
export const actions: Actions = {
    hapus: async ({ request }) => {
        const data = await request.formData()
        const id = data.get("id_situs")
        try {
            const res = await fetch(`${env.URL_KERAJAAN}/situs/${id}`, {
                method: "DELETE"
            })
            if (!res.ok) {
                throw new Error(`HTTP Error! Status: ${res.status}`);
            }
            const data = await res.json();
            console.log(data)
            return { success: true };
        }
        catch (error) {
            console.error("Error deleting record:", error);
            return fail(500, { error: "Server error when deleting record" });
        }
    }

};