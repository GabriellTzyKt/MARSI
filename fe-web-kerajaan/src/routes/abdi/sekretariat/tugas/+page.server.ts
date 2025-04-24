import { fail, type Actions } from "@sveltejs/kit";
import { z } from "zod";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";

export const load: PageServerLoad = async () => {
    try {
        const res = await fetch(`${env.BASE_URL_8008}/tugas`, {
            method: 'GET',
            headers: {
                Accept: 'application/json'
            }
        });



        if (res.ok) {
            const data = await res.json();
            console.log(data);
            const formattedData = data.map((item: any) => ({
                ...item,
                tanggal_mulai: item.tanggal_mulai ? item.tanggal_mulai.split('T')[0] : item.tanggal_mulai
            }));

            const sortedData = formattedData.sort((a: any, b: any) => {
                // Kalo ditugaskan ditampilin duluan
                if (a.status_tugas === "Ditugaskan" && b.status_tugas !== "Ditugaskan") {
                    return -1;
                }
                // Kalo statusnya selesai di taro di belakang
                if (a.status_tugas !== "Ditugaskan" && b.status_tugas === "Ditugaskan") {
                    return 1;
                }
                // kalo sama gaperlu berubah
                return 0;
            });
            
            console.log(sortedData);
            return { data: sortedData }
       }
    } catch (error) { }
};

export const actions: Actions = {
    tambahTugas: async ({ request }) => {
        const data = await request.formData()
        let today = new Date().toISOString().split("T")[0]
        const formDate = String(data.get("tanggal_penugasan"))
        console.log(data)
        console.log(today)
        const ver = z.object({
            pemberi_tugas:
                z.string({ message: "Field Pemberi Tugas harus diisi" })
                    .nonempty("Minimal 1 huruf / tidak boleh kosong"),
            nama_tugas:
                z.string({ message: "Field Pemberi Tugas harus diisi" })
                    .nonempty("Minimal 1 huruf / tidak boleh kosong"),
            tanggal_penugasan:
                z.string({ message: "Field Pemberi Tugas harus diisi" })
                    .nonempty("Minimal 1 huruf / tidak boleh kosong")
                    .refine(() => {
                        return formDate >= today
                    }, { message: "Tanggal penugasan tidak boleh kurang dari hari ini" }),

            anggota_yg_ditugaskan:
                z.string({ message: "Field Pemberi Tugas harus diisi" })
                    .nonempty("Minimal 1 huruf / tidak boleh kosong"),
            deskripsi_tugas:
                z.string({ message: "Field Pemberi Tugas harus diisi" })
                    .nonempty("Minimal 1 huruf / tidak boleh kosong"),

        })
        const formData = {
            pemberi_tugas: String(data.get("pemberi_tugas")),
            nama_tugas: String(data.get("nama_tugas")),
            tanggal_penugasan: String(data.get("tanggal_penugasan")),
            anggota_yg_ditugaskan: String(data.get("anggota_yg_ditugaskan")),
            deskripsi_tugas: String(data.get("deskripsi_tugas")),
        }
        const verification = ver.safeParse({ ...formData })
        if (!verification.success) {
            return fail(418, { errors: verification.error.flatten().fieldErrors, s: false, formData })
        }
        return { errors: "No Error", formData, s: true }
    },
    ubahTugas: async ({ request }) => {
        const data = await request.formData()
        console.log(data)
        let today = new Date().toISOString().split("T")[0]
        const formDate = String(data.get("tanggal_penugasan"))
        console.log(data)
        console.log(today)
        const ver = z.object({
            pemberi_tugas:
                z.string({ message: "Field Pemberi Tugas harus diisi" })
                    .nonempty("Minimal 1 huruf / tidak boleh kosong"),
            nama_tugas:
                z.string({ message: "Field Pemberi Tugas harus diisi" })
                    .nonempty("Minimal 1 huruf / tidak boleh kosong"),
            tanggal_penugasan:
                z.string({ message: "Field Pemberi Tugas harus diisi" })
                    .nonempty("Minimal 1 huruf / tidak boleh kosong")
                    .refine(() => {
                        return formDate >= today
                    }, { message: "Tanggal penugasan tidak boleh kurang dari hari ini" }),

            anggota_yg_ditugaskan:
                z.string({ message: "Field Pemberi Tugas harus diisi" })
                    .nonempty("Minimal 1 huruf / tidak boleh kosong"),
            deskripsi_tugas:
                z.string({ message: "Field Pemberi Tugas harus diisi" })
                    .nonempty("Minimal 1 huruf / tidak boleh kosong"),

        })
        const formData = {
            pemberi_tugas: String(data.get("pemberi_tugas")),
            nama_tugas: String(data.get("nama_tugas")),
            tanggal_penugasan: String(data.get("tanggal_penugasan")),
            anggota_yg_ditugaskan: String(data.get("anggota_yg_ditugaskan")),
            deskripsi_tugas: String(data.get("deskripsi_tugas")),
        }
        const verification = ver.safeParse({ ...formData })
        if (!verification.success) {
            return fail(418, { errors: verification.error.flatten().fieldErrors, success: false, formData })
        }
        return { errors: "No Error", success: true, formData }
    }
};