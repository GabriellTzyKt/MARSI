import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";

export const load: PageServerLoad = async ({ }) => {
    try {
        const komunitasResponse = await fetch(`${env.URL_KERAJAAN}/komunitas`);
        if (!komunitasResponse.ok) {
            throw error(komunitasResponse.status, `Failed to fetch komunitas: ${komunitasResponse.statusText}`);
        }
        
        const komunitasList = await komunitasResponse.json();
        console.log("komunitas : ", komunitasList);

        const filteredList = komunitasList.filter((doc: any) => {
            return doc.deleted_at == '0001-01-01T00:00:00Z' && doc.deleted_at !== null;
        });

        console.log("filtered: ", filteredList)

        return {
            filteredList
        };
    } catch (error) {
        console.error("Error in load function:", error);
        throw error;
    }
};
