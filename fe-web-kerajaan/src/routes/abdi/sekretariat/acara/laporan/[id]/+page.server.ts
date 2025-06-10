import { env } from "$env/dynamic/private";
import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { schemaLpj } from "./Schemalaporan";

export const load: PageServerLoad = async ({params, cookies}) => {
    try {
        let cook = JSON.parse(cookies.get("userSession") as string)
        function setjabatan(data) {
                switch (data) {
                    
                    case "ketua":
                        return "Ketua"
                        
                    case "wakilketua":
                        return "Wakil Ketua"
                    case "sekretariat":
                         return "Sekretariat"
                    case "bendahara":
                        return "Bendahara"
                    case "acara":
                         return "Acara"
                    case "komunikasi":
                         return "Komunikasi"
                    case "perlengkapan":
                         return "Perlengkapan"
                    case "pdd":
                         return "PDD"
                    case "keamanan":
                         return "Keamanan"
                    case "humas":
                        return "Humas"
                    default:
                        return data
                }
            }
        let resSitus = await fetch(`${env.URL_KERAJAAN}/situs`);
        let res = await fetch(`${env.URL_KERAJAAN}/acara/detail/${params.id}`);
        let resUndangan = await fetch(`${env.URL_KERAJAAN}/undangan/${params.id}`);
        let resPanit = await fetch(`${env.URL_KERAJAAN}/acara/panitia/${params.id}`);
        console.log(res)
        if (res.ok && resUndangan.ok && resPanit.ok && resSitus.ok) {
            let data = await res.json()
            let undangan = await resUndangan.json()
            undangan = undangan.filter(item => item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at)
            let panit = await resPanit.json()
             panit = panit.filter(item => item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at)
            let situs = await resSitus.json()

            let resUser = await fetch(`${env.PUB_PORT}/user/${data?.id_penanggung_jawab}`, {
                headers: {
                    "Authorization" : `Bearer ${cook?.token}`
                }
            })
            let user = await resUser.json()

            console.log("Data User", user)
            let formatDate = (isoString) => {
                if (!isoString || isoString === '0001-01-01T00:00:00Z') return '-';
                let date = new Date(isoString);
                let day = String(date.getUTCDate()).padStart(2, '0');
                let month = String(date.getUTCMonth() + 1).padStart(2, '0');
            let year = date.getFullYear();
            return `${day}-${month}-${year}`;
            };
            let formatTime = (isoString) => {
                if (!isoString || isoString === '0001-01-01T00:00:00Z') return '-';
                let date = new Date(isoString);
                let hours = String(date.getHours()).padStart(2, '0');
                let minutes = String(date.getMinutes()).padStart(2, '0');
                return `${hours}:${minutes}`;
            };
            function formatTimeToHHMM_UTC(isoString: string): string {
                if (!isoString || isoString === '0001-01-01T00:00:00Z') return '-';
                const date = new Date(isoString);
                const hours = String(date.getUTCHours()).padStart(2, '0');
                const minutes = String(date.getUTCMinutes()).padStart(2, '0');
                return `${hours}:${minutes}`;
            }
            let formattedData = {
                    ...data,
                    tanggal_mulai: formatDate(data.waktu_mulai),
                    tanggal_selesai: formatDate(data.waktu_selesai),
                    waktu_mulai: formatTimeToHHMM_UTC(data.waktu_mulai),
                    waktu_selesai: formatTimeToHHMM_UTC(data.waktu_selesai),
                    waktu_mulai_original: data.waktu_mulai,
                waktu_selesai_original: data.waktu_selesai,
                    nama_penanggungjawab : user.nama_lengkap
                };
                
            let undanganWithUser = await Promise.all(undangan.map(async (item) => { 
                try {
                    let resUser = await fetch(`${env.PUB_PORT}/user/${item.id_penerima}`, {
                        headers: {
                            "Authorization" : `Bearer ${cook?.token}`
                        }
                    })
                    if(resUser.ok) {
                        let user = await resUser.json()
                        return {
                            ...item,
                            nama_penerima: user.nama_lengkap,
                            nomer_telepon: user.no_telp,
                            jenis_kelamin: user.jenis_kelamin
                        }
                    }
                    
                    else {
                       return {
                            ...item,
                            nama_penerima: "No User Found",
                            nomer_telepon: "-",
                            jenis_kelamin: "-"
                        }
                    }
                } catch (error) {
                    
                }
            }))
             let panitWithUser = await Promise.all(panit.map(async (item) => { 
                try {
                    let resUser = await fetch(`${env.PUB_PORT}/user/${item.id_user}`, {
                        headers: {
                            "Authorization" : `Bearer ${cook?.token}`
                        }
                    })
                    if(resUser.ok) {
                        let user = await resUser.json()
                        return {
                            ...item,
                              jabatan : setjabatan(item.jabatan_panitia),
                            nama_panit: user.nama_lengkap,
                           
                        }
                    }
                    
                    else {
                       return {
                            ...item,
                            nama_panit: "No User Found",
                            
                        }
                    }
                } catch (error) {
                    
                }
            }))
                console.log(formattedData)
                console.log(undangan)
            console.log(panit)
            // Check if dokumentasi contains multiple IDs
        const dokumentasiValue = formattedData.foto_acara?.toString() || '';
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

            let resLpj = await fetch(`${env.URL_KERAJAAN}/lpj/${params.id}`);
            if (!resLpj.ok) {
                console.error(`Failed to fetch lpj/${params.id}: ${resLpj.status}`);
               
            } 
             let lpjData = await resLpj.json();
             
            let rab = await fetch(`${env.URL_KERAJAAN}/lpj/rab/${lpjData.id_lpj_acara}`, {
                method:"GET"
            });
            let rabData = await rab.json();
            rabData = rabData?.filter((item)=> item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at)||[]
            formattedData.lpj = lpjData.message === "Lpj Acara not found" ? '' : lpjData;
            const dokumentasiValueDoc = lpjData.bukti_pelaksanaan?.toString() || '';
            const docIdsDoc = dokumentasiValueDoc.includes(',') 
            ? dokumentasiValueDoc.split(',').map((id : any) => id.trim()).filter(Boolean)
            : [dokumentasiValueDoc];

        console.log(`Document has ${docIds.length} dokumentasi IDs:`, docIds);
          let fileDetailsDoc : any = [];
             // Process each document ID separately
        for (const docId of docIdsDoc) {
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
            fileDetailsDoc = [...fileDetailsDoc, ...docFileDetails.filter(file => file !== null)];
            }

                return { data: formattedData,rabData, fileDetailsDoc, undangan: undanganWithUser, panit: panitWithUser, situs: situs, files: fileDetails};
           
        }

    }
    catch (e) {
        if (e instanceof Error) return console.log(e.message)
    }
};
export const actions: Actions = {
    updateLaporan: async ({ request, params }) => {
        let data = await request.formData();
        // console.log(data)
        let existingLPJ: any;
        const newFilesDokumentasi = data.getAll('uploadfileDokumentasi').filter(file => file instanceof File && file.size > 0) as File[];
        const existingFileIdsDokumentasi = data.getAll('existingFileIdDokumentasi').map(id => id?.toString()).filter(id => id && id !== 'null' && id !== 'undefined');
        console.log("exisiting doc :v", existingFileIdsDokumentasi)
        let id_lpj: any
        
        let lpjRes = await fetch(`${env.URL_KERAJAAN}/lpj/${params.id}`, {
            method: "GET",
        });
        let lpjData = await lpjRes.json();
        console.log(lpjData)
        if (!lpjRes) {
            console.error(`Failed to fetch lpj/${params.id}: ${lpjRes.status}`);
            // return fail(404, { error: "Lpj tidak ditemukan" });
        }

        id_lpj = lpjData.id_lpj_acara
         existingLPJ = lpjData
        if (!id_lpj) {
            

            let lpj = new FormData()
            lpj.append("jumlah_peserta", (data.get("jumlah_peserta") as string))
            lpj.append("perkiraan_jumlah_peserta", (data.get("perkiraan_jumlah_peserta") as string))
            for( const doc of newFilesDokumentasi){
                console.log("adding", doc)
                lpj.append("bukti_pelaksanaan", (doc as File))
            }
            lpj.append("id_acara", (params.id as string))
    
            console.log("Lpj yang akan di Submit : ", lpj)
            let lpjRes = await fetch(`${env.URL_KERAJAAN}/lpj`, {
                method: "POST",
                
                body: lpj
            })
            let lpjData = await lpjRes.json()
            console.log(lpjData)

            if (!lpjRes) {
                console.error(`Failed to fetch lpj/${params.id}: ${lpjRes.status}`);
                // return fail(404, { error: "Lpj tidak ditemukan" });
            }
            let lpjjres = await fetch(`${env.URL_KERAJAAN}/lpj/${params.id}`, {
                method: "GET",
            });
            let lpjj = await lpjjres.json();
            id_lpj = lpjj.id_lpj_acara
            existingLPJ = lpjj
        }
       

        console.log("id", id_lpj)
        console.log("dataLPJ", existingLPJ)
        let newDocLPJ:any = []




        if (newFilesDokumentasi.length > 0) {
            try {
                // Upload each file individually to ensure all are processed
                for (const file of newFilesDokumentasi) {
                    console.log(`Processing file: ${file.name} (${file.size} bytes)`);
                    
                    const singleFileFormData = new FormData();
                    singleFileFormData.append('nama_acara', (data.get("nama_acara"))  as string);
                    singleFileFormData.append('bukti_pelaksanaan', file);
                    
                    console.log(`Uploading file: ${file.name}`);
                    const uploadResponse = await fetch(`${env.URL_KERAJAAN}/file/lpj_acara`, {
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
                        newDocLPJ.push(fileId);
                    } else {
                        console.warn(`Could not extract ID for file ${file.name}:`, uploadResult);
                    }
                }
                
                console.log('All new files uploaded with IDs:', newDocLPJ);
            } catch (uploadError) {
                console.error('Error in file upload process:', uploadError);
                return fail(500, {
                    errors: `Error uploading files: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`,
                    success: false
                });
            }
        }

        // Combine existing and new file IDs
        let allFileIdsDocument = [...existingFileIdsDokumentasi];
            
        // Add new file IDs if any
        if (newDocLPJ.length > 0) {
            allFileIdsDocument = [...allFileIdsDocument, ...newDocLPJ];
        }
        console.log("all files doc", allFileIdsDocument)
        // If no files provided at all, use existing dokumentasi from document
        let finalDokumentasiAcara = allFileIdsDocument.length > 0 
            ? allFileIdsDocument.join(',') 
            : (existingLPJ.bukti_pelaksanaan || '');
            

         const payloadLPJ = {
             id_lpj_acara: Number(existingLPJ.id_lpj_acara),
             bukti_pelaksanaan: finalDokumentasiAcara,
             jumlah_peserta:  Number(data.get("jumlah_peserta"))||Number(existingLPJ.jumlah_peserta),
             perkiraan_jumlah_peserta: Number(data.get("perkiraan_jumlah_peserta"))||Number(existingLPJ.perkiraan_jumlah_peserta)
        };
        console.log("lpj payload", payloadLPJ   )
        let put = await fetch(`${env.URL_KERAJAAN}/lpj  `, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payloadLPJ)
        });
        let lpjMesg = await put.json()
        console.log("SubmitLPJ", lpjMesg)

        let rabList: { id_lpj_acara: number;  keterangan: string; jumlah_pengeluaran: number }[] = [];
        const rabKeteranganKeys = Array.from(data.keys()).filter((key) =>
            key.startsWith("rab_keterangan_")
        );
       

        try {
            
            for (const ketKey of rabKeteranganKeys) {
                const index = ketKey.split("_").pop();                       
                const jumlahKey = `rab_jumlah_${index}`;                    
                const keterangan = data.get(ketKey)?.toString() ?? "";                   
                const jumlah = parseInt(data.get(jumlahKey)?.toString() ?? "0")              
                if (keterangan || jumlah) {               
                    rabList.push({id_lpj_acara: Number(id_lpj), keterangan, jumlah_pengeluaran:Number(jumlah) });           
                }            
            }   

            if(rabList.length>0){
                
            console.log("RAB List:", rabList); 
            console.log()
            if(rabList.length > 0){
                let rabRes = await fetch(`${env.URL_KERAJAAN}/lpj/rab`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                body: JSON.stringify(rabList)
            });
                let ms = await rabRes.json()
                console.log(ms)
                }
                }
            // let fetchRAB = await fetch(`${env.URL_KERAJAAN}/lpj/rab/${id_lpj}`, {
            //     method: "GET"
            // })
            // if (!fetchRAB.ok) {

            //     console.error(`Failed to fetch lpj/rab/${id_lpj}: ${fetchRAB.status}`);

            // }
            // let rabData = await fetchRAB.json()
            // if (rabData?.length === 0) {
                
            // }
            // else {
                

            // }
            // if (!rabRes.ok) {
            //     console.error(`Failed to submit rab: ${rabRes.status}`);
            //     return fail(406, {
            //         errors: "Terjadi kesalahan mengupload data",
            //         success: false,
            //         type: "add"
            //     });
            // }
            const existingFileIdsAcara = data.getAll('existingFileIdAcara').map(id => id?.toString()).filter(id => id && id !== 'null' && id !== 'undefined');
            const newFilesAcara = data.getAll('uploadfileAcara').filter(file => file instanceof File && file.size > 0) as File[];
            // const newFilesDokumentasi = data.getAll('uploadfileDokumentasi').filter(file => file instanceof File && file.size > 0) as File[];
            console.log("New files from form:", newFilesAcara.map(f => f.name));
            let newFileIds: string[] = [];
            const existingDocResponse = await fetch(`${env.URL_KERAJAAN}/acara/detail/${params.id}`);
            const existingDoc = existingDocResponse.ok ? await existingDocResponse.json() : { foto_acara: '' };
            // let fotoAcara = data.getAll("uploadfileAcara") as File[]
            console.log("File acara", newFilesAcara)
            console.log("File doc", newFilesDokumentasi)
            if (newFilesAcara.length > 0) {
                try {
                    // Upload each file individually to ensure all are processed
                    for (const file of newFilesAcara) {
                        console.log(`Processing file: ${file.name} (${file.size} bytes)`);
                        
                        const singleFileFormData = new FormData();
                        singleFileFormData.append('nama_acara', existingDoc.nama_acara   as string);
                        singleFileFormData.append('foto_acara', file);
                        
                        console.log(`Uploading file: ${file.name}`);
                        const uploadResponse = await fetch(`${env.URL_KERAJAAN}/file/foto_acara`, {
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
        // let gambarf;
       
              
            // Combine existing and new file IDs
            let allFileIdsAcara = [...existingFileIdsAcara];
            
            // Add new file IDs if any
            if (newFileIds.length > 0) {
                allFileIdsAcara = [...allFileIdsAcara, ...newFileIds];
            }
            
            // If no files provided at all, use existing dokumentasi from document
            let finalDokumentasiAcara = allFileIdsAcara.length > 0 
                ? allFileIdsAcara.join(',') 
                : (existingDoc.foto_acara || '');
                
            console.log('Final dokumentasi value:', finalDokumentasiAcara);
            const payload = {
                id_acara: Number(params.id),              
                nama_acara: (data.get("nama_acara")),          
                deskripsi_acara: data.get("deskripsi_acara"),
                tujuan_acara: data.get("tujuan_acara"),
                lokasi_acara: Number(data.get("lokasi_acara")),
                alamat_acara: data.get("alamat_acara"),
                waktu_mulai: `${data.get("tanggal_mulai")} ${data.get("jam_mulai")}:00`,
                waktu_selesai: `${data.get("tanggal_selesai")} ${data.get("jam_selesai")}:00`,
                penanggung_jawab: Number(data.get("penanggungjawab_id")),
                jenis_acara: data.get("jenis_acara"),
                kapasitas_acara: Number(data.get("kapasitas_acara")),
                foto_acara: finalDokumentasiAcara, 
                
               
                status: existingDoc.status,               
            };
            let res = await fetch(`${env.URL_KERAJAAN}/acara`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            let msg = await res.json()
            console.log(msg)
            if (!res.ok) {
                console.error(msg.message)
            }
            console.log("Final Isian",payload)
            return { success: true };

        } catch (error) {
            
        }
       
    }
};