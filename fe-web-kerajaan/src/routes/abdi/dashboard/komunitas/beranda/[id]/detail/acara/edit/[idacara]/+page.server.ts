import { env } from "$env/dynamic/private";
import { fail, error, type Actions } from "@sveltejs/kit";
import { z } from "zod";
import type { PageServerLoad } from "./$types";

export const load = async ({ params, fetch, cookies }) => {

    const sessionStr = cookies.get("userSession");
    let id_admin = null;
    if (sessionStr) {
        try {
            const session = JSON.parse(sessionStr);
            id_admin = session.id_admin;
        } catch (e) {
            console.error("Gagal parse userSession", e);
        }
    }

    const id_situs = params.id;
    const id_acaraorganisasi = params.idacara;
    console.log("id orgn : ", id_acaraorganisasi);
    console.log("id situs : ", id_situs);

    // Ambil semua data yang dibutuhkan secara paralel
    const [usersRes, situsRes, organisasiRes, acaraRes, panitiaRes, undanganRes] = await Promise.all([
        fetch(`${env.BASE_URL}/users?limit=2000`),
        fetch(`${env.BASE_URL_8008}/situs?limit=200`),
        fetch(`${env.BASE_URL_8008}/komunitas?limit=200`),
        fetch(`${env.BASE_URL_8008}/acara/komunitas/${id_situs}?limit=200`),
        fetch(`${env.BASE_URL_8008}/acara/panitia/${id_acaraorganisasi}`),
        fetch(`${env.BASE_URL_8008}/undangan/${id_acaraorganisasi}`)
    ]);

    if (!usersRes.ok || !situsRes.ok || !organisasiRes.ok || !acaraRes.ok) {
        throw error(500, "Gagal mengambil data users, situs, komunitas, organisasi, atau acara");
    }

    // Parsing dan filter setiap response
    const users = await usersRes.json();
    const filteredUsers = Array.isArray(users)
        ? users.filter((item: any) => item.deleted_at === "0001-01-01T00:00:00Z" || item.deleted_at === null)
        : users;

    const situs = await situsRes.json();
    const filteredSitus = Array.isArray(situs)
        ? situs.filter((item: any) => item.deleted_at === "0001-01-01T00:00:00Z" || item.deleted_at === null)
        : situs;

    const organisasi = await organisasiRes.json();
    const filteredOrganisasi = Array.isArray(organisasi)
        ? organisasi.filter((item: any) => item.deleted_at === "0001-01-01T00:00:00Z" || item.deleted_at === null)
        : organisasi;


    const panitia = await panitiaRes.json();
    const filteredPanitia = Array.isArray(panitia)
        ? panitia.filter((item: any) => item.deleted_at === "0001-01-01T00:00:00Z" || item.deleted_at === null)
        : panitia;

    const isKetuaExist = filteredPanitia.some((item: any) => item.jabatan_panitia === "ketua");

    const undangan = await undanganRes.json();
    const filteredUndangan = Array.isArray(undangan)
        ? undangan.filter((item: any) => item.deleted_at === "0001-01-01T00:00:00Z" || item.deleted_at === null)
        : undangan;

    const acaraList = await acaraRes.json();
    const filteredAcaraList = Array.isArray(acaraList)
        ? acaraList.filter((item: any) => {
            if (item.Acara) {
                return item.Acara.deleted_at === "0001-01-01T00:00:00Z" || item.Acara.deleted_at === null;
            }
            // fallback kalau struktur berbeda
            return item.deleted_at === "0001-01-01T00:00:00Z" || item.deleted_at === null;
        })
        : acaraList;

    // console.log("Filtered acaraList: ", filteredAcaraList);

    // Cari acara yang id-nya sama dengan id_acaraorganisasi
    let acara = null;
    for (const item of acaraList) {
        if (item.Acara.id_acara == Number(id_acaraorganisasi)) {
            acara = item;
            break;
        }
    }
    if (!acara) throw error(404, "Acara tidak ditemukan");

    return {
        id_admin,
        users: filteredUsers,
        situs: filteredSitus,
        organisasi: filteredOrganisasi,
        acaraList: filteredAcaraList,
        data: acara,
        dataUndangan: filteredUndangan,
        dataPanit: filteredPanitia,
        id_situs,
        id_acaraorganisasi,
        isKetuaExist
    };
};


