import { data_showraja } from "$lib/dummy";
import { fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { z } from "zod";
import { env } from "$env/dynamic/private";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params, cookies }) => {

    const userSession = cookies.get("userSession");
    if (!userSession) {
        throw redirect(302, '/login2');
    }

    const session = JSON.parse(userSession);
    console.log("session : ", session)
    if (!session.adminData || session.adminData.jenis_admin !== 'admin kerajaan') {
        throw redirect(302, '/admin/beranda');
    }

    try {
        // Ambil semua data kerajaan
        const response = await fetch(`${env.BASE_URL}/kerajaan?limit=200`, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const allKerajaan = await response.json();

        // Ambil data jenis kerajaan
        const jenisResponse = await fetch(`${env.BASE_URL}/kerajaan/jenis?limit=200`, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });

        if (!jenisResponse.ok) {
            throw new Error(`HTTP Error! Status: ${jenisResponse.status}`);
        }

        const jenisKerajaan = await jenisResponse.json();

        const gelarResponse = await fetch(`${env.BASE_URL}/gelar?limit=200`, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });

        if (!gelarResponse.ok) {
            throw new Error(`HTTP Error! Status: ${gelarResponse.status}`);
        }

        const gelarKerajaan = await gelarResponse.json();

        const filteredGelarKerajaan = gelarKerajaan.filter(
            (item: any) => item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at
        );


        const historyResponse = await fetch(`${env.BASE_URL}/history-raja?limit=200`, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });

        if (!historyResponse.ok) {
            throw new Error(`HTTP Error! Status: ${historyResponse.status}`);
        }

        const listHistory = await historyResponse.json();

        // Filter jenis kerajaan yang tidak dihapus
        const filteredJenisKerajaan = jenisKerajaan.filter((item: any) =>
            item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at
        );

        // Filter history raja berdasarkan id_kerajaan dan status deleted
        console.log(`Filtering history raja for kerajaan ID: ${params.id}`);
        const filteredHistoryRaja = listHistory.filter((item: any) => {
            const notDeleted = item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at;
            const matchesKerajaan = item.id_kerajaan === parseInt(params.id);
            return notDeleted && matchesKerajaan;
        });

        console.log(`Found ${filteredHistoryRaja.length} history raja records for this kerajaan`);

        // Tambahkan URL gambar dan format tahun menjabat untuk setiap history raja
        console.log("Processing images and formatting dates for history raja...");
        const historyRajaWithImages = [];

        // Gunakan loop for biasa daripada Promise.all untuk debugging yang lebih mudah
        for (let i = 0; i < filteredHistoryRaja.length; i++) {
            const raja = filteredHistoryRaja[i];
            console.log(`Processing raja ${i + 1}/${filteredHistoryRaja.length}: ${raja.nama_raja || 'Unknown'}`);

            // Buat salinan objek raja
            const rajaWithImage = {
                ...raja,
                imageUrl: '',
                periodeMenjabat: '' // Tambahkan properti untuk periode menjabat
            };

            // Format periode menjabat (tahun mulai - tahun selesai)
            try {
                // Ambil tahun dari tanggal mulai menjabat
                const mulaiDate = new Date(raja.mulai_menjabat);
                const tahunMulai = mulaiDate.getFullYear();

                // Cek apakah tanggal selesai menjabat valid
                const selesaiDate = new Date(raja.selesai_menjabat);
                let periodeMenjabat = '';

                // Jika tanggal selesai adalah default (0001-01-01) atau tidak ada, berarti "sampai sekarang"
                if (raja.selesai_menjabat === '0001-01-01T00:00:00Z' || !raja.selesai_menjabat) {
                    periodeMenjabat = `${tahunMulai} - Sekarang`;
                } else {
                    const tahunSelesai = selesaiDate.getFullYear();
                    periodeMenjabat = `${tahunMulai} - ${tahunSelesai}`;
                }

                rajaWithImage.periodeMenjabat = periodeMenjabat;
                console.log(`Periode menjabat: ${periodeMenjabat}`);
            } catch (error) {
                console.error(`Error formatting periode menjabat:`, error);
                rajaWithImage.periodeMenjabat = 'Periode tidak diketahui';
            }

            // Cek apakah raja memiliki foto
            if (raja.dokumentasi && raja.dokumentasi.trim() !== '') {
                console.log(`Raja has foto_raja ID: ${raja.dokumentasi}`);

                try {
                    // Ambil file path dari endpoint /doc/{id}
                    const docUrl = `${env.BASE_URL}/doc/${raja.dokumentasi}`;
                    console.log(`Fetching document from: ${docUrl}`);

                    const docRes = await fetch(docUrl);
                    console.log(`Document fetch status: ${docRes.status}`);

                    if (docRes.ok) {
                        const docData = await docRes.json();
                        console.log(`Document data received:`, docData);

                        const filePath = docData.file_dokumentasi || docData;
                        console.log(`File path extracted: ${typeof filePath === 'string' ? filePath : 'Not a string'}`);

                        if (typeof filePath === 'string') {
                            // Buat URL lengkap ke file
                            rajaWithImage.imageUrl = `${env.BASE_URL}/file?file_path=${encodeURIComponent(filePath)}`;
                            console.log(`Image URL created: ${rajaWithImage.imageUrl}`);
                        }
                    } else {
                        console.log(`Failed to fetch document: ${docRes.status}`);
                    }
                } catch (error) {
                    console.error(`Error processing image:`, error);
                }
            } else {
                console.log(`Raja has no foto_raja ID`);
            }

            historyRajaWithImages.push(rajaWithImage);
        }

        console.log(`Processed ${historyRajaWithImages.length} raja records with images and date periods`);
        console.log("Sample raja with image and period:", historyRajaWithImages[0] || "No records");

        // Cari kerajaan dengan ID yang sesuai
        const id_kerajaan = parseInt(params.id);
        const detil_kerajaan = allKerajaan.find((kerajaan: any) => kerajaan.id_kerajaan === id_kerajaan);

        if (!detil_kerajaan) {
            throw new Error(`Data kerajaan dengan ID ${id_kerajaan} tidak ditemukan`);
        }

        // Prepare arrays for all media types
        let imageUrls = [];
        let benderaUrl = '';
        let lambangUrl = '';
        let videoUrl = '';

        if (detil_kerajaan.foto_umum && detil_kerajaan.foto_umum.trim() !== '') {
            const photoIds = detil_kerajaan.foto_umum.split(',').map((id: string) => id.trim());

            // Fetch file path for each photo ID
            for (const photoId of photoIds) {
                if (!photoId) continue;

                try {
                    const docRes = await fetch(`${env.BASE_URL}/doc/${photoId}`);

                    if (docRes.ok) {
                        const docData = await docRes.json();
                        const filePath = docData.file_dokumentasi || docData;

                        if (typeof filePath === 'string') {
                            imageUrls.push(`${env.BASE_URL}/file?file_path=${encodeURIComponent(filePath)}`);
                        }
                    }
                } catch (error) {
                    console.error(`Error fetching document with ID ${photoId}:`, error);
                }
            }
        }

        // Process bendera_kerajaan (single item)
        if (detil_kerajaan.bendera_kerajaan && detil_kerajaan.bendera_kerajaan.trim() !== '') {
            try {
                const docRes = await fetch(`${env.BASE_URL}/doc/${detil_kerajaan.bendera_kerajaan}`);

                if (docRes.ok) {
                    const docData = await docRes.json();
                    const filePath = docData.file_dokumentasi || docData;

                    if (typeof filePath === 'string') {
                        benderaUrl = `${env.BASE_URL}/file?file_path=${encodeURIComponent(filePath)}`;
                    }
                }
            } catch (error) {
                console.error(`Error fetching bendera with ID ${detil_kerajaan.bendera_kerajaan}:`, error);
            }
        }

        // Process lambang_kerajaan (single item)
        if (detil_kerajaan.lambang_kerajaan && detil_kerajaan.lambang_kerajaan.trim() !== '') {
            try {
                const docRes = await fetch(`${env.BASE_URL}/doc/${detil_kerajaan.lambang_kerajaan}`);

                if (docRes.ok) {
                    const docData = await docRes.json();
                    const filePath = docData.file_dokumentasi || docData;

                    if (typeof filePath === 'string') {
                        lambangUrl = `${env.BASE_URL}/file?file_path=${encodeURIComponent(filePath)}`;
                    }
                }
            } catch (error) {
                console.error(`Error fetching lambang with ID ${detil_kerajaan.lambang_kerajaan}:`, error);
            }
        }

        // Process video_kerajaan (single item)
        if (detil_kerajaan.video_kerajaan && detil_kerajaan.video_kerajaan.trim() !== '') {
            try {
                const docRes = await fetch(`${env.BASE_URL}/doc/${detil_kerajaan.video_kerajaan}`);

                if (docRes.ok) {
                    const docData = await docRes.json();
                    const filePath = docData.file_dokumentasi || docData;

                    if (typeof filePath === 'string') {
                        videoUrl = `${env.BASE_URL}/file?file_path=${encodeURIComponent(filePath)}`;
                    }
                }
            } catch (error) {
                console.error(`Error fetching video with ID ${detil_kerajaan.video_kerajaan}:`, error);
            }
        }

        // Add all media URLs to the kerajaan data
        const kerajaanWithMedia = {
            ...detil_kerajaan,
            imageUrls,
            benderaUrl,
            lambangUrl,
            videoUrl
        };

        console.log("DATA RAJA : ", kerajaanWithMedia)

        const [eraRes, rumpunRes] = await Promise.all([
            fetch(`${env.BASE_URL}/era?limit=200`, {
                method: "GET",
                headers: { "Accept": "application/json" }
            }),
            fetch(`${env.BASE_URL}/rumpun?limit=200`, {
                method: "GET",
                headers: { "Accept": "application/json" }
            })
        ]);

        if (!eraRes.ok || !rumpunRes.ok) {
            throw new Error(`HTTP Error! Status: era=${eraRes.status}, rumpun=${rumpunRes.status}`);
        }

        const eraList = await eraRes.json();
        console.log(
            "Era :", eraList
        )

        const filteredEra = eraList.filter((era: any) =>
            era.deleted_at == null || era.deleted_at === '0001-01-01T00:00:00Z'
        );

        console.log("filtered : ", filteredEra)
        
        const rumpunList = await rumpunRes.json();
        console.log(
            "Rumpun :", rumpunList
        )

        const filteredRumpun = rumpunList.filter((rumpun: any) =>
            rumpun.deleted_at == null || rumpun.deleted_at === '0001-01-01T00:00:00Z'
        );

        console.log("filtered : ", filteredRumpun)


        return {
            detil_kerajaan: kerajaanWithMedia,
            jenisKerajaan: filteredJenisKerajaan,
            historyRaja: historyRajaWithImages,
            gelar: filteredGelarKerajaan,
            eraList : filteredEra,
            rumpunList : filteredRumpun

        };
    } catch (error) {
        console.error("Error loading data:", error);
        // Fallback ke data dummy jika terjadi error
        const detil_kerajaan = data_showraja;
        return {
            detil_kerajaan,
            jenisKerajaan: []
        };
    }
};

