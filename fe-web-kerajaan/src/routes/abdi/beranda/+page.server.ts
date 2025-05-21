import { env } from "$env/dynamic/private";
import { formatDate, formatDatetoUI } from "$lib";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    try {
        // Fetch all data in parallel for better performance
        const [situsRes, acaraRes, organisasiRes, komunitasRes] = await Promise.all([
            fetch(`${env.URL_KERAJAAN}/situs`),
            fetch(`${env.URL_KERAJAAN}/acara`),
            fetch(`${env.URL_KERAJAAN}/organisasi`),
            fetch(`${env.URL_KERAJAAN}/komunitas`)
        ]);

        // Check responses
        if (!situsRes.ok) throw new Error(`Situs API error: ${situsRes.status}`);
        if (!acaraRes.ok) throw new Error(`Acara API error: ${acaraRes.status}`);
        if (!organisasiRes.ok) throw new Error(`Organisasi API error: ${organisasiRes.status}`);
        if (!komunitasRes.ok) throw new Error(`Komunitas API error: ${komunitasRes.status}`);

        // Parse JSON responses
        const situsData = await situsRes.json();
        const acaraData = await acaraRes.json();
        const organisasiData = await organisasiRes.json();
        const komunitasData = await komunitasRes.json();

        // Ensure all data are arrays
        const situsArray = Array.isArray(situsData) ? situsData : [situsData];
        const acaraArray = Array.isArray(acaraData) ? acaraData : [acaraData];
        const organisasiArray = Array.isArray(organisasiData) ? organisasiData : [organisasiData];
        const komunitasArray = Array.isArray(komunitasData) ? komunitasData : [komunitasData];

        // Filter out soft-deleted items
        const filteredSitus = situsArray.filter(item => 
            item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at
        );
        
        const filteredAcara = acaraArray.filter(item => 
            item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at
        );
        
        const filteredOrganisasi = organisasiArray.filter(item => 
            item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at
        );
        
        const filteredKomunitas = komunitasArray.filter(item => 
            item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at
        );

        console.log("Filtered data counts:", {
            situs: filteredSitus.length,
            acara: filteredAcara.length,
            organisasi: filteredOrganisasi.length,
            komunitas: filteredKomunitas.length
        });

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
            situs: processedSitus.length,
            acara: processedAcara.length,
            organisasi: processedOrganisasi.length,
            komunitas: processedKomunitas.length
        });

        // Return all processed data
        return {
            situs: processedSitus,
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

