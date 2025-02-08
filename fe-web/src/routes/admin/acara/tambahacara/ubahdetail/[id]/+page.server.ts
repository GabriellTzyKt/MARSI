import type { PageServerLoad } from "./$types";
import { dummyAcara } from "$lib/dummy";

export const load: PageServerLoad = async ({params}) => {
    const data_acara = dummyAcara[Number(params.id)]
    return {acara : data_acara}
  
};