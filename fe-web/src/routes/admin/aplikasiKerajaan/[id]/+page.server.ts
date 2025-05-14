import { env } from "$env/dynamic/private";
import type { PageServerLoad } from "./$types";

// Add a load function to get the id_kerajaan from URL and fetch existing data
export const load: PageServerLoad = async ({ params, fetch }) => {
    try {
        // Get id_kerajaan from URL
        const id_kerajaan = params.id;

        console.log("Id kerajaan : ", id_kerajaan)
        
        if (!id_kerajaan) {
            return {
                error: "Missing id_kerajaan parameter in URL",
                websiteFeatures: null,
                mobileFeatures: null
            };
        }
        
        console.log(`Loading data for kerajaan ID: ${id_kerajaan}`);
        
        // Fetch existing data from both endpoints
        const [websiteResponse, mobileResponse] = await Promise.all([
            fetch(`${env.BASE_URL}/fitur/website`),
            fetch(`${env.BASE_URL}/fitur/mobile`)
        ]);
        
        let websiteFeatures = null;
        let mobileFeatures = null;
        
        if (websiteResponse.ok) {
            const websiteData = await websiteResponse.json();
            console.log("Website features data:", websiteData);
            
            // Find the data for this specific id_kerajaan
            websiteFeatures = Array.isArray(websiteData) 
                ? websiteData.find(item => item.id_kerajaan === parseInt(id_kerajaan))
                : (websiteData.id_kerajaan === parseInt(id_kerajaan) ? websiteData : null);
        } else {
            console.error("Failed to fetch website features:", websiteResponse.status);
        }
        
        if (mobileResponse.ok) {
            const mobileData = await mobileResponse.json();
            console.log("Mobile features data:", mobileData);
            
            // Find the data for this specific id_kerajaan
            mobileFeatures = Array.isArray(mobileData)
                ? mobileData.find(item => item.id_kerajaan === parseInt(id_kerajaan))
                : (mobileData.id_kerajaan === parseInt(id_kerajaan) ? mobileData : null);
        } else {
            console.error("Failed to fetch mobile features:", mobileResponse.status);
        }
        
        return {
            id_kerajaan: parseInt(id_kerajaan),
            websiteFeatures,
            mobileFeatures
        };
    } catch (error) {
        console.error("Error in load function:", error);
        return {
            error: error instanceof Error ? error.message : "Unknown error occurred",
            websiteFeatures: null,
            mobileFeatures: null
        };
    }
};