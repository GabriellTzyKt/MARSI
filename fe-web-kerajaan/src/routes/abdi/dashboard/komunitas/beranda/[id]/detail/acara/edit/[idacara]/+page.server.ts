import { env } from "$env/dynamic/private";
import { fail, error, type Actions } from "@sveltejs/kit";
import { z } from "zod";

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
    const [usersRes, situsRes, organisasiRes, acaraRes] = await Promise.all([
        fetch(`${env.BASE_URL}/users?limit=2000`),
        fetch(`${env.BASE_URL_8008}/situs?limit=200`),
        fetch(`${env.BASE_URL_8008}/komunitas?limit=200`),
        fetch(`${env.BASE_URL_8008}/acara/komunitas/${id_situs}?limit=200`)
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

    console.log("Filtered acaraList: ", filteredAcaraList);
    
    // Cari acara yang id-nya sama dengan id_acaraorganisasi
    let acara = null;
    for (const item of filteredAcaraList) {
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
        acara
    };
};


export const actions: Actions = {
    edit: async ({ request, params }) => {
        const data = await request.formData();
        const id_acaraorganisasi = params.idacara;
        console.log("Data : ", data)

        const ids = data.getAll("id").map(String);
        const ids2 = data.getAll("id2").map(String);

        let form: any = {
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
            namajabatan: {}
        };

        const ver = z.object({
            namaacara: z.string().trim().min(1, "Isi Nama Acara!"),
            lokasiacara: z.string().trim().min(1, "Lokasi harus diisi!"),
            tujuanacara: z.string().trim().min(1, "Tujuan harus diisi!"),
            deskripsiacara: z.string().trim().min(1, "Deskripsi harus terisi!"),
            penanggungjawab: z.string().trim().min(1, "Isi penanggungjawab!"),
            kapasitasacara: z.string()
                .trim()
                .min(1, "Minimal 1 anggota")
                .regex(/^\d+$/, "Jumlah anggota harus angka"),
            jenis_acara: z.string().trim().min(1, "Pilih jenis acara!"),
            tanggalmulai: z.coerce.date({ message: "Tanggal Tidak valid (YYYY-MM-DD)" }),
            tanggalselesai: z.coerce.date({ message: "Tanggal Tidak valid (YYYY-MM-DD)" }),
            waktumulai: z.string().regex(/^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/, {
                message: "pakai format : HH(jam):mm(menit)."
            }),
            waktuselesai: z.string().regex(/^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/, {
                message: "pakai format : HH(jam):mm(menit)."
            }),
            panggilan: z.record(z.string().trim().min(1, "Panggilan gaboleh kosong!")),
            namabawah: z.record(z.string().min(1, "Masih ada input field yg kosong!")),
            notelpbawah: z.record(
                z.string()
                    .min(10, "Nomor telepon harus diisi!")
                    .regex(/^\d+$/, "Nomor telepon hanya boleh angka!")
            ),
            namajabatan: z.record(z.string().trim().min(1, "Silahkan Pilih Jabatan!")),
            namalengkapbawah: z.record(z.string().min(1, "Tidak boleh kosong!"))
        });

        // Isi form dari request.formData()
        form = {
            buttonselect: data.get("buttonselect") ?? "",
            jenis_acara: data.get("default-radio") ?? "",
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
            namajabatan: {}
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
            console.log("errors : ", fieldErrors);
            return fail(406, {
                errors: fieldErrors,
                success: false,
                formData: form,
                type: "add"
            });
        }

        // Ambil id_pengirim dari form data (misalnya, field "id_user")
        const id_pengirim = data.get("id_user");

        // Kirim POST request ke endpoint /undangan untuk setiap penerima (berdasarkan form.namabawah)
        // asumsikan field form.namabawah berisi id penerima yang valid
        for (const id of ids) {
            const id_penerima = form.namabawah[id];
            const undanganPayload = {
                id_acara: Number(id_acaraorganisasi),  // id_acaraorganisasi dari params.idacara
                id_pengirim: Number(id_pengirim),
                id_penerima: Number(id_penerima)
            };

            console.log("UNDANGAN PAYLOAD : ", undanganPayload)
            const undanganRes = await fetch(`${env.BASE_URL_8008}/undangan`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(undanganPayload)
            });
            if (!undanganRes.ok) {
                console.error("Gagal mengirim undangan untuk penerima id: ", id_penerima);
            }
        }

        return { errors: "Success", success: true, formData: form };
    }
};