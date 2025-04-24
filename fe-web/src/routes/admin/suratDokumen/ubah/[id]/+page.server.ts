import { env } from "$env/dynamic/private";
import { error, fail, type Actions } from "@sveltejs/kit";
import { z } from "zod";

export const actions: Actions = {
    submit: async ({ request, params }) => {
        try {
            const data = await request.formData();
            const id = params.id;
            
            console.log('Form data received:', Object.fromEntries(data.entries()));
            
            // ngambil data dari form yg diubah
            const namaDokumen = data.get('nama')?.toString();
            const kategori = data.get('kategori')?.toString();
            const jenisDokumen = data.get('jenisDokumen')?.toString();
            const subkategori = data.get('subkategori')?.toString();
            
            // ngambil file
            const existingFileIds = data.getAll('existingFileId')
                .map(id => id?.toString())
                .filter(Boolean);
            
            // ngambil file baru 
            const newFiles = data.getAll('uploadfile')
                .filter(file => file instanceof File && file.size > 0) as File[];
            
            // Validasi data
            if (!namaDokumen) {
                return fail(400, { 
                    errors: { namaDokumen: ['Nama dokumen tidak boleh kosong'] },
                    success: false 
                });
            }
            
            let id_path = null;
            
            // upload file baru
            if (newFiles.length > 0) {
                const fileFormData = new FormData();
                
                // nambahin data kedalem api
                fileFormData.append('kategori_arsip', kategori || '');
                fileFormData.append('jenis_arsip', jenisDokumen || '');
                
                // file baru yg diubah
                newFiles.forEach(file => {
                    fileFormData.append('dokumentasi', file);
                });
                                
                // nnyari id path foto lewat api 
                const fileResponse = await fetch(`${env.PUB_PORT}/file/arsip`, {
                    method: 'POST',
                    body: fileFormData
                });
                
                if (!fileResponse.ok) {
                    console.error('File upload failed:', await fileResponse.text());
                    return fail(fileResponse.status, {
                        errors: `Error uploading files: ${fileResponse.statusText}`,
                        success: false
                    });
                }
                
                // menambahkan id path yg didapat kedalam variabel
                const fileResult = await fileResponse.json();
                console.log('File upload result:', fileResult);
                id_path = fileResult.id_path;
            }
            
            // Ambil dokumentasi dari arsip jika ada dan tidak ada file yang diubah
            const docResponse = await fetch(`${env.PUB_PORT}/arsip?limit=1000`);
            if (!docResponse.ok) {
                return fail(docResponse.status, {
                    errors: `Error fetching existing document: ${docResponse.statusText}`,
                    success: false
                });
            }
            
            const documents = await docResponse.json();
            const existingDoc = documents.find((doc: { id_arsip: number }) => doc.id_arsip === Number(id));
            
            if (!existingDoc) {
                return fail(404, {
                    errors: `Document with ID ${id} not found`,
                    success: false
                });
            }
            
            // data-data yg akan dikirim ke api ( untuk edit )
            const payload = {
                id_arsip: Number(id),
                nama_arsip: namaDokumen || '',
                kategori_arsip: kategori || '',
                jenis_arsip: Number(jenisDokumen) || 0,
                sub_kategori_arsip: Number(subkategori) || 0,
                dokumentasi: id_path ? id_path.toString() : existingDoc.dokumentasi
            };
                        
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
                return fail(response.status, {
                    errors: `Error updating document: ${response.statusText}`,
                    success: false
                });
            }
            
            return { 
                success: true,
                message: 'Dokumen berhasil diperbarui'
            };
        } catch (error : any) {
            console.error('Error in submit action:', error);
            return fail(500, {
                errors: `Terjadi kesalahan: ${error.message}`,
                success: false
            });
        }
    }
};

export const load = async ({ params, fetch }) => {
    const id = params.id;
    
    try {
        // Fetch semua arsip
        const response = await fetch(`${env.PUB_PORT}/arsip?limit=100`);
        
        if (!response.ok) {
            throw error(response.status, `Failed to fetch documents`);
        }
        
        const documents = await response.json();
        console.log("documents : ", documents);

        const dataambil = await fetch(`${env.PUB_PORT}/kerajaan?limit=100`);

        const data = await dataambil.json();

        // Konversi id dari string ke number untuk perbandingan
        const document = documents.find((doc: { id_arsip: number }) => doc.id_arsip === Number(id));

        if (!document) {
            throw error(404, `Document with ID ${id} not found`);
        }

        console.log("document sesuai ID : ", document);
        
        // Fetch file paths untuk dokumen ini
        const filePathsRequest = await fetch(`${env.PUB_PORT}/doc/${document.dokumentasi}`, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });

        let fileDetails = [];
        
        if (filePathsRequest.ok) {
            const filePathsData = await filePathsRequest.json();
            // console.log("File paths data:", filePathsData);
            
            // Jika file_dokumentasi adalah string, konversi ke array
            const filePaths = Array.isArray(filePathsData.file_dokumentasi) 
                ? filePathsData.file_dokumentasi 
                : [filePathsData.file_dokumentasi];
            
            // Ambil detail untuk setiap file
            fileDetails = await Promise.all(filePaths.map(async (path : any) => {
                if (!path) return null;
                
                const actualPath = path;
                console.log("Processing file path:", actualPath);
                
                try {
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
                    
                    return {
                        path: actualPath,
                        url: `${env.PUB_PORT}/file?file_path=${encodeURIComponent(actualPath)}`,
                        type: fileDataRequest.headers.get("content-type") || "unknown",
                        name: actualPath.split('/').pop(),
                        size: fileDataRequest.headers.get("content-length") || "unknown"
                    };
                } catch (error) {
                    console.error(`Error processing file path ${actualPath}:`, error);
                    return {
                        path: actualPath,
                        url: null,
                        error: error instanceof Error ? error.message : "Unknown error"
                    };
                }
            }));
            
            fileDetails = fileDetails.filter(file => file !== null);
            console.log("file details 11: ", fileDetails)
        } else {
            console.error(`Failed to fetch file paths for doc ${id}:`, filePathsRequest.status);
        }
        
        const jenisResponse = await fetch(`${env.PUB_PORT}/jenis-arsip`);
        const jenisArsip = jenisResponse.ok ? await jenisResponse.json() : [];
        
        // Return semua data yang diperlukan
        return {
            document,
            jenisArsip,
            data,
            files: fileDetails
        };
    } catch (e) {
        console.error(`Error loading document ${id}:`, e);
        throw error(500, "Failed to load document data");
    }
};
