import { env } from "$env/dynamic/private";
import { fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { Actions } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ fetch, cookies }) => {

    const userSession = cookies.get("userSession");
    if (!userSession) {
        throw redirect(302, '/login2');
    }
    const session = JSON.parse(userSession);
    if (!session.adminData || session.adminData.jenis_admin !== 'super admin') {
        throw redirect(302, '/admin/biodata');
    }

    try {
        // ngambil data arsip
        const arsipRequest = await fetch(env.PUB_PORT + "/arsip?limit=1000", {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });

        if (!arsipRequest.ok) {
            console.error("Failed to fetch arsip data:", arsipRequest.status);
            return { dataArsip: "Failed" };
        }

        const arsipData = await arsipRequest.json();

        // Log all document IDs
        console.log("All document IDs:");
        arsipData.forEach((doc: any) => {
            console.log(`ID: ${doc.id_arsip}, Dokumentasi ID: ${doc.dokumentasi}, Name: ${doc.nama_arsip}`);
        });

        // Filter out deleted items
        const filteredArsipData = arsipData.filter((doc: any) => {
            return doc.deleted_at === '0001-01-01T00:00:00Z' && doc.deleted_at !== null;
        });

        const enrichedArsipData = filteredArsipData.map((doc: any) => {
            // Cari dokumen lain yang id_arsip-nya sama dengan sub_kategori_arsip milik doc ini
            const subKategoriDoc = filteredArsipData.find(
                (d: any) => Number(doc.sub_kategori_arsip) === Number(d.id_arsip)
            );
            return {
                id_arsip: doc.id_arsip,
                sub_kategori_nama_arsip: subKategoriDoc.nama_arsip
            };
        });

        // 2. Ambil data arsip/kerajaan (linking data)
        const kerajaanResponse = await fetch(env.PUB_PORT + "/arsip/kerajaan?limit=2000", {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });
        if (!kerajaanResponse.ok) {
            console.error("Failed to fetch arsip/kerajaan data:", kerajaanResponse.status);
            return { dataArsip: "Failed" };
        }
        const arsipKerajaanData = await kerajaanResponse.json();

        // 3
        const documentsWithKerajaanInfo = filteredArsipData.map((doc: any) => {
            const matchingKerajaan = arsipKerajaanData.find(
                (item: any) =>
                    item.Arsip && Number(item.Arsip.id_arsip) === Number(doc.id_arsip)
            );

            const matchingEnriched = enrichedArsipData.find(
                (enriched: any) => Number(enriched.id_arsip) === Number(doc.id_arsip)
            );
            return {
                ...doc,
                arsipKerajaan: matchingKerajaan || null,
                ...(matchingEnriched ? matchingEnriched : {})
            };

        });

        // 4. (Opsional) Log hasilnya untuk debugging
        console.log("Documents with linked arsip/kerajaan info:");
        documentsWithKerajaanInfo.forEach((doc: any) => {
            console.log(`ID: ${doc.id_arsip}, Name: ${doc.nama_arsip}`);
            if (doc.arsipKerajaan) {
                console.log("  Linked arsipKerajaan:", doc.arsipKerajaan);
            }
        });


        // ngambil jenis arsip data
        const jenisArsipRequest = await fetch(env.PUB_PORT + "/jenis-arsip?limit=1000", {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });

        if (!jenisArsipRequest.ok) {
            console.error("Failed to fetch jenis arsip data:", jenisArsipRequest.status);
            return { dataArsip: "Failed", jenisArsip: "Failed" };
        }

        const jenisArsipData = await jenisArsipRequest.json();
        // console.log("Jenis arsip data fetched:", jenisArsipData);

        // ngambil kerajaan
        const jenisKerajaan = await fetch(env.PUB_PORT + "/kerajaan?limit=200", {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });

        if (!jenisKerajaan.ok) {
            console.error("Failed to fetch jenis arsip data:", jenisKerajaan.status);
            return { dataArsip: "Failed", jenisArsip: "Failed" };
        }

        const jenisKerajaanData = await jenisKerajaan.json();
        // console.log("Kerajaan total :", jenisKerajaanData);

        // proses data arsip + nambah jenis arsip
        const documentsWithFiles = await Promise.all(
            filteredArsipData.map(async (doc: any) => {
                try {
                    // nyari id yang sama
                    const matchingJenisArsip = jenisArsipData.find((jenis: any) =>
                        jenis.id_jenis_arsip === doc.jenis_arsip
                    );

                    // tambah data nama_jenis ( id yg sama ) utk ditampilkan di halaman awal
                    const docWithJenisArsip = {
                        ...doc,
                        jenis_arsip_detail: matchingJenisArsip.nama_jenis || "tidak ada"
                    };

                    const docId = doc.dokumentasi;
                    // Handle multiple document IDs separated by commas
                    const docIds = typeof docId === 'string'
                        ? docId.split(',').map(id => id.trim()).filter(id => id)
                        : [docId].filter(id => id);

                    // Process each document ID
                    const allFilesWithData = await Promise.all(
                        docIds.map(async (singleDocId) => {
                            try {
                                const filePathsRequest = await fetch(`${env.BASE_URL}/doc/${singleDocId}`, {
                                    method: "GET",
                                    headers: {
                                        "Accept": "application/json"
                                    }
                                });

                                if (!filePathsRequest.ok) {
                                    console.error(`Failed to fetch file paths for doc ${singleDocId}:`, filePathsRequest.status);
                                    return [];
                                }

                                // Process file paths for this document ID
                                const filePathsData = await filePathsRequest.json();
                                let pathsArray = [];
                                if (Array.isArray(filePathsData)) {
                                    pathsArray = filePathsData;
                                } else if (filePathsData) {
                                    pathsArray = [filePathsData];
                                }

                                // Process each file path
                                return await Promise.all(
                                    pathsArray.map(async (filePath: any, index: number) => {
                                        console.log(`[${index}] Processing file path:`, filePath);
                                        try {
                                            let actualPath;
                                            if (typeof filePath === 'string') {
                                                actualPath = filePath;
                                                console.log(`[${index}] Path is string:`, actualPath);
                                            } else if (filePath && filePath.file_dokumentasi) {
                                                actualPath = filePath.file_dokumentasi;
                                                console.log(`[${index}] Path from file_dokumentasi:`, actualPath);
                                            } else {
                                                try {
                                                    const parsedPath = typeof filePath === 'string' ? JSON.parse(filePath) : filePath;
                                                    actualPath = parsedPath.file_dokumentasi || JSON.stringify(filePath);
                                                    console.log(`[${index}] Path from parsed object:`, actualPath);
                                                } catch (e) {
                                                    actualPath = JSON.stringify(filePath);
                                                    console.log(`[${index}] Path from stringified object:`, actualPath);
                                                }
                                            }

                                            // Log all versions of the URL for testing
                                            const encodedPath = encodeURIComponent(actualPath);
                                            const rawUrl = `${env.BASE_URL}/file?file_path=${actualPath}`;
                                            const encodedUrl = `${env.BASE_URL}/file?file_path=${encodedPath}`;

                                            console.log(`[${index}] Raw URL (for manual testing): ${rawUrl}`);
                                            console.log(`[${index}] Encoded URL (used in fetch): ${encodedUrl}`);

                                            // Buat FormData untuk request
                                            const formData = new FormData();
                                            formData.append("file_path", actualPath);

                                            // First try with encoded URL and FormData
                                            let fileDataRequest = await fetch(encodedUrl, {
                                                method: "GET"
                                            });

                                            // If encoded URL fails, try with raw URL
                                            if (!fileDataRequest.ok) {
                                                console.log(`[${index}] Encoded URL failed, trying raw URL...`);
                                                const rawFormData = new FormData();
                                                rawFormData.append("file_path", actualPath);

                                                fileDataRequest = await fetch(rawUrl, {
                                                    method: "POST",
                                                    body: rawFormData
                                                });
                                                console.log(`[${index}] Raw URL response status: ${fileDataRequest.status} ${fileDataRequest.statusText}`);
                                            }

                                            if (!fileDataRequest.ok) {
                                                console.error(`[${index}] Both URLs failed for path ${actualPath}:`, fileDataRequest.status);
                                                return {
                                                    path: actualPath,
                                                    rawUrl: rawUrl,  // Include raw URL for testing
                                                    encodedUrl: encodedUrl,  // Include encoded URL for testing
                                                    url: null,
                                                    error: `Failed to load file: ${fileDataRequest.status}`
                                                };
                                            }

                                            // Use whichever URL worked
                                            const workingUrl = fileDataRequest.url || (fileDataRequest.ok ? (fileDataRequest === await fetch(encodedUrl) ? encodedUrl : rawUrl) : null);
                                            console.log(`[${index}] Successfully fetched file using URL: ${workingUrl}`);

                                            return {
                                                path: actualPath,
                                                url: workingUrl,
                                                type: fileDataRequest.headers.get("content-type") || "unknown",
                                                name: actualPath.split('/').pop(),
                                                size: fileDataRequest.headers.get("content-length") || "unknown"
                                            };
                                        } catch (error: unknown) {
                                            console.error(`[${index}] Error processing file path:`, error);
                                            return {
                                                path: typeof filePath === 'string' ? filePath : JSON.stringify(filePath),
                                                url: null,
                                                error: error instanceof Error ? error.message : "Unknown error occurred"
                                            };
                                        }
                                    })
                                );
                            } catch (error) {
                                console.error(`Error processing document ID ${singleDocId}:`, error);
                                return [];
                            }
                        })
                    );

                    // Flatten the array of arrays into a single array of files
                    const filesWithData = allFilesWithData.flat();



                    // console.log("Files with data:", filesWithData);
                    return {
                        ...docWithJenisArsip,
                        files: filesWithData,
                        sub_kategori_nama_arsip: (() => {
                            const match = enrichedArsipData.find(
                                (enriched: any) => Number(enriched.id_arsip) === Number(doc.id_arsip)
                            );
                            return match ? match.sub_kategori_nama_arsip : null;
                        })(),
                        nama_kerajaan: (() => {
                            const arsipKerajaan = arsipKerajaanData.find(
                                (item: any) =>
                                    item.Arsip && Number(item.Arsip.id_arsip) === Number(doc.id_arsip)
                            );
                            if (arsipKerajaan && arsipKerajaan.id_kerajaan) {
                                const kerajaan = jenisKerajaanData.find(
                                    (k: any) => Number(k.id_kerajaan) === Number(arsipKerajaan.id_kerajaan)
                                );
                                return kerajaan ? kerajaan.nama_kerajaan : null;
                            }
                            return null;
                        })()
                    };
                } catch (error: unknown) {
                    // console.error(`Error processing document ${doc.id_arsip}:`, error);
                    return {
                        ...doc,
                        jenis_arsip_detail: null,
                        files: [],
                        error: error instanceof Error ? error.message : "Unknown error occurred"
                    };
                }
            })
        );

        console.log("Documents : ", documentsWithFiles)

        return {
            dataArsip: documentsWithFiles,
            arsip: documentsWithKerajaanInfo,
            // jenisArsip: jenisArsipData 
        };
    } catch (e) {
        if (e instanceof Error) {
            // console.error("Error in load function:", e.message);
            return { dataArsip: "Failed", error: e.message };
        }
        return { dataArsip: "Failed", error: "Unknown error" };
    }
};

export const actions: Actions = {
    delete: async ({ request }) => {
        const data = await request.formData()
        console.log("data id : ", data)
        try {
            const del = await fetch(`${env.PUB_PORT}/arsip/${data.get("id_arsip")}`, {
                method: "DELETE"
            })
            const m = await del.json()
            if (!del.ok) {
                return fail(406, { error: `Code ${del.status} Message: ${m.message}` })
            }
            console.log(m.message)
            return { error: "no error" }
        }
        catch (error) {

        }
    },
};
