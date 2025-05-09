import { fail, type Actions } from "@sveltejs/kit";
import { string, z } from "zod";


export const actions: Actions = {
    tambah: async ({ request }) => {
        const data = await request.formData();

        const formDataEntries = Array.from(data.entries()); // Konversi FormData ke array

        console.log("data entries : ", formDataEntries)

        let form: any = {
            namapengunjung: "",
            keterangankunjungan: "",
            notelp: "",
            kotaasal: "",
            orangyangditemui: "",
            tujuankunjungan: "",
            radioinput: "",
        }


        const ver = z.object({
            namapengunjung: z.record(
                z.string().trim().min(1, "Masukkan nama 1 anggota!")
            ),
            keterangankunjungan: z.record(z.string().trim().min(1, "Keterangan harus diisi!")),
            kotaasal: z.record(z.string().trim().min(1, "Isi Kota!")),
            orangyangditemui: z.record(z.string().optional()),
            tujuankunjungan: z.record(z.string().optional()),
            radioinput: z.record(z.string().trim().min(1, "Pilih salah satu!")),
            notelp:
                z.record(
                    z.string()
                        .min(10, "Nomor telepon harus diisi!")
                        .regex(/^\d+$/, "Nomor telepon hanya boleh angka!")
                ),
        });

        form = {
            namapengunjung: {},
            keterangankunjungan: {},
            kotaasal: {},
            orangyangditemui: {},
            tujuankunjungan: {},
            radioinput: {},
            notelp: {},
        };

        for (const [key, value] of formDataEntries) {
            if (key.startsWith("namapengunjung-")) {
                form.namapengunjung[key] = String(value).trim();
            }
            else if (key.startsWith("keterangankunjungan-")) {
                form.keterangankunjungan[key] = String(value).trim();
            }
            else if (key.startsWith("notelp-")) {
                form.notelp[key] = String(value).trim();
            }
            else if (key.startsWith("kotaasal-")) {
                form.kotaasal[key] = String(value).trim();
            }
            else if (key.startsWith("default-radio-")) {
                form.radioinput[key] = String(value).trim();
            }
            else if (key.startsWith("orangyangditemui-")) {
                form.orangyangditemui[key] = String(value).trim();
            }
            else if (key.startsWith("tujuankunjungan-")) {
                form.tujuankunjungan[key] = String(value).trim();
            }
        }


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
