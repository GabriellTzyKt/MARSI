import { error, fail, type Actions } from "@sveltejs/kit";
import { any, z } from "zod";
import type { PageServerLoad } from "../$types";
import { env } from "$env/dynamic/private";

export const load: PageServerLoad = async ({ fetch, params, cookies }) => {
    // Ambil id dari params
    const id = params.id;
    let token = cookies.get("userSession")? JSON.parse(cookies.get("userSession") as string): ''
    console.log("Params", id)
    // Fetch users, situs, komunitas, organisasi, dan acara
    const [usersRes, situsRes, organisasiRes, acaraRes] = await Promise.all([
        fetch(`${env.BASE_URL_8008}/anggota?limit=200`),
        fetch(`${env.BASE_URL_8008}/situs?limit=200`),
        fetch(`${env.BASE_URL_8008}/organisasi?limit=200`),
        fetch(`${env.BASE_URL_8008}/acara/organisasi/${id}?limit=200`)
    ]);

    if (!usersRes.ok || !situsRes.ok || !organisasiRes.ok || !acaraRes.ok) {
        console.log("Error", usersRes, situsRes, organisasiRes, acaraRes)
        throw error(500, "Gagal mengambil data users, situs, komunitas, organisasi, atau acara");
    }

    const usersData = await usersRes.json();
    const filteredUsers = Array.isArray(usersData)
        ? usersData.filter((item: any) => item.deleted_at === "0001-01-01T00:00:00Z" || item.deleted_at === null) 
        : usersData;

    const situsData = await situsRes.json();
    const filteredSitus = Array.isArray(situsData)
        ? situsData.filter((item: any) => item.deleted_at === "0001-01-01T00:00:00Z" || item.deleted_at === null)
        : situsData;

    const organisasiData = await organisasiRes.json();
    const filteredOrganisasi = Array.isArray(organisasiData)
        ? organisasiData.filter((item: any) => item.deleted_at === "0001-01-01T00:00:00Z" || item.deleted_at === null)
        : organisasiData;

    const acaraData = await acaraRes.json();
    const filteredAcara = Array.isArray(acaraData)
        ? acaraData.filter((item: any) => item.Acara.deleted_at === "0001-01-01T00:00:00Z" || item.Acara.deleted_at === null)
        : acaraData;

    return {
        users : filteredUsers,
        situs : filteredSitus,
        organisasi : filteredOrganisasi,
        acara: filteredAcara
    };
};


export const actions: Actions = {
    tambah: async ({ request, params }) => {
        const data = await request.formData();
        let id = params.id

        console.log("Data : ", data)

        const ids = data.getAll("id").map(String);
        const ids2 = data.getAll("id2").map(String);


        console.log(ids)

        let form: any = {
            namaacara: "",
            lokasiacara: "",
            alamatacara: "",
            tujuanacara: "",
            deskripsiacara: "",
            penanggungjawab: "",
            penyelenggaraacara: "",
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
            // penyelenggaraacara: z.string().trim().min(1, "Isi penyelenggara!"),
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
            lokasiacara: data.get("lokasiacara") ?? "",
            alamatacara: data.get("alamatacara") ?? "",
            tujuanacara: data.get("tujuanacara") ?? "",
            deskripsiacara: data.get("deskripsiacara") ?? "",
            penanggungjawab: data.get("penanggungjawab") ?? "",
            penyelenggaraacara: id || 0,
            kapasitasacara: data.get("kapasitasacara") ?? "",
            tanggalmulai: data.get("tanggalmulai") ?? "",
            tanggalselesai: data.get("tanggalselesai") ?? "",
            waktumulai: data.get("waktumulai") ?? "",
            waktuselesai: data.get("waktuselesai") ?? "",
            panggilan: {},
            namabawah: {},
            notelpbawah: {},
            namalengkapbawah: {},
            namajabatan: {},
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

            console.log("errors : ", fieldErrors)

            return fail(406, {
                errors: fieldErrors,
                success: false,
                formData: form,
                type: "add"
            });
        }

        // return { errors: "Success", success: true, formData: form, type: "add" };



        try {
            let id_user: any = data.get("id_user")
            const formData = new FormData();
            formData.append("id_organisasi", form.penyelenggaraacara);
            formData.append("id_pemohon", id_user); // atau field lain sesuai kebutuhan
            formData.append("penanggung_jawab", form.penanggungjawab);
            formData.append("lokasi", form.lokasiacara);
            formData.append("nama_acara", form.namaacara);
            formData.append("deskripsi", form.deskripsiacara);
            formData.append("tujuan_acara", form.tujuanacara);
            formData.append("alamat_acara", form.alamatacara);
            formData.append("waktu_mulai", `${form.tanggalmulai} ${form.waktumulai}:00`)
            formData.append("waktu_selesai", `${form.tanggalselesai} ${form.waktuselesai}:00`);
            formData.append("jenis_acara", form.inputradio);
            formData.append("kapasitas", form.kapasitasacara);

            console.log("Form : ", formData)

            // Jika ada file foto
            const foto = data.get("foto_acara");
            if (foto && typeof foto !== "string") {
                formData.append("foto_acara", foto);
            }

            // Kirim ke API eksternal
            const res = await fetch(`${env.BASE_URL_8008}/acara/organisasi`, {
                method: "POST",
                body: formData,
            });

            const apiResult = await res.json();

            if (!res.ok) {
                console.log("OI")
                return fail(500, {
                    errors: { api: [apiResult.message || "Gagal mengirim ke API komunitas"] },
                    success: false,
                    formData: form,
                    type: "add"
                });
            }

            console.log("success")

            return {
                success: true,
                apiResult
            };
        } catch (e) {
            return fail(500, {
                errors: { api: ["Terjadi kesalahan saat mengirim ke API"] },
                success: false,
                type: "add"
            });
        }
    }
}
