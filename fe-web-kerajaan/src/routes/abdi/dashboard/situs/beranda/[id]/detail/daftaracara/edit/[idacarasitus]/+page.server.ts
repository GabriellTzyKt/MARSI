import { env } from "$env/dynamic/private";
import { fail, error, type Actions } from "@sveltejs/kit";
import { z } from "zod";

export const load = async ({ params, fetch, cookies }) => {
    const id_situs = params.id;
    const id_acarasitus = params.idacarasitus;
    let cookie = cookies.get("userSession") ? JSON.parse(cookies.get("userSession") as string) : '';

    // Ambil semua data yang dibutuhkan secara paralel
    const [usersRes, situsRes, komunitasRes, organisasiRes, acaraRes] = await Promise.all([
        fetch(`${env.BASE_URL}/users?limit=2000`, {
            headers: {
                "Authorization": `Bearer ${cookie.token}`
            }
        }),
        fetch(`${env.BASE_URL_8008}/situs?limit=200`),
        fetch(`${env.BASE_URL_8008}/komunitas?limit=200`),
        fetch(`${env.BASE_URL_8008}/organisasi?limit=200`),
        fetch(`${env.BASE_URL_8008}/acara/detail/${id_acarasitus}`)
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
        ? situsData.filter((item: any) => item.deleted_at === "0001-01-01T00:00:00Z" || item.deleted_at == null)
        : situsData;

        function formatTimeToHHMM_UTC(isoString: string): string {
            if (!isoString || isoString === '0001-01-01T00:00:00Z') return '-';
            const date = new Date(isoString);
            const hours = String(date.getUTCHours()).padStart(2, '0');
            const minutes = String(date.getUTCMinutes()).padStart(2, '0');
            return `${hours}:${minutes}`;
        }
    let acaraData = await acaraRes.json();
     acaraData = {
         ...acaraData,
         waktu_selesai_time : formatTimeToHHMM_UTC(acaraData.waktu_selesai),
         waktu_mulai_time : formatTimeToHHMM_UTC(acaraData.waktu_mulai),
        }
     let [resUndangan, resPanit] = await Promise.all([
            fetch(`${env.URL_KERAJAAN}/undangan/${id_acarasitus}?limit=500`, {
                method:"GET",
            }),
            fetch(`${env.URL_KERAJAAN}/acara/panitia/${id_acarasitus}?limit=500`, {
                 method:"GET",   
            })
     ]);
     if (!resUndangan.ok && !resPanit.ok) {
            
        }
        let dataUndangan = await resUndangan.json()
        dataUndangan = dataUndangan.filter(item => item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at)
        console.log("DAta Undangan", dataUndangan)
        let dataPanit = await resPanit.json()
         dataPanit = dataPanit.filter(item => item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at)


        console.log("data Panit", dataPanit)
    // Cari acara yang id-nya sama dengan id_acarasitus

    return {
        users : filteredUsers,
        situs : filteredSitus,
        dataPanit,
        dataUndangan,
        id_situs,
        acara : acaraData
    };
};


export const actions: Actions = {
    edit: async ({ request, params, cookies }) => {
        let token = cookies.get("userSession") ? JSON.parse(cookies.get("userSession") as string) : '';
        const data = await request.formData();
        let res = await fetch(`${env.URL_KERAJAAN}/acara/detail/${params.idacarasitus}`);
        let msd = await res.json()
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
        const undanganArr = Object.keys(form.namabawah).map(id => ({
            nama: form.namabawah[id],
            notelp: form.notelpbawah[id],
            panggilan: form.panggilan[id]
        }));
          const panitiaArr = Object.keys(form.namalengkapbawah).map(id => ({
            nama: form.namalengkapbawah[id],
            jabatan: form.namajabatan[id]
          }));
            console.log("Undangan :", undanganArr )
        console.log("Panit :", panitiaArr ) 
        if (undanganArr && panitiaArr) {
            try {
            await Promise.all(
                undanganArr.map(async (undangan) => {
                    let send = {
                        id_acara: Number(msd.id_acara),
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
                        id_acara: Number(msd.id_acara),
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
                id_acara: Number(msd.id_acara),
                nama_acara: data.get("namaacara"),
                deskripsi_acara: data.get("deskripsiacara") ||'',
                tujuan_acara: data.get("tujuanacara"),
                lokasi_acara: Number(data.get("lokasiacara")),
                alamat_acara: data.get("alamatacara"),
                waktu_mulai: `${data.get("tanggalmulai")} ${data.get("waktumulai")}:00`,
                waktu_selesai: `${data.get("tanggalselesai")} ${data.get("waktuselesai")}:00`,
                penanggung_jawab: Number(data.get("penanggungjawab")),
                jenis_acara: data.get("default-radio"),
                kapasitas_acara: Number(data.get("kapasitasacara")),
                // foto_acara: "1",
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
        
        
      
           



        return { errors: "Success", success: true, formData: form };
    }
};