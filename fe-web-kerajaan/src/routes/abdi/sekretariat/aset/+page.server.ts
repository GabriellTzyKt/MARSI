import { env } from "$env/dynamic/private";
import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { filterArsip } from "$lib";

export const load: PageServerLoad = async () => {
    try {
        const res = await fetch(`${env.URL_KERAJAAN}/aset`);
       
        if (!res.ok) {
            throw new Error(`HTTP Error! Status: ${res.status}`);
        }
     
    
        const data = await res.json();

        const filter = filterArsip(data)
        console.log(filter)

        return { data };
    }
    catch (error) {
        
    }
};
export const actions: Actions = {
    
};