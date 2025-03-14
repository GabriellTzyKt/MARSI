import type { Actions } from "@sveltejs/kit";
import { string, z } from "zod";


export const actions: Actions = {
    tambah: async ({request}) => {
        const data = await request.formData()
        console.log(data)
         let form = {
            nama_anggota: "",
            no_telp: "",
            email: "",
            nama_kerajaan: "",
            jenis_kerajaan: "",
            gelar : ""
             
        }
                let ver = z.object({
                    nama_anggota:
                        z.string({ message: "nama_anggota Harus Berupa String" })
                            .nonempty({ message: "Field ini jangan kosong" })
                            .max(255, { message: "Kata mencapai Maximal (255)" })
                            .trim(),
                    no_telp:
                        z.string({ message: "Input Harus Ada" })
                            .min(10,{message:"nomer telepon minimal  10 angka"})
                            .max(13, { message: "nomer telepon maximal 15 angka" })
                            .regex(/^\d+$/, "Harus berupa nomer")
                            .trim(),
                    email:
                        z.string({ message: "Input tidak boleh kosong / bukan string" })
                            .email("Format Email Tidak Valid").trim(),
                    nama_kerajaan:
                        z.string({ message: "Field Tidak Boleh Kosong Atau Harus berupa Huruf" })
                            .nonempty("Filed Tidak Boleh Kosong")
                            .max(255, "Sudah Mencapai Max huruf (255)")
                            .trim(),
                    jenis_kerajaan:
                        z.string({ message: "Input tidak boleh kosong / bukan string" })
                            .nonempty("Field ini tidak boleh kosong")
                            .max(255, "Tidak boleh lebih dari 255 kata")
                            .trim(),
                    gelar:
                        z.string({ message: "Input tidak boleh kosong / bukan string" })
                            .nonempty("Field ini tidak boleh kosong")
                            .max(255, "Tidak boleh lebih dari 255 kata")
                            .trim(),
                })
         form = {
            nama_anggota: data.get("nama_anggota"),
            no_telp: data.get("no_telp"),
            email: data.get("email"),
            nama_kerajaan: data.get("nama_kerajaan"),
            jenis_kerajaan: data.get("jenis_kerajaan"),
            gelar : data.get("gelar")
             
        }
        const verif = ver.safeParse({ ...form })
        
        if (!verif.success) {
            return{errors: verif.error.flatten().fieldErrors, success: false, formData: form}
        }
        return { errors: "no Error", success: true, formData: form}
    }
};