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
            let data = await response.json();

            const formatDate = (iso: string) => {
                const date = new Date(iso);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                return `${day}-${month}-${year}`;
            };

            const kerajaanFormatted = data.map((item: any) => ({
                ...item,
                tanggal_berdiri: formatDate(item.tanggal_berdiri),
                tanggal_berakhir:
                    item.tanggal_berakhir !== '0001-01-01T00:00:00Z'
                        ? formatDate(item.tanggal_berakhir)
                        : '-',
            }));

            return { kerajaan: kerajaanFormatted };
        }
        return {errors:`Data cant be retrieved : Error code : ${response.status} Message : ${data.message}`}
    }
    catch (e ) {
        console.error("error : "+ e)
    }
   
    
};

