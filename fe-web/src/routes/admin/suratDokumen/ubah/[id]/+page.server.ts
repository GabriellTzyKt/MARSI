import { env } from "$env/dynamic/private";
import { redirect } from "@sveltejs/kit";
import { error, fail, type Actions } from "@sveltejs/kit";
import { z } from "zod";

export const actions: Actions = {
    submit: async ({ request, params }) => {
        try {
            const data = await request.formData();
            const id = params.id;
            console.log("data 1", data)

            // console.log('Form data received:', Object.fromEntries(data.entries()));

            // ngambil data dari form yg diubah
            const namaDokumen = data.get('nama')?.toString();
            const kategori = data.get('kategori')?.toString();
            const jenisDokumen = data.get('jenisDokumen')?.toString();
            const subkategori = data.get('subkategori')?.toString();

            // Get existing file IDs from the form
            const existingFileIds = data.getAll('existingFileId')
                .map(id => id?.toString())
                .filter(id => id && id !== 'null' && id !== 'undefined');

            // console.log('Existing file IDs from form:', existingFileIds);

            // Get new files from the form
            const newFiles = data.getAll('uploadfile').filter(file => file instanceof File && file.size > 0) as File[];
            // console.log('New files from form:', newFiles.map(f => f.name));

            // Upload new files if any
            let newFileIds: string[] = [];
            if (newFiles.length > 0) {
                try {
                    // Upload each file individually to ensure all are processed
                    for (const file of newFiles) {
                        // console.log(`Processing file: ${file.name} (${file.size} bytes)`);

                        const singleFileFormData = new FormData();
                        singleFileFormData.append('dokumentasi', file);

                        // console.log(`Uploading file: ${file.name}`);
                        const uploadResponse = await fetch(`${env.PUB_PORT}/file/arsip`, {
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
                        // console.log(`Upload result for ${file.name}:`, uploadResult);

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
                            // console.log(`File ${file.name} uploaded with ID: ${fileId}`);
                            newFileIds.push(fileId);
                        } else {
                            console.warn(`Could not extract ID for file ${file.name}:`, uploadResult);
                        }
                    }

                    // console.log('All new files uploaded with IDs:', newFileIds);
                } catch (uploadError) {
                    console.error('Error in file upload process:', uploadError);
                    return fail(500, {
                        errors: `Error uploading files: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`,
                        success: false
                    });
                }
            }

            // Get existing document to use as fallback
            const existingDocResponse = await fetch(`${env.PUB_PORT}/arsip/${id}`);
            const existingDoc = existingDocResponse.ok ? await existingDocResponse.json() : { dokumentasi: '' };

            // Combine existing and new file IDs
            let allFileIds = [...existingFileIds];

            // Add new file IDs if any
            if (newFileIds.length > 0) {
                allFileIds = [...allFileIds, ...newFileIds];
            }

            // If no files provided at all, use existing dokumentasi from document
            let finalDokumentasi = allFileIds.length > 0
                ? allFileIds.join(',')
                : (existingDoc.dokumentasi || '');

            // console.log('Final dokumentasi value:', finalDokumentasi);

            // data-data yg akan dikirim ke api ( untuk edit )
            const payload = {
                id_arsip: Number(id),
                nama_arsip: namaDokumen || '',
                kategori_arsip: kategori || '',
                jenis_arsip: jenisDokumen ? Number(jenisDokumen) : 1, // Default to 1 if not provided or invalid
                sub_kategori_arsip: subkategori ? Number(subkategori) : 0,
                dokumentasi: finalDokumentasi
            };

            console.log('Sending payload to API:', payload);

            // update perubahan
            const response = await fetch(`${env.PUB_PORT}/arsip`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                console.error('API response error:', await response.text());
                try {
                    const errorData = await response.json();
                    console.error('API error details:', errorData);
                    return fail(response.status, {
                        errors: `Error updating document: ${errorData.message || response.statusText}`,
                        success: false
                    });
                } catch (e) {
                    return fail(response.status, {
                        errors: `Error updating document: ${response.statusText}`,
                        success: false
                    });
                }
            }

            // Setelah update arsip, lakukan pemeriksaan untuk arsip/kerajaan
            const form_id_arsip_kerajaan = data.get("id_arsip_kerajaan") || 0;
            const form_id_kerajaan = data.get("id_kerajaan");
            console.log(form_id_arsip_kerajaan, form_id_kerajaan, "ID 1");

            // Jika id_arsip_kerajaan ada, lakukan PUT (update)
            if (form_id_arsip_kerajaan !== 0 && form_id_kerajaan) {
                const putBody = {
                    id_arsip_kerajaan: Number(form_id_arsip_kerajaan),
                    id_arsip: Number(id),
                    id_kerajaan: Number(form_id_kerajaan)
                };

                const kerajaanPutResponse = await fetch(`${env.PUB_PORT}/arsip/kerajaan`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(putBody)
                });

                if (!kerajaanPutResponse.ok) {
                    const errText = await kerajaanPutResponse.text();
                    console.error('Failed to update arsip/kerajaan:', errText);
                    return fail(500, {
                        errors: `Gagal update arsip/kerajaan: ${errText}`,
                        success: false
                    });
                }

                console.log("Berhasil edit arsip");
            }
            else {
                const postBody = {
                    id_arsip: Number(id), // dari params.id
                    id_kerajaan: Number(form_id_kerajaan)
                };

                console.log("Ulala")
                const kerajaanPostResponse = await fetch(`${env.PUB_PORT}/arsip/kerajaan`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(postBody)
                });

                if (!kerajaanPostResponse.ok) {
                    const errText = await kerajaanPostResponse.text();
                    console.error("Failed to create new arsip/kerajaan:", errText);
                    return fail(500, {
                        errors: `Gagal create arsip/kerajaan: ${errText}`,
                        success: false
                    });
                }

                console.log("Berhasil create new arsip/kerajaan");
            }

            return {
                success: true,
                message: 'Dokumen berhasil diperbarui'
            };
        } catch (error: any) {
            console.error('Error in submit action:', error);
            return fail(500, {
                errors: `Terjadi kesalahan: ${error.message}`,
                success: false
            });
        }
    }
};

