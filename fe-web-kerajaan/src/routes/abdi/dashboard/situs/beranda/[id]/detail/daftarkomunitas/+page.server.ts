import { env } from "$env/dynamic/private";
import { fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import { formatDate, formatDatetoUI } from "$lib";


export const load: PageServerLoad = async ({ params, cookies }) => {
    let token = cookies.get("userSession") ? JSON.parse(cookies.get("userSession") as string) : '';
    let id = params.id
    // Fetch data for the specific community
    let res = await fetch(`${env.URL_KERAJAAN}/komunitas?limit=1000`);
    let komunitas = await res.json();
    console.log(id)
    console.log("Komunitas data:", komunitas);
    if (!res.ok) {
        console.error("Failed to fetch komunitas data");
        return {
            komunitas: []
        };
    }
    let komunitasFiltered = komunitas.filter((item: any) => {
        return item.lokasi == params.id && (item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at);
    });
    komunitasFiltered = await Promise.all(komunitasFiltered.map(async (data: any) => {
        let resPJ = await fetch(`${env.PUB_PORT}/user/${data.penanggung_jawab}`, {
            headers: {
                "Authorization": `Bearer ${token?.token}`
            }
        });
        let resPL = await fetch(`${env.PUB_PORT}/user/${data.pelindung}`, {
            headers: {
                "Authorization": `Bearer ${token?.token}`
            }
        });
        let resPB = await fetch(`${env.PUB_PORT}/user/${data.pembina}`, {
            headers: {
                "Authorization": `Bearer ${token?.token}`
            }
        });
        if (!resPJ.ok || !resPL.ok || !resPB.ok) {
            throw new Error(`HTTP Error! Status: ${resPJ.status}`);
        }
        let pjData = await resPJ.json();
        let plData = await resPL.json();
        let pbData = await resPB.json();
        return {
            ...data,
            tanggal_berdiri: formatDatetoUI(data.tanggal_berdiri),
            penanggung_jawab: pjData.nama_lengkap||"-",
            pelindung: plData.nama_lengkap||"-",
            pembina: pbData.nama_lengkap||"-",
        }
           
        
        return null
    }))
    return {
        komunitas: komunitasFiltered,
        id_situs: params.id,
        id
    };
};

export const actions: Actions = {
    deleteKomunitas: async ({ request }) => {
        const data = await request.formData();
        const id = data.get("id_komunitas");
        console.log("Deleting komunitas with ID:", id);
        try {
            const delres = await fetch(`${env.URL_KERAJAAN}/komunitas/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (!delres.ok) {
                throw new Error(`HTTP Error! Status: ${delres.status}`);
            }
            return { success: true };
        } catch (error) {
            console.error("Error deleting komunitas:", error);
            return fail(400, { success: false, error: error.message });
        }
    }
};