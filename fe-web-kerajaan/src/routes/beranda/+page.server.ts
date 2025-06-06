import { env } from "$env/dynamic/private";
import { formatDatetoUI } from "$lib";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    try {
        // Fetch all data in parallel for better performance
        const [situsRes,  acaraDisetujuiRes, acaraBerlangsungRes, organisasiRes, komunitasRes,berandaRes] = await Promise.all([
            fetch(`${env.URL_KERAJAAN}/situs?limit=500`),
            fetch(`${env.URL_KERAJAAN}/acara/status?status=Disetujui`),
            fetch(`${env.URL_KERAJAAN}/acara/status?status=Berlangsung`),
            fetch(`${env.URL_KERAJAAN}/organisasi?limit=500`),
            fetch(`${env.URL_KERAJAAN}/komunitas?limit=500`),
            fetch(`${env.URL_KERAJAAN}/beranda`),
        ]);

        // Check responses
        if (!situsRes.ok) throw new Error(`Situs API error: ${situsRes.status}`);
        if (!acaraDisetujuiRes.ok) throw new Error(`Acara Disetujui API error: ${acaraDisetujuiRes.status}`);
        if (!acaraBerlangsungRes.ok) throw new Error(`Acara Berlangsung API error: ${acaraBerlangsungRes.status}`);
        if (!organisasiRes.ok) throw new Error(`Organisasi API error: ${organisasiRes.status}`);
        if (!komunitasRes.ok) throw new Error(`Komunitas API error: ${komunitasRes.status}`);
        if (!berandaRes.ok) throw new Error(`Komunitas API error: ${komunitasRes.status}`);

        // Parse JSON responses one by one to identify the issue
        const situsData = await situsRes.json();
        const acaraDisetujuiData = await acaraDisetujuiRes.json();
        const acaraBerlangsungData = await acaraBerlangsungRes.json();
        const organisasiData = await organisasiRes.json();
        const komunitasData = await komunitasRes.json();
        const berandaData = await berandaRes.json();

        // Gabungkan acara Disetujui dan Berlangsung, lalu filter duplikat berdasarkan id_acara
        const acaraGabungan = [
            ...acaraDisetujuiData,
            ...acaraBerlangsungData
        ].filter((item, index, self) =>
            index === self.findIndex((t) => t.id_acara === item.id_acara)
        );

        let beranda = await Promise.all(
            berandaData.map(async (item: any) => {
                let dokumentasi_url = "";
                if (item.dokumentasi && typeof item.dokumentasi === "string" && item.dokumentasi.trim() !== "") {
                    try {
                        const pict = await fetch(`${env.URL_KERAJAAN}/doc/${item.dokumentasi}`);
                        if (pict.ok) {
                            const filePathData = await pict.json();
                            const filePath = filePathData.file_dokumentasi || filePathData;
                            if (typeof filePath === "string") {
                                dokumentasi_url = `${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(filePath)}`;
                            }
                        }
                    } catch (err) {
                        console.error("Error fetching dokumentasi for beranda:", err);
                    }
                }
                return {
                    ...item,
                    dokumentasi_url
                };
            })
        );

        console.log("Raw data types:", {
            situs: typeof situsData, isArray: Array.isArray(situsData),
            
            organisasi: typeof organisasiData, isArray2: Array.isArray(organisasiData),
            komunitas: typeof komunitasData, isArray3: Array.isArray(komunitasData)
        });

        // Ensure all data are arrays
        const situsArray = Array.isArray(situsData) ? situsData : [situsData];
        
        const organisasiArray = Array.isArray(organisasiData) ? organisasiData : [organisasiData];
        const komunitasArray = Array.isArray(komunitasData) ? komunitasData : [komunitasData];

         // Filter out soft-deleted items
         const filteredSitus = situsArray.filter(item => 
            item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at
        ).slice(0,5);
        
        // Lanjutkan proses seperti sebelumnya, ganti acaraArray jadi acaraGabungan
        const acaraArray = Array.isArray(acaraGabungan) ? acaraGabungan : [acaraGabungan];
        const filteredAcara = acaraArray.filter(item =>
            item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at
        ).slice(0, 5);
        
        const filteredOrganisasi = organisasiArray.filter(item => 
            item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at
        ).slice(0,5);
        
        const filteredKomunitas = komunitasArray.filter(item => 
            item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at
        ).slice(0,5);
        console.log("Filtered data counts:", {
            situs: filteredSitus.length,
            acara: filteredAcara.length,
            organisasi: filteredOrganisasi.length,
            komunitas: filteredKomunitas.length
        });
        console.log("Filtered Acara", filteredAcara)
        // Process situs data with photos
        const processedSitus = await Promise.all(filteredSitus.map(async (item) => {
            const processedItem = { ...item, imageUrls: [] };
            
            if (item.foto_situs && item.foto_situs.trim() !== '') {
                try {
                    const docIds = item.foto_situs.split(',').map(id => id.trim());
                    
                    for (const id of docIds) {
                        if (!id) continue;
                        
                        const docRes = await fetch(`${env.URL_KERAJAAN}/doc/${id}`);
                        
                        if (docRes.ok) {
                            const docData = await docRes.json();
                            const filePath = docData.file_dokumentasi || docData;
                            
                            if (typeof filePath === 'string') {
                                processedItem.imageUrls.push(
                                    `${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(filePath)}`
                                );
                            } else if (Array.isArray(filePath)) {
                                filePath.forEach(path => {
                                    if (typeof path === 'string') {
                                        processedItem.imageUrls.push(
                                            `${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(path)}`
                                        );
                                    }
                                });
                            }
                        }
                    }
                } catch (error) {
                    console.error(`Error processing images for situs ${item.id_situs}:`, error);
                }
            }
            
            return processedItem;
        }));
        console.log("")
        // Process acara data with photos
        const processedAcara = await Promise.all(filteredAcara.map(async (item) => {
            const processedItem = {
                ...item,
                tanggal_mulai: formatDatetoUI(item.tanggal_mulai),
                tanggal_selesai: formatDatetoUI(item.tanggal_selesai),
                imageUrls: []
            };
            
            if (item.foto_acara && item.foto_acara.trim() !== '') {
                try {
                    const docIds = item.foto_acara.split(',').map(id => id.trim());
                    
                    for (const id of docIds) {
                        if (!id) continue;
                        
                        const docRes = await fetch(`${env.URL_KERAJAAN}/doc/${id}`);
                        
                        if (docRes.ok) {
                            const docData = await docRes.json();
                            const filePath = docData.file_dokumentasi || docData;
                            
                            if (typeof filePath === 'string') {
                                processedItem.imageUrls.push(
                                    `${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(filePath)}`
                                );
                            } else if (Array.isArray(filePath)) {
                                filePath.forEach(path => {
                                    if (typeof path === 'string') {
                                        processedItem.imageUrls.push(
                                            `${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(path)}`
                                        );
                                    }
                                });
                            }
                        }
                    }
                } catch (error) {
                    console.error(`Error processing images for acara ${item.id_acara}:`, error);
                }
            }
            
            return processedItem;
        }));

        // Process organisasi data with photos
        const processedOrganisasi = await Promise.all(filteredOrganisasi.map(async (item) => {
            const processedItem = {
                ...item,
                tanggal_berdiri: item.tanggal_berdiri ? formatDatetoUI(item.tanggal_berdiri) : '',
                imageUrls: []
            };
            
            if (item.foto_organisasi && item.foto_organisasi.trim() !== '') {
                try {
                    const docIds = item.foto_organisasi.split(',').map(id => id.trim());
                    
                    for (const id of docIds) {
                        if (!id) continue;
                        
                        const docRes = await fetch(`${env.URL_KERAJAAN}/doc/${id}`);
                        
                        if (docRes.ok) {
                            const docData = await docRes.json();
                            const filePath = docData.file_dokumentasi || docData;
                            
                            if (typeof filePath === 'string') {
                                processedItem.imageUrls.push(
                                    `${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(filePath)}`
                                );
                            } else if (Array.isArray(filePath)) {
                                filePath.forEach(path => {
                                    if (typeof path === 'string') {
                                        processedItem.imageUrls.push(
                                            `${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(path)}`
                                        );
                                    }
                                });
                            }
                        }
                    }
                } catch (error) {
                    console.error(`Error processing images for organisasi ${item.id_organisasi}:`, error);
                }
            }
            
            return processedItem;
        }));

        // Process komunitas data with photos
        const processedKomunitas = await Promise.all(filteredKomunitas.map(async (item) => {
            const processedItem = {
                ...item,
                tanggal_berdiri: item.tanggal_berdiri ? formatDatetoUI(item.tanggal_berdiri) : '',
                imageUrls: []
            };
            
            if (item.foto_komunitas && item.foto_komunitas.trim() !== '') {
                try {
                    const docIds = item.foto_komunitas.split(',').map(id => id.trim());
                    
                    for (const id of docIds) {
                        if (!id) continue;
                        
                        const docRes = await fetch(`${env.URL_KERAJAAN}/doc/${id}`);
                        
                        if (docRes.ok) {
                            const docData = await docRes.json();
                            const filePath = docData.file_dokumentasi || docData;
                            
                            if (typeof filePath === 'string') {
                                processedItem.imageUrls.push(
                                    `${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(filePath)}`
                                );
                            } else if (Array.isArray(filePath)) {
                                filePath.forEach(path => {
                                    if (typeof path === 'string') {
                                        processedItem.imageUrls.push(
                                            `${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(path)}`
                                        );
                                    }
                                });
                            }
                        }
                    }
                } catch (error) {
                    console.error(`Error processing images for komunitas ${item.id_komunitas}:`, error);
                }
            }
            
            return processedItem;
        }));

        console.log("Processed data counts:", {
            beranda
        });

        // Return all processed data
        return {
            situs: processedSitus,
            beranda,
            acara: processedAcara,
            organisasi: processedOrganisasi,
            komunitas: processedKomunitas
        };
    } catch (error) {
        console.error("Error in beranda load function:", error);
        return {
            situs: [],
            acara: [],
            organisasi: [],
            komunitas: [],
            error: error instanceof Error ? error.message : String(error)
        };
    }
};