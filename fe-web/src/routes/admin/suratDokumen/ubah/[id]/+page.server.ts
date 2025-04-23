import { env } from "$env/dynamic/private";
import { error, fail, type Actions } from "@sveltejs/kit";
import { z } from "zod";

export const actions: Actions = {
    submit: async ({ request, params }) => {
        const data = await request.formData();
        const id = params.id;
        console.log('ubah 1 : ',data)

        const ver = z.object({
            namaDokumen: z.string({ message: "Input Tidak Boleh Kosong" }).max(255).nonempty("Isi Nama"),
            jenisDokumen: z.string({ message: "Pilih 1 pilihan!" }),
            kategori: z.string({ message: "Pilih 1 pilihan!" }),
        });

        const namaDokumen = data.get("nama");
        const kategori = data.get("kategori");
        const jenisDokumen = data.get("jenisDokumen");
        const subkategori = data.get("subkategori");
        const keterkaitan = data.get("keterkaitan") || ""; // Menambahkan definisi keterkaitan
        const urlFoto = data.getAll("uploadfile")
            .filter((file) => file instanceof File && file.size > 0)
            .map((file) => (file as File).name);

        console.log('urlfoto : ', urlFoto)    

        const validation = ver.safeParse({
            namaDokumen,
            kategori,
            jenisDokumen,
        });

        if (!validation.success) {
            const fieldErrors = validation.error.flatten().fieldErrors;
            
            return fail(406, {
                errors: fieldErrors,
                success: false,
                formData: { namaDokumen, kategori, jenisDokumen, subkategori, keterkaitan, urlFoto },
                type: "add"
            });
        }

        try {
            // Ambil file untuk dikirim ke endpoint /file/arsip
            const files = data.getAll("uploadfile")
                .filter((file) => file instanceof File && file.size > 0);
            
                console.log("files 1: ", files)
            
            let id_path = null;
            
            // Hanya kirim request ke /file/arsip jika ada file yang diupload
            if (files.length > 0) {
                console.log("Isi file ada")
                // Persiapkan FormData untuk endpoint /file/arsip
                const fileFormData = new FormData();
                fileFormData.append("kategori_arsip", kategori?.toString() || "");
                fileFormData.append("jenis_arsip", jenisDokumen?.toString() || "");
                
                // Tambahkan file ke FormData
                files.forEach((file) => {
                    fileFormData.append("dokumentasi", file);
                });
                
                console.log("Mengirim data ke /file/arsip");
                
                // Kirim request POST ke endpoint /file/arsip
                const fileResponse = await fetch(`${env.PUB_PORT}/file/arsip`, {
                    method: "POST",
                    body: fileFormData,
                });
                
                if (!fileResponse.ok) {
                    const errorData = await fileResponse.json();
                    return fail(fileResponse.status, { 
                        errors: `Error ${fileResponse.status}: ${errorData.message || 'Gagal mengupload file'}`,
                        success: false
                    });
                }
                
                // Ambil id_path dari response
                const fileResult = await fileResponse.json();
                console.log("file result: ", fileResult)
                id_path = fileResult.id_path;
                
                console.log("ID Path dari /file/arsip:", id_path);
            }
            
            // Persiapkan JSON payload untuk dikirim ke API /arsip
            const payload = {
                id_arsip: Number(id),
                nama_arsip: namaDokumen?.toString() || "",
                kategori_arsip: kategori?.toString() || "",
                jenis_arsip: Number(jenisDokumen) || 0,
                sub_kategori_arsip: Number(subkategori) || 0,
                dokumentasi : id_path?.toString() || ""
            };
            
            // Tambahkan id_path jika ada
            // if (id_path) {
            //     payload.dokumentasi = id_path;
            // }
            
            console.log("JSON payload untuk /arsip:", payload);

            // Kirim request PUT ke endpoint /arsip dengan JSON
            const response = await fetch(`${env.PUB_PORT}/arsip`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return fail(response.status, { 
                    errors: `Error ${response.status}: ${errorData.message || 'Unknown error'}`,
                    success: false
                });
            }

            const result = await response.json();
            return { 
                success: true, 
                message: "Dokumen berhasil diperbarui",
                data: result
            };
        } catch (error) {
            console.error("Error updating document:", error);
            return fail(500, { 
                errors: "Terjadi kesalahan saat memperbarui dokumen", 
                success: false 
            });
        }
    }
};

export const load = async ({ params, fetch }) => {
    const id = params.id;
    
    try {
        // Fetch semua arsip
        const response = await fetch(`${env.PUB_PORT}/arsip?limit=1000`);
        
        if (!response.ok) {
            throw error(response.status, `Failed to fetch documents`);
        }
        
        const documents = await response.json();
        console.log("documents : ", documents);

        const dataambil = await fetch(`${env.PUB_PORT}/kerajaan?limit=200`);

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
