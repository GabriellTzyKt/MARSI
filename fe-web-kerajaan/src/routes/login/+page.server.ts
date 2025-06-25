import { error, fail, redirect, type Actions } from "@sveltejs/kit";
import { schema } from "./schema";
import { env } from "$env/dynamic/private";
import { jwtDecode } from "jwt-decode";

export const actions: Actions = {
    login: async ({cookies, request}) => {
        const formData = await request.formData();
        const objForm = Object.fromEntries(formData);
        const verification = schema.safeParse(objForm);
        
        if (!verification.success) {
            return fail(406, {errors: verification.error.flatten().fieldErrors});
        }
        
        try {
            const final = new FormData();
            final.append("username", objForm.username);
            final.append("password", objForm.password);
            
            const res = await fetch(`${env.PUB_PORT}/sign-in`, {
                method: "POST",
                headers: {
                    "Accept": "*/*"
                },
                body: final,
            });
            
            const data = await res.json();
            console.log(data)
            let Admin = await fetch(`${env.URL_KERAJAAN}/admin?limit=600`, {
                method: "GET",
               
            });
            if (!Admin.ok) {
                throw error(Admin.status, `Failed to fetch admin: ${Admin.statusText}`);
            }
            let dataAdmin = await Admin.json();
            if (res.ok) {
                try {
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
                        jenis_admin: dataAdminuser?.jenis_admin|| false,
                        status_admin_aktif : dataAdminuser?.status_aktif||0
                    }
                    console.log("Found Admin:", dataAdminuser);
                    cookies.set("userSession", JSON.stringify({ 
                        username: data.username, 
                        user_data: decode, 
                        token: data.jwt_token,
                        id_admin: dataAdminuser?.id_admin ||0,
                        jenis_admin: dataAdminuser?.jenis_admin|| false,
                        status_admin_aktif : dataAdminuser?.status_aktif||0
                    }), {
                        path: "/",
                        maxAge: 60 * 60 * 24,
                        sameSite: "strict"
                    });
                    
                    return { success: true, userCookie  };
                } catch (tokenError) {
                    console.error("Error decoding token:", tokenError);
                    return fail(500, { errors: "Token tidak valid" });
                }
            } else {
                console.error("Login failed:", data);
                return fail(res.status, { 
                    apierror: "Login gagal"
                });
            }
        } catch (error) {
            console.error("Login error:", error);
            return fail(500, { errors: "Terjadi kesalahan pada server" });
        }
    }
};
