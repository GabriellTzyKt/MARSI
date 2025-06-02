import { fail } from "@sveltejs/kit";
import { error, type Actions } from "@sveltejs/kit";
import { z } from "zod";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";
import { dummyAcara } from "$lib/dummy";

export const load: PageServerLoad = async ({params, cookies}) => {
    try {
        let token = cookies.get("userSession")? JSON.parse(cookies.get("userSession") as string): ''
        let res = await fetch(`${env.URL_KERAJAAN}/acara/detail/${params.id}`);
        if (!res.ok) {
            //  throw error(404, "Acara not found");
        }
         let resSitus = await fetch(`${env.URL_KERAJAAN}/situs?limit=600`);
        if (!resSitus.ok) {
            // throw error(404, "Situs not found");
        }
        let data = await res.json()
        let situs = await resSitus.json()
        situs = situs.filter((doc: any) => {
            return doc.deleted_at == '0001-01-01T00:00:00Z' || !doc.deleted_at;
        });
        // console.log("SITUS FILTERED: ", situs);
        let formatDate = (isoString) => {
                if (!isoString || isoString === '0001-01-01T00:00:00Z') return '-';
                let date = new Date(isoString);
                let day = String(date.getDate()).padStart(2, '0');
                let month = String(date.getMonth() + 1).padStart(2, '0');
            let year = date.getFullYear();
            return `${year}-${month}-${day}`;
            };
            let formatTime = (isoString) => {
                if (!isoString || isoString === '0001-01-01T00:00:00Z') return '-';
                let date = new Date(isoString);
                let hours = String(date.getHours()).padStart(2, '0');
                let minutes = String(date.getMinutes()).padStart(2, '0');
                return `${hours}:${minutes}`;
        };
        let resLocFromSitus = await fetch(`${env.URL_KERAJAAN}/situs/${data.id_lokasi}`);
        if (!resLocFromSitus.ok) {
            // throw error(404, "Lokasi not found");
        }
        let locDataFromSitus = await resLocFromSitus.json();
        // console.log("Found Lokasi : ", locDataFromSitus)
        let formattedData = {
                    ...data,
                    nama_lokasi: locDataFromSitus.nama_situs,
                    alamat_lokasi: locDataFromSitus.alamat,
                    tanggal_mulai: formatDate(data.waktu_mulai),
                    tanggal_selesai: formatDate(data.waktu_selesai),
                    waktu_mulai: formatTime(data.waktu_mulai),
                    waktu_selesai: formatTime(data.waktu_selesai),
                    waktu_mulai_original: data.waktu_mulai,
                    waktu_selesai_original: data.waktu_selesai
        };
        let resuser = await fetch(`${env.PUB_PORT}/users`, {
            headers: {
                "Authorization": `Bearer ${token?.token}`
            }
        });
        if (!resuser.ok) {
            // throw error(404, "Acara not found");
        }
        let userData = await resuser.json();
        userData = userData.filter((item: any) => {
            return item.deleted_at == '0001-01-01T00:00:00Z' || !item.deleted_at;
        }).map((item: any) => {
            return {
                id: item.id_user,
                name: item.nama_lengkap,
                email: item.email,
                no_telp: item.no_telp,
                jenis_kelamin: item.jenis_kelamin
            }
        });
        formattedData = {
            ...formattedData,
            nama_penanggung_jawab: userData.name
        };

        let [resUndangan, resPanit] = await Promise.all([
            fetch(`${env.URL_KERAJAAN}/undangan/${data.id}`, {
                headers: {
                    "Authorization": `Bearer ${token?.token}`
                }
            }),
            fetch(`${env.URL_KERAJAAN}/acara/panit/${data.id}`, {
                headers: {
                    "Authorization": `Bearer ${token?.token}`
                }
            })
        ]);
        if (!resUndangan.ok && !resPanit.ok) {
            
        }
        let dataUndangan = await resUndangan.json()
        let dataPanit = await resPanit.json()
        console.log(formattedData)
        return { data: formattedData, situs,dataUndangan,dataPanit,  user: userData };
    }
    catch (error) {
        console.log(error)
        return { error: "Terjadi kesalahan mengambil data" };
    }
};

export const actions: Actions = {
    editAcara: async ({ request }) => {
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
            jenis_acara: z.enum(["Terbuka", "Tertutup"], {
                errorMap: () => ({ message: "Pilih jenis acara!" }),
                }),
            deskripsiacara: z.string().trim().min(1, "Deskripsi harus terisi!"),
            penanggungjawab: z.string().trim().min(1, "Isi penanggungjawab!"),
            kapasitasacara: z.string()
                .trim()
                .min(1, "Minimal 1 anggota") // trim hapus spasi awal dan akhir, min 1 itu mastiin "" dan null tdk valid
                .regex(/^\d+$/, "Jumlah anggota harus angka"),
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
            // buttonselect: data.get("buttonselect") ?? "",
            inputradio: data.get("default-radio") ?? "",
            jenis_acara: data.get("jenisacara") ?? "",
            namaacara: data.get("namaacara") ?? "",
            id_lokasi: data.get("id_lokasi") ?? "",
            lokasiacara: data.get("lokasi_acara") ?? "",
            tujuanacara: data.get("tujuanacara") ?? "",
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