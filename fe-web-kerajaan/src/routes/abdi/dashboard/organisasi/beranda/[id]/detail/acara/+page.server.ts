import { fail, type Actions } from "@sveltejs/kit";
import { z } from "zod";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({fetch, params, depends}) => {
    // Add a dependency that can be invalidated
    depends('organisasi:acara');
    
    try {
        // Get the current organization ID from params
        const currentOrgId = params.id;
        console.log("Current organization ID:", currentOrgId);
        
        // Fetch current organization details
        const organisasiResponse = await fetch(`${env.URL_KERAJAAN}/organisasi/${currentOrgId}`, {
            cache: 'no-store'
        });
        
        if (!organisasiResponse.ok) {
            throw error(organisasiResponse.status, `Failed to fetch organisasi: ${organisasiResponse.statusText}`);
        }
        
        const currentOrganisasi = await organisasiResponse.json();
        console.log("Current organization:", currentOrganisasi);
        
        // Directly fetch events for the current organization using the correct API endpoint
        const acaraResponse = await fetch(`${env.URL_KERAJAAN}/acara/organisasi/${currentOrgId}`, {
            cache: 'no-store'
        });
        
        if (!acaraResponse.ok) {
            console.error(`Failed to fetch acara for organization ${currentOrgId}: ${acaraResponse.statusText}`);
            throw error(acaraResponse.status, `Failed to fetch acara: ${acaraResponse.statusText}`);
        }
        
        const acaraData = await acaraResponse.json();
        console.log(`Events for organization ${currentOrgId}:`, acaraData);
        
        // Add organization info to each acara without processing photos
        const processedAcara = acaraData.map((acara : any) => ({
            ...acara,
            organisasi_id: currentOrgId,
            organisasi_nama: currentOrganisasi.nama_organisasi || 'Unknown Organization'
        }));

        // Fetch all organizations for reference (if needed)
        const allOrganisasiResponse = await fetch(`${env.URL_KERAJAAN}/organisasi`, {
            cache: 'no-store'
        });
        
        let organisasiList = [];
        if (allOrganisasiResponse.ok) {
            organisasiList = await allOrganisasiResponse.json();
        }
        
        return {
            organisasi: currentOrganisasi,
            acaraList: processedAcara,
            organisasiList: organisasiList
        };
    } catch (err) {
        console.error("Error in load function:", err);
        throw err;
    }
};
