import { fail, type Actions } from "@sveltejs/kit";
import { z } from "zod";


export const actions: Actions = {
    tambahLanding: async ({ request }) => {
        const data = await request.formData()
        console.log(data)
        const ver = z.object({
            judul_halaman:
                z.string({ message: "Field Judul halaman Harus diisi" })
                    .nonempty("Tidak Boleh Kosong"),
            
            deskripsi_halaman: 
            z.string({ message: "Field deskripsi halaman Harus diisi" })
                    .nonempty("Tidak Boleh Kosong"),
            deskripsi_1: 
            z.string({ message: "Field Deskripsi Card 1 Harus diisi" })
            .nonempty("Tidak Boleh Kosong"),
            deskripsi_2: 
            z.string({ message: "Field Deskripsi Card 2 Harus diisi" })
            .nonempty("Tidak Boleh Kosong"),
            deskripsi_3: 
            z.string({ message: "Field Deskripsi Card 3 Harus diisi" })
            .nonempty("Tidak Boleh Kosong"),
        })

        const formData = {
            judul_halaman : String(data.get("judul_halaman")),
            deskripsi_halaman : String(data.get("deskripsi_halaman")),
            deripsi_1 : String(data.get("deksripsi_1")),
            deskripsi_2 : String(data.get("deskripsi_2")),
            deskripsi_3 : String(data.get("deskripsi_3")),
        }
        const verif = ver.safeParse({ ...formData })
        if (!verif.success) {
            console.log(verif.error.flatten().fieldErrors)
            return fail(418,{errors: verif.error.flatten().fieldErrors, formData})
        }
        return {errrors: "no error", formData}
    }
};