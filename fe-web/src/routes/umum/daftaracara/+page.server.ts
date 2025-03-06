import { detail_acara } from "$lib/dummy";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    const detil_acara = detail_acara

    return { detil_acara };
};
