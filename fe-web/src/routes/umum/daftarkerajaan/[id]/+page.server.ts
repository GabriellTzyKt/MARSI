import { tempdata } from "$lib/dummy";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
    const id = Number(params.id);
    const detil_kerajaan = tempdata.find((kerajaan) => kerajaan.id === id);

    if (!detil_kerajaan) {
        throw new Error(`Data tidak ditemukan untuk ID: ${id}`);
    }

    return { detil_kerajaan };
};
