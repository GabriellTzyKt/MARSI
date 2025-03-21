import SuccessModal from "$lib/modal/SuccessModal.svelte";
import { fail, type Actions } from "@sveltejs/kit";
import { number, z } from "zod";


export const actions: Actions = {
    editSitus: async ({request}) => {
        const data = await request.formData()
        console.log(data)
        const ver = z.object({
            nama_situs:
                z.string({ message: "Field Nama Situs harus diisi" })
                    .nonempty("Field Ini tidak boleh kosong"),
            
            alamat:
                z.string({ message: "Field Alamat harus diisi" })
                    .nonempty("Field Ini tidak boleh kosong"),
            
            phone:
                z.string({ message: "Field Nomer Telepon harus diisi" })
                    .min(10, "Nomer Telepon Minimal 10 digit")
                    .max(13, "Nomer Telepon Maximal 13 digit")
                    .regex(/^\d+$/, "Input Harus Berupa Angka / Digit"),
            
            
            kepemilikan:
                z.string({ message: "Field Kepemilikan harus diisi" })
                    .nonempty("Field Ini tidak boleh kosong"),
            
            deskripsi_situs:
                z.string({ message: "Field Deskripsi Situs harus diisi" })
                    .nonempty("Field Ini tidak boleh kosong"),
            
            juru_kunci:
                z.string({ message: "Field Juru Kunci harus diisi" })
                    .nonempty("Field Ini tidak boleh kosong"),
            
            dibangun_oleh:
                z.string({ message: "Field Dibangun Oleh harus diisi" })
                    .nonempty("Field Ini tidak boleh kosong"),
            
            tahun_berdiri:
                z.string({ message: "Field Tahun Beridir harus diisi" })
                    .nonempty("Field Ini tidak boleh kosong")
                    .regex(/^\d+$/, "Input Harus Berupa Angka / Digit"),
            
            pembina:
                z.string({ message: "Field Pembina harus diisi" })
                    .nonempty("Field Ini tidak boleh kosong"),
            
            pelindung:
                z.string({ message: "Field Pelindung harus diisi" })
                    .nonempty("Field Ini tidak boleh kosong"),
            
            jam_buka:
                z.string({ message: "Field Jam Buka harus diisi" })
                    .nonempty("Field Ini tidak boleh kosong"),
            
            jam_tutup:
                z.string({ message: "Field Jam Tutup harus diisi" })
                    .nonempty("Field Ini tidak boleh kosong"),
            
            jumlah_anggota:
                z.number({ message: "Field Jumlah Situs harus diisi" })
                    .min(1,"minimal 1 anggota")
                    ,
                    
            wisata:
                z.string({ message: "Field Jam Tutup harus diisi" })
                    .nonempty("Field Ini tidak boleh kosong")
            
            
        })
        const formData = {
            nama_situs: String(data.get("nama_situs")),
            alamat: String(data.get("alamat")),
            phone: String(data.get("phone")),
            kepemilikan: String(data.get("kepemilikan")),
            deskripsi_situs: String(data.get("deskripsi_situs")),
            juru_kunci: String(data.get("juru_kunci")),
            dibangun_oleh: String(data.get("dibangun_oleh")),
            tahun_berdiri: String(data.get("tahun_berdiri")),
            pembina: String(data.get("pembina")),
            pelindung: String(data.get("pelindung")),
            jam_buka: String(data.get("jam_buka")),
            jam_tutup: String(data.get("jam_tutup")),
            jumlah_anggota: Number(data.get("jumlah_anggota")),
            wisata: String(data.get("wisata")),
        }
        const verification = ver.safeParse({ ...formData })
        
        if (!verification.success) {
            return fail(418, {
                errors: verification.error.flatten().fieldErrors, success: false, formData
            })
        }
        return { success: true, formData}
    }
};