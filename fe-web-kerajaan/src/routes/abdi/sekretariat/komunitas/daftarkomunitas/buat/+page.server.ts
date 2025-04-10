import { fail, type Actions } from "@sveltejs/kit";
import { z } from "zod";

export const actions: Actions = {
    tambahSitus: async ({request}) => {
        const data = await request.formData()
        console.log(data)
        const ver = z.object({
            nama_situs: 
                z.string({ message: "Field Nama Situs Harus diisi" })
                    .nonempty("Field ini tidak boleh kosong"),
            
            alamat: 
                z.string({ message: "Field Alamat Harus diisi" })
                    .nonempty("Field ini tidak boleh kosong"),
            
            email: 
                z.string({ message: "Field Email Harus diisi" })
                    .nonempty("Field ini tidak boleh kosong")
                    .email("Email Invalid"),
            deskripsi_situs: 
                z.string({ message: "Field Deskripsi Situs Harus diisi" })
                    .nonempty("Field ini tidak boleh kosong"),
            
            penanggungjawab: 
                z.string({ message: "Field Penanggung Jawab Harus diisi" })
                    .nonempty("Field ini tidak boleh kosong"),
            pembina: 
                z.string({ message: "Field Pembina Harus diisi" })
                    .nonempty("Field ini tidak boleh kosong"),
            pelindung: 
                z.string({ message: "Field Pelindung Harus diisi" })
                    .nonempty("Field ini tidak boleh kosong"),
            phone:
                z.string({ message: "Field Nomer Telepon Harus diisi" })
                    .min(10, "Nomer telpon minimal 10 digit")
                    .max(13, "nomer telpon maximal 13 digit")
                    .regex(/^\d+$/, "Harus berupa digit")
            
            
        })
        const formData = {
            nama_situs: String(data.get("nama_situs")),
            alamat: String(data.get("alamat")),
            email: String(data.get("email")),
            deskripsi_situs: String(data.get("deskripsi_situs")),
            penanggungjawab: String(data.get("penanggungjawab")),
            pembina: String(data.get("pembina")),
            pelindung: String(data.get("pelindung")),
            phone: String(data.get("phone")),
        }
        const verification = ver.safeParse({ ...formData })
        if (!verification.success) {
            return fail(418,{errors: verification.error.flatten().fieldErrors, success:false, formData})
        }
        return {success: true, formData}
    }
};