import { env } from "$env/dynamic/private";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch }) => {
    try {
        // Fetch data arsip
        const arsipRequest = await fetch(env.PUB_PORT + "/arsip?limit=200", {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });
        
        if (!arsipRequest.ok) {
            console.error("Failed to fetch arsip data:", arsipRequest.status);
            return { dataArsip: "Failed" };
        }
        
        // dijadiin bentuk json, supaya datanya bisa di akses dan di manipulasi ( karena bentuknya sudah menjadi array atau objek Javascript)
        const arsipData = await arsipRequest.json();
        console.log("Arsip data fetched:", arsipData);
        
        // promise itu ngebantu supaya data yg diproses lebih cepat (karena dilakukan bersamaan) dan tidak menggangu thread utama ( karena asynchronus )
        const documentsWithFiles = await Promise.all(
            // disini makek map karena kita perlu memodifikasi setiap dokumen ( menambahkan file kedalam setiap dokumen )
            arsipData.map(async (doc : any) => {
                try {
                    
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
                            ...doc,
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
                    console.log("Paths array:", pathsArray);

                    const filesWithData = await Promise.all(
                        pathsArray.map(async (filePath: any) => {
                            console.log("Processing file path:", filePath);
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

                                console.log("Actual path to use:", actualPath);

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

                                console.log(`Successfully fetched file for ${actualPath}`);

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

                    console.log("Files with data:", filesWithData);
                    return {
                        ...doc,
                        files: filesWithData
                    };
                } catch (error : unknown) {
                    console.error(`Error processing document ${doc.id_arsip}:`, error);
                    return {
                        ...doc,
                        files: [],
                        error: error instanceof Error ? error.message : "Unknown error occurred"
                    };
                }
            })
        );
        
        return { dataArsip: documentsWithFiles };
    } catch (e) {
        if (e instanceof Error) {
            console.error("Error in load function:", e.message);
            return { dataArsip: "Failed", error: e.message };
        }
        return { dataArsip: "Failed", error: "Unknown error" };
    }
};
