import { error, fail, type Actions } from "@sveltejs/kit";
import { string, z } from "zod";
import { schema } from "./schema";
import { env } from "$env/dynamic/private";


export const actions: Actions = {
    tambah: async ({ request }) => {
        const data = await request.formData()
        const res = Object.fromEntries(data)
        console.log(res)
        const verif = schema.safeParse(res)
        
        if (!verif.success) {
           
            return fail(418, { errors: verif.error.flatten().fieldErrors, success: false, form: res })
        }
        try {
            const formdata = new FormData()
            formdata.append("nama_kerajaan",res.nama_kerajaan)
            formdata.append("raja_sekarang",res.raja_sekarang)
            formdata.append("jenis_kerajaan",res.jenis_kerajaan)
            formdata.append("deskripsi_kerajaan",res.deskripsi_kerajaan)
            formdata.append("alamat_kerajaan",res.alamat_kerajaan)
            formdata.append("era",res.era_kerajaan)
            formdata.append("rumpun",res.rumpun_kerajaan)
            const send = await fetch(`${env.PUB_PORT}/kerajaan`, {
                method: "POST",
                body: formdata
            })
            const r = await send.json()
            console.log(r)
            if (send.ok) {
                return { errors: "no Error", success: true, form: res }
            }
            return fail(400,{request:`Error Code : ${send.status} ${r.message}`})
        }
        catch (e) {
            console.error("Fetch Error", e)
        }
    }
       
}