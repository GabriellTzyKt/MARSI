import { fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";
import { schema } from "./schema";
import { jwtDecode } from "jwt-decode";
import { events } from "$lib/dummy";
export const load: PageServerLoad = async () => {
    try {
        
    }
    catch {
        
    }
};

export const actions: Actions = {
    signin: async ({ request, locals, cookies }) => {
        let data
        let token
        const dt = await request.formData()
        console.log(dt)
        let formdata = Object.fromEntries(dt)

        let validation = schema.safeParse(formdata)
        if (!validation.success) {
            console.log(validation.error.flatten().fieldErrors)
            return fail(406,{errors: validation.error.flatten().fieldErrors})
        }
        console.log(validation.data)
        const send = {
            nama_lengkap: validation.data.nama_lengkap,
            alamat: validation.data.alamat,
            tempat_lahir: validation.data.tempat_lahir,
            tanggal_lahir: validation.data.tanggal_lahir,
            // nama_ayah: "",
            // nama_ibu: "",
            // panggilan: "",
            username: validation.data.username,
            password: validation.data.password,
            email: validation.data.email,
            nomor_telepon: validation.data.no_hp,
            // pekerjaan: '',
            // agama:"",
            jenis_kelamin: validation.data.jenis_kelamin,
            // hobi:''
        }
        try {
            console.log("Sending to:", `${env.PUB_PORT}/sign-up`);
            const res = await fetch(`${env.PUB_PORT}/sign-up`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "*/*"
                },
                body: JSON.stringify(send)
            })  
            data = await res.json()
            console.log(res)
            console.log(data)
            if (data === null) {
                return fail(406,{resError: `Error:Username sudah diambil`})
            }
            if (res.ok) {
                if (data === null) {
                    return fail(406,{resError: `Error:Username sudah diambil`})
                }
                token = jwtDecode(data.jwt_token) 
                console.log(token)
                cookies.set("userSession", JSON.stringify({ username: data.username, user_data: token }), {
                    path: "/",
                    maxAge: 60 * 60 * 60,
                    sameSite: "strict"
                })
               
                return{ success: true, data}
            } else {
                
                return fail(406,{resError: `Error:${data.message}`})
            }
            
        }
        catch(error) {
            console.log(error)
            
            return fail(406,{resError: `Network error or invalid URL`})
        }
    }
};