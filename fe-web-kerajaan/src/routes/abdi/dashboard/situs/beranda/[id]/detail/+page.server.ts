import { error, fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";

export const load: PageServerLoad = async ({ params, cookies }) => {
    let token = cookies.get('userSession') ? JSON.parse(cookies.get('userSession') as string) : '';
    try {
        const id = params.id;

        // Fetch komunitas data
        const situsResponse = await fetch(`${env.URL_KERAJAAN}/situs/${id}`);
        if (!situsResponse.ok) {
            throw error(situsResponse.status, `Failed to fetch Situs: ${situsResponse.statusText}`);
        }
        const situsData = await situsResponse.json();
        console.log("Situs data:", situsData);
        let [resjk, respl, respb] = await Promise.all([
            fetch(`${env.PUB_PORT}/user/${situsData.juru_kunci}`, {
                method: "GET",
                headers: {
                   "Authorization": "Bearer " + token?.token
                }
            }),
            fetch(`${env.PUB_PORT}/user/${situsData.pelindung}`, {
                method: "GET",
                headers: {
                   "Authorization": "Bearer " + token?.token
                }
            }),
            fetch(`${env.PUB_PORT}/user/${situsData.pembina}`, {
                method: "GET",
                headers: {
                   "Authorization": "Bearer " + token?.token
                }
            }),

        ])
        let jk = await resjk.json()
        let pb = await respb.json()
        let pl = await respl.json()
        let wisataData = null;
        if (situsData.id_wisata) {
            try {
                const wisataResponse = await fetch(`${env.URL_KERAJAAN}/situs/wisata`);
                if (wisataResponse.ok) {
                    const wisataList = await wisataResponse.json();
                    console.log("Wisata list:", wisataList);

                    // Find the matching wisata by id
                    wisataData = wisataList.find((item: any) =>
                        item.id_wisata === situsData.id_wisata ||
                        item.id === situsData.id_wisata
                    );

                    if (wisataData) {
                        console.log("Matching wisata found:", wisataData);
                    } else {
                        console.error(`No matching wisata found for ID ${situsData.id_wisata}`);
                    }
                } else {
                    console.error(`Failed to fetch wisata list: ${wisataResponse.status}`);
                }
            } catch (error) {
                console.error(`Error fetching wisata list:`, error);
            }
        }
        let jenisRes = await fetch(`${env.URL_KERAJAAN}/situs/jenis?limit=500`);
        if (!jenisRes.ok) {
            console.error(`Failed to fetch situs jenis: ${jenisRes.status}`);
        }
        const situsJenis = await jenisRes.json();
        let jenis_situs = situsJenis.find((item: any) => item.id_jenis_situs === situsData.id_jenis_situs).jenis_situs;
        // ambil foto profil dari foto situs, ambil yg foto 1 aja
        let profileUrl = null;
        if (situsData.profile !== "") {
            try {
                const firstPhotoId = situsData.profile.split(',')[0];

                const filePathResponse = await fetch(`${env.URL_KERAJAAN}/doc/${firstPhotoId}`);
                if (filePathResponse.ok) {
                    const filePathData = await filePathResponse.json();
                    console.log("File path data:", filePathData);

                    const filePath = filePathData.file_dokumentasi;
                    if (filePath) {
                        profileUrl = {
                            path: filePath,
                            url: `${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(filePath)}`,
                            name: filePath.split('/').pop()
                        };
                    }
                }
            } catch (fileError) {
                console.error("Error fetching file details:", fileError);
            }
        }


         const dokumentasiValue = situsData.foto_situs?.toString() || '';
        const docIds = dokumentasiValue.includes(',') 
            ? dokumentasiValue.split(',').map((id : any) => id.trim()).filter(Boolean)
            : [dokumentasiValue];   
        console.log("Foto Situs", docIds)

        // ambil smua foto yg ada
       let fileDetails : any = [];
        // Process each document ID separately
        for (const docId of docIds) {
            if (!docId) continue;
            
            console.log(`Fetching doc/${docId}`);
            const filePathsRequest = await fetch(`${env.URL_KERAJAAN}/doc/${docId}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            });
            
            if (!filePathsRequest.ok) {
                console.error(`Failed to fetch doc/${docId}: ${filePathsRequest.status}`);
                continue;
            }
            
            const filePathsData = await filePathsRequest.json();
            console.log(`File paths data for doc ${docId}:`, filePathsData);
            
            // Extract file paths
            const filePaths = Array.isArray(filePathsData.file_dokumentasi)
                ? filePathsData.file_dokumentasi
                : [filePathsData.file_dokumentasi];
            
            // Process each file path
            const docFileDetails = await Promise.all(filePaths.map(async (path: any) => {
                if (!path) return null;
                
                const actualPath = path;
                console.log(`Processing file path from doc ${docId}:`, actualPath);
                
                try {
                    const fileDataRequest = await fetch(`${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(actualPath)}`, {
                        method: "GET"
                    });
                    
                    if (!fileDataRequest.ok) {
                        console.error(`Failed to fetch file data for path ${actualPath}:`, fileDataRequest.status);
                        return {
                            path: actualPath,
                            url: null,
                            error: `Failed to load file: ${fileDataRequest.status}`,
                            docId: docId
                        };
                    }
                    
                    return {
                        path: actualPath,
                        url: `${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(actualPath)}`,
                        type: fileDataRequest.headers.get("content-type") || "unknown",
                        name: actualPath.split('/').pop(),
                        size: fileDataRequest.headers.get("content-length") || "unknown",
                        docId: docId
                    };
                } catch (error) {
                    console.error(`Error processing file path ${actualPath}:`, error);
                    return {
                        path: actualPath,
                        url: null,
                        error: error instanceof Error ? error.message : "Unknown error",
                        docId: docId
                    };
                }
            }));
            // Add files from this document to the main list
            fileDetails = [...fileDetails, ...docFileDetails.filter(file => file !== null)];

        }
        

        return {
            situs: situsData,
            files: fileDetails,
            juru_kunci: jk.nama_lengkap,
            pelindung: pl.nama_lengkap,
            pembina: pb.nama_lengkap,
            profileUrl,
            wisata: wisataData || null,
            jenis_situs

        };
    } catch (err) {
        console.error("Error in load function:", err);
        throw error(500, "Failed to load komunitas details");
    }
};
export const actions: Actions = {
    updateFoto: async ({ request, params, cookies }) => {
        let cookie = cookies.get("userSession") ? JSON.parse(cookies.get("userSession") as string) : '';
        let data = await request.formData();
        // console.log(data)
         const existingDocResponse = await fetch(`${env.URL_KERAJAAN}/situs/${params.id}`);    
        const existingDoc = existingDocResponse.ok ? await existingDocResponse.json() : { foto_organisasi: '' };
        let locRes = await fetch(`${env.URL_KERAJAAN}/loc/${existingDoc.id_lokasi}`);
        let loc = await locRes.json()

        const newFiles = data.getAll('uploadfile').filter(file => file instanceof File && file.size > 0) as File[];
        console.log('New files from form:', newFiles.map(f => f.name));
        console.log(data)
        const existingFileIds = data.getAll('existingFileId')           
            .map(id => id?.toString())           
            .filter(id => id && id !== 'null' && id !== 'undefined');
        let newFileIds: string[] = []


        if (newFiles.length > 0) {              
            try {      // Upload each file individually to ensure all are processed
                for (const file of newFiles) {         
                    console.log(`Processing file: ${file.name} (${file.size} bytes)`);
                    const singleFileFormData = new FormData();
                    singleFileFormData.append('nama_situs', existingDoc.nama_situs as string);   
                    singleFileFormData.append('foto_situs', file);                               
                    console.log(`Uploading file: ${file.name}`);         
                    const uploadResponse = await fetch(`${env.URL_KERAJAAN}/file/foto_situs`, {                          
                        method: 'POST',                 
                        body: singleFileFormData                          
                    });      
                    if (!uploadResponse.ok) {
                        console.error(`Upload failed for ${file.name}:`, uploadResponse.status);     
                        const responseText = await uploadResponse.text();     
                        console.error('Upload response body:', responseText);   
                        continue; // Skip this file but continue with others    
                    }
                    const uploadResult = await uploadResponse.json();  
                    console.log(`Upload result for ${file.name}:`, uploadResult); 
                    // Extract ID from response
                    let fileId = null;  
                    if (uploadResult.id_path) {
                        if (typeof uploadResult.id_path === 'string') {   
                            fileId = uploadResult.id_path;
                        } else if (uploadResult.id_path.data) {       
                            fileId = uploadResult.id_path.data;   
                        }
                    } else if (uploadResult.id_dokumentasi) {
                        if (typeof uploadResult.id_dokumentasi === 'string') {
                            fileId = uploadResult.id_dokumentasi;
                        } else if (Array.isArray(uploadResult.id_dokumentasi)) { 
                            fileId = uploadResult.id_dokumentasi[0]; // Take first if array   
                        }
                    } else if (Array.isArray(uploadResult) && uploadResult.length > 0) {
                        fileId = uploadResult[0];
                    } else if (uploadResult.data) {
                        if (typeof uploadResult.data === 'string') {                          
                            fileId = uploadResult.data;          
                        } else if (Array.isArray(uploadResult.data) && uploadResult.data.length > 0) {            
                            fileId = uploadResult.data[0];              
                            
                        }
                    }  
                    if (fileId) {
                        console.log(`File ${file.name} uploaded with ID: ${fileId}`);
                        newFileIds.push(fileId);
                    } else {              
                        console.warn(`Could not extract ID for file ${file.name}:`, uploadResult);              
                    }
                }  
                console.log('All new files uploaded with IDs:', newFileIds);            
            } catch (uploadError) {
                            console.error('Error in file upload process:', uploadError);       
                return fail(500, {
                    errors: `Error uploading files: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`,
                    success: false
                            });
            }
        }      
       
        // const id_jenis_aset = jenisList.find(item => item.nama_jenis === jenis_aset)
        console.log("data", existingDoc)

        // let gambarf; 
        // Combine existing and new file IDs    
        let allFileIds = [...existingFileIds];
        // Add new file IDs if any
        
        if (newFileIds.length > 0) {    
            allFileIds = [...allFileIds, ...newFileIds]; 
        }
        // If no files provided at all, use existing dokumentasi from document
        
        let finalDokumentasi = allFileIds.length > 0  
            ? allFileIds.join(',') 
            : (existingDoc.foto_situs || '');
        console.log('Final dokumentasi value:', finalDokumentasi);
        
        
        
        // data-data yg akan dikirim ke api ( untuk edit )
        
        const payload = {     
            id_admin: Number(cookie.id_admin),
            id_situs: Number(existingDoc.id_situs),     
            id_wisata: Number(existingDoc.id_wisata),     
            nama_situs: (existingDoc.nama_situs),     
            profile: existingDoc.profile,     
            id_jenis_situs: Number(existingDoc.id_jenis_situs), 
            foto_situs: finalDokumentasi,
            deskripsi_situs: existingDoc.deskripsi_situs, 
            alamat: existingDoc.alamat, 
            longitude: parseFloat(loc.longitude),              
            latitude: parseFloat(loc.latitude),              
            nama_pendiri: existingDoc.nama_pendiri,              
            tahun_berdiri:Number(existingDoc.tahun_berdiri),              
            pemilik_situs: existingDoc.pemilik_situs,              
            pembina: existingDoc.pembina,              
            pelindung: existingDoc.pelindung,              
            juru_kunci: existingDoc.juru_kunci,                            
            jam_buka: existingDoc.jam_buka,                            
            jam_tutup: existingDoc.jam_tutup,                            
            no_telp: existingDoc.no_telp,                            
            email: existingDoc.email,                            
        };       
        console.log("Payload",payload)       
        try {
            const res = await fetch(`${env.URL_KERAJAAN}/situs`, {
                headers: {
                    "Content-Type": "application/json"
        
                }, method: "PUT", body: JSON.stringify(payload)
            })
            let msg = await res.json()
            console.log(msg)
                           if(!res.ok){
                               throw new Error(`HTTP Error! Status: ${res.status}`)
                           }
            return { data: "berhasil", success: true }
        }     
        catch (error) {
            console.log(error)
            return { data: "gagal", success: false }
        }      
    }

};