import { error, fail, type Actions } from "@sveltejs/kit";
import { any, z } from "zod";


export const actions: Actions = {
    tambah: async ({ request }) => {
        const data = await request.formData();

        const ids = data.getAll("id").map(String);


        console.log(ids)

        let form: any = {
            namaacara: "",
            lokasiacara: "",
            tujuanacara: "",
            deskripsiacara: "",
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
        }

        for (const id of ids) {
            console.log(`Checking id: ${id}`);

            form.namabawah[id] = data.get(`namabawah_${id}`) ?? "";
            form.notelpbawah[id] = data.get(`notelpbawah_${id}`) ?? "";
            form.panggilan[id] = data.get(`panggilan_${id}`) ?? "";

            console.log(`namabawah_${id}:`, form.namabawah[id]);
            console.log(`notelpbawah_${id}:`, form.notelpbawah[id]);
            console.log(`panggilan_${id}:`, form.panggilan[id]);
            console.log('----------------------------');
        }

        const ver = z.object({
            buttonselect: z.string().trim().min(1, "Minimal 1!"),
            inputradio: z.string().trim().min(1, "Minimal 1!"),
            namaacara: z.string().trim().min(1, "Isi Nama acara"),
            lokasiacara: z.string().trim().min(1, "Alamat harus diisi!"),
            tujuanacara: z.string().email("Email Tidak Valid").trim().min(1, "Email harus diisi!"),
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
                    .min(1, "Nomor telepon harus diisi!")
                    .regex(/^\d+$/, "Nomor telepon hanya boleh angka!")
            ),
        });

        form = {
            buttonselect: data.get("buttonselect") ?? "",
            inputradio: data.get("default-radio") ?? "",
            namaacara: data.get("namaacara") ?? "",
            lokasiacara: data.get("lokasiacara") ?? "",
            tujuanacara: data.get("tujuanacara") ?? "",
            deskripsiacara: data.get("deskripsiacara") ?? "",
            penanggungjawab: data.get("penanggungjawab") ?? "",
            kapasitasacara: data.get("kapasitasacara") ?? "",
            tanggalmulai: data.get("tanggalmulai") ?? "",
            tanggalselesai: data.get("tanggalselesai") ?? "",
            waktumulai: data.get("waktumulai") ?? "",
            waktuselesai: data.get("waktuselesai") ?? "",
            panggilan: {},
            namabawah: {},
            notelpbawah: {},
        };

        for (const entry of data.entries()) {
            const [key, value] = entry;

            const match = key.match(/^(panggilan|namabawah|notelpbawah)_(\d+)$/);
            if (match) {
                const [, fieldName, id] = match;
                form[fieldName][id] = value;
            }
        }

        const validation = ver.safeParse({ ...form });

        if (!validation.success) {
            const fieldErrors = validation.error.flatten().fieldErrors;

            // Modifikasi fieldErrors untuk menambahkan id pada setiap pesan error
            const errorWithId: any = {};

            for (const [key, errors] of Object.entries(fieldErrors)) {
                if (key === 'namabawah' || key === 'notelpbawah') {
                    errorWithId[key] = errors.map((error, index) => ({
                        message: error,
                        id: ids[index] || "undefined",
                    }));
                    console.log("error with key", errorWithId[key])
                } else {
                    errorWithId[key] = errors;
                }
            }

            console.log(errorWithId); // Debugging untuk memastikan format sudah sesuai

            return fail(406, {
                errors: errorWithId,
                success: false,
                formData: form,
                type: "add"
            });
        }

        return { errors: "Success", success: true, formData: form, type: "add" };
    }
};
