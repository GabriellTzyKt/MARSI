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
        const res = await fetch(`${env.PUB_PORT}/sign-in`, {
            method: "POST",
            headers: {
               "Accept":"*/*"
            },
            body: dataaa
        });
        
            const s = await res.json()
        
        if (res.ok) {
            console.log(s)
            const data = jwtDecode(s.jwt_token)
            
        cookies.set("userSession", JSON.stringify({ nama: s.username, data:data }), {
            path: '/',
            maxAge: 60 * 60 * 60000,
            sameSite: 'strict'
        })
           return {errors:false,success: true}
           
            
        }
       
       
        console.log(locals.token)
        return fail(406,{ errorB:s.message, success: false, username  })
       
       
    }
};