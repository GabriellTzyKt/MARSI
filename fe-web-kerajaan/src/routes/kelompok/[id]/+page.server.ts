import { detail_kelompok } from "$lib/dummy";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
    const id = Number(params.id);
    const detil_kelompok = detail_kelompok.find((v) => v.id === id);

    if (!detil_kelompok) {
        throw new Error(`Data tidak ditemukan untuk ID: ${id}`);
    }

    return { detil_kelompok };
};
