// import { tempsitusdata } from "$lib/dummy";
import { detil_situs } from "$lib/dummy";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
    const id = Number(params.id);
    const find = detil_situs.find((situs) => situs.id === id);

    if (!find) {
        throw new Error(`Data tidak ditemukan untuk ID: ${id}`);
    }

    return { detil:find };
};
