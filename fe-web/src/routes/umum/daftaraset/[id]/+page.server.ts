import { tempasetdata } from "$lib/dummy";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
    const id = Number(params.id);
    const detil_aset = tempasetdata.find((aset) => aset.id === id);

    if (!detil_aset) {
        throw new Error(`Data tidak ditemukan untuk ID: ${id}`);
    }

    return { detil_aset };
};
