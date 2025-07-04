import { error, fail, type Actions } from "@sveltejs/kit";
import { any, z } from "zod";
import type { PageServerLoad } from "../$types";
import { env } from "$env/dynamic/private";

export const load: PageServerLoad = async () => {
    try {
        const res = await fetch(`${env.URL_KERAJAAN}/situs`);
        
        if (!res) {
            console.error("Failed to initialize fetch request");
            return fail(500, { error: "Server error: Failed to initialize request" });
        }
        
        if (res.ok) {
            const data = await res.json();
            console.log("Data: ",data);
            return { data };
        } else {
            const errorData = await res.text().catch(() => "Unknown error");
            console.error(`API error: ${res.status} - ${errorData}`);
            return fail(res.status, { 
                error: `Failed to retrieve data: ${res.status}`,
                details: errorData
            });
        }
    }
    catch (err) {
         const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
        console.error("Error in load function:", errorMessage);
        return fail(500, { error: "Server error", details: errorMessage });
    }
};
export const actions: Actions = {
    tambah: async ({ request }) => {
        const data = await request.formData();
        
        // Log semua data yang diterima
        console.log("=== FORM DATA RECEIVED ===");
        for (const [key, value] of data.entries()) {
            console.log(`${key}: ${value}`);
        }
        
        // Cek khusus untuk alamat acara
        console.log("alamat_acara value:", data.get("alamat_acara"));
        
        const ids = data.getAll("id").map(String);
        const ids2 = data.getAll("id2").map(String);


        console.log(ids)

        let form: any = {
            namaacara: "",
            lokasiacara: "",
            tujuanacara: "",
            deskripsiacara: "",
            alamatacara: "",
            penanggungjawab: "",
            kapasitasacara: "",
            tanggalmulai: "",
            tanggalselesai: "",
            waktumulai: "",
            waktuselesai: "",
            buttonselect: "",
            inputradio: "",
            namabawah: {},
            notelpbawah: {},
            panggilan: {},
            namalengkapbawah: {},
            namajabatan: {},
        }

        const ver = z.object({
            buttonselect: z.string().trim().min(1, "Minimal 1!"),
            inputradio: z.string().trim().min(1, "Minimal 1!"),
            namaacara: z.string().trim().min(1, "Isi Nama acara"),
            lokasiacara: z.string().trim().min(1, "Lokasi harus diisi!"),
            alamatacara: z.string().trim().min(1, "Alamat harus diisi!"),
            tujuanacara: z.string().trim().min(1, "Tujuan harus diisi!"),
            deskripsiacara: z.string().trim().min(1, "Deskripsi harus terisi!"),
            penanggungjawab: z.string().trim().min(1, "Isi penanggungjawab!"),
            kapasitasacara: z.string()
                .trim()
                .min(1, "Kapasitas harus terisi!")
                .regex(/^\d+$/, "Jumlah anggota harus angka"),
            tanggalmulai: z.coerce.date({ message: "Tanggal Tidak valid (YYYY-MM-DD)" }),
            tanggalselesai: z.coerce.date({ message: "Tanggal Tidak valid (YYYY-MM-DD)" }),
            waktumulai: z.string().regex(/^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/, {
                message: "pakai format : HH(jam):mm(menit).",
            }),
            waktuselesai: z.string().regex(/^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/, {
                message: "pakai format : HH(jam):mm(menit).",
            }),
            panggilan: z.record(z.string().min(1, "Panggilan gaboleh kosong!")),
            namabawah: z.record(z.string().min(1, "Masih ada input field yg kosong!")),
            notelpbawah: z.record(
                z.string()
                    .min(10, "Nomor telepon harus diisi!")
                    .regex(/^\d+$/, "Nomor telepon hanya boleh angka!")
            ),
            namajabatan: z.record(z.string().trim().min(1, "Silahkan Pilih Jabatan!")),
            namalengkapbawah: z.record(z.string().min(1, "Tidak boleh kosong!")),
        });

        form = {
            buttonselect: data.get("buttonselect") ?? "",
            inputradio: data.get("default-radio") ?? "",
            namaacara: data.get("namaacara") ?? "",
            lokasiacara: data.get("lokasi_acara") ?? "",
            tujuanacara: data.get("tujuan_acara") ?? "",
            alamatacara: data.get("alamat_acara") ?? "",
            deskripsiacara: data.get("deskripsi_acara") ?? "",
            penanggungjawab: data.get("penanggungjawab") ?? "",
            kapasitasacara: data.get("kapasitasacara") ?? "",
            tanggalmulai: data.get("tanggalmulai") ?? "",
            tanggalselesai: data.get("tanggalselesai") ?? "",
            waktumulai: data.get("waktumulai") ?? "",
            waktuselesai: data.get("waktuselesai") ?? "",
            panggilan: {},
            namabawah: {},
            notelpbawah: {},
            namalengkapbawah: {},
            namajabatan : {},
        };

        for (const id of ids) {
            form.namabawah[id] = data.get(`namabawah_${id}`) ?? "";
            form.notelpbawah[id] = data.get(`notelpbawah_${id}`) ?? "";
            form.panggilan[id] = data.get(`panggilan_${id}`) ?? "";
        }

        for (const id2 of ids2) {
            form.namalengkapbawah[id2] = data.get(`namalengkapbawah_${id2}`) ?? "";
            form.namajabatan[id2] = data.get(`namajabatan_${id2}`) ?? "";
        }


        console.log(form)

        const validation = ver.safeParse({ ...form });

        if (!validation.success) {
            const fieldErrors = validation.error.flatten().fieldErrors;

            console.log("errors : " , fieldErrors)
            
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
