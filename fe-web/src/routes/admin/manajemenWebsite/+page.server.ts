import { env } from "$env/dynamic/private";
import { fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { Actions } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ fetch }) => {
    try {
        // Fetch all website features data
        const websiteResponse = await fetch(`${env.BASE_URL}/fitur/website`);
        
        if (!websiteResponse.ok) {
            throw new Error(`Failed to fetch website features: ${websiteResponse.status} ${websiteResponse.statusText}`);
        }
        
        const websiteFeatures = await websiteResponse.json();
        console.log("Website features data:", websiteFeatures);
        
        // Fetch all mobile features data
        const mobileResponse = await fetch(`${env.BASE_URL}/fitur/mobile`);
        
        if (!mobileResponse.ok) {
            throw new Error(`Failed to fetch mobile features: ${mobileResponse.status} ${mobileResponse.statusText}`);
        }
        
        const mobileFeatures = await mobileResponse.json();
        console.log("Mobile features data:", mobileFeatures);
        
        // Fetch kerajaan data to get names
        const kerajaanResponse = await fetch(`${env.BASE_URL}/kerajaan?limit=200`);
        let kerajaanData = [];
        
        if (kerajaanResponse.ok) {
            kerajaanData = await kerajaanResponse.json();
            console.log("Kerajaan data:", kerajaanData);
        } else {
            console.error(`Failed to fetch kerajaan data: ${kerajaanResponse.status}`);
        }
        
        // Create a map of kerajaan IDs to names for quick lookup
        const kerajaanMap = new Map();
        if (Array.isArray(kerajaanData)) {
            kerajaanData.forEach(kerajaan => {
                kerajaanMap.set(kerajaan.id_kerajaan, kerajaan.nama_kerajaan);
            });
        }
        
        // Combine website and mobile features data
        const combinedData : any = [];
        
        // Process website features
        if (Array.isArray(websiteFeatures)) {
            websiteFeatures.forEach(website => {
                const id_kerajaan = website.id_kerajaan;
                const existingEntry = combinedData.find((item : any ) => item.id_kerajaan === id_kerajaan);
                
                if (existingEntry) {
                    // Update existing entry with website features
                    existingEntry.websiteFeatures = website;
                } else {
                    // Create new entry
                    combinedData.push({
                        id_kerajaan,
                        nama_kerajaan: kerajaanMap.get(id_kerajaan) || `Kerajaan ${id_kerajaan}`,
                        websiteFeatures: website,
                        mobileFeatures: null
                    });
                }
            });
        }
        
        // Process mobile features
        if (Array.isArray(mobileFeatures)) {
            mobileFeatures.forEach(mobile => {
                const id_kerajaan = mobile.id_kerajaan;
                const existingEntry = combinedData.find((item : any ) => item.id_kerajaan === id_kerajaan);
                
                if (existingEntry) {
                    // Update existing entry with mobile features
                    existingEntry.mobileFeatures = mobile;
                } else {
                    // Create new entry
                    combinedData.push({
                        id_kerajaan,
                        nama_kerajaan: kerajaanMap.get(id_kerajaan) || `Kerajaan ${id_kerajaan}`,
                        websiteFeatures: null,
                        mobileFeatures: mobile
                    });
                }
            });
        }
        
        console.log("Combined data:", combinedData);
        
        // Format data for display
        const formattedData = combinedData.map((item : any )=> {
            // Use status_permintaan from websiteFeatures if available
            let status = "Diajukan"; // Default status
            
            if (item.websiteFeatures && item.websiteFeatures.status_permintaan) {
                status = item.websiteFeatures.status_permintaan;
            }
            
            return {
                id_permintaan: item.id_kerajaan,
                asal_kerajaan: item.nama_kerajaan,
                link_website: `...`,
                tanggal_buat: "01-01-2023", // Placeholder date
                tanggal_selesai: "31-12-2023", // Placeholder date
                status: status,
                websiteFeatures: item.websiteFeatures,
                mobileFeatures: item.mobileFeatures
            };
        });
        
        // Definisikan urutan status
        const statusOrder: Record<string, number> = {
            'Diajukan': 1,
            'Ditinjau': 2,
            'Selesai': 3
        };
        
        // Urutkan data berdasarkan status
        formattedData.sort((a : any , b : any) => {
            const orderA = statusOrder[a.status] || 999;
            const orderB = statusOrder[b.status] || 999;
            return orderA - orderB;
        });

        return {
            dataArsip: formattedData,
        };
    } catch (e) {
        if (e instanceof Error) {
            console.error("Error in load function:", e.message);
            return { dataArsip: "Failed", error: e.message };
        }
        return { dataArsip: "Failed", error: "Unknown error" };
    }
};

export const actions: Actions = {
    delete: async ({ request }) => {
        const data = await request.formData()
        console.log("data id : ", data)
        try {
            const del = await fetch(`${env.PUB_PORT}/arsip/${data.get("id_arsip")}`, {
                method: "DELETE"
            })
            const m = await del.json()
            if (!del.ok) {
                return fail(406, { error: `Code ${del.status} Message: ${m.message}` })
            }
            console.log(m.message)
            return { error: "no error" }
        }
        catch (error) {
            console.error("Error deleting record:", error);
            return fail(500, { error: "Server error when deleting record" });
        }
    },
};
