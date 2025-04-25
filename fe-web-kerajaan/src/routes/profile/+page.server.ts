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
            const formatDate = (isoString) => {
                if (!isoString || isoString === '0001-01-01T00:00:00Z') return '-';
                const date = new Date(isoString);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${year}-${month}-${day}`;
            };
            const resData = {
                ...data,
                tanggal_lahir: formatDate(data.tanggal_lahir)
            }
            console.log(data)
            return {data: resData}
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