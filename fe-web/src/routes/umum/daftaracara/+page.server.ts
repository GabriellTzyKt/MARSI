import { env } from "$env/dynamic/private";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    try {
    
        const request = await fetch(env.BASE_URL_8008 + "/acara?limit=200", {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        })

        console.log(request)
        if (request.ok) {
            const data = await request.json()
            console.log("Ini data: ", data)
            
            return { dataKerajaan: data }
        }
        else return { dataKerajaan: "Failed" }

    }
    catch (e) {
        if (e instanceof Error) return console.log(e.message)
    }
};