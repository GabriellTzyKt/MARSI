import { env } from "$env/dynamic/private";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({params, cookies}) => {
    try {
        let cook = JSON.parse(cookies.get("userSession") as string)
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
                let day = String(date.getDate()).padStart(2, '0');
                let month = String(date.getMonth() + 1).padStart(2, '0');
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

            let formattedData = {
                    ...data,
                    tanggal_mulai: formatDate(data.waktu_mulai),
                    tanggal_selesai: formatDate(data.waktu_selesai),
                    waktu_mulai: formatTime(data.waktu_mulai),
                    waktu_selesai: formatTime(data.waktu_selesai),
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
            console.log("Formatted Data",formattedData)
                return { data: formattedData, undangan: undanganWithUser, panit: panit, situs: situs, files: fileDetails};
           
        }

    }
    catch (e) {
        if (e instanceof Error) return console.log(e.message)
    }
};