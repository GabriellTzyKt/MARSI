import { env } from "$env/dynamic/private";
import { fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { Actions } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ fetch }) => {
    try {
        // ngambil data arsip
        const arsipRequest = await fetch(env.PUB_PORT + "/arsip?limit=100", {
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
        // Filter out deleted items
        const filteredArsipData = arsipData.filter((doc: any) => {
            return doc.deleted_at === '0001-01-01T00:00:00Z' && doc.deleted_at !== null;
        });
        console.log("Filtered arsip data:", filteredArsipData);

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
                    const filePathsRequest = await fetch(`${env.PUB_PORT}/doc/${docId}`, {
                        method: "GET",
                        headers: {
                            "Accept": "application/json"
                        }
                    });

                    if (!filePathsRequest.ok) {
                        console.error(`Failed to fetch file paths for doc ${docId}:`, filePathsRequest.status);
                        return {
                            ...docWithJenisArsip,
                            files: []
                        };
                    }

                    // dijadiin json, karena habis di fetch
                    const filePathsData = await filePathsRequest.json();
                    // console.log(`File paths data for doc ${docId}:`, filePathsData, typeof filePathsData);

                    // mastiin array soalnya bakal di proses kedalam function map()
                    let pathsArray = [];
                    if (Array.isArray(filePathsData)) {
                        pathsArray = filePathsData;
                    } else if (filePathsData) {
                        pathsArray = [filePathsData];
                    }
                    // console.log("Paths array:", pathsArray);

                    const filesWithData = await Promise.all(
                        pathsArray.map(async (filePath: any) => {
                            // console.log("Processing file path:", filePath);
                            try {
                                let actualPath;
                                if (typeof filePath === 'string') {
                                    actualPath = filePath;
                                } else if (filePath && filePath.file_dokumentasi) {
                                    actualPath = filePath.file_dokumentasi;
                                    // ini dijadiin stringify supaya ada isi / hasilnya, bukan undefined / null
                                } else {
                                    try {
                                        const parsedPath = typeof filePath === 'string' ? JSON.parse(filePath) : filePath;
                                        actualPath = parsedPath.file_dokumentasi || JSON.stringify(filePath);
                                    } catch (e) {
                                        actualPath = JSON.stringify(filePath);
                                    }
                                }

                                // console.log("Actual path to use:", actualPath);

                                // ini perlu di encode supaya tidak ada karakter khusus yang mengganggu karena perlu mengakses url langsung
                                const fileDataRequest = await fetch(`${env.PUB_PORT}/file?file_path=${encodeURIComponent(actualPath)}`, {
                                    method: "GET"
                                });

                                if (!fileDataRequest.ok) {
                                    console.error(`Failed to fetch file data for path ${actualPath}:`, fileDataRequest.status);
                                    return {
                                        path: actualPath,
                                        url: null,
                                        error: `Failed to load file: ${fileDataRequest.status}`
                                    };
                                }

                                // console.log(`Successfully fetched file for ${actualPath}`);

                                return {
                                    path: actualPath,
                                    url: `${env.PUB_PORT}/file?file_path=${encodeURIComponent(actualPath)}`,
                                    type: fileDataRequest.headers.get("content-type") || "unknown",
                                    name: actualPath.split('/').pop(),
                                    size: fileDataRequest.headers.get("content-length") || "unknown"
                                };
                            } catch (error: unknown) {
                                console.error(`Error processing file path:`, error);
                                return {
                                    path: typeof filePath === 'string' ? filePath : JSON.stringify(filePath),
                                    url: null,
                                    error: error instanceof Error ? error.message : "Unknown error occurred"
                                };
                            }
                        })
                    );

                    // console.log("Files with data:", filesWithData);
                    return {
                        ...docWithJenisArsip,
                        files: filesWithData
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

        return {
            dataArsip: documentsWithFiles,
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
        console.log("data id : " , data)
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
