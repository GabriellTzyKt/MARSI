import { error, fail, type Actions } from "@sveltejs/kit";
import { z } from "zod";


export const actions: Actions = {
    edit: async ({ request }) => {
        const data : any = await request.formData();

        let form = {
            namasitus: "",
            email: "",
            notelepon: "",
            kepemilikan: "",
            deskripsi: "",
            dibangunoleh: "",
            tanggalberdiri: "",
            alamat: "",
            jurukunci: "",
            jenissitus: "",
            pembina: "",
            pelindung: "",
            jambuka: "",
            jamtutup: "",
            wisata: "",
        }

        const ver = z.object({
            namasitus: z.string().trim().min(1, "Isi Nama komunitas"),
            email: z.string().email("Email Tidak Valid").
                trim().min(1, "Email harus diisi!"),
            tanggalberdiri: z.coerce.date({ message: "Tanggal Tidak valid (YYYY-MM-DD)" }),
            kepemilikan: z.string().trim().min(1, "Isi penanggungjawab!"),
            deskripsi: z.string().trim().min(1, "Isi Deskripsi!"),
            dibangunoleh: z.string().trim().min(1, "Harus ada isi!"),
            notelepon: z.string()
                .trim()
                .min(1, "Masukkan no telepon")
                .regex(/^\d+$/, "Hanya angka diperbolehkan")
                .max(12, "Nomor telepon max 12 digit!"),

            alamat: z.string().trim().min(1, "Alamat harus diisi!"),
            jurukunci: z.string().trim().min(1, "Isi Juru Kunci"),
            jenissitus: z.string().trim().min(1, "Isi Jenis Situs"),
            pembina: z.string().trim().min(1, "Isi Pembina"),
            pelindung: z.string().trim().min(1, "Isi Pelindung"),
            jambuka: z.string().regex(/^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/, {
                message: "pakai format : HH(jam):mm(menit).",
            }),
            jamtutup: z.string().regex(/^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/, {
                message: "pakai format : HH(jam):mm(menit).",
            }), 
            wisata: z.string().trim().min(1, "Isi Wisata"),
        });

        form = {
            namasitus: data.get("namasitus") ?? "",
            notelepon: data.get("notelepon") ?? "",
            email: data.get("email") ?? "",
            kepemilikan: data.get("kepemilikan") ?? "",
            deskripsi: data.get("deskripsi") ?? "",
            dibangunoleh: data.get("dibangunoleh") ?? "",
            tanggalberdiri: data.get("tanggalberdiri") ?? "",
            alamat: data.get("alamat") ?? "",
            jurukunci: data.get("jurukunci") ?? "",
            jenissitus: data.get("jenissitus") ?? "",
            pembina: data.get("pembina") ?? "",
            pelindung: data.get("pelindung") ?? "",
            jambuka: data.get("jambuka") ?? "",
            jamtutup: data.get("jamtutup") ?? "",
            wisata: data.get("wisata") ?? "",
        };

        const validation = ver.safeParse({ ...form });

        if (!validation.success) {
            const fieldErrors = validation.error.flatten().fieldErrors;

            console.log("errors : ", fieldErrors)

            return fail(406, {
                errors: fieldErrors,
                success: false,
                formData: form,
                type: "add"
            });
        }

        return { errors: "Success", success: true, formData: form, type: "add" };
    }
};