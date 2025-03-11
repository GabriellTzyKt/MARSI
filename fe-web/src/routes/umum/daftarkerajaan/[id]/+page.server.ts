import { tempdata } from "$lib/dummy";
import { data_flipcard2 } from "$lib/dummy";
import { data_showraja } from "$lib/dummy";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
    const id = Number(params.id);
    const detil_kerajaan = tempdata.find((kerajaan) => kerajaan.id === id);
    const detil_flip =  data_flipcard2
    const show_raja = data_showraja

    if (!detil_kerajaan) {
        throw new Error(`Data tidak ditemukan untuk ID: ${id}`);
    }

    return { detil_kerajaan, detil_flip, show_raja };
};
