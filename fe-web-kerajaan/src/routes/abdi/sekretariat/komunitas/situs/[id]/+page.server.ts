import { detail_situs } from "$lib/dummy";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
    const id = Number(params.id);
    const detil_situs = detail_situs.find((situs) => situs.id === id);

    if (!detil_situs) {
        throw new Error(`Data tidak ditemukan untuk ID: ${id}`);
    }

    return { detil_situs };
};
