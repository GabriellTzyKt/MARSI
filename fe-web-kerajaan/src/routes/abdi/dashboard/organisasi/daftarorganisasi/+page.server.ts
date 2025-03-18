import type { Actions } from "@sveltejs/kit";
import { dummySekreAnggotaOrg } from '$lib/dummy'
import { string, z } from "zod";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({fetch}) => {
    const detil_anggota = dummySekreAnggotaOrg

    return { detil_anggota };
};



export const actions: Actions = {
    tambah: async ({request}) => {
        const data = await request.formData();

        let form = {
            namaanggota: "",
            deskripsi: "",
            jabatan: "",
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
            return {
                errors: validation.error.flatten().fieldErrors, success: false,
                formData: form, type: "add"
            };
        }


        return { errors: "Success", success: true, formData: form, type: "add" };
    }
};