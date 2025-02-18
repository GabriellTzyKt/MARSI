import { detail_acara } from "$lib/dummy";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
    const id = Number(params.id);
    const detil_acara = detail_acara.find((acara) => acara.id === id);

    if (!detil_acara) {
        throw new Error(`Data tidak ditemukan untuk ID: ${id}`);
    }

    return { detil_acara };
};
