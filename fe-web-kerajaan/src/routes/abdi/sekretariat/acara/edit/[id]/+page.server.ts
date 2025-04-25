import { fail } from "@sveltejs/kit";
import { error, type Actions } from "@sveltejs/kit";
import { z } from "zod";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";
import { dummyAcara } from "$lib/dummy";

export const load: PageServerLoad = async ({params}) => {
    try {
        const res = await fetch(`${env.URL_KERAJAAN}/acara/detail/${params.id}`);
        if (!res.ok) {
             return fail(404, { error: "Acara not found" })
        }
        const data = await res.json()
        const formatDate = (isoString) => {
                if (!isoString || isoString === '0001-01-01T00:00:00Z') return '-';
                const date = new Date(isoString);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${year}-${month}-${day}`;
            };
            const formatTime = (isoString) => {
                if (!isoString || isoString === '0001-01-01T00:00:00Z') return '-';
                const date = new Date(isoString);
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                return `${hours}:${minutes}`;
        };
        
        const formattedData = {
                    ...data,
                    tanggal_mulai: formatDate(data.waktu_mulai),
                    tanggal_selesai: formatDate(data.waktu_selesai),
                    waktu_mulai: formatTime(data.waktu_mulai),
                    waktu_selesai: formatTime(data.waktu_selesai),
                    waktu_mulai_original: data.waktu_mulai,
                    waktu_selesai_original: data.waktu_selesai
        };
        console.log(formattedData)
        return { data: formattedData }
    }
    catch (error) {
        console.log(error)
    }
};

export const actions: Actions = {
    edit: async ({ request }) => {
        const data = await request.formData();

        const ids = data.getAll("id").map(String);
        const ids2 = data.getAll("id2").map(String);
        console.log(data)
        let form : any = {
            namaacara: "",
            lokasiacara: "",
            tujuanacara: "",
            deskripsiacara: "",
            penanggungjawab: "",
            kapasitasacara: "",
            jenis_acara: "",
            tanggalmulai: "",
            tanggalselesai: "",
            waktumulai: "",
            waktuselesai: "",
            namabawah: {},
            notelpbawah: {},
            panggilan: {},
            namalengkapbawah: {},
            namajabatan: {},
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
            tanggalmulai: z.coerce.date({ message: "Tanggal Tidak valid (YYYY-MM-DD)" }),
            tanggalselesai: z.coerce.date({ message: "Tanggal Tidak valid (YYYY-MM-DD)" }),
            waktumulai: z.string().regex(/^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/, {
                message: "pakai format : HH(jam):mm(menit).",
            }),
            waktuselesai: z.string().regex(/^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/, {
                message: "pakai format : HH(jam):mm(menit).",
            }),
            panggilan: z.record(z.string().trim().min(1, "Panggilan gaboleh kosong!")),
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

        return { errors: "Success", success: true, formData: form };
    }
};