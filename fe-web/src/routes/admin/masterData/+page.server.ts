import { addAPIProvider } from "@iconify/svelte";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";
import { fail, type Actions } from "@sveltejs/kit";
import { z } from "zod";

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


export const actions: Actions = {
    tambah: async ({ request }) => {
        const data = await request.formData();

        let form: any = {
            namagelar: "",
        }

        const ver = z.object({
            namagelar: z.string().trim().min(1, "Isi Gelar!"),
        });

        form = {
            namagelar: data.get("namagelar") ?? "",
        };


        console.log(form)

        const validation = ver.safeParse({ ...form });

        if (!validation.success) {
            const fieldErrors = validation.error.flatten().fieldErrors;

            console.log("errors : " , fieldErrors)
            
            return fail(406, {
                errors: fieldErrors,
                success: false,
                formData: form,
                type: "add"
            });
        }

        return { errors: "Success", success: true, formData: form, type: "add" };
    }
};