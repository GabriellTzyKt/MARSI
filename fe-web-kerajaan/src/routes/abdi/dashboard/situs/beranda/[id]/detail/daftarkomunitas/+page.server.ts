import { env } from "$env/dynamic/private";
import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";


export const load: PageServerLoad = async ({ params }) => {
  

    // Fetch data for the specific community
    let res = await fetch(`${env.URL_KERAJAAN}/komunitas`);
    let komunitas = await res.json();
    console.log("Komunitas data:", komunitas);
    if (!res.ok) {
        console.error("Failed to fetch komunitas data");
        return {
            komunitas: []
        };
    }
    let komunitasFiltered = komunitas.filter((item: any) => {
        return item.lokasi == params.id && (item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at);
    });
    return {
        komunitas: komunitasFiltered,
        id_situs: params.id
    };
};

export const actions: Actions = {
    
};