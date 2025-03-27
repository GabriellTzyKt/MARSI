import { addAPIProvider } from "@iconify/svelte";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";
import { error, fail, type Actions } from "@sveltejs/kit";
import { z } from "zod";
import { invalidate, invalidateAll } from "$app/navigation";
import { filter } from "d3";

export const load: PageServerLoad = async () => {
    try {
        const response = await fetch(`${env.PUB_PORT}/jenis-arsip`)
        if (response.ok) {
            let data = await response.json()
            data = data.filter(item => item.deleted_at === "0001-01-01T00:00:00Z")
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
        const res = data.getAll("nama_jenis")
        const ver = 
        // Schema untuk array tanpa string kosong
        z.array(z.string()).transform(arr => arr.filter(str => str !== ''))
        
        
        const form = {
            nama_jenis: {},
        };
        const validation = ver.parse(res);
          
        console.log(validation)
        try {
                if (validation.length === 0) {
                return fail(406, { errors: "No Data" });
            }
             for (const nama of validation) {
                const payload = { nama_jenis: nama };

                const submit = await fetch(`${env.PUB_PORT}/jenis-arsip`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" }, // Tambahkan header
                    body: JSON.stringify(payload),
                });

                if (!submit.ok) {
                    const m = await submit.json();
                    return fail(406, { errors: `Error ${submit.status}: ${m.message}` });
                 }
                 invalidateAll()
            }
        }
        
        catch (error) {
            
        }
      

        return { errors: "Success", success: true, formData: form, type: "add" };
    },
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
    ubah: async ({request}) => {
        try {
            const req = await request.formData()
            const data = Object.fromEntries(req)
            const ver = z.object({
                nama_jenis: z.string().nonempty("Field Ini Tidak Boleh Kosong")
            });
            const verification = ver.safeParse(data)
            if (!verification.success) {
                return fail(406,{error: verification.error.flatten().fieldErrors})
            }
            const edit = await fetch(`${env.PUB_PORT}/jenis-arsip`, {
                method: "PUT",
                body : JSON.stringify(data)
            })
            if (!edit.ok) {
                const m = await edit.json()
                 return fail(406,{error: `Error ${edit.status} Message : ${m.message}`})
            }
            return {error: "No Error"}
        }
        catch (error) {
            console.log(error)
        }
    }
};