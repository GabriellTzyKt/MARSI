import { fail } from "@sveltejs/kit";
import { error, type Actions } from "@sveltejs/kit";
import { z } from "zod";


export const actions: Actions = {
    edit: async ({ request }) => {
        const data = await request.formData();

        let form = {
            namaOrganisasi: "",
            alamat: "",
            email: "",
            deskripsiOrganisasi: "",
            penanggungjawab: "",
            pembina: "",
            pelindung: "",
            notelepon: "",
            jumlahanggota: "",
        }

        const ver = z.object({
            namaOrganisasi: z.string().trim().min(1, "Isi Nama organisasi"),
            alamat: z.string().trim().min(1, "Alamat harus diisi!"),
            email: z.string().email("Email Tidak Valid").
                trim().min(1, "Email harus diisi!"),
            deskripsiOrganisasi: z.string().trim().min(1, "Deskripsi harus terisi!"),
            penanggungjawab: z.string().trim().min(1, "Isi penanggungjawab!"),
            pembina: z.string().trim().min(1, "Isi pembina!"),
            pelindung: z.string().trim().min(1, "Isi pelindung!"),
            notelepon: z.string()
                .trim()
                .min(1, "Masukkan no telepon")
                .regex(/^\d+$/, "Hanya angka diperbolehkan")
                .max(12, "Nomor telepon max 12 digit!"),

            jumlahanggota: z.string()
                .trim()
                .min(1, "Minimal 1 anggota") // trim hapus spasi awal dan akhir, min 1 itu mastiin "" dan null tdk valid
                .regex(/^\d+$/, "Jumlah anggota harus angka"),
        });

        form = {
            namaOrganisasi: data.get("namaorganisasi") ?? "",
            alamat: data.get("alamat") ?? "",
            email: data.get("email") ?? "",
            deskripsiOrganisasi: data.get("deskripsiorganisasi") ?? "",
            penanggungjawab: data.get("penanggungjawab") ?? "",
            pembina: data.get("pembina") ?? "",
            pelindung: data.get("pelindung") ?? "",
            notelepon: data.get("notelepon") ?? "",
            jumlahanggota: data.get("jumlahanggota") ?? "",
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