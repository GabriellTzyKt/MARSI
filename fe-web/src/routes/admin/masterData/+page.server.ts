import { addAPIProvider } from "@iconify/svelte";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";

export const load: PageServerLoad = async () => {
    try {
        const response = await fetch(`${env.PUB_PORT}/jenis-arsip`)
        if (response.ok) {
            const data = await response.json()
            return {dataArsip: data}
        }
       
        else {
             const data = await response.json()
            return{errors: `Error : ${response.status}, Message: ${data.message}`}
        }
    }
    catch (error) {
        console.log(error)
    }
    // const data_role = await fetch(`${env.PUB_PORT}/role`).then((r) => r.json())
    // if (data_role) {
    //     return {role: data_role}
    // }
};