export const actions: Actions = {
    editAcara: async ({ request, cookies, params }) => {
        const id = params.id
        const id_acara = params.idacara
        console.log("id : ", id)
        console.log("id a : " , id_acara)
        const data = await request.formData();
        let token = cookies.get("userSession")? JSON.parse(cookies.get("userSession") as string): ''

        const ids = data.getAll("id").map(String); // undangan
        const ids2 = data.getAll("id2").map(String); //panit
        let res = await fetch(`${env.URL_KERAJAAN}/acara/detail/${params.idacara}`);
                let msd = await res.json()
        console.log(data)
        console.log(ids)
        console.log(ids2)
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
            jenis_acara: z.enum(["private", "public"], {
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
            // panggilan: z.record(z.string().trim().min(1, "Panggilan gaboleh kosong!")),
            // namabawah: z.record(z.string().min(1, "Masih ada input field yg kosong!")),
            // notelpbawah: z.record(
            //     z.string()
            //         .min(10, "Nomor telepon harus diisi!")
            //         .regex(/^\d+$/, "Nomor telepon hanya boleh angka!")
            // ),
            // namajabatan: z.record(z.string().trim().min(1, "Silahkan Pilih Jabatan!")),
            // namalengkapbawah: z.record(z.string().min(1, "Tidak boleh kosong!")),
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
        console.log("Extracted Form:", form);

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
        const undanganArr = Object.keys(form.namabawah).map(id => ({
            nama: form.namabawah[id],
            notelp: form.notelpbawah[id],
            panggilan: form.panggilan[id]
        }));
          const panitiaArr = Object.keys(form.namalengkapbawah).map(id => ({
            nama: form.namalengkapbawah[id],
            jabatan: form.namajabatan[id]
          }));
        console.log("undangan arr : ", undanganArr , "panitia arr : ", panitiaArr)
        if (undanganArr && panitiaArr) {
            try {
            await Promise.all(
                undanganArr.map(async (undangan) => {
                    let send = {
                        id_acara: Number(id_acara),
                        id_pengirim: Number(token?.user_data?.id_user),
                        id_penerima: Number(undangan.nama)
                    }
                    console.log("sending acara", send)
                   let res = await fetch(`${env.URL_KERAJAAN}/undangan`, {    
                        method: "POST",            
                        headers: { "Content-Type": "application/json" }, 
                        body: JSON.stringify(send)
                   });
                    let msg = await res.json()
                    console.log(msg)
                })
            );
            await Promise.all(
                panitiaArr.map(async (panitia) => {
                     let send = {
                        id_acara: Number(id_acara),
                        id_user: Number(panitia.nama),
                        jabatan_panitia: panitia.jabatan
                    }
                    console.log("sending panit", send)
                    let res = await fetch(`${env.URL_KERAJAAN}/acara/panitia`, {    
                        method: "POST",            
                        headers: { "Content-Type": "application/json" }, 
                        body: JSON.stringify(send)
                    });
                    let msg = await res.json()
                    console.log("panitia",msg)
                })
            );
            } catch (error) {
                console.log(error)
                return fail(406, {
                    errors: "Terjadi kesalahan mengambil data",
                    success: false,
                    formData: form,
                    type: "add"
                });
            
            }

        
        }
        try {
            let payload ={
                id_acara: Number(id_acara),
                nama_acara: data.get("namaacara"),
                deskripsi_acara: data.get("deskripsi_acara"),
                tujuan_acara: data.get("tujuanacara"),
                lokasi_acara: Number(data.get("id_lokasi")),
                alamat_acara: data.get("alamat_acara"),
                waktu_mulai: `${data.get("tanggalmulai")} ${data.get("waktumulai")}:00`,
                waktu_selesai: `${data.get("tanggalselesai")} ${data.get("waktuselesai")}:00`,
                penanggung_jawab: Number(data.get("penanggungjawab_id")),
                jenis_acara: data.get("jenisacara"),
                kapasitas_acara: Number(data.get("kapasitasacara")),
                foto_acara: msd.foto_acara,
                status: msd.status === "Diajukan"? "Diajukan" : msd.status,
            }
            console.log("PayLoad", payload)
            let res = await fetch(`${env.URL_KERAJAAN}/acara`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            })
            let msg = await res.json()
            console.log("Edit acara",msg)
            if (!res.ok) {
            }
            return {success: true}
        } catch (error) {
            
        }
        
        
      
        console.log("Undangan :", undanganArr )
        console.log("Panit :", panitiaArr )
        
        
        return { errors: "Success", success: true, acara: true };
    },

};