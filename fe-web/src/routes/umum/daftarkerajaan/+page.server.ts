import { tempdata } from "$lib/dummy";
import { env } from "$env/dynamic/private"
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({fetch}) => {
    const detil_kerajaan = tempdata

    // try {
    //     const res = await fetch(env.BASE_URL + "/kerajaan");
    //     if (!res.ok) {
    //         throw new Error(`HTTP Error! Status: ${res.status}`);
    //     }
    //     const detil_kerajaan = await res.json();
    //     console.log(detil_kerajaan)

    //     return { detil_kerajaan };
    // } catch (error) {
    //     console.error("Error fetching data:", error);
    //     return { detil_kerajaan: [] }; 
    // }

    return { detil_kerajaan};
};
