import { env } from "$env/dynamic/private";
import type { PageServerLoad } from "./$types";
import { detail_situs } from "$lib/dummy"

export const load: PageServerLoad = async () => {
    try {
        const data = detail_situs;
        return {
            datasitus : data
        };
        // return { data };
    }
    catch (error) {
        
    }
};