import { env } from "$env/dynamic/private";
import Table from "$lib/table/Table.svelte";
import {  z } from "zod";
import type { Actions, PageServerLoad } from "./$types";
import { schema } from "./schema";
import { fail } from "@sveltejs/kit";



export const load: PageServerLoad = async ({ fetch }) => {
    try {
        // Fetch both endpoints in parallel
        const [kerajaanResponse, jenisKerajaanResponse] = await Promise.all([
            fetch(env.PUB_PORT + "/kerajaan?limit=200", {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            }),
            fetch(env.PUB_PORT + "/kerajaan/jenis?limit=200", {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            })
        ]);
        
        // Check if both requests were successful
        if (!kerajaanResponse.ok || !jenisKerajaanResponse.ok) {
            throw new Error("Failed to fetch data");
        }
        
        // Parse the JSON responses
        const kerajaanData = await kerajaanResponse.json();
        const jenisKerajaanData = await jenisKerajaanResponse.json();
        
        const formatDate = (iso: string) => {
            const date = new Date(iso);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        };

        // Create a map of jenis_kerajaan IDs for quick lookup
        const jenisKerajaanMap = new Map();
        jenisKerajaanData.forEach((jenis: any) => {
            jenisKerajaanMap.set(jenis.id_jenis_kerajaan, jenis);
        });
        
        // Format kerajaan data and add jenis_kerajaan name directly
        const kerajaanFormatted = kerajaanData.map((item: any) => {
            const jenisDetail = jenisKerajaanMap.get(item.jenis_kerajaan);
            
            return {
                ...item,
                tanggal_berdiri: formatDate(item.tanggal_berdiri),
                tanggal_berakhir:
                    item.tanggal_berakhir !== '0001-01-01T00:00:00Z'
                        ? formatDate(item.tanggal_berakhir)
                        : '-',
                jenis_kerajaan_nama: jenisDetail ? jenisDetail.nama_jenis_kerajaan : '-'
            };
        });
        
        return {
            dataKerajaan: kerajaanFormatted,
            jenisKerajaan: jenisKerajaanData
        };
    }
    catch (e) {
        if (e instanceof Error) console.log(e.message);
        return {
            dataKerajaan: "Failed",
            jenisKerajaan: []
        };
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
