import { tempdata } from "$lib/dummy";
import { env } from "$env/dynamic/private"
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({fetch}) => {
    const detil_situs = tempdata

    try {
        const res = await fetch(env.BASE_URL_8008 + "/situs?limit=200");
        if (!res.ok) {
            throw new Error(`HTTP Error! Status: ${res.status}`);
        }
        const detil_situs = await res.json();
        console.log(detil_situs)

        return { detil_situs };
    } catch (error) {
        console.error("Error fetching data:", error);
        return { detil_situs: [] }; 
    }

    return { detil_situs: detil_situs};
};
