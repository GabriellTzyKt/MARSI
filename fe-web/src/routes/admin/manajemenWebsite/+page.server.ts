import { env } from "$env/dynamic/private";
import { fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { Actions } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ }) => {
    try {
        let dummyTest = [
            {
                id_permintaan: 1,
                asal_kerajaan: "Surat Edaran",
                link_website: "https://www.google.com",
                tanggal_buat: "11-05-2025",
                tanggal_selesai: "12-12-2025",
                status: "Diajukan",
            },
            {
                id_permintaan: 2,
                asal_kerajaan: "Surat Edaran 2",
                link_website: "https://www.google2.com",
                tanggal_buat: "12-05-2025",
                tanggal_selesai: "13-12-2025",
                status: "Selesai",
            },
            {
                id_permintaan: 3,
                asal_kerajaan: "Surat Edaran 3",
                link_website: "https://www.google3.com",
                tanggal_buat: "13-05-2025",
                tanggal_selesai: "14-12-2025",
                status: "Sedang Diproses",
            },
        ]

        // Definisikan urutan status
        const statusOrder: Record<string, number> = {
            'Diajukan': 1,
            'Sedang Diproses': 2,
            'Selesai': 3
        };
        
        // Urutkan data berdasarkan status
        dummyTest.sort((a, b) => {
            const orderA = statusOrder[a.status] || 999;
            const orderB = statusOrder[b.status] || 999;
            return orderA - orderB;
        });

        return {
            dataArsip: dummyTest,
        };
    } catch (e) {
        if (e instanceof Error) {
            // console.error("Error in load function:", e.message);
            return { dataArsip: "Failed", error: e.message };
        }
        return { dataArsip: "Failed", error: "Unknown error" };
    }
};

export const actions: Actions = {
    delete: async ({ request }) => {
        const data = await request.formData()
        console.log("data id : ", data)
        try {
            const del = await fetch(`${env.PUB_PORT}/arsip/${data.get("id_arsip")}`, {
                method: "DELETE"
            })
            const m = await del.json()
            if (!del.ok) {
                return fail(406, { error: `Code ${del.status} Message: ${m.message}` })
            }
            console.log(m.message)
            return { error: "no error" }
        }
        catch (error) {

        }
    },
};
