import { accounts } from "$lib/dummy";
import type { PageServerLoad } from "./$types";


export const load: PageServerLoad = async ({params}) => {
    return {akun: accounts[0]}
};