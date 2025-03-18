import { error, type Actions } from "@sveltejs/kit";
import { z } from "zod";


export const actions: Actions = {
    edit: async ({ request }) => {
        const data = await request.formData();

        let form = {
            namaacara: "",
            lokasiacara: "",
            tujuanacara: "",
            deskripsiacara: "",
            penanggungjawab: "",
            kapasitascara: "",
            jenis_acara: "",
            tanggalmulai: "",
            tanggalselesai: "",
            waktumulai: "",
            waktuselesai: ""
        }

        const ver = z.object({
            namaacara: z.string().trim().min(1, "Isi Nama Acara!"),
            lokasiacara: z.string().trim().min(1, "Lokasi harus diisi!"),
            tujuanacara: z.string().trim().min(1, "Tujuan harus diisi!"),
            deskripsiacara: z.string().trim().min(1, "Deskripsi harus terisi!"),
            penanggungjawab: z.string().trim().min(1, "Isi penanggungjawab!"),
            kapasitasacara: z.string()
                .trim()
                .min(1, "Minimal 1 anggota") // trim hapus spasi awal dan akhir, min 1 itu mastiin "" dan null tdk valid
                .regex(/^\d+$/, "Jumlah anggota harus angka"),
            jenis_acara: z.string().trim().min(1, "Pilih jenis acara!"),
            tanggalmulai: z.string().trim().min(1, "tanggal harus terisi!"),
            tanggalselesai: z.string().trim().min(1, "tanggal harus terisi!"),
            waktumulai: z.string().trim().min(1, "waktu harus terisi!"),
            waktuselesai: z.string().trim().min(1, "waktu harus terisi!"),
        });

        form = {
            namaacara: data.get("namaacara") ?? "",
            lokasiacara: data.get("lokasiacara") ?? "",
            tujuanacara: data.get("tujuanacara") ?? "",
            deskripsiacara: data.get("deskripsiacara") ?? "",
            penanggungjawab: data.get("penanggungjawab") ?? "",
            kapasitasacara: data.get("kapasitasacara") ?? "",
            jenis_acara: data.get("jenis_acara") ?? "",
            tanggalmulai: data.get("tanggalmulai") ?? "",
            tanggalselesai: data.get("tanggalselesai") ?? "",
            waktumulai: data.get("waktumulai") ?? "",
            waktuselesai: data.get("waktuselesai") ?? "",
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