import { env } from "$env/dynamic/private";
import { formatDate, formatDatetoUI } from "$lib";
import pLimit from "p-limit";
import type { Actions, PageServerLoad } from "./$types";


export const load: PageServerLoad = async () => {
    try {
        let limit = pLimit(5)
        // Fetch komunitas data
        const res = await fetch(`${env.URL_KERAJAAN}/komunitas`);
        if (!res.ok) {
            throw new Error(`HTTP Error! Status: ${res.status}`);
        }
        const data = await res.json();
        console.log("Raw komunitas data:", data);
        
        // Process each komunitas item with user details
        const processedData = await Promise.all(data.map(async (item) => {
            // Format date
            const formattedItem = {
                ...item,
                tanggal_berdiri: formatDatetoUI(item.tanggal_berdiri)
            };
            
            console.log(`Processing komunitas: ${item.nama_komunitas}`);
            console.log(`- penanggung_jawab: ${item.penanggung_jawab}`);
            console.log(`- pembina: ${item.pembina}`);
            console.log(`- pelindung: ${item.pelindung}`);
            
            // Process user IDs for each role
            const roles = {
                penanggung_jawab: item.penanggung_jawab ? [item.penanggung_jawab] : [],
                pembina: item.pembina ? item.pembina.split(',').filter(id => id && id !== "") : [],
                pelindung: item.pelindung ? item.pelindung.split(',').filter(id => id && id !== "") : []
            };
            
            // Create a unique set of all user IDs to fetch
            const allUserIds = new Set([
                ...roles.penanggung_jawab,
                ...roles.pembina,
                ...roles.pelindung
            ]);
            
            console.log(`Unique user IDs to fetch:`, Array.from(allUserIds));
            
            // Fetch all unique user details in parallel using port 8888
            const userDetailsMap = new Map();
            
                if (allUserIds.size > 0) {
                const userResults = await Promise.all(
                    Array.from(allUserIds).map(id =>
                        limit(async () => {
                            if (!id || id === "" || isNaN(Number(id))) return { id, userData: null };
                            try {
                                console.log(`Fetching user ${id}...`);
                                const userRes = await fetch(`${env.PUB_PORT}/user/${id}`);
                                if (userRes.ok) {
                                    const userData = await userRes.json();
                                     console.log(`Found User ${id} : ${userData.nama_lengkap}...`);
                                    return { id, userData };
                                }
                                return { id, userData: null };
                            } catch (error) {
                                console.error(`Error fetching user ${id}:`, error);
                                return { id, userData: null };
                            }
                        })
                    )
                );
                userResults.forEach(({ id, userData }) => {
                    if (userData) userDetailsMap.set(id, userData);
                });
            }
            
            // Get user names directly - extract nama_lengkap
            const penanggungJawabId = roles.penanggung_jawab.length > 0 ? roles.penanggung_jawab[0] : null;
            let penanggungJawabName = "-";
            
            if (penanggungJawabId && userDetailsMap.has(penanggungJawabId)) {
                const userData = userDetailsMap.get(penanggungJawabId);
                // Extract nama_lengkap
                penanggungJawabName = userData.nama_lengkap || `User ${penanggungJawabId}`;
                console.log(`Penanggung jawab (${penanggungJawabId}) name:`, penanggungJawabName);
            } else {
                console.log(`No data found for penanggung jawab ID: ${penanggungJawabId}`);
                // If it's not a number, it might already be a name
                if (penanggungJawabId && isNaN(Number(penanggungJawabId))) {
                    penanggungJawabName = penanggungJawabId;
                }
            }
                
            const pembinaNames = roles.pembina
                .map(id => {
                    if (userDetailsMap.has(id)) {
                        const userData = userDetailsMap.get(id);
                        return userData.nama_lengkap || `User ${id}`;
                    }
                    // If it's not a number, it might already be a name
                    return isNaN(Number(id)) ? id : `User ${id}`;
                })
                .join(", ") || "-";
                
            const pelindungNames = roles.pelindung
                .map(id => {
                    if (userDetailsMap.has(id)) {
                        const userData = userDetailsMap.get(id);
                        return userData.nama_lengkap || `User ${id}`;
                    }
                    // If it's not a number, it might already be a name
                    return isNaN(Number(id)) ? id : `User ${id}`;
                })
                .join(", ") || "-";
            
            // Add user names directly to the item
            return {
                ...formattedItem,
                penanggung_jawab_nama: penanggungJawabName,
                pembina_nama: pembinaNames,
                pelindung_nama: pelindungNames
            };
        }));
        
        console.log("Processed data:", processedData);
        return { data: processedData };
    }
    catch (error) {
        console.error("Error in load function:", error);
        return { data: [], error: error instanceof Error ? error.message : "Unknown error" };
    }
};
export const actions: Actions = {
    
};
