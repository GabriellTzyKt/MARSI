import { fail, type Actions } from "@sveltejs/kit";
import { schema } from "./schema";
import { env } from "$env/dynamic/private";

export const actions: Actions = {
    login: async ({cookies, request}) => {
        const formData = await request.formData()
        const objForm = Object.fromEntries(formData)
        const verification = schema.safeParse(objForm)
        if (!verification.success) {
            return fail(406,{errors: verification.error.flatten().fieldErrors})
        }
        try {
            const final = new FormData()
            final.append("username", objForm.username)
            final.append("password", objForm.password)
            const res = await fetch(`${env.PUB_PORT}/sign-in`, {
                method: "POST",
                headers: {
                    "Accept": "*/*"
                },
                body: final,

            })
            if (res.ok) {
                const data = await res.json()
                console.log(data)
                cookies.set("userSession", JSON.stringify({ username: data.username, user_data: data.data, token:data.jwt_token }), {
                    path: "/",
                    maxAge: 60 * 60 * 24,
                    sameSite: "strict"
                })
                return {success: true}
            }
            return fail(406,{errors: "Username atau password salah"})
        }
        catch (error) {
          // Only log and rethrow if it's not a redirect
            if (error instanceof Response && error.status === 303) {
                throw error;
            }
            console.log(error?.message)
            return fail(500, {errors: "Terjadi kesalahan pada server"})
        }

    }
};