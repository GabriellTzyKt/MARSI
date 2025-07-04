import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "../$types";
import { z } from "zod";
import { env } from "$env/dynamic/private";


export const load: PageServerLoad = async ({cookies}) => {
    const cook = cookies.get("otpVerified")as string;
    if (!cook) {
        redirect(302, '/forgotPassword')
        
    }
    else {
        return {success: true}
    }
};
export const actions: Actions = {
    changePassword: async ({ request, cookies }) => {
        const data = await request.formData()
        const cook = JSON.parse(cookies.get("otpVerified")as string);        
        const obj = Object.fromEntries(data)
        const check = z.object({
            password: z.string({ message: "Password tidak valid" })
                .nonempty("Field Tidak Boleh Kosong")
                .min(8, "Password minimal 8 karakter")
                .regex(/[A-Z]/, "Password harus memiliki minimal 1 huruf kapital")
                .regex(/[0-9]/, "Password harus memiliki minimal 1 angka")
                .regex(/[^A-Za-z0-9]/, "Password harus memiliki minimal 1 simbol"),
            confirmPassword: z.string({ message: "Konfirmasi password tidak valid" })
                .nonempty("Field Tidak Boleh Kosong")
        }).refine(data => data.password === data.confirmPassword, {
            message: "Password dan konfirmasi password tidak sama",
            path: ["confirmPassword"]
        });
        const verif = check.safeParse(obj)
        if (!verif.success) {
            console.log("Errors:", verif.error.flatten().fieldErrors)
            return fail(418, { errors: verif.error.flatten().fieldErrors, })

          
        }
        try {
            const content = {
                id_user : cook.id_user,
                password: obj.password
            }
            console.log("Data to Send", content)
            const res = await fetch(`${env.PUB_PORT}/edit-password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "*/*"
                },
                body: JSON.stringify(content)
            })
            if (!res.ok) {
                console.log(res)
                return fail(418, { errors: "Terjadi kesalahan pada server"})
            }
            console.log("Success", res)
            const returnData = await res.json()
            console.log(returnData)
            cookies.delete('otpVerified', {path: '/'});     
            return {errors: "no error"}
        }
        catch (errors) {
            return fail(418, { errors: "Terjadi kesalahan pada server"})
        }

    }
}