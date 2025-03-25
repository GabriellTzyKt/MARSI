import { env } from "$env/dynamic/private";
import Table from "$lib/table/Table.svelte";
import { z } from "zod";
import type { Actions, PageServerLoad } from "./$types";
import { schema } from "./schema";
import { fail } from "@sveltejs/kit";



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
export const actions: Actions = {
    tambahKerajaan: async ({request}) => {
        const data = await request.formData()
        const entry = Object.fromEntries(data)
        console.log(data)
        const verif = schema.safeParse(entry)
        if (!verif.success) {
            console.log(verif.error.flatten().fieldErrors)
            return fail(418, {errors: verif.error.flatten().fieldErrors, success: false, entry})
        }
        return {errors: "No Error", success: true}
 
    },
    ubahKerajaan: async ({request}) => {
        const data = await request.formData().then((v)=> Object.fromEntries(v))
        const verif = schema.safeParse(data)
        if (!verif.success) {
            console.log(verif.error.flatten().fieldErrors)
            return fail(418, {errors: verif.error.flatten().fieldErrors, success: false, data})
        }
        return {errors: "No Error", success: true}
        console.log(data)
    }
};