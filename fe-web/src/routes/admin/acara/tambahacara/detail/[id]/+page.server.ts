import type { PageServerLoad } from "./$types";
import { dummyAcara } from "$lib/dummy";

export const load: PageServerLoad = async ({fetch, params}) => {
    console.log(params.id)
    console.log(dummyAcara[Number(params.id)])
    console.log(fetch)
    return {acara : dummyAcara[Number(params.id)]}
};