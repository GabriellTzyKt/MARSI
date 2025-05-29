import { env } from "$env/dynamic/private";
import { formatDate, formatDatetoUI } from "$lib";
import pLimit from "p-limit";
import type { Actions, PageServerLoad } from "./$types";
import { fail } from "@sveltejs/kit";


export const load: PageServerLoad = async () => {
    try {
        let limit = pLimit(5)
        // Fetch komunitas data
        let res = await fetch(`${env.URL_KERAJAAN}/komunitas?limit=200`);
        if (!res.ok) {
            throw new Error(`HTTP Error! Status: ${res.status}`);
        }
        let data = await res.json();
        console.log("Raw komunitas data:", data);
        data = data.filter((item: any) => {
            return item.deleted_at == '0001-01-01T00:00:00Z' || !item.deleted_at;
        });
        // Process each komunitas item with user details
        let processedData = await Promise.all(data.map(async (item) => {
            // Format date
            let formattedItem = {
                ...item,
                tanggal_berdiri: formatDatetoUI(item.tanggal_berdiri)
            };
            
            // console.log(`Processing komunitas: ${item.nama_komunitas}`);
            // console.log(`- penanggung_jawab: ${item.penanggung_jawab}`);
            // console.log(`- pembina: ${item.pembina}`);
            // console.log(`- pelindung: ${item.pelindung}`);
            
            // Process user IDs for each role
            let roles = {
                penanggung_jawab: item.penanggung_jawab ? [item.penanggung_jawab] : [],
                pembina: item.pembina ? item.pembina.split(',').filter(id => id && id !== "") : [],
                pelindung: item.pelindung ? item.pelindung.split(',').filter(id => id && id !== "") : []
            };
            
            // Create a unique set of all user IDs to fetch
            let allUserIds = new Set([
                ...roles.penanggung_jawab,
                ...roles.pembina,
                ...roles.pelindung
            ]);
            
            // console.log(`Unique user IDs to fetch:`, Array.from(allUserIds));
            
            // Fetch all unique user details in parallel using port 8888
            let userDetailsMap = new Map();
            
                if (allUserIds.size > 0) {
                let userResults = await Promise.all(
                    Array.from(allUserIds).map(id =>
                        limit(async () => {
                            if (!id || id === "" || isNaN(Number(id))) return { id, userData: null };
                            try {
                                console.log(`Fetching user ${id}...`);
                                let userRes = await fetch(`${env.PUB_PORT}/user/${id}`);
                                if (userRes.ok) {
                                    let userData = await userRes.json();
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
            let penanggungJawabId = roles.penanggung_jawab.length > 0 ? roles.penanggung_jawab[0] : null;
            let penanggungJawabName = "-";
            
            if (penanggungJawabId && userDetailsMap.has(penanggungJawabId)) {
                let userData = userDetailsMap.get(penanggungJawabId);
                // Extract nama_lengkap
                penanggungJawabName = userData.nama_lengkap || `User ${penanggungJawabId}`;
                // console.log(`Penanggung jawab (${penanggungJawabId}) name:`, penanggungJawabName);
            } else {
                console.log(`No data found for penanggung jawab ID: ${penanggungJawabId}`);
                // If it's not a number, it might already be a name
                if (penanggungJawabId && isNaN(Number(penanggungJawabId))) {
                    penanggungJawabName = penanggungJawabId;
                }
            }
                
            let pembinaNames = roles.pembina
                .map(id => {
                    if (userDetailsMap.has(id)) {
                        let userData = userDetailsMap.get(id);
                        return userData.nama_lengkap || `User ${id}`;
                    }
                    // If it's not a number, it might already be a name
                    return isNaN(Number(id)) ? id : `User ${id}`;
                })
                .join(", ") || "-";
                
            let pelindungNames = roles.pelindung
                .map(id => {
                    if (userDetailsMap.has(id)) {
                        let userData = userDetailsMap.get(id);
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
        
        // console.log("Processed data:", processedData);
        return { data: processedData };
    }
    catch (error) {
        console.error("Error in load function:", error);
        return { data: [], error: error instanceof Error ? error.message : "Unknown error" };
    }
};
export const actions: Actions = {
    deleteKomunitas: async ({ request }) => {
        const data = await request.formData();
        const id = data.get("id_komunitas");
        try {
            const delres = await fetch(`${env.URL_KERAJAAN}/komunitas/${id}`, {
                method: "DELETE"
            });
            if (!delres.ok) {
                const errorData = await delres.json().catch(() => ({}));
                console.error("Delete failed:", delres.status, errorData);
                return fail(delres.status, { 
                    error: errorData.message || `Gagal menghapus komunitas (${delres.status})` 
                });
            }
            const successData = await delres.json().catch(() => ({ message: "Success" }));
            console.log("Delete successful:", successData);
            return {
                success: true,
                message: "Komunitas berhasil dihapus"
            };
        }
        catch (error) {
            console.log(error);
        }
    }


};
