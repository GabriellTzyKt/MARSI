import { env } from "$env/dynamic/private";
import { fail } from "@sveltejs/kit";
import { filterArsip } from "$lib";
import type { Actions, PageServerLoad } from "./$types";
import type { late } from "zod";


export const load: PageServerLoad = async ({cookies}) => {
    try {
        let cookie = JSON.parse(cookies.get("userSession") as string)
        let res = await fetch(`${env.URL_KERAJAAN}/situs?limit=1000`);
        if (!res.ok) {
            // throw new Error(`HTTP Error! Status: ${res.status}`);
        }
        let data = await res.json();
        console.log(data)
        let formattedData = data.filter(item => item.deleted_at === "0001-01-01T00:00:00Z")
        let resWisata = await fetch(`${env.URL_KERAJAAN}/situs/wisata?limit=1000`);
        if (!resWisata.ok) {
            throw new Error(`HTTP Error! Status: ${resWisata.status}`);
        }
        let dataWisata = await resWisata.json();
        dataWisata = dataWisata.filter((item: any) => {
            return item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at;
        }
        )
        formattedData = formattedData.map((item: any) => {
            let wisata = dataWisata.find((wisata: any) => wisata.id_wisata === item.id_wisata);
            return {
                ...item,
                nama_wisata: wisata ? wisata.nama_wisata : "Tidak Tersedia",
                // lokasi: wisata ? wisata.lokasi : "Tidak Tersedia",
                tanggal_berdiri: item.tanggal_berdiri ? new Date(item.tanggal_berdiri).toLocaleDateString() : "Tidak Tersedia"
            };
        });
        formattedData = await Promise.all(formattedData.map(async (item) => {
            let useres = await fetch(`${env.PUB_PORT}/user/${item.juru_kunci}`, {
                method: "GET",
                                headers: {
                                    "Authorization": `Bearer ${cookie.token}`
                                }
            })
            let j = await useres.json()
            return {
                ...item,
                juru_kunci: j.nama_lengkap|| "-"
            }
        }))
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
        console.error("Error fetching data:", error);
        return { data: [] };
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