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
        
        // Fetch current komunitas details
        const komunitasResponse = await fetch(`${env.URL_KERAJAAN}/komunitas/${currentKomId}`, {
            cache: 'no-store'
        });
        
        if (!komunitasResponse.ok) {
            throw error(komunitasResponse.status, `Failed to fetch komunitas: ${komunitasResponse.statusText}`);
        }
        
        const currentKomunitas = await komunitasResponse.json();
        console.log("Current komunitas:", currentKomunitas);
        
        // Directly fetch events for the current komunitas using the correct API endpoint
        const acaraResponse = await fetch(`${env.URL_KERAJAAN}/acara/komunitas/${currentKomId}`, {
            cache: 'no-store'
        });
        
        if (!acaraResponse.ok) {
            console.error(`Failed to fetch acara for komunitas ${currentKomId}: ${acaraResponse.statusText}`);
            throw error(acaraResponse.status, `Failed to fetch acara: ${acaraResponse.statusText}`);
        }
        
        const acaraNestedData = await acaraResponse.json();
        console.log(`Raw events for komunitas ${currentKomId}:`, acaraNestedData);
        
        // Extract and process the acara data from the nested structure
        const processedAcara = acaraNestedData.map(item => {
            // Check if the item has an Acara property (nested structure)
            if (item.Acara) {
                return {
                    ...item.Acara,
                    // id_komunitas: item.id_komunitas,
                    // komunitas_nama: currentKomunitas.nama_komunitas || 'Unknown Komunitas'
                };
            } else {
                // Fallback for items that might not have the nested structure
                return {
                    ...item,
                    // id_komunitas: currentKomId,
                    // komunitas_nama: currentKomunitas.nama_komunitas || 'Unknown Komunitas'
                };
            }
        });
        
        console.log("Processed acara data:", processedAcara);

        // Fetch all komunitas for reference (if needed)
        const allKomunitasResponse = await fetch(`${env.URL_KERAJAAN}/komunitas`, {
            cache: 'no-store'
        });
        
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
