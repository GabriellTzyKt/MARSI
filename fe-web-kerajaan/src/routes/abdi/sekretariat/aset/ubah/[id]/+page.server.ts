import { env } from "$env/dynamic/private";
import { error, fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { z } from "zod";

export const load = async ({ params, fetch }) => {
    const id = params.id;
    
    try {
        // Fetch semua arsip
        const response = await fetch(`${env.URL_KERAJAAN}/aset/${id}`);
        
        if (!response.ok) {
            throw error(response.status, `Failed to fetch documents`);
        }
        
        let dataAset = await response.json()


        // Konversi id dari string ke number untuk perbandingan
        

        console.log("document sesuai ID : ", dataAset);

        // Check if dokumentasi contains multiple IDs
        const dokumentasiValue = dataAset.dokumentasi?.toString() || '';
        const docIds = dokumentasiValue.includes(',') 
            ? dokumentasiValue.split(',').map((id : any) => id.trim()).filter(Boolean)
            : [dokumentasiValue];

        console.log(`Document has ${docIds.length} dokumentasi IDs:`, docIds);

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
            const docFileDetails = await Promise.all(filePaths.map(async (path : any) => {
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

        console.log("File details final:", fileDetails);
        
        const jenisResponse = await fetch(`${env.URL_KERAJAAN}/aset/jenis?limit=500`);
        const jenisArsip = jenisResponse.ok ? await jenisResponse.json() : [];
        
        // Return semua data yang diperlukan
        return {
            
            jenisArsip,
            files: fileDetails
        };
    } catch (e) {
        console.error(`Error loading document ${id}:`, e);
        throw error(500, "Failed to load document data");
    }
};
export const actions: Actions = {
    edit: async ({request}) => {
       const data = await request.formData()
               const obj = Object.fromEntries(data)
               const nama_aset = data.get("nama_aset")
               const id_kerajaan = data.get("id_kerajaan")
               const id_aset = data.get("id_aset")
               const jenis_aset = data.get("jenis_aset")
               const deskripsi_aset = data.get("deskripsi_aset")
               const gambar = data.getAll("gambar")
              
                const dokumentasiFiles = data.getAll("dokumentasi")
                   .filter(item => item instanceof File && item.size > 0) as File[];
               
               const jenisres = await fetch(`${env.URL_KERAJAAN}/aset/jenis`)
                if (!jenisres.ok) {
                       throw new Error(`Failed to fetch jenis aset: ${jenisres.status}`);
               }
               const jenisList = await jenisres.json();
               console.log(data)
               console.log(jenisList)
               const validationJenis = jenisList.map(item => {
                   return item.nama_jenis
               })
               console.log("Valid jenis values:", validationJenis);
                 // Define validation schema
               const schema = z.object({
                   nama_aset: z.string().min(1, "Nama aset harus diisi"),
                    jenis_aset: z.string()
                           .min(1, "Jenis aset harus dipilih")
                           .refine(val => validationJenis.includes(val), {
                               message: "Jenis aset tidak valid, pilih dari daftar yang tersedia"
                           }),
                   deskripsi_aset: z.string({message:"Deskripsi Aset harus diisi"}).min(1, "Deskripsi harus diisi"),
                //    dokumentasi: z.array(z.any())
                //        .refine(files => files.length > 0, {
                //            message: "Minimal satu dokumentasi harus diunggah"
                //        })
                //        .refine(files => files.every(file => file instanceof File), {
                //            message: "File dokumentasi tidak valid"
                //        })
               });
               const dokumentasii = data.getAll("dokumentasi").filter(item => item instanceof File && item.size > 0).map(item => item as File)
                console.log("Dokumentasi files:", dokumentasii.map(file => ({
                   name: file.name,
                   type: file.type,
                   size: file.size
               })));
               console.log("Dokumentasi: ",dokumentasiFiles)
                const validation = schema.safeParse({
                     nama_aset,
                    jenis_aset,
                    deskripsi_aset,
                   dokumentasi: dokumentasiFiles
                });
               // const files = dokumentasiFiles.map((files)=> files.name)
               
               if (!validation.success) {
                   console.log(validation.error.flatten().fieldErrors)
                   return fail(406,{
                       errors: validation.error.flatten().fieldErrors,
                       success: false,
                       // formData: Object.fromEntries(data)
                   });
        }
        const id_jenis_aset = jenisList.find(item => item.nama_jenis === jenis_aset)
        let gambarf;
       
            let sendData = {
                    id_aset: Number(id_aset),

                    id_jenis_aset: Number(String(id_jenis_aset.id_jenis_aset)),
                    dokumentasi: gambar.join(","),
                    nama_aset: nama_aset,
                    deskripsi: deskripsi_aset,
                    kategori_aset: jenis_aset
        }
        console.log(sendData)
               try {
                   const res = await fetch(`${env.URL_KERAJAAN}/aset`, {
                       headers: {
                           "Content-Type": "application/json"
                       }
                   , method: "PUT", body: JSON.stringify(sendData) })
                   if(!res.ok){
                       throw new Error(`HTTP Error! Status: ${res.status}`)
                   }
                   console.log(res)
                   return {data: "berhasil", success: true}
               }
               catch (error) {
                   console.log(error)
                   return {data: "gagal", success: false}
               }
               
           }
    }