export const actions: Actions = {
    tambah: async ({ request, params }) => {
        const data = await request.formData();
        console.log("ID dari URL:", params.id);
        let id = params.id
        const res = Object.fromEntries(data)

        // console.log("ini data ", data)
        console.log("ini res", res)


        let form: any = {
            // nama: "",
            // lokasi: "",
            // jenis: "",
            // tanggal: "",
            // era: "",
            // rumpun: "",
            // deskripsi: "",
            // dokumen: "",
            // inputbendera: "",
            // inputlambang: "",
            // inputvideo: "",
            // linkkerajaan: "",
            // promosi: "",
            // linkacara1: "",
            // linkacara2: "",
            // linkacara3: "",

            inputfotoraja: "",
            tanggalmeninggal: "",
            namaraja: "",
            gelarraja: "",
            tanggallahir: "",
            kotalahir: "",
            agama: "",
            wangsa: "",
            namaayah: "",
            namaibu: "",
            tanggalawal: "",
            tanggalakhir: "",
            inputcheckbox: "",
        }

        console.log("1", params.id)

        const ver = z.object({
            namaraja: z.string().trim().min(1, "Minimal 1!"),
            gelarraja: z.string().trim().min(1, "Minimal 1!"),
            tanggallahir: z.coerce.date({ message: "Tanggal Tidak valid (YYYY-MM-DD)" }),
            inputfotoraja: z.string().optional(),
            kotalahir: z.string().trim().min(1, "Minimal 1!"),
            agama: z.string().trim().min(1, "Minimal 1!"),
            // tanggalmeninggal: z.coerce.date({ message: "Tanggal Tidak valid (YYYY-MM-DD)" }),
            wangsa: z.string().trim().min(1, "Minimal 1!"),
            namaayah: z.string().trim().min(1, "Minimal 1!"),
            namaibu: z.string().trim().min(1, "Minimal 1!"),
            tanggalawal: z.coerce.date({ message: "Tanggal Tidak valid (YYYY-MM-DD)" }),
            // tanggalakhir: z.coerce.date({ message: "Tanggal Tidak valid (YYYY-MM-DD)" }),
            inputcheckbox: z.string().trim().optional(),
        });

        console.log("2", params.id)


        form = {
            // inputfotoraja: data.get("inputfotoraja"),
            // tanggalmeninggal: data.get("tanggalmeninggal"),
            namaraja: data.get("namaraja"),
            gelarraja: data.get("gelarraja"),
            tanggallahir: data.get("tanggallahir"),
            kotalahir: data.get("kotalahir"),
            agama: data.get("agama"),
            wangsa: data.get("wangsa"),
            namaayah: data.get("namaayah"),
            namaibu: data.get("namaibu"),
            tanggalawal: data.get("tanggalawal"),
            // tanggalakhir: data.get("tanggalakhir"),
            inputcheckbox: data.get("inputcheckbox") || " ",
        };

        // console.log("form" , form)
        console.log("3", params.id)


        const validation = ver.safeParse({ ...form });

        if (!validation.success) {
            const fieldErrors = validation.error.flatten().fieldErrors;

            // console.log("errors : ", fieldErrors)
            console.log("4", params.id)


            return fail(406, {
                errors: fieldErrors,
                success: false,
                formData: form,
                type: "add"
            });
        }

        // console.log("Nama raja : " , res.namaraja)

        console.log("5", res.id)

        try {
            // Buat FormData baru dan pastikan format data sesuai dengan yang berhasil di Postman
            const formData = new FormData()
            formData.append("id_kerajaan", String(params.id))
            formData.append("id_gelar", res.gelarraja)
            formData.append("nama_raja", res.namaraja)
            formData.append("tempat_lahir", res.kotalahir)
            formData.append("tanggal_lahir", res.tanggallahir)
            formData.append("tanggal_meninggal", res.tanggalmeninggal || "")
            formData.append("nama_ayah", res.namaayah)
            formData.append("nama_ibu", res.namaibu)
            formData.append("agama", res.agama)
            formData.append("wangsa", res.wangsa)
            formData.append("mulai_menjabat", res.tanggalawal)
            formData.append("selesai_menjabat", res.tanggalakhir || "")
            formData.append("foto_raja", res.inputfotoraja || "")

            console.log("Form Data : ", formData)

            // Kirim request ke API
            const result = await fetch(env.BASE_URL + "/history-raja", {
                method: 'POST',
                body: formData,
            });

            // Ambil response sebagai text terlebih dahulu
            const responseText = await result.text();
            console.log("API Response status:", result.status);
            console.log("API Response text:", responseText);

            // Parse response sebagai JSON jika memungkinkan
            let r;
            try {
                r = JSON.parse(responseText);
            } catch (e) {
                console.error("Failed to parse response as JSON:", e);
                r = { message: responseText };
            }

            if (result.ok) {
                console.log("Success response from API");
                return { errors: null, success: true };
            } else {
                console.log("Error response from API:", r.message);
                return fail(400, {
                    request: `Error Code: ${result.status} ${r.message || 'Unknown error'}`,
                    errors: {
                        api: [`API Error: ${r.message || 'Unknown error'}`]
                    },
                    success: false,
                    formData: form,
                    type: "add"
                });
            }
        } catch (error) {
            console.error("Exception during API call:", error);

            return fail(500, {
                request: "Internal error occurred",
                errors: {
                    exception: ["An unexpected error occurred while processing your request"]
                },
                success: false,
                formData: form,
                type: "add"
            });
        }
    },

    selesai: async ({ request, params }) => {
        const data = await request.formData();
        console.log("Processing form submission for ID:", params.id);

        // Extract all form data
        const res: Record<string, any> = Object.fromEntries(data);
        console.log("res : ", res);

        // Get existing IDs from form data
        const existingBenderaId = data.get("existing_bendera_id")?.toString() || "";
        const existingLambangId = data.get("existing_lambang_id")?.toString() || "";
        const existingFotoUmumIds = data.get("existing_foto_umum_ids")?.toString() || "";
        const existingVideoId = data.get("existing_video_id")?.toString() || data.get("existingVideoId")?.toString() || "";

        console.log("Existing IDs from form:", {
            bendera: existingBenderaId,
            lambang: existingLambangId,
            fotoUmum: existingFotoUmumIds,
            video: existingVideoId
        });

        // Process files
        let fotoUmumIds: string[] = [];
        let benderaId = "";
        let lambangId = "";
        let videoId = "";

        // Helper function to upload a file with consistent error handling
        async function uploadFile(file: File, endpoint: string, fieldName: string, additionalData: Record<string, string> = {}) {
            if (!(file instanceof File) || file.size === 0) {
                console.warn(`Invalid or empty ${fieldName} file:`, file);
                return null;
            }

            console.log(`Preparing to upload ${fieldName}:`, file.name, "size:", file.size);

            const formData = new FormData();
            // Add any additional data
            for (const [key, value] of Object.entries(additionalData)) {
                formData.append(key, value);
            }
            // Add the file
            formData.append(fieldName, file);

            try {
                // Add timeout to ensure request completes
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

                console.log(`Sending ${fieldName} to:`, env.BASE_URL + endpoint);
                const response = await fetch(env.BASE_URL + endpoint, {
                    method: 'POST',
                    body: formData,
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                console.log(`${fieldName} response status:`, response.status);

                if (response.ok) {
                    const result = await response.json();
                    console.log(`${fieldName} result:`, result);
                    return result;
                } else {
                    console.error(`Failed to upload ${fieldName}:`, file.name);
                    const errorText = await response.text();
                    console.error("Response status:", response.status);
                    console.error("Response text:", errorText);
                    return null;
                }
            } catch (error) {
                console.error(`Exception during ${fieldName} upload:`, error);
                return null;
            }
        }

        // 1. Process dokumen files (foto umum)
        const dokumenFiles = data.getAll("dokumen");
        console.log("Foto umum files count:", dokumenFiles.length);
        console.log("Foto umum files details:", dokumenFiles.map(f => f instanceof File ? `${f.name} (${f.size} bytes)` : 'Not a file'));

        // PENTING: Jika ada existing_foto_umum_ids, gunakan nilai tersebut sebagai basis
        if (existingFotoUmumIds && existingFotoUmumIds.trim() !== '') {
            console.log("Using existing foto umum IDs as base:", existingFotoUmumIds);
            fotoUmumIds = existingFotoUmumIds.split(',').map(id => id.trim()).filter(id => id);
        }

        // Cek apakah ada file baru (yang tidak memiliki prefix "image_")
        const newFiles = dokumenFiles.filter(file =>
            file instanceof File &&
            file.size > 0 &&
            !file.name.startsWith('image_')
        );

        // Jika ada file baru, upload dan tambahkan ID-nya ke fotoUmumIds
        if (newFiles.length > 0) {
            console.log(`Found ${newFiles.length} new files to upload`);

            // Upload setiap file baru
            for (const file of newFiles) {
                if (!(file instanceof File)) continue;

                console.log(`Uploading new file: ${file.name} (${file.size} bytes)`);

                const formData = new FormData();
                formData.append("nama_kerajaan", res.nama || "Unknown");
                formData.append("foto_umum", file);

                try {
                    const response = await fetch(env.BASE_URL + "/file/umum", {
                        method: 'POST',
                        body: formData
                    });

                    if (response.ok) {
                        const result = await response.json();
                        console.log("Upload response:", result);

                        // Extract ID
                        if (result.id_path && result.id_path.data) {
                            const newIds = result.id_path.data.split(',').map((id: any) => id.trim()).filter((id: any) => id);
                            fotoUmumIds.push(...newIds);
                        } else if (result.id_path) {
                            fotoUmumIds.push(result.id_path);
                        } else if (result.id_dokumentasi) {
                            fotoUmumIds.push(result.id_dokumentasi);
                        }
                    } else {
                        console.error("Upload failed:", await response.text());
                    }
                } catch (error) {
                    console.error("Upload exception:", error);
                }
            }
        } else {
            console.log("No new files to upload");
        }

        console.log("FINAL foto_umum IDs:", fotoUmumIds);

        // 2. Process bendera file
        const bendera = data.get("inputbendera");
        console.log("Bendera file details:", bendera instanceof File ? `${bendera.name} (${bendera.size} bytes)` : 'Not a file or empty');

        // Check if there's a new bendera file (not starting with "image_")
        if (bendera instanceof File && bendera.size > 0 && !bendera.name.startsWith('image_')) {
            console.log("New bendera file detected, will upload:", bendera.name);
            try {
                const formData = new FormData();
                formData.append("nama_kerajaan", res.nama || "Unknown");
                formData.append("bendera_kerajaan", bendera);

                const response = await fetch(env.BASE_URL + "/file/bendera", {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.id_path) {
                        benderaId = result.id_path;
                        console.log("New bendera uploaded with ID:", benderaId);
                    }
                } else {
                    console.error("Upload failed:", await response.text());
                }
            } catch (error) {
                console.error("Upload exception:", error);
            }
        } else if (existingBenderaId && existingBenderaId.trim() !== '' && existingBenderaId !== ' ') {
            // Use existing ID if no new file
            benderaId = existingBenderaId;
            console.log("Using existing bendera ID:", benderaId);
        } else {
            console.log("No bendera file to upload and no existing ID");
            benderaId = "";
        }

        // Add this line to verify the final ID being used
        console.log("FINAL bendera ID being used:", benderaId);

        // 3. Process lambang file
        const lambang = data.get("inputlambang");
        console.log("Lambang file details:", lambang instanceof File ? `${lambang.name} (${lambang.size} bytes)` : 'Not a file or empty');

        // Check if there's a new lambang file (not starting with "image_")
        if (lambang instanceof File && lambang.size > 0 && !lambang.name.startsWith('image_')) {
            console.log("New lambang file detected, will upload:", lambang.name);
            try {
                const formData = new FormData();
                formData.append("nama_kerajaan", res.nama || "Unknown");
                formData.append("lambang_kerajaan", lambang);

                const response = await fetch(env.BASE_URL + "/file/lambang", {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.id_path) {
                        lambangId = result.id_path;
                        console.log("New lambang uploaded with ID:", lambangId);
                    }
                } else {
                    console.error("Upload failed:", await response.text());
                }
            } catch (error) {
                console.error("Upload exception:", error);
            }
        } else if (existingLambangId && existingLambangId.trim() !== '' && existingLambangId !== ' ') {
            // Use existing ID if no new file
            lambangId = existingLambangId;
            console.log("Using existing lambang ID:", lambangId);
        } else {
            console.log("No lambang file to upload and no existing ID");
            lambangId = "";
        }

        // 4. Process video file
        const video = data.get("inputvideo");
        console.log("Video file details:", video instanceof File ? `${video.name} (${video.size} bytes)` : 'Not a file or empty');

        // Check if there's a new video file (not starting with "image_")
        if (video instanceof File && video.size > 0 && !video.name.startsWith('image_')) {
            console.log("New video file detected, will upload:", video.name);
            try {
                const formData = new FormData();
                formData.append("nama_kerajaan", res.nama || "Unknown");
                formData.append("video_kerajaan", video);

                const response = await fetch(env.BASE_URL + "/file/video", {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.id_path) {
                        videoId = result.id_path;
                        console.log("New video uploaded with ID:", videoId);
                    }
                } else {
                    console.error("Upload failed:", await response.text());
                }
            } catch (error) {
                console.error("Upload exception:", error);
            }
        } else if (existingVideoId && existingVideoId.trim() !== '' && existingVideoId !== ' ') {
            // Use existing ID if no new file
            videoId = existingVideoId;
            console.log("Using existing video ID:", videoId);
        } else {
            console.log("No video file to upload and no existing ID");
            videoId = "";
        }

        console.log("FINAL video ID:", videoId);

        // Create the kerajaan data object with all IDs
        const kerajaanData = {
            id_kerajaan: Number(params.id),
            longitude: Number(res.long || 0),
            latitude: Number(res.lat || 0),
            nama_kerajaan: res.nama,
            raja_sekarang: data.get("raja_sekarang"),
            jenis_kerajaan: Number(res.jenis || 1),
            deskripsi_kerajaan: res.deskripsi,
            alamat_kerajaan: res.lokasi,
            bendera_kerajaan: benderaId,
            lambang_kerajaan: lambangId,
            foto_umum: fotoUmumIds.join(','),
            video_kerajaan: videoId,
            tahun_berdiri: res.tahun_berdiri || "1900",
            tahun_berakhir: res.tahunberakhir || "1980",
            era: Number(res.era),
            rumpun: Number(res.rumpun),
            email: res.email || "email",
            url_website: res.linkkerajaan || "url1@marsi.com",
            url_acara_1: res.linkacara1 || "url2@marsi.com",
            url_acara_2: res.linkacara2 || "url3@marsi.com",
            url_acara_3: res.linkacara3 || "url@marsi.com",
        };

        console.log("VIDEO DEBUG: Final kerajaan data with video ID:", kerajaanData.video_kerajaan);

        // Combine all IDs
        console.log("All foto umum IDs collected:", fotoUmumIds);
        const fotoUmumIdsString = fotoUmumIds.join(',');
        console.log("Final foto umum IDs string:", fotoUmumIdsString);
        console.log("Bendera ID:", benderaId);
        console.log("Lambang ID:", lambangId);
        console.log("Video ID:", videoId);

        let form: any = {
            nama: "",
            lokasi: "",
            jenis: "",
            tanggal: "",
            era: "",
            rumpun: "",
            deskripsi: "",
            // File fields removed from validation
            linkkerajaan: "",
            promosi: "",
            linkacara1: "",
            linkacara2: "",
            linkacara3: "",
        }

        const ver = z.object({
            nama: z.string().trim().min(1, "Isi Nama!"),
            lokasi: z.string().trim().min(1, "Isi!"),
            jenis: z.string().trim().min(1, "Isi!"),
            tanggal: z.string().trim().min(1, "Isi!"),
            era: z.string().trim().min(1, "Isi!"),
            rumpun: z.string().trim().min(1, "Isi!"),
            deskripsi: z.string().trim().min(1, "Isi!"),
            // File validations removed
            linkkerajaan: z.string().optional(),
            promosi: z.string().optional(),
            linkacara1: z.string().optional(),
            linkacara2: z.string().optional(),
            linkacara3: z.string().optional(),
        });

        form = {
            nama: data.get("nama") || " ",
            lokasi: data.get("lokasi") || " ",
            jenis: data.get("jenis") || " ",
            tanggal: data.get("tanggalberdiri") || " ",
            era: data.get("era") || " ",
            rumpun: data.get("rumpun") || " ",
            deskripsi: data.get("deskripsi") || " ",
            longitude: data.get("long") || " ",
            latitude: data.get("lat") || " ",
            linkkerajaan: data.get("linkkerajaan"),
            promosi: data.get("promosi"),
            linkacara1: data.get("linkacara1"),
            linkacara2: data.get("linkacara2"),
            linkacara3: data.get("linkacara3"),
        };

        console.log("form : ", form);

        const validation = ver.safeParse({ ...form });

        if (!validation.success) {
            const fieldErrors = validation.error.flatten().fieldErrors;
            console.log("errors : ", fieldErrors);
            return fail(406, {
                errors: fieldErrors,
                success: false,
                formData: form,
                type: "add"
            });
        }

        try {
            console.log("Final kerajaan data:", kerajaanData);

            const result = await fetch(env.BASE_URL + "/kerajaan", {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(kerajaanData),
            });

            console.log("Kerajaan update response status:", result.status);

            const r = await result.json();
            console.log("Kerajaan update response:", r);
            console.log("OK ", result.ok)

            if (result.ok) {
                console.log("Update successful");
                return { errors: "no", success: true };
            } else {
                console.log('Update failed');
                return fail(400, { request: `Error Code: ${result.status} ${r.message}` });
            }
        } catch (error) {
            if (error instanceof Error) console.error(error.message);
            return fail(500, { request: "An unexpected error occurred" });
        }
    },

    hapusHistoryRaja: async ({ request, params }) => {
        const data = await request.formData();
        const id_history_raja = data.get("id_history_raja");
        const id_kerajaan = data.get("id_kerajaan") || params.id;

        console.log(`Attempting to delete history raja with ID: ${id_history_raja} from kerajaan ID: ${id_kerajaan}`);

        if (!id_history_raja) {
            console.error("Missing history raja ID");
            return fail(400, { errors: "ID history raja tidak ditemukan" });
        }

        try {
            // Kirim request DELETE ke API
            const deleteUrl = `${env.BASE_URL}/history-raja/${id_history_raja}`;
            console.log(`Sending DELETE request to: ${deleteUrl}`);

            const response = await fetch(deleteUrl, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json"
                }
            });

            // Ambil response sebagai text terlebih dahulu
            const responseText = await response.text();
            console.log("API Response status:", response.status);
            console.log("API Response text:", responseText);

            // Parse response sebagai JSON jika memungkinkan
            let responseData;
            try {
                responseData = JSON.parse(responseText);
            } catch (e) {
                console.error("Failed to parse response as JSON:", e);
                responseData = { message: responseText };
            }

            if (!response.ok) {
                console.error(`Failed to delete history raja: ${response.status}`, responseData);
                return fail(response.status, {
                    errors: responseData.message || `Gagal menghapus data (${response.status})`
                });
            }

            console.log("Successfully deleted history raja");
            return { success: true };
        } catch (error) {
            console.error("Error deleting history raja:", error);
            return fail(500, { errors: "Terjadi kesalahan saat menghapus data" });
        }
    },

    editHistory: async ({ request, params }) => {
        const data = await request.formData();

        // Log semua data yang diterima
        console.log("EDIT HISTORY SERVER - All form data entries:");
        for (const [key, value] of data.entries()) {
            if (value instanceof File) {
                console.log(`EDIT HISTORY SERVER - ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
            } else {
                console.log(`EDIT HISTORY SERVER - ${key}: ${value}`);
            }
        }

        const res = Object.fromEntries(data);
        console.log("EDIT HISTORY SERVER - Form data as object:", res);

        // Cek apakah ada ID foto raja yang sudah ada
        const existingFotoRajaId = data.get("existing_foto_raja_id")?.toString() || "";
        console.log("EDIT HISTORY SERVER - Existing foto raja ID:", existingFotoRajaId);

        // Cek apakah ada file foto raja baru
        const newFotoRaja = data.get("inputfotoraja");
        let fotoRajaId = existingFotoRajaId;

        if (newFotoRaja instanceof File && newFotoRaja.size > 0) {
            console.log("EDIT HISTORY SERVER - New foto raja detected, uploading...");
            try {
                // Upload foto raja to API
                const fotoRajaFormData = new FormData();
                fotoRajaFormData.append("nama_kerajaan", res.nama_kerajaan || res.nama_raja || "Unknown");
                fotoRajaFormData.append("dokumentasi", res.inputfotoraja);

                const fotoRajaResponse = await fetch(`${env.BASE_URL}/file/raja`, {
                    method: 'POST',
                    body: fotoRajaFormData,
                });

                if (fotoRajaResponse.ok) {
                    const fotoRajaResult = await fotoRajaResponse.json();
                    fotoRajaId = fotoRajaResult.id_path || "";
                    console.log("EDIT HISTORY SERVER - Foto raja uploaded, ID:", fotoRajaId);
                } else {
                    console.error("EDIT HISTORY SERVER - Failed to upload foto raja:", await fotoRajaResponse.text());
                }
            } catch (error) {
                console.error("EDIT HISTORY SERVER - Error uploading foto raja:", error);
            }
        } else {
            console.log("EDIT HISTORY SERVER - No new foto raja, using existing ID:", fotoRajaId);
        }

        // Prepare data for history-raja update
        try {
            // Check if "masih" checkbox is checked
            const masihMenjabat = data.get("inputcheckbox") === "masih";

            const historyRajaData = {
                id_raja: Number(res.id_raja),
                id_kerajaan: Number(res.id || params.id),
                id_gelar: Number(res.gelarraja),
                nama_raja: res.namaraja,
                tempat_lahir: res.kotalahir,
                tanggal_lahir: res.tanggallahir,
                tanggal_meninggal: res.tanggalmeninggal || "",
                nama_ayah: res.namaayah,
                nama_ibu: res.namaibu,
                agama: res.agama,
                wangsa: res.wangsa,
                mulai_menjabat: res.tanggalawal,
                selesai_menjabat: masihMenjabat ? "" : (res.tanggalakhir || ""),
                dokumentasi: fotoRajaId,
            };

            console.log("EDIT HISTORY SERVER - Sending update to API:", historyRajaData);

            const updateResponse = await fetch(`${env.BASE_URL}/history-raja`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(historyRajaData),
            });

            const updateResult = await updateResponse.text();
            console.log("EDIT HISTORY SERVER - API response status:", updateResponse.status);

            let parsedResult;
            try {
                parsedResult = JSON.parse(updateResult);
            } catch (e) {
                console.error("EDIT HISTORY SERVER - Failed to parse response as JSON:", e);
                parsedResult = { message: updateResult };
            }

            if (updateResponse.ok) {
                console.log("EDIT HISTORY SERVER - Update successful");
                return { success: true };
            } else {
                console.error("EDIT HISTORY SERVER - Update failed:", parsedResult);
                return fail(updateResponse.status, {
                    errors: parsedResult.message || `Error updating history raja (${updateResponse.status})`
                });
            }
        } catch (error) {
            console.error("EDIT HISTORY SERVER - Error during update:", error);
            return fail(500, { errors: "Terjadi kesalahan saat memperbarui data" });
        }
    },
};
