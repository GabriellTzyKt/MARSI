import { env } from "$env/dynamic/private";
import type { PageServerLoad } from "../../$types";

export const load: PageServerLoad = async ({params}) => {
    console.log(params)
    try {
        let res = await fetch(`${env.URL_KERAJAAN}/situs/${params.id}`);
        if (!res.ok) {
            throw new Error(`HTTP Error! Status: ${res.status}`);
        }
        let situsData = await res.json();
        let imageUrls = [];
        if (situsData.foto_situs && situsData.foto_situs.trim() !== '') {
            try {
                const docIds = situsData.foto_situs.split(',').map(id => id.trim());
                console.log("Document IDs:", docIds);
                
                for (const docId of docIds) {
                    if (!docId) continue;
                    
                    console.log(`Fetching document with ID: ${docId}`);
                    const docRes = await fetch(`${env.URL_KERAJAAN}/doc/${docId}`);
                    
                    if (docRes.ok) {
                        const docData = await docRes.json();
                        console.log("Document data:", docData);
                        
                        if (docData.file_dokumentasi) {
                            const imageUrl = `${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(docData.file_dokumentasi)}`;
                            imageUrls.push(imageUrl);
                        }
                    } else {
                        console.error(`Failed to fetch document ${docId}: ${docRes.statusText}`);
                    }
                }
            } catch (error) {
                console.error("Error processing image URLs:", error);
            }
        }
        let final = {
            ...situsData,
            imageUrls
        }
        console.log(final)
        return { data: final };
    } catch (error) {
        
    }
};