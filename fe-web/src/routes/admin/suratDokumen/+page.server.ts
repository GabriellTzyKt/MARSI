import { env } from "$env/dynamic/private";
import type { PageServerLoad } from "./$types";




export const load: PageServerLoad = async () => {
    try {
        // const header = {
        //     method: "GET",
        //     headers: {
        //         "accept": "application/json"
        //     }
        // }
       const request =await fetch(env.PUB_PORT + "/arsip", {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
       })
        
        // console.log(request)
        if (request.ok) {
            const data = await request.json()
            console.log("Ini arsip : ", data)
            return {dataArsip : {data}}
        }
        else return {dataArsip: "Failed"}
        
       
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