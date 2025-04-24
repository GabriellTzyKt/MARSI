import { env } from "$env/dynamic/private"
import type { Actions } from "@sveltejs/kit"
import { fail } from "@sveltejs/kit"

export const actions: Actions = {

    hapus: async ({request})=>{
        const data = await request.formData()
        try {
            const del = await fetch(`${env.PUB_PORT}/jenis-arsip/${data.get("id_jenis_arsip")}`,{
                method:"DELETE"
            })
            if (!del.ok) {
                const m = await del.json()
                return fail(406,{error: `Code ${del.status} Message: ${m.message}`})
            }
            return {error: "no error"}
        }
        catch (error) {
            
        }
    },
}