// import { tempsitusdata } from "$lib/dummy";
import { env } from "$env/dynamic/private";
import { detil_situs } from "$lib/dummy";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
    const find = detil_situs;
    
    return { find };
};
