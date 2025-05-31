import { error, fail, type Actions } from "@sveltejs/kit";
import { any, z } from "zod";
import type { PageServerLoad } from "../$types";
import { env } from "$env/dynamic/private";

export const load: PageServerLoad = async ({ cookies }) => {
    try {
        let token = cookies.get("userSession")? JSON.parse(cookies.get("userSession") as string): ''
        let res = await fetch(`${env.URL_KERAJAAN}/situs`);
        let resUser = await fetch(`${env.PUB_PORT}/users`,{
            headers: {
                "Authorization": `Bearer ${token?.token}`
            }
        });
        if(!resUser.ok){
            throw error(resUser.status, `Failed to fetch user: ${resUser.statusText}`);
        }
        let userData = await resUser.json()
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
        if (!res) {
            console.error("Failed to initialize fetch request");
            return fail(500, { error: "Server error: Failed to initialize request" });
        }
        
        if (res.ok) {
            let data = await res.json();
            console.log("Data: ", data);
            
            return { data, user: userData, id_pemohon: token?.user_data.id_user };
        } else {
            let errorData = await res.text().catch(() => "Unknown error");
            console.error(`API error: ${res.status} - ${errorData}`);
            return fail(res.status, { 
                error: `Failed to retrieve data: ${res.status}`,
                details: errorData
            });
        }
    }
    catch (err) {
         let errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
        console.error("Error in load function:", errorMessage);
        return fail(500, { error: "Server error", details: errorMessage });
    }
};
export const actions: Actions = {
    tambah: async ({ request }) => {
        const data = await request.formData();
        console.log(data)
        
        // Log semua data yang diterima
        console.log("=== FORM DATA RECEIVED ===");
        for (const [key, value] of data.entries()) {
            console.log(`${key}: ${value}`);
        }
        
        // Cek khusus untuk alamat acara
        console.log("alamat_acara value:", data.get("alamat_acara"));
        
        const ids = data.getAll("id").map(String);
        const ids2 = data.getAll("id2").map(String);


        console.log(ids)


        const ver = z.object({
         
            inputradio: z.string().trim().min(1, "Minimal 1!"),
            namaacara: z.string().trim().min(1, "Isi Nama acara"),
            lokasiacara: z.string().trim().min(1, "Lokasi harus diisi!"),
            alamatacara: z.string().trim().min(1, "Alamat harus diisi!"),
            tujuanacara: z.string().trim().min(1, "Tujuan harus diisi!"),
            deskripsiacara: z.string().trim().min(1, "Deskripsi harus terisi!"),
            penanggungjawab: z.string().trim().min(1, "Isi penanggungjawab!"),
            
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

        let form: any = {
            namaacara: data.get("namaacara") ?? "",
            lokasiacara: data.get("lokasi_acara") ?? "",
            alamatacara: data.get("alamat_acara") ?? "",
            deskripsiacara: data.get("deskripsi_acara") ?? "",
            kapasitasacara: data.get("kapasitasacara") ?? "",
            inputradio: data.get("default-radio") ?? "",
            penanggungjawab: data.get("penanggungjawab") ?? "",
            tujuanacara: data.get("tujuan_acara") ?? "",
            tanggalmulai: data.get("tanggalmulai") ?? "",
            tanggalselesai: data.get("tanggalselesai") ?? "",
            waktumulai: data.get("waktumulai") ?? "",
            waktuselesai: data.get("waktuselesai") ?? "",
         
           
            // panggilan: {},
            // namabawah: {},
            // notelpbawah: {},
            // namalengkapbawah: {},
            // namajabatan: {},
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

        try {

            let formsend = new FormData()
            formsend.append("id_pemohon", data.get("id_pemohon") as string)
            formsend.append("penanggung_jawab", data.get("penanggung_jawab_id") as string)
            formsend.append("id_lpj", data.get("id_lpj") as string||"1")
            formsend.append("lokasi_acara", data.get("id_lokasi") as string || data.get("lokasi_acara") as string)

            formsend.append("nama_acara", data.get("namaacara") as string)
            formsend.append("deskripsi_acara", data.get("deskripsi_acara") as string)
            formsend.append("nama_acara", data.get("namaacara") as string)
            formsend.append("nama_acara", data.get("namaacara") as string)
            formsend.append("nama_acara", data.get("namaacara") as string)
            formsend.append("nama_acara", data.get("namaacara") as string)
           
            

            let res = await fetch(`${env.URL_KERAJAAN}/acara`,{

            })
        } catch (error) {
            
        }

        return { errors: "Success", success: true, formData: form, type: "add" };
    }
};
