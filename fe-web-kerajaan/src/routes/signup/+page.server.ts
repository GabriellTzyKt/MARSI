import { error, fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";
import { schema } from "./schema";
// import { jwtDecode } from "jwt-decode";
import { events } from "$lib/dummy";
import { jwtDecode } from "jwt-decode";
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
            nama_ayah: "",
            nama_ibu: '',
            keturunan: "",
            // nama_ayah: "",
            // nama_ibu: "",
            // panggilan: "",
            username: validation.data.username,
            password: validation.data.password,
            email: validation.data.email,
            no_telp: validation.data.no_hp,
            pekerjaan: "",
            agama: "",

            jenis_kelamin: validation.data.jenis_kelamin,
            hobi:''
            
          
            // pekerjaan: '',
            // agama:"",
            // jenis_kelamin: validation.data.jenis_kelamin,
            // hobi:''
        }
        console.log("Data send",send)
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
               let Admin = await fetch(`${env.URL_KERAJAAN}/admin?limit=600`, {
                               method: "GET",
                              
                           });
                           if (!Admin.ok) {
                               throw error(Admin.status, `Failed to fetch admin: ${Admin.statusText}`);
                           }
                           let dataAdmin = await Admin.json();
                if (res.ok) {
                               
                    const decode = jwtDecode(data.jwt_token);
                    console.log("Login response data:", data);
                    console.log("Decoded token:", decode);
                    let dataAdminuser = dataAdmin.filter((item) => item.deleted_at === "0001-01-01T00:00:00Z" || !item.deleted_at || item.deleted_at === null).find((item) => item.id_user === decode?.id_user)
                    // if(!dataAdminuser){
                    //     return fail(400,{user_error: "User tidak ditemukan / Dihapus"})
                    // }
                    let userCookie = {
                        username: data.username,
                        user_data: decode,
                        token: data.jwt_token,
                        id_admin: dataAdminuser?.id_admin,
                        jenis_admin: dataAdminuser?.jenis_admin || false,
                        status_admin_aktif: dataAdminuser?.status_aktif || 0
                    }
                    console.log("Found Admin:", dataAdminuser);
                    cookies.set("userSession", JSON.stringify({
                        username: data.username,
                        user_data: decode,
                        token: data.jwt_token,
                        id_admin: dataAdminuser?.id_admin || 0,
                        jenis_admin: dataAdminuser?.jenis_admin || false,
                        status_admin_aktif: dataAdminuser?.status_aktif || 0
                    }), {
                        path: "/",
                        maxAge: 60 * 60 * 24,
                        sameSite: "strict"
                    })
                }
                                   
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