import { error, fail, type Actions } from "@sveltejs/kit";
import { any, z } from "zod";
import type { PageServerLoad } from "../$types";
import { env } from "$env/dynamic/private";

export const load: PageServerLoad = async ({ fetch, params,cookies }) => {
    // Ambil id dari params
    const { id } = params;
    let token = cookies.get("userSession") ? JSON.parse(cookies.get("userSession") as string) : '';

    // Fetch users, situs, komunitas, organisasi, dan acara
    const [usersRes, situsRes, komunitasRes, organisasiRes, acaraRes] = await Promise.all([
        fetch(`${env.BASE_URL}/users?limit=2000`, {
            method: 'GET',
            headers: { 
                "Authorization": `Bearer ${token?.token}`
            }
        }),
        fetch(`${env.BASE_URL_8008}/situs?limit=200`),
        fetch(`${env.BASE_URL_8008}/komunitas?limit=200`),
        fetch(`${env.BASE_URL_8008}/organisasi?limit=200`),
        fetch(`${env.BASE_URL_8008}/acara/situs/${id}?limit=200`)
    ]);

    if (!usersRes.ok || !situsRes.ok || !komunitasRes.ok || !organisasiRes.ok || !acaraRes.ok) {
        throw error(500, "Gagal mengambil data users, situs, komunitas, organisasi, atau acara");
    }

    const usersData = await usersRes.json();
    const filteredUsers = Array.isArray(usersData)
        ? usersData.filter((item: any) => item.deleted_at === "0001-01-01T00:00:00Z" || item.deleted_at === null) 
        : usersData;

    const situsData = await situsRes.json();
    const filteredSitus = Array.isArray(situsData)
        ? situsData.filter((item: any) => item.deleted_at === "0001-01-01T00:00:00Z")
        : situsData;

    const komunitasData = await komunitasRes.json();
    const filteredKomunitas = Array.isArray(komunitasData)
        ? komunitasData.filter((item: any) => item.deleted_at === "0001-01-01T00:00:00Z")
        : komunitasData;

    const organisasiData = await organisasiRes.json();
    const filteredOrganisasi = Array.isArray(organisasiData)
        ? organisasiData.filter((item: any) => item.deleted_at === "0001-01-01T00:00:00Z")
        : organisasiData;

    const acaraData = await acaraRes.json();
    const filteredAcara = Array.isArray(acaraData)
        ? acaraData.filter((item: any) => item.deleted_at === "0001-01-01T00:00:00Z")
        : acaraData;

    return {
        users: filteredUsers,
        situs: filteredSitus,
        komunitas: filteredKomunitas,
        organisasi: filteredOrganisasi,
        acara: filteredAcara
    };
};

export const actions: Actions = {
    tambah: async ({ request, cookies }) => {
        let token  = cookies.get("userSession") ? JSON.parse(cookies.get("userSession") as string) : '';
        const data = await request.formData();

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
            // panggilan: z.record(z.string().min(1, "Panggilan gaboleh kosong!")),
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
            buttonselect: data.get("buttonselect") ?? "",
            inputradio: data.get("default-radio") ?? "",
            namaacara: data.get("namaacara") ?? "",
            lokasiacara: data.get("lokasiacara") ?? "",
            alamatacara: data.get("alamatacara") ?? "",
            tujuanacara: data.get("tujuanacara") ?? "",
            deskripsiacara: data.get("deskripsiacara") ?? "",
            penanggungjawab: data.get("penanggungjawab") ?? "",
            // penyelenggaraacara: data.get("penyelenggaraacara") ?? "",
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
           
            // Ambil id komunitas
            
          
            // Siapkan formData baru untuk dikirim ke API eksternal
            const formData = new FormData();
            formData.append("id_pemohon", token.id_admin);
            formData.append("penanggung_jawab", form.penanggungjawab);
            formData.append("lokasi_acara", form.lokasiacara);
            formData.append("nama_acara", form.namaacara);
            formData.append("deskripsi_acara", form.deskripsiacara);
            formData.append("tujuan_acara", form.tujuanacara);
            formData.append("alamat_acara", form.alamatacara);
            formData.append("waktu_mulai", `${form.tanggalmulai} ${form.waktumulai}:00`)
            formData.append("waktu_selesai", `${form.tanggalselesai} ${form.waktuselesai}:00`);
            formData.append("jenis_acara", form.inputradio);
            formData.append("kapasitas_acara", form.kapasitasacara);
            formData.append("status", "diajukan");
           
            console.log("Payload", formData)
            //    let formsend = new FormData()
            // formsend.append("id_pemohon", data.get("id_pemohon") as string)
            // formsend.append("penanggung_jawab", data.get("penanggungjawab_id") as string)
            // formsend.append("id_lpj", data.get("id_lpj") as string||"1")
            // formsend.append("lokasi_acara", (data.get("id_lokasi") as string )|| data.get("lokasi_acara") as string)
            // formsend.append("nama_acara", data.get("namaacara") as string)
            // formsend.append("deskripsi_acara", data.get("deskripsi_acara") as string)
            // formsend.append("tujuan_acara", data.get("tujuan_acara") as string)
            // formsend.append("alamat_acara", data.get("alamat_acara") as string)
            // formsend.append("waktu_mulai", `${data.get("tanggalmulai") as string} ${data.get("waktumulai") as string}:00`)
            // formsend.append("waktu_selesai", `${data.get("tanggalselesai") as string} ${data.get("waktuselesai") as string}:00`)
            // formsend.append("jenis_acara", data.get("default-radio") as string)
            // formsend.append("kapasitas_acara", data.get("kapasitasacara") as string)
            // formsend.append("status", "Diajukan")
            
            // // Jika ada file foto
            // const foto = data.get("foto_acara");
            // if (foto && typeof foto !== "string") {
            //     formData.append("foto_acara", foto);
            // }

            // Kirim ke API eksternal
           let res = await fetch(`${env.URL_KERAJAAN}/acara`, {
                          method:"POST",
                          body: formData
                      })
                      let s = await res.json()
                      if (!res.ok) {
          
                          console.log(s)
                          
          
          
                          return fail(400, { errors: { server: 'Something went wrong on the server.' } });
                      }

            console.log("Rawr")

            return {
                success: true,
            };
        
            
             
            
        } catch (e) {
            return fail(500, {
                errors: { api: ["Terjadi kesalahan saat mengirim ke API"] },
                success: false,
                type: "add"
            });
        }
    }
};
