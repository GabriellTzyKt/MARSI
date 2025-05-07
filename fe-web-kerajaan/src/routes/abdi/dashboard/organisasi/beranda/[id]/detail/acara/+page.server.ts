import { fail, type Actions } from "@sveltejs/kit";
import { z } from "zod";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({fetch, params}) => {
    try {
        // Get the current organization ID from params
        const currentOrgId = params.id;
        console.log("Current organization ID:", currentOrgId);
        
        // Fetch all organizations
        const organisasiResponse = await fetch(`${env.URL_KERAJAAN}/organisasi`);
        if (!organisasiResponse.ok) {
            throw error(organisasiResponse.status, `Failed to fetch organisasi: ${organisasiResponse.statusText}`);
        }
        
        const organisasiList = await organisasiResponse.json();
        console.log("All organizations:", organisasiList);
        
        // Extract all organization IDs - no filtering, just get all IDs
        const orgIds = organisasiList.map((org: any) => org.id_organisasi).filter(Boolean);
        console.log("All organization IDs:", orgIds);
        
        // Array to store all events from all organizations
        let allEvents: any[] = [];
        
        // Fetch events for each organization ID
        for (const orgId of orgIds) {
            try {
                const acaraResponse = await fetch(`${env.BASE_URL_8008}/acara/organisasi/${orgId}`);
                if (acaraResponse.ok) {
                    const acaraData = await acaraResponse.json();
                    console.log(`Events for organization ${orgId}:`, acaraData);
                    
                    // Add organization info to each event
                    const orgInfo = organisasiList.find((org: any) => org.id_organisasi === orgId);
                    const eventsWithOrgInfo = acaraData.map((event: any) => ({
                        ...event,
                        organisasi_id: orgId,
                        organisasi_nama: orgInfo?.nama_organisasi || 'Unknown Organization'
                    }));
                    
                    // Add events to the array
                    allEvents = [...allEvents, ...eventsWithOrgInfo];
                }
            } catch (acaraError) {
                console.error(`Error fetching events for organization ${orgId}:`, acaraError);
            }
        }
        
        console.log("All events from all organizations:", allEvents);
        
        // Find the current organization
        const currentOrganisasi = organisasiList.find(
            (org: any) => org.id_organisasi === Number(currentOrgId) || org.id_organisasi === currentOrgId
        );
        
        if (!currentOrganisasi) {
            throw error(404, `Organization with ID ${currentOrgId} not found`);
        }
        
        // Filter events for the current organization
        const currentOrgEvents = allEvents.filter(
            (event: any) => event.organisasi_id === Number(currentOrgId) || event.organisasi_id === currentOrgId
        );
        
        console.log("Events for current organization:", currentOrgEvents);

        return {
            organisasi: currentOrganisasi,
            acaraList: currentOrgEvents,
            allEvents: allEvents,
            organisasiList: organisasiList
        };
    } catch (error) {
        console.error("Error in load function:", error);
        throw error;
    }
};
