import { dummydata } from "$lib/dummy";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({params}) => {
    const detil_anggota = dummydata[Number(params.id)]
    return {detil_anggota}
};