import { env } from "$env/dynamic/private";
import type { PageServerLoad } from "../../$types";

export const load: PageServerLoad = async ({params}) => {
    console.log(params)
    try {
        let res = await fetch(`${env.URL_KERAJAAN}/situs/${params.id}`);
        let resW = await fetch(`${env.URL_KERAJAAN}/situs/wisata?limit=600`);
        if (!res.ok) {
            throw new Error(`HTTP Error! Status: ${res.status}`);
        }
        if (!resW.ok) {
            throw new Error(`HTTP Error! Status: ${resW.status}`);
        }
        let situsData = await res.json();
        let wisataData = await resW.json();
        let wisata = wisataData.filter((item: any) => {
            return item.deleted_at == '0001-01-01T00:00:00Z' || !item.deleted_at;
        })
        wisata = wisata.find((item)=> item.id_wisata === situsData.id_wisata).nama_wisata;
        let imageUrls = [];
        let profileUrl: any
       
        if ((situsData.profile)) {
            try {
               

                    console.log(`Fetching document with ID: ${situsData.profile}`);
                    const docRes = await fetch(`${env.URL_KERAJAAN}/doc/${situsData.profile}`);

                    if (docRes.ok) {
                        const docData = await docRes.json();
                        console.log("Document data:", docData);

                        if (docData.file_dokumentasi) {
                            const imageUrl = `${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(docData.file_dokumentasi)}`;
                            profileUrl = imageUrl
                        }
                    } else {
                        console.error(`Failed to fetch document ${docId}: ${docRes.statusText}`);
                    }
            
            } catch (error) {
                console.error("Error processing image URLs:", error);
            }
        }
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
            wisata,
            imageUrls,
            profileUrl
        }
        console.log(final)
        return { data: final };
    } catch (error) {
        
    }
};