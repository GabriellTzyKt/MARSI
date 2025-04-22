import { env } from "$env/dynamic/private";
import { error, fail, type Actions } from "@sveltejs/kit";
import { z } from "zod";

export const actions: Actions = {
    submit: async ({ request, params }) => {
        const data = await request.formData();
        const id = params.id; // Mengambil ID dari parameter URL
        console.log('ubah : ',data)

        const ver = z.object({
            namaDokumen: z.string({ message: "Input Tidak Boleh Kosong" }).max(255).nonempty("Isi Nama"),
            asalKerajaan: z.string({ message: "Pilih 1 pilihan!" }),
            jenisDokumen: z.string({ message: "Pilih 1 pilihan!" }),
            kategori: z.string({ message: "Pilih 1 pilihan!" }),
            urlfoto: z.array(z.string({message : "Input Minimal 1 Foto!"})).min(1, { message: "Minimal 1 Foto!" }), // Ubah jadi array
        });

        const namaDokumen = data.get("nama");
        const asalKerajaan = data.get("asalKerajaan");
        const kategori = data.get("kategori");
        const jenisDokumen = data.get("jenisDokumen");
        const urlFoto = data.getAll("uploadfile")
            .filter((file) => file instanceof File && file.size > 0)
            .map((file) => (file as File).name);

        const validation = ver.safeParse({
            namaDokumen,
            asalKerajaan,
            kategori,
            jenisDokumen,
            urlfoto: urlFoto,
        });

        if (!validation.success) {
            return {
                errors: validation.error.flatten().fieldErrors, success: false,
                values: { namaDokumen, asalKerajaan, kategori, jenisDokumen, urlfoto: urlFoto },
            };
        }

        try {
            // Persiapkan FormData untuk dikirim ke API
            const formData = new FormData();
            formData.append("id_arsip", id || "");
            formData.append("nama_arsip", namaDokumen?.toString() || "");
            formData.append("kategori_arsip", kategori?.toString() || "");
            formData.append("jenis_arsip", jenisDokumen?.toString() || "");
            
            // Tambahkan file ke FormData jika ada
            const files = data.getAll("uploadfile")
                .filter((file) => file instanceof File && file.size > 0);
            
            if (files.length > 0) {
                files.forEach((file) => {
                    formData.append("dokumentasi", file);
                });
            }

            // Kirim request PUT ke endpoint /arsip
            const response = await fetch(`${env.PUB_PORT}/arsip`, {
                method: "PUT",
                body: formData,
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
            console.log("File paths data:", filePathsData);
            
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
            console.log("file details: ", fileDetails)
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
