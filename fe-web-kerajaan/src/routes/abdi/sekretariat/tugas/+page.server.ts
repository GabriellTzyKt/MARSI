import { fail, type Actions } from "@sveltejs/kit";
import { z } from "zod";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";

export const load: PageServerLoad = async () => {
    try {
        // Fetch tugas data
        const tugasRes = await fetch(`${env.URL_KERAJAAN}/tugas`, {
            method: 'GET',
            headers: {
                Accept: 'application/json'
            }
        });

        // Fetch situs data
        const situsRes = await fetch(`${env.URL_KERAJAAN}/situs`, {
            method: 'GET',
            headers: {
                Accept: 'application/json'
            }
        });

        if (situsRes.ok && tugasRes.ok) {
            const situsData = await situsRes.json();
            console.log("Situs Data:", situsData);
            
            const tugasData = await tugasRes.json();
            console.log("Tugas Data:", tugasData);
            
            const formattedData = tugasData.map((item: any) => ({
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

            return { 
                data: sortedData, 
                situs: situsData 
            };
        }
        
        return { 
            data: [], 
            situs: [] 
        };
    } catch (error) {
        console.error("Error fetching data:", error);
        return { 
            data: [], 
            situs: [] 
        };
    }
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
            nama_situs:
                z.string({ message: "Field harus diisi" })
                    .nonempty("Minimal 1 huruf / tidak boleh kosong"),
            nama_acara:
                z.string({ message: "Field harus diisi" })
                    .nonempty("Minimal 1 huruf / tidak boleh kosong"),


        })
        const formData = {
            pemberi_tugas: String(data.get("pemberi_tugas")),
            nama_tugas: String(data.get("nama_tugas")),
            tanggal_penugasan: String(data.get("tanggal_penugasan")),
            anggota_yg_ditugaskan: String(data.get("anggota_yg_ditugaskan")),
            deskripsi_tugas: String(data.get("deskripsi_tugas")),
            nama_situs: String(data.get("nama_situs")),
            nama_acara: String(data.get("nama_acara")),
        }
        const verification = ver.safeParse({ ...formData })
        if (!verification.success) {
            return fail(418, { errors: verification.error.flatten().fieldErrors, s: false, formData })
        }
        // return { errors: "No Error", formData, s: true }

        try {
            // Membuat objek JSON untuk dikirim ke API
            const tugasData = {
                pemberi_tugas: formData.pemberi_tugas,
                nama_tugas: formData.nama_tugas,
                tanggal_mulai: formData.tanggal_penugasan,
                penerima_tugas: formData.anggota_yg_ditugaskan,
                deskripsi_tugas: formData.deskripsi_tugas,
                nama_situs: formData.nama_situs,
                nama_acara: formData.nama_acara
                // lokasi
                // id_acara ?
            };

            const send = await fetch(`${env.BASE_URL_8008}/tugas`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(tugasData)
            });

            const r = await send.json();
            console.log(r);

            if (send.ok) {
                return { errors: "no Error", success: true };
            }
            return fail(400, { request: `Error Code : ${send.status} ${r.message}` });
        } catch (e) {
            console.error("Fetch Error", e);
            return fail(500, { request: "Terjadi kesalahan saat mengirim data" });
        }


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
