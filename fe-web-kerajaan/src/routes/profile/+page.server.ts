import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";
import { date } from "zod";
import { formatDate, formatDatetoUI } from "$lib";


export const load: PageServerLoad = async ({locals, cookies}) => {
    try {
        const sessionCookie = cookies.get("userSession");
        console.log(sessionCookie)
        if (!sessionCookie) {
            return redirect(302, '/login');
        }
        
        const session = JSON.parse(sessionCookie);
        console.log(sessionCookie)
        if (!session || !session.token) {
            return redirect(302, '/login');
        }
        
        console.log("Session contents:", session.user_data);
        
        const res = await fetch(`${env.PUB_PORT}/user/profile`, {
            headers: {
                "Authorization": `Bearer ${session.token}`
            }
        });
        
        const data = await res.json();
        console.log("Profile",data.profile)
        if (res.ok) {
             const res = await fetch(`${env.PUB_PORT}/doc/${data.profile}`);
            const dataPath = await res.json();
            console.log(dataPath)
             const foto_profile = dataPath.file_dokumentasi 
                ? `${env.PUB_PORT}/file?file_path=${encodeURIComponent(dataPath.file_dokumentasi)}`
                : ''; // ganti dengan path default image kamu
            const resData = {
                ...data,
                foto_profile,
                tanggal_lahir: formatDate(data.tanggal_lahir)
            };
            
            console.log(data);
            return {data: resData};
        }
        
        console.log(data);
        return redirect(302, '/login');
    } catch (error) {
        console.error("Error in profile load function:", error);
        return redirect(302, '/login');
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
