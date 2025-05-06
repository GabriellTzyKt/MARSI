import { fail, redirect, type Actions } from "@sveltejs/kit";
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
            
            if (res.ok) {
                try {
                    const decode = jwtDecode(data.jwt_token);
                    console.log("Login response data:", data);
                    console.log("Decoded token:", decode);
                    
                    cookies.set("userSession", JSON.stringify({ 
                        username: data.username, 
                        user_data: decode, 
                        token: data.jwt_token 
                    }), {
                        path: "/",
                        maxAge: 60 * 60 * 24,
                        sameSite: "strict"
                    });
                    
                    return { success: true };
                } catch (tokenError) {
                    console.error("Error decoding token:", tokenError);
                    return fail(500, { errors: "Token tidak valid" });
                }
            } else {
                console.error("Login failed:", data);
                return fail(res.status, { 
                    errors: data.message || "Username atau password salah" 
                });
            }
        } catch (error) {
            console.error("Login error:", error);
            return fail(500, { errors: "Terjadi kesalahan pada server" });
        }
    }
};
