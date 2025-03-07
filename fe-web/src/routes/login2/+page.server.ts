import { every, scaleUtc } from "d3";

import type { Actions } from "./$types";
import { z } from 'zod';
import { redirect } from "@sveltejs/kit";

export const actions: Actions = {
    register: async ({ cookies, request }) => {
        const User = z.object({
            notelporEmail: z.string()
                .min(5, { message: "Minimal 5 karakter" })
                .max(255, { message: "Maksimal 255 karakter" })
                .refine(val => {
                    const email = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val)
                    const notelp = /^[0-9]{5,15}$/.test(val)
                    return email||notelp
                },{message: "Harus berupa email atau nomor telepon yang valid"})
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
                .regex(/[0-9]/, { message: "Password Harus ada miniam 1 angka" })
                .regex(/[^A-Za-z0-9]/,{message: "Password harus ada simbol"})
        })

        const data = await request.formData()
        const validation = User.safeParse({
            notelporEmail: data.get("emailno"),
            pass: data.get("pass")
        })
        if (!validation.success) {
            return { errors: validation.error.flatten().fieldErrors, success: false  }
        }
        return {errors: false ,success: true}
        console.log(data)
    }
};