import { tempasetdata } from "$lib/dummy";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    const detil_aset = tempasetdata

    return { detil_aset };
};
