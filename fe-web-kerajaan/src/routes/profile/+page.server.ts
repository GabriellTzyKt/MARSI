import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";
import { date } from "zod";

export const load: PageServerLoad = async ({locals,cookies}) => {
    try {
        const session = JSON.parse(cookies.get("userSession") as string);
        console.log("Session contents:", session.user_data);
        console.log("Session contents:", session.user_data.id_user);
        console.log("Session contents:", session.token);
        if (!session) {
            redirect(302, '/login')
        }
        const res = await fetch(`${env.PUB_PORT}/user/detail`,
            {
                headers: {
                    "Authorization": `Bearer ${session.token}`
                }
            }
        )
        const data = await res.json()
        if (res.ok) {
            console.log(data)
            return {data}
        }
        console.log(data)
    }   
    catch (error) {
        
    }
};

export const actions: Actions = {
    logout: async ({cookies}) => {
        try {
            const session = cookies.get("userSession")
            console.log(session)
            if (!session) {
                return {success: false}
            }
            else {
                const sess = JSON.parse(session as string)
                
                
                cookies.delete("userSession", { path: "/" })
                return {success: true}
            }
           
        }
        catch (error) {
            console.log("Logout Error", error)
            return fail(500, {error: "An error occurred during logout"})
            
        }
    }
};