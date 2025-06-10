import { fail } from "@sveltejs/kit";
import { error, type Actions } from "@sveltejs/kit";
import { z } from "zod";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";
import { dummyAcara } from "$lib/dummy";
let hapusUndangan = false
let acara = false

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
                let day = String(date.getUTCDate()).padStart(2, '0');
                let month = String(date.getUTCMonth() + 1).padStart(2, '0');
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
        function formatTimeToHHMM_UTC(isoString: string): string {
            if (!isoString || isoString === '0001-01-01T00:00:00Z') return '-';
            const date = new Date(isoString);
            const hours = String(date.getUTCHours()).padStart(2, '0');
            const minutes = String(date.getUTCMinutes()).padStart(2, '0');
            return `${hours}:${minutes}`;
        }
        // console.log("Found Lokasi : ", locDataFromSitus)
        let formattedData = {
                    ...data,
                    nama_lokasi: locDataFromSitus.nama_situs,
                    alamat_lokasi: locDataFromSitus.alamat,
                    tanggal_mulai: formatDate(data.waktu_mulai),
                    tanggal_selesai: formatDate(data.waktu_selesai),
                    waktu_mulai: formatTimeToHHMM_UTC(data.waktu_mulai),
                    waktu_selesai: formatTimeToHHMM_UTC(data.waktu_selesai),
                    waktu_mulai_original: data.waktu_mulai,
                    waktu_selesai_original: data.waktu_selesai
        };
        let resuser = await fetch(`${env.PUB_PORT}/users?limit=1000`, {
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
            fetch(`${env.URL_KERAJAAN}/undangan/${params.id}?limit=500`, {
                method:"GET",
            }),
            fetch(`${env.URL_KERAJAAN}/acara/panitia/${params.id}?limit=500`, {
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
        // dataPanit = dataPanit?.filter(item => item?.deleted_at === '0001-01-01T00:00:00Z' || !item?.deleted_at)
        console.log(formattedData)
        return { data: formattedData, situs,dataUndangan,dataPanit,  user: userData };
    }
    catch (error) {
        console.log(error)
        return { error: "Terjadi kesalahan mengambil data" };
    }
};

export const actions: Actions = {
    editAcara: async ({ request, cookies, params }) => {
        const data = await request.formData();
        let token = cookies.get("userSession")? JSON.parse(cookies.get("userSession") as string): ''
        let res = await fetch(`${env.URL_KERAJAAN}/acara/detail/${params.id}`);
        let msd = await res.json()

        const ids = data.getAll("id").map(String); // undangan
        const ids2 = data.getAll("id2").map(String); //panit
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
            panggilan: z.record(z.string().trim().min(1, "Panggilan gaboleh kosong!")),
            namabawah: z.record(z.string().min(1, "Masih ada input field yg kosong!")),
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
        if (undanganArr && panitiaArr) {
            try {
            await Promise.all(
                undanganArr.map(async (undangan) => {
                    let send = {
                        id_acara: Number(data.get("id_acara")),
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
                        id_acara: Number(data.get("id_acara")),
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
                id_acara: Number(data.get("id_acara")),
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


    hapusUndangan: async ({ request, cookies }) => {
        const data = await request.formData();
        let token = cookies.get("userSession") ? JSON.parse(cookies.get("userSession") as string) : ''
        console.log(data)
        try {
            let res = await fetch(`${env.URL_KERAJAAN}/undangan/${data.get("id_undangan")}`, {
                method: "DELETE",
               
            });
            let msg = await res.json()
            if (!res.ok) {
                console.error(msg.message)
            }

            console.log(msg)
            return { success: true, message: "Undangan berhasil dihapus", hapusUndangan :true };
        } catch (error) {
            
        }
    }
};