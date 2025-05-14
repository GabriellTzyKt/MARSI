import { z } from "zod";
import type { Actions, PageServerLoad } from "./$types";
import { fail } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";

export const load: PageServerLoad = async () => {
    
};
let email: string ;
export const actions: Actions = {
    otp: async ({request}) => {
        const data = await request.formData()
        console.log(data)
        const obj = Object.fromEntries(data)
        const check = z.object({
            input: z.string({message: "Input tidak valid atau bukan merupakan email"}).nonempty("Field Tidak Boleh Kosong").email("Email Tidak Valid")
        })
        const verif = check.safeParse(obj)
        if (!verif.success) {
            console.log("Errors:",verif.error.flatten().fieldErrors)
            return fail(418,{errors: verif.error.flatten().fieldErrors, })
        }
        try {
            const content = {
                content : obj.input,
                type : "email"
            }
            const res = await fetch(`${env.PUB_PORT}/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "*/*"
                },
                body: JSON.stringify(content)
            })
            if (!res.ok) {
                return fail(418, { errors: "Terjadi kesalahan pada server"})
            }
            console.log("Success", res)
            const returnData = await res.json()
            console.log(returnData)
            email = obj.input as string;
            return {errors: "no error"}
        }
        catch (errors) {
            return fail(418, { errors: "Terjadi kesalahan pada server"})
        }
    },
    sendOTP: async ({request, cookies}) => {
        const data = await request.formData()
        console.log(data)
        const obj = Object.fromEntries(data)
        console.log(obj)
        const check = z.object({
        input: z.string({message: "Input tidak boleh kosong"})
            .nonempty("Field Tidak Boleh Kosong")
            .regex(/^\d+$/, "OTP harus berupa angka")})            
        const verif = check.safeParse(obj)
        if (!verif.success) {
            console.log("Errors:",verif.error.flatten().fieldErrors)
            return fail(418,{errors: verif.error.flatten().fieldErrors, })
        }
        try {
            const content = {
                content : email,
                type: "email",
                user_input : obj.input
            }
            const res = await fetch(`${env.PUB_PORT}/verify-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "*/*"
                },
                body: JSON.stringify(content)
            })
            if (!res.ok) {
                console.log(res)
                return fail(418, { errors: "Terjadi kesalahan pada server / OTP Tidak Benar"})
            }
            console.log("Success", res)
            const returnData = await res.json()
            console.log(returnData)
              // Set a cookie to indicate OTP verification was successful
            cookies.set('otpVerified', 'true', {
            path: '/',
            maxAge: 60 * 10, // 10 minutes
            httpOnly: true,
            sameSite: 'strict'
            });
            return {errors: "no error"}
        }
        catch (errors) {
            return fail(418, { errors: "Terjadi kesalahan pada server"})
        }
    },


};