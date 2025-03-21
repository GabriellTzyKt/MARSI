import { fail, text, type Actions } from "@sveltejs/kit";
import { z } from "zod";

export const actions: Actions = {
    tambahAset: async ({ request }) => {
        let error: Record<any,any>
        const data = await request.formData()
        
        const file = data.get("gambar_section") as File

        // console.log(data)
        const ver = z.object({
            header_section:
                z.string({ message: "Filed Header Section harus diisi" })
                    .nonempty("Minimal harus ada 1 huruf / tidak boleh kosong"),
            deskripsi_section:
                z.string({ message: "Filed Header Section harus diisi" })
                    .nonempty("Minimal harus ada 1 huruf / tidak boleh kosong"),
            
        })

        const formData = {
            header_section: String(data.get("header_section")),
            deskripsi_section: String(data.get("deskripsi_section")),
        }

        const verif = ver.safeParse({...formData})
        if (!verif.success) {
            return fail(418, { errors: verif.error.flatten().fieldErrors, formData})
        }
        return {errors: "no error", formData}

    }
};