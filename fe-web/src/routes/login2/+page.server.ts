import { every, local, scaleUtc, timeFormatDefaultLocale } from "d3";

import type { Actions } from "./$types";
import { z } from 'zod';
import { fail } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
import { jwtDecode } from "jwt-decode";

export const actions: Actions = {
    register: async ({ cookies, request, locals }) => {
        
        const User = z.object({
            username: z.string().nonempty("Field username Tidak Boleh Kosong")
            ,
            // notelp: z.string()
            //     .min(5, { message: "Notelp Minimal 5 digit" })
            //     .max(15, { message: "Notelp Maximal 15 digit" })
            //     .nullable(),
            // email: z.string()
            //     .max(255, { message: "Email Melebihi Batas" })
            //     .email({ message: "Email tidak valid" })
            //     .nullable(),
            pass: z.string({ message: "password bukan string" })
                .min(8, { message: "Password minimal 8 huruf" })
                .max(255, { message: "Password sudah maximal!" })
                .nonempty({ message: "Password tidak boleh kosong" })
                .regex(/[A-Z]/, { message: "Password Harus ada minimal 1 huruf Kapital" })
                .regex(/[0-9]/, { message: "Password Harus ada minimal 1 angka" })
                .regex(/[^A-Za-z0-9]/,{message: "Password harus ada simbol"})
        })

        const data = await request.formData()
        const username = data.get('username')
        const validation = User.safeParse({
            username: data.get("username")||"",
            pass: data.get("pass")||""
        })
        console.log(validation.data)
        
        if (!validation.success) {
            console.log(validation.error.flatten().fieldErrors)
            return fail(406,{ errors: validation.error.flatten().fieldErrors, success: false, username  })
        }
        const dataaa = new FormData()
        dataaa.append("username",data.get("username") as string)
        dataaa.append("password", data.get("pass") as string)
        const r = {
            username: data.get("username"),
            password: data.get("pass")
        }
        // First, make the API call to sign in
        const res = await fetch(`${env.PUB_PORT}/sign-in`, {
            method: "POST",
            headers: {
               "Accept":"*/*"
            },
            body: dataaa
        });

        const s = await res.json()

        if (res.ok) {
            console.log("Login successful, response:", s);
            const data: any = jwtDecode(s.jwt_token);
            
            // Extract id_user from the decoded JWT data
            const id_user = data.id_user;
            console.log("Decoded JWT, id_user:", id_user);
            
            // Check if this user is an admin by fetching admin data
            let adminResponse = await fetch(`${env.BASE_URL}/admin?limit=200`, {
                method: "GET",
                headers: { "Accept": "application/json" }
            });
            
            let isAdmin = false;
            let adminType = null;
            let adminData = null;
            let id_kerajaan = 0;
            
            if (adminResponse.ok) {
                const admins = await adminResponse.json();
                console.log("Admin data fetched, total admins:", admins.length);
                
                // Find admin with matching id_user
                adminData = admins.find((admin: any) => admin.id_user === id_user);
                console.log("Admin data for current user:", adminData);
                
                if (adminData) {
                    // Check if admin account is active
                    if (adminData.status_aktif === 0) {
                        console.log(`Admin account is inactive (status_aktif = 0)`);
                        // Return specific error for inactive account
                        return fail(403, { 
                            errorB: "Akun tidak aktif. Silahkan hubungi administrator.", 
                            success: false, 
                            username: data.get("username"),
                            inactive: true
                        });
                    } else {
                        isAdmin = true;
                        adminType = adminData.jenis_admin;
                        id_kerajaan = adminData.id_kerajaan || 0;
                        console.log(`User is an admin of type: ${adminType}, id_kerajaan: ${id_kerajaan}`);
                    }
                } else {
                    console.log("No admin data found for this user");
                }
            } else {
                console.error("Failed to fetch admin data:", adminResponse.status);
            }
            
            // Set cookie with all the necessary information
            cookies.set("userSession", JSON.stringify({ 
                nama: s.username, 
                data: data, 
                token: s.jwt_token,
                id_user: id_user,
                isAdmin: isAdmin,
                adminType: adminType,
                adminData: adminData,
                id_kerajaan
            }), {
                path: '/',
                maxAge: 60 * 60 * 60000,
                sameSite: 'strict'
            });
            
            console.log("Cookie set with adminType:", adminType);
            
            // Return success response with admin information including id_kerajaan
            return {
                errors: false, 
                success: true, 
                id_user: id_user,
                isAdmin: isAdmin,
                adminType: adminType,
                id_kerajaan: id_kerajaan
            };
        }
       
       
        console.log(locals.token)
        return fail(406,{ errorB:s.message, success: false, username  })
       
       
    }
};
