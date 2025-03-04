// import { tempsitusdata } from "$lib/dummy";
import { detil_situs } from "$lib/dummy";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
    const find = detil_situs;

    return { find };
};
