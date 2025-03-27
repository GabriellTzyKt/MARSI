import { data_flipcard, dummydata } from "$lib/dummy";
import { z } from "zod";

import type { Actions, PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";
import { error, fail } from "@sveltejs/kit";
import { schema } from "./schema";

export const load: PageServerLoad = async ({params}) => {
    try {
        let data;
        const response = await fetch(`${env.PUB_PORT}/kerajaan/detail/${params.id}`)
        if (response.ok) {
            data = await response.json()
            console.log(data)
            return {kerajaan: data}
        }
        return {errors:`Data cant be retrieved : Error code : ${response.status} Message : ${data.message}`}
    }
    catch (e ) {
        console.error("error : "+ e)
    }
   
    
};

