import { error, fail, type Actions } from "@sveltejs/kit";
import { z } from "zod";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";
import { formatDate } from "$lib";


export const load: PageServerLoad = async ({ params }) => {
    console.log("id komunitas", params.id)
    try {
        const komunitasResponse = await fetch(`${env.URL_KERAJAAN}/komunitas/anggota/${params.id}`);
        if (!komunitasResponse.ok) {
            throw error(komunitasResponse.status, `Failed to fetch komunitas: ${komunitasResponse.statusText}`);
        }
        
        const komunitasList = await komunitasResponse.json();
        console.log("komunitas : ", komunitasList);
        const finalData = await Promise.all(komunitasList.map(async (data: any) => {
            const res = await fetch(`${env.PUB_PORT}/user/${data.id_user}`)
            if (res.ok) {
                const dataAnggota = await res.json()
                return {
                    ...dataAnggota,
                    tanggal_bergabung: formatDate(data.tanggal_bergabung),
                    jabatan_komunitas: data.jabatan_anggota
                }
            }
        }))

        const allKomunitas = await fetch(`${env.URL_KERAJAAN}/komunitas`)
        if (!allKomunitas.ok) {
            throw error(allKomunitas.status, `Failed to fetch komunitas: ${komunitasResponse.statusText}`);
        }
        const allKomData =await allKomunitas.json()
        const allAnggotaNested = await Promise.all(
            allKomData.map(async (item: any) => {
                const id_kom_res = await fetch(`${env.URL_KERAJAAN}/komunitas/anggota/${item.id_komunitas}`);
                if (!id_kom_res.ok) return []; // Jika gagal ambil anggota komunitas, skip
        
                const data_user_kom = await id_kom_res.json();
        
                const res_info_user = await Promise.all(
                    data_user_kom.map(async (data1: any) => {
                        const res_nama = await fetch(`${env.PUB_PORT}/user/${data1.id_user}`);
                        if (!res_nama.ok) return null;
        
                        const info_user = await res_nama.json();
                        return {
                            ...info_user,
                            tanggal_bergabung: data1.tanggal_bergabung,
                            deskripsi_tugas: data1.deskripsi_tugas,
                            jabatan_anggota: data1.jabatan_anggota,
                            id_komunitas: item.id_komunitas
                        };
                    })
                );
        
                // Buang null (user fetch gagal)
                return res_info_user.filter(Boolean);
            })
        );
        const allAnggota = allAnggotaNested.flat();
        return {
            data: finalData,
            allAnggota
        }
        
        // Array untuk menyimpan semua data anggota dari semua komunitas
        
        // Iterasi melalui setiap komunitas untuk mengambil anggotanya
        

       
    } catch (error) {
        console.error("Error in load function:", error);
        throw error;
    }
};


export const actions: Actions = {
    tambah: async ({ request }) => {
        const data = await request.formData();

        let form = {
            namaanggota: "",
            deskripsi: "",
            jabatan: ""
        }


        const ver = z.object({
            namaanggota: z.string().trim().min(1, "Minimal 1 anggota!"),
            deskripsi: z.string().trim().min(1, "Deskripsi harus diisi!"),
            jabatan: z.string().trim().min(1, "Jabatan harus diisi!"),
        });

        form = {
            namaanggota: String(data.get("namaanggota") || "").trim(),
            deskripsi: String(data.get("deskripsitugas") || "").trim(),
            jabatan: String(data.get("jabatan") || "").trim(),
        };

        console.log("Extracted Form:", form);


        const validation = ver.safeParse({ ...form });

        if (!validation.success) {
            console.log(validation.error.flatten().fieldErrors)
            return fail(406, {
                errors: validation.error.flatten().fieldErrors, success: false,
                formData: form, type: "add"
            });
        }

        return { errors: "Success", success: true, formData: form, type: "add" };
    }
};