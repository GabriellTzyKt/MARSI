import { env } from "$env/dynamic/private";
import { filterArsip, formatDateTime,formatDate,formatTime } from "$lib";
import type { PageServerLoad } from "../acara/[id]/$types";


export const load: PageServerLoad = async () => {
    try {
        const res = await fetch(`${env.URL_KERAJAAN}/aset`);
        if (!res.ok) {
            throw new Error(`HTTP Error! Status: ${res.status}`);
        }
        const data = await res.json();
        

        const formattedData = data.filter((event : any) => {
                // Keep only items where deleted_at is the default value (not deleted)
                return event.deleted_at === '0001-01-01T00:00:00Z' || !event.deleted_at;
        })
       console.log(formattedData)
        return { data: formattedData };
        
    }
    catch {
        
    }
};