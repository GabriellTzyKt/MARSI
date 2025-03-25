import { env } from "$env/dynamic/private";
import Table from "$lib/table/Table.svelte";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    try {
        // const header = {
        //     method: "GET",
        //     headers: {
        //         "accept": "application/json"
        //     }
        // }
        const data = await fetch(`htttp://leap.crossnet.co.id:8888/history-raja/kerajaan/10`, {
            method: "GET",
            headers: {
                accept: "application/json"
            }
        })
        if (!data.ok) {
            throw new Error(`HTTP error! Status: ${data.status}`);
        }
        
        console.log(data)
        // const data = await fetch(env.URL_BASE,{
        //     method: 'GET',
        //     headers: {
        //         'x-rapidapi-key': 'Sign Up for Key',
        //         'x-rapidapi-host': 'covid-19-data.p.rapidapi.com'
        //     }
        // }).then((r)=>r.json())
        // console.log(data)
        // return {tabel: data}
    }
   catch (e){
    if(e instanceof Error) return console.log(e.message)
   }
};