export const load = async ({ params, fetch, cookies }) => {


    const userSession = cookies.get("userSession");
    if (!userSession) {
        throw redirect(302, '/login2');
    }
    const session = JSON.parse(userSession);
    if (!session.adminData || session.adminData.jenis_admin !== 'super admin') {
        throw redirect(302, '/admin/biodata');
    }

    const id = params.id;

    try {
        // Fetch semua arsip
        const response = await fetch(`${env.PUB_PORT}/arsip?limit=1000`);
        if (!response.ok) {
            throw error(response.status, `Failed to fetch documents`);
        }
        const documents = await response.json();
        let filteredDocuments = documents.filter((item: any) =>
            (item.deleted_at === "0001-01-01T00:00:00Z" || item.deleted_at === null) &&
            item.id_arsip != id
        ); console.log("documents : ", documents);

        // Fetch data kerajaan
        const dataambil = await fetch(`${env.PUB_PORT}/kerajaan?limit=1000`);
        const data = await dataambil.json();

        const datafilter = data.filter((item: any) => item.deleted_at === "0001-01-01T00:00:00Z")

        // Fetch data arsip/kerajaan
        const arsipKerajaanResponse = await fetch(`${env.PUB_PORT}/arsip/kerajaan?limit=200`);
        if (!arsipKerajaanResponse.ok) {
            throw error(arsipKerajaanResponse.status, `Failed to fetch arsip/kerajaan`);
        }
        const arsipKerajaanData = await arsipKerajaanResponse.json();

        // Filter arsip/kerajaan berdasarkan id_arsip
        const arsipKerajaan = arsipKerajaanData.find(
            (item: { Arsip: { id_arsip: number } }) => item.Arsip.id_arsip === Number(id)
        );

        console.log("arsipKerajaan sesuai ID : ", arsipKerajaan);

        let namaKerajaan = "";
        if (arsipKerajaan && arsipKerajaan.id_kerajaan) {
            const matchingKerajaan = data.find(
                (item: { id_kerajaan: number; nama_kerajaan: string }) =>
                    Number(item.id_kerajaan) === Number(arsipKerajaan.id_kerajaan)
            );
            if (matchingKerajaan) {
                namaKerajaan = matchingKerajaan.nama_kerajaan;
            }
        }
        console.log("Nama Kerajaan:", namaKerajaan);

        // Konversi id dari string ke number untuk perbandingan
        const document = documents.find((doc: { id_arsip: number }) => doc.id_arsip === Number(id));
        if (!document) {
            throw error(404, `Document with ID ${id} not found`);
        }

        console.log("document sesuai ID : ", document);

        // Check if dokumentasi contains multiple IDs
        const dokumentasiValue = document.dokumentasi?.toString() || '';
        const docIds = dokumentasiValue.includes(',')
            ? dokumentasiValue.split(',').map((id: any) => id.trim()).filter(Boolean)
            : [dokumentasiValue];

        console.log(`Document has ${docIds.length} dokumentasi IDs:`, docIds);

        let fileDetails: any = [];

        // Process each document ID separately
        for (const docId of docIds) {
            if (!docId) continue;

            console.log(`Fetching doc/${docId}`);
            const filePathsRequest = await fetch(`${env.PUB_PORT}/doc/${docId}`, {
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
                    const fileDataRequest = await fetch(`${env.PUB_PORT}/file?file_path=${encodeURIComponent(actualPath)}`, {
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
                        url: `${env.PUB_PORT}/file?file_path=${encodeURIComponent(actualPath)}`,
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



        const jenisResponse = await fetch(`${env.PUB_PORT}/jenis-arsip`);
        const jenisArsip = jenisResponse.ok ? await jenisResponse.json() : [];
        const filteredjenisarsip = jenisArsip.filter((item: any) => item.deleted_at === "0001-01-01T00:00:00Z")


        const jenisResponse2 = await fetch(`${env.PUB_PORT}/jenis-arsip?limit=200`);
        const jenisArsip2 = jenisResponse2.ok ? await jenisResponse2.json() : [];
        const filteredjenisarsip2 = jenisArsip2.filter((item: any) => item.deleted_at === "0001-01-01T00:00:00Z")


        // Return semua data yang diperlukan
        return {
            document,
            jenisArsip: filteredjenisarsip,
            kerajaanData: datafilter,
            arsipData: filteredDocuments,
            filteredjenisarsip2,
            arsipKerajaan, // Tambahkan arsip/kerajaan yang sesuai
            namaKerajaan,
            files: fileDetails
        };
    } catch (e) {
        console.error(`Error loading document ${id}:`, e);
        throw error(500, "Failed to load document data");
    }
};
