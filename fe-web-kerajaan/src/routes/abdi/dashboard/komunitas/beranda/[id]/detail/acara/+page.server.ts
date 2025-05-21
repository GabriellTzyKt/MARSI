import { fail, type Actions } from "@sveltejs/kit";
import { z } from "zod";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({fetch, params, depends}) => {
    // Add a dependency that can be invalidated
    depends('komunitas:acara');
    
    try {
        // Get the current komunitas ID from params
        const currentKomId = params.id;
        console.log("Current komunitas ID:", currentKomId);
        
        // Fetch all data in parallel using Promise.all
        const [komunitasResponse, acaraResponse, allKomunitasResponse] = await Promise.all([
            fetch(`${env.URL_KERAJAAN}/komunitas/${currentKomId}`, { cache: 'no-store' }),
            fetch(`${env.URL_KERAJAAN}/acara/komunitas/${currentKomId}`, { cache: 'no-store' }),
            fetch(`${env.URL_KERAJAAN}/komunitas`, { cache: 'no-store' })
        ]);
        
        // Handle komunitas response
        if (!komunitasResponse.ok) {
            throw error(komunitasResponse.status, `Failed to fetch komunitas: ${komunitasResponse.statusText}`);
        }
        const currentKomunitas = await komunitasResponse.json();
        
        // Handle acara response
        if (!acaraResponse.ok) {
            throw error(acaraResponse.status, `Failed to fetch acara: ${acaraResponse.statusText}`);
        }
        const acaraNestedData = await acaraResponse.json();
        
        // Process acara data - extract from nested structure
        const processedAcara = acaraNestedData.map(item => {
            if (item.Acara) {
                return {
                    ...item.Acara,
                    id_komunitas: item.id_komunitas,
                    komunitas_nama: currentKomunitas.nama_komunitas || 'Unknown Komunitas'
                };
            } else {
                return {
                    ...item,
                    id_komunitas: currentKomId,
                    komunitas_nama: currentKomunitas.nama_komunitas || 'Unknown Komunitas'
                };
            }
        });
        
        // Handle all komunitas response
        let komunitasList = [];
        if (allKomunitasResponse.ok) {
            komunitasList = await allKomunitasResponse.json();
        }

        return {
            komunitas: currentKomunitas,
            allAcara: processedAcara,
            komunitasList: komunitasList
        };
    } catch (err) {
        console.error("Error in load function:", err);
        throw err;
    }
};
