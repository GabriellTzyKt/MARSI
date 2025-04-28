import { env } from "$env/dynamic/private";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    try {
        const res = await fetch(`${env.URL_KERAJAAN}/komunitas`);
        if (!res.ok) {
            throw new Error(`HTTP Error! Status: ${res.status}`);
        }
        const data = await res.json();
        console.log(data)

        return { data };
    }
    catch (error) {
        
    }
};
export const actions: Actions = {
    
};