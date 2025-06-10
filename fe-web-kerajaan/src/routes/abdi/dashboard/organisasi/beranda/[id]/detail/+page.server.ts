import { error, fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types"; 
import { env } from "$env/dynamic/private";

export const load: PageServerLoad = async ({ params, cookies }) => {
    try {
        const id = params.id;
        const token = cookies.get("userSession") ? JSON.parse(cookies.get("userSession") as string) : '';

        // Fetch komunitas data
        const organisasiResponse = await fetch(`${env.URL_KERAJAAN}/organisasi/${id}`);
        if (!organisasiResponse.ok) {
            throw error(organisasiResponse.status, `Failed to fetch komunitas: ${organisasiResponse.statusText}`);
        }
        const organisasiData = await organisasiResponse.json();
        console.log("organisasi data:", organisasiData);

        // Fetch user data for penanggung_jawab, pembina, and pelindung
        let penanggungJawab = null;
        let pembina = null;
        let pelindung = null;

        // Fetch penanggung_jawab data
        if (organisasiData.penanggung_jawab && organisasiData.penanggung_jawab !== '0') {
            try {
                const userRes = await fetch(`${env.URL_KERAJAAN}/anggota/${organisasiData.penanggung_jawab}`, {

                });
                if (userRes.ok) {
                    penanggungJawab = await userRes.json();
                }
            } catch (err) {
                console.error("Error fetching penanggung_jawab:", err);
            }
        }
        
        // Fetch pembina data
        if (organisasiData.pembina && organisasiData.pembina !== '0') {
            try {
                const userRes = await fetch(`${env.URL_KERAJAAN}/anggota/${organisasiData.pembina}`, {
                   
                });
                if (userRes.ok) {
                    pembina = await userRes.json();
                }
            } catch (err) {
                console.error("Error fetching pembina:", err);
            }
        }
        
        // Fetch pelindung data
        if (organisasiData.pelindung && organisasiData.pelindung !== '0') {
            try {
                const userRes = await fetch(`${env.URL_KERAJAAN}/anggota/${organisasiData.pelindung}`, {
                    
                });
                if (userRes.ok) {
                    pelindung = await userRes.json();
                }
            } catch (err) {
                console.error("Error fetching pelindung:", err);
            }
        }

        // Fetch anggota data
        const dataanggota = await fetch(`${env.URL_KERAJAAN}/organisasi/anggota/${id}`);
        if (!dataanggota.ok) {
            throw error(dataanggota.status, `Failed to fetch organisasi anggota: ${dataanggota.statusText}`);
        }
        const dataanggotajson = await dataanggota.json();
        
        // Fetch profile image if available
        
        let profileUrl =null
        if (organisasiData.profile) {
            try {
                const filePathResponse = await fetch(`${env.URL_KERAJAAN}/doc/${organisasiData.profile}`);
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

        // Fetch foto_organisasi images if available
        let fotoOrganisasiDetails = [];
          const dokumentasiValue = organisasiData.foto_organisasi?.toString() || '';
        const docIds = dokumentasiValue.includes(',') 
            ? dokumentasiValue.split(',').map((id : any) => id.trim()).filter(Boolean)
            : [dokumentasiValue];   
        console.log("Foto Organisai", docIds)
        
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
            organisasi: organisasiData,
            files: fileDetails,
            profileUrl,
            dataanggota: dataanggotajson,
       
            penanggungJawab,
            pembina,
            pelindung
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
        console.log(data)

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
                    singleFileFormData.append('nama_organisasi', data.get("nama_organisasi") as string);   
                    singleFileFormData.append('foto_organisasi', file);                               
                    console.log(`Uploading file: ${file.name}`);         
                    const uploadResponse = await fetch(`${env.URL_KERAJAAN}/file/foto_organisasi`, {                          
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
        const existingDocResponse = await fetch(`${env.URL_KERAJAAN}/organisasi/${params.id}`);    
        const existingDoc = existingDocResponse.ok ? await existingDocResponse.json() : { foto_organisasi: '' };  
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
            : (existingDoc.foto_organisasi || '');
        console.log('Final dokumentasi value:', finalDokumentasi);
        
        
        
        // data-data yg akan dikirim ke api ( untuk edit )
        
        const payload = {     
            id_organisasi: Number(existingDoc.id_organisasi),     
            penanggung_jawab: Number(existingDoc.penanggung_jawab),     
            nama_organisasi: existingDoc.nama_organisasi,     
            foto_organisasi: finalDokumentasi,
            deskripsi: existingDoc.deskripsi_organisasi, 
            alamat: existingDoc.alamat, 
            no_telp: existingDoc.no_telp,              
            email: existingDoc.email,              
            pelindung: existingDoc.pelindung,              
            pembina: existingDoc.pembina,              
            tanggal_berdiri: existingDoc.tanggal_berdiri.split("T")[0],              
            profile: existingDoc.profile,                            
        };       
        console.log(payload)       
        try {
            const res = await fetch(`${env.URL_KERAJAAN}/organisasi`, {
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













