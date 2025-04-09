import type { Actions } from "@sveltejs/kit";
import { xml } from "d3";
import { z } from "zod";

class Form {
     nama_lengkap:string | undefined
     email:string | undefined
     no_telp:string | undefined
     tgl_lahir: string | undefined 
    kota_lahir: string | undefined
     afiliasi: string | undefined
     admin_role : string | undefined
    constructor(
        nama_lengkap?: string,
        email?: string,
        no_telp?: string,
        tgl_lahir?: string,
        kota_lahir?: string,
        afiliasi?: string,
        admin_role?: string
        
    ) {
        this.nama_lengkap = nama_lengkap;
        this.email = email
        this.no_telp = no_telp
        this.tgl_lahir = tgl_lahir
        this.kota_lahir = kota_lahir
        this.afiliasi = afiliasi
        this.admin_role = admin_role
        
    }
    
}

export const actions: Actions = {
    tambah: async ({request}) => {
        const data = await request.formData()
        console.log(data)
        const ver = z.object({
            nama_lengkap:
                z.string({ message: "Harus diisi / harus berupa string" })
                    .nonempty("Tidak Boleh kosong")
                    .max(300, "Nama Terlalu Panjang (max = 300)")
                    .trim(),
            
                    
            email:
                z.string({ message: "Harus diisi / harus berupa string" })
                .email("Email Tidak Valid")
                    .nonempty("Field Tidak Boleh Kosong")
                    .trim(),
            
            no_telp:
                z.string({ message: "Input Harus Ada" })
                    .min(10,{message:"nomer telepon minimal  10 angka"})
                    .max(13, { message: "nomer telepon maximal 15 angka" })
                    .regex(/^\d+$/, "Harus berupa nomer")
                    .trim(),
            password:
            z.string({ message: "password bukan string" })
            .min(8, { message: "Password minimal 8 huruf" })
            .max(255, { message: "Password sudah maximal!" })
            .nonempty({ message: "Password tidak boleh kosong" })
            .regex(/[A-Z]/, { message: "Password Harus ada minimal 1 huruf Kapital" })
            .regex(/[0-9]/, { message: "Password Harus ada miniam 1 angka" })
            .regex(/[^A-Za-z0-9]/,{message: "Password harus ada simbol"}),
            tgl_lahir:
                z.coerce.date({ message: "Tanggal Tidak valid (YYYY-MM-DD)" }),
            kota_lahir: 
                z.string({ message: "Harus diisi / harus berupa kata" })
                    .nonempty("Tidak Boleh kosong")
                    .max(255, "Input hanya bisa sampai 255 kata")
                    .trim(),
            jenis_kelamin: 
                z.string({ message: "Harus diisi / harus berupa kata" })
                    .nonempty("Tidak Boleh kosong")
                    .max(255, "Input hanya bisa sampai 255 kata")
                    .trim(),
            afiliasi: 
                z.string({ message: "Harus diisi / harus berupa kata" })
                    .nonempty("Filed Tidak Boleh Kosong")
                    .max(255, "Input Terlalu Banyak (Max 255 Kata)")
                    .trim(),
            admin_role: 
                z.string({ message: "Harus diisi / harus berupa string" })
                    .nonempty("FieldTidak Boleh Kosong")
                    .max(255, "Max 255 Kata")
                    .trim()
            
            
        })
        const nama_lengkap = data.get("nama_lengkap")
        const email = data.get("email")
        const password = data.get("password")
        const jenis_kelamin = data.get("jenis_kelamin")
        const no_telp = data.get("no_telp")
        const tgl_lahir = data.get("tgl_lahir")
        const kota_lahir = data.get("kota_lahir")
        const afiliasi = data.get("afiliasi")
        const admin_role = data.get("admin_role")
        const formData = {
            nama_lengkap,
            email,
            no_telp,
            password,
            tgl_lahir,
            kota_lahir,
            jenis_kelamin,
            afiliasi,
            admin_role
         }
        const verif = ver.safeParse({...formData})
   
        if (!verif.success) {
            return {errors: verif.error?.flatten().fieldErrors, success: false , formData, type: "add"}
        }
        return {success: true, formData, type: "add"}
    },
  
    ubah: async ({request}) => {
        const data = await request.formData()
        console.log(data)
        const ver = z.object({
            nama_lengkap:
                z.string({ message: "Harus diisi / harus berupa string" })
                    .nonempty("Tidak Boleh kosong")
                    .max(300, "Nama Terlalu Panjang (max = 300)")
                    .trim(),
            
                    
            email:
                z.string({ message: "Harus diisi / harus berupa string" })
                .email("Email Tidak Valid")
                    .nonempty("Field Tidak Boleh Kosong")
                    .trim(),
            
            no_telp:
                z.string({ message: "Input Harus Ada" })
                    .min(10,{message:"nomer telepon minimal  10 angka"})
                    .max(13, { message: "nomer telepon maximal 15 angka" })
                    .regex(/^\d+$/, "Harus berupa nomer")
                    .trim(),
            tgl_lahir:
                z.coerce.date({ message: "Tanggal Tidak valid (YYYY-MM-DD)" }),
            kota_lahir: 
                z.string({ message: "Harus diisi / harus berupa kata" })
                    .nonempty("Tidak Boleh kosong")
                    .max(255, "Input hanya bisa sampai 255 kata")
                    .trim(),
            afiliasi: 
                z.string({ message: "Harus diisi / harus berupa kata" })
                    .nonempty("Filed Tidak Boleh Kosong")
                    .max(255, "Input Terlalu Banyak (Max 255 Kata)")
                    .trim(),
            admin_role: 
                z.string({ message: "Harus diisi / harus berupa string" })
                    .nonempty("FieldTidak Boleh Kosong")
                    .max(255, "Max 255 Kata")
                    .trim()
            
            
        })
        const nama_lengkap = data.get("nama_lengkap")
        const email = data.get("email")
        const no_telp = data.get("no_telp")
        const tgl_lahir = data.get("tgl_lahir")
        const kota_lahir = data.get("kota_lahir")
        const afiliasi = data.get("afiliasi")
        const admin_role = data.get("admin_role")
        const formData = {
            nama_lengkap,
            email,
            no_telp,
            tgl_lahir,
            kota_lahir,
            afiliasi,
            admin_role
         }
         console.log(formData)
        const verif = ver.safeParse({...formData})
        console.log(verif.error?.flatten().fieldErrors)
        if (!verif.success) {
            return {errors: verif.error?.flatten().fieldErrors, success: false , formData, type: "edit"}
        }
        return {success: true, formData, type: "edit"}

    }
    
};