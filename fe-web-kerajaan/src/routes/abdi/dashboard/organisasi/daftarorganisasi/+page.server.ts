import type { Actions } from "@sveltejs/kit";
import { string, z } from "zod";


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
            namaanggota: data.get("namaanggota") ?? "",
            deskripsi: data.get("deskripsi") ?? "",
            jabatan: data.get("jabatan") ?? "",
        };

        const validation = ver.safeParse({ ...form });

        if (!validation.success) {
            console.log(validation.error.flatten().fieldErrors)
            return {
                errors: validation.error.flatten().fieldErrors, success: false,
                formData: form
            };
        }

        return { errors: "Success", success: true, formData: form };
    }
};