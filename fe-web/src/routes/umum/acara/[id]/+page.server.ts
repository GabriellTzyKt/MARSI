import { tempdata,tempasetdata } from "$lib/dummy";
import type { PageServerLoad } from "./$types";


export const load: PageServerLoad = async ({params}) => {
    const detilacara = tempasetdata[Number(params.id)]

    return {acara:detilacara}
};