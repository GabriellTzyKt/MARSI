import { env } from "$env/dynamic/private";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async ({ cookies }) => {
    try {
        // Fetch all situs
        console.log("Fetching all situs from:", `${env.URL_KERAJAAN}/situs`);
        const situsResponse = await fetch(`${env.URL_KERAJAAN}/situs`);
        if (!situsResponse.ok) {
            throw error(situsResponse.status, `Failed to fetch Situs: ${situsResponse.statusText}`);
        }
        
        const allSitusData = await situsResponse.json();
        console.log(`Retrieved ${allSitusData.length} situs records`);
        
        // Extract all unique location IDs
        const locationIds = [...new Set(
            allSitusData
                .filter((situs : any) => situs.id_lokasi && situs.deleted_at === '0001-01-01T00:00:00Z')
                .map((situs : any) => situs.id_lokasi)
        )];
        
        console.log(`Found ${locationIds.length} unique location IDs:`, locationIds);
        
        // Fetch events for each location ID
        const allEvents = [];
        
        for (const locationId of locationIds) {
            try {
                console.log(`Fetching events for location ID ${locationId}`);
                const eventsResponse = await fetch(`${env.URL_KERAJAAN}/acara/situs/${locationId}`);
                
                if (eventsResponse.ok) {
                    const events = await eventsResponse.json();
                    console.log(`Found ${events.length} events for location ${locationId}`);
                    
                    // Find the situs info for this location
                    const situsInfo = allSitusData.find((s : any) => s.id_lokasi === locationId);
                    
                    // Add situs info to each event
                    const eventsWithSitusInfo = events.map((event : any) => ({
                        ...event,
                        situs_nama: situsInfo?.nama_situs || 'Unknown',
                        situs_alamat: situsInfo?.alamat || 'Unknown Location'
                    }));
                    
                    // Add to our collection
                    allEvents.push(...eventsWithSitusInfo);
                } else {
                    console.error(`Failed to fetch events for location ${locationId}: ${eventsResponse.status}`);
                }
            } catch (eventError) {
                console.error(`Error fetching events for location ${locationId}:`, eventError);
            }
        }
        
        console.log(`Total events found across all locations: ${allEvents.length}`);
        
        // Fetch all users to get names for penanggung_jawab
        console.log("Fetching all users");
        const usersResponse = await fetch(`${env.BASE_URL}/users`);
        let allUsers = [];
        
        if (usersResponse.ok) {
            allUsers = await usersResponse.json();
            console.log(`Retrieved ${allUsers.length} users`);
        } else {
            console.error(`Failed to fetch users: ${usersResponse.status}`);
        }
        
        // Create a map of user IDs to user details for quick lookup
        const userMap = new Map();
        allUsers.forEach((user : any) => {
            userMap.set(user.id_user, user);
        });
        
        // Add penanggung_jawab names to events
        const eventsWithUserInfo = allEvents.map((event : any) => {
            let penanggungJawabName = 'Unknown';
            
            if (event.id_penanggung_jawab && userMap.has(event.id_penanggung_jawab)) {
                const userData = userMap.get(event.id_penanggung_jawab);
                penanggungJawabName = userData.nama_lengkap || userData.nama || `User ${event.id_penanggung_jawab}`;
            }
            
            return {
                ...event,
                penanggung_jawab_nama: penanggungJawabName
            };
        });
        
        // Sort events by date (newest first)
        eventsWithUserInfo.sort((a, b) => {
            const dateA : any = new Date(a.tanggal_mulai || a.created_at || 0);
            const dateB : any = new Date(b.tanggal_mulai || b.created_at || 0);
            return dateB - dateA;
        });
        
        return {
            events: eventsWithUserInfo,
            locationIds: locationIds,
            situsCount: allSitusData.length
        };
    } catch (err) {
        console.error("Error in load function:", err);
        throw error(500, "Failed to load situs and events data");
    }
}
