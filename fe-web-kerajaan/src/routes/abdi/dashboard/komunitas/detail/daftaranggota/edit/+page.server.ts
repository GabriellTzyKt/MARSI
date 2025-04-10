import { fail } from "@sveltejs/kit";
import { error, type Actions } from "@sveltejs/kit";
import { z } from "zod";


export const actions: Actions = {
    edit: async ({ request }) => {
        const data = await request.formData();

        let form: any = {
            namalengkap: "",
            tempatlahir: "",
            tanggallahir: "",
            alamat: "",
            notelepon: "",
            hobi: "",
            jeniskelamin : "",
            jabatan: "",
            radioayah: "",
            radioibu: "",
            inputayah: "",
            inputibu: "",
            email: "",
            wongso: "",
            pekerjaan: "",
            agama: "",
            deskripsitugas: "",
        }

        const ver = z.object({
            namalengkap: z.string().trim().min(1, "Isi Nama organisasi"),
            tempatlahir: z.string().trim().min(1, "Tempat lahir harus diisi!"),
            tanggallahir: z.coerce.date({ message: "Tanggal Tidak valid (YYYY-MM-DD)" }),
            alamat: z.string().trim().min(1, "Alamat isiiiii!"),
            notelepon: z.string()
                .min(10, "Nomor telepon harus diisi!")
                .regex(/^\d+$/, "Nomor telepon hanya boleh angka!"),
            hobi: z.string().optional(),
            jeniskelamin: z.string().trim().min(1, "Isi Jenis Kelamin!"),
            jabatan: z.string().trim().min(1, "Isi jabatan!"),
            radioayah: z.string().trim().min(1, "Minimal 1!"),
            radioibu: z.string().trim().min(1, "Minimal 1!"),
            inputayah: z.string().trim().min(1, "Isi Input!"),
            inputibu: z.string().trim().min(1, "Isi input!"),
            wongso: z.string().trim().min(1, "Isi Wongso!"),
            pekerjaan: z.string().optional(),
            agama: z.string().optional(),
            email: z.string().optional(),
            deskripsitugas: z.string().trim().min(1, "Isi Deskripsi!"),
        });

        form = {
            namalengkap: data.get("namalengkap") ?? "",
            tempatlahir: data.get("tempatlahir") ?? "",
            tanggallahir: data.get("tanggallahir") ?? "",
            alamat: data.get("alamat") ?? "",
            notelepon: data.get("notelepon") ?? "",
            hobi: data.get("hobi") ?? "",
            jabatan: data.get("jabatan") ?? "",
            radioayah: data.get("radio-ayah") ?? "",
            radioibu: data.get("radio-ibu") ?? "",
            inputayah: data.get("inputayah") ?? "",
            inputibu: data.get("inputibu") ?? "",
            wongso: data.get("wongso") ?? "",
            pekerjaan: data.get("pekerjaan") ?? "",
            agama: data.get("agama") ?? "",
            email: data.get("email") ?? "",
            deskripsitugas: data.get("deskripsitugas") ?? "",
            jeniskelamin: data.get("jeniskelamin") ?? "",
        };

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