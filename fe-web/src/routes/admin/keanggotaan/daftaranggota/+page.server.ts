import { env } from "$env/dynamic/private";
import Table from "$lib/table/Table.svelte";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    try {
        const data = await fetch(env.BASE_URL + "/kerajaan", {
            method: "GET"
        }).then((r)=> r.json())
        console.log("data kerajaan : ", data)
    }
   catch (e){
    if(e instanceof Error) return console.log(e.message)
   }
};