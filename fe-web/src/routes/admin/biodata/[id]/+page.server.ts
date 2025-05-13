import { data_showraja } from "$lib/dummy";
import { fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { z } from "zod";
import { env } from "$env/dynamic/private";

export const load: PageServerLoad = async () => {
    const detil_kerajaan = data_showraja

    return { detil_kerajaan };
};

export const actions: Actions = {
    tambah: async ({ request, params }) => {
        const data = await request.formData();
        console.log("ID dari URL:", params.id);
        let id = params.id
        const res = Object.fromEntries(data)

        // console.log("ini data ", data)
        // console.log("ini res", res)


        let form: any = {
            nama: "",
            lokasi: "",
            jenis: "",
            tanggal: "",
            era: "",
            rumpun: "",
            deskripsi: "",
            dokumen: "",
            inputbendera: "",
            inputlambang: "",
            inputvideo: "",
            linkkerajaan: "",
            promosi: "",
            linkacara1: "",
            linkacara2: "",
            linkacara3: "",

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
            tanggalmeninggal: z.coerce.date({ message: "Tanggal Tidak valid (YYYY-MM-DD)" }),
            wangsa: z.string().trim().min(1, "Minimal 1!"),
            namaayah: z.string().trim().min(1, "Minimal 1!"),
            namaibu: z.string().trim().min(1, "Minimal 1!"),
            tanggalawal: z.coerce.date({ message: "Tanggal Tidak valid (YYYY-MM-DD)" }),
            tanggalakhir: z.coerce.date({ message: "Tanggal Tidak valid (YYYY-MM-DD)" }),
            inputcheckbox: z.string().trim().optional(),
        });

        console.log("2", params.id)


        form = {
            // inputfotoraja: data.get("inputfotoraja"),
            tanggalmeninggal: data.get("tanggalmeninggal"),
            namaraja: data.get("namaraja"),
            gelarraja: data.get("gelarraja"),
            tanggallahir: data.get("tanggallahir"),
            kotalahir: data.get("kotalahir"),
            agama: data.get("agama"),
            wangsa: data.get("wangsa"),
            namaayah: data.get("namaayah"),
            namaibu: data.get("namaibu"),
            tanggalawal: data.get("tanggalawal"),
            tanggalakhir: data.get("tanggalakhir"),
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
            const formData = new FormData()
            formData.append("id_kerajaan", String(res.id) || "11")
            formData.append("nama_raja", res.namaraja || "None")
            formData.append("tempat_lahir", res.kotalahir || " ")
            formData.append("tanggal_lahir", res.tanggallahir || " ")
            formData.append("tanggal_meninggal", res.tanggalmeninggal || " ")
            formData.append("nama_ayah", res.namaayah || " ")
            formData.append("nama_ibu", res.namaibu || " ")
            formData.append("agama", res.agama || " " )
            formData.append("wangsa", res.wangsa || " ")
            formData.append("mulai_menjabat", res.tanggalawal || " ")
            formData.append("selesai_menjabat", res.tanggalakhir || " ")
            formData.append("foto_raja", res.inputfotoraja || " ")
            formData.append("gelar_raja", res.gelarraja || " ")

            const result = await fetch(env.BASE_URL + "/history-raja", {
                method: 'POST',
                body: formData,
            });

            const r = await result.json()

            if (result.ok) { 
                console.log("7", params.id)
                return { errors: " no ", success : true};
            } else {
                console.log("8", params.id)
                return fail(400,{request:`Error Code : ${result.status} ${r.message}`})
            }
        } catch (error) {
            if (error instanceof Error) console.error(error.message);
            console.log("9", params.id)


        }

        return { errors: "Success", success: true, formData: form, type: "add" };
    },

    selesai: async ({ request }) => {
        const data = await request.formData();
        
        // Define a proper type for the result object
        const res: Record<string, any> = {};
        
        // Process each entry individually
        for (const [key, value] of data.entries()) {
            // For keys that might have multiple values (like 'dokumen')
            if (key === 'dokumen') {
                if (!res[key]) {
                    res[key] = [];
                }
                res[key].push(value);
            } else {
                // For other keys, just store the value
                res[key] = value;
            }
        }
        
        console.log("Processed form data:", res);
        console.log("Number of dokumen files:", res.dokumen ? res.dokumen.length : 0);
        
        // When processing dokumen files:
        const fotoUmumIds = [];
        if (res.dokumen && res.dokumen.length > 0) {
            for (const file of res.dokumen) {
                if (file instanceof File && file.size > 0) {
                    const fotoUmumFormData = new FormData();
                    fotoUmumFormData.append("nama_kerajaan", res.nama);
                    fotoUmumFormData.append("foto_umum", file);
                    
                    console.log("Uploading foto umum:", file.name);
                    
                    try {
                        const fotoUmumResponse = await fetch(env.BASE_URL + "/file/umum", {
                            method: 'POST',
                            body: fotoUmumFormData,
                        });
                        
                        if (fotoUmumResponse.ok) {
                            const fotoUmumResult = await fotoUmumResponse.json();
                            console.log("Foto umum result:", fotoUmumResult);
                            
                            // Check for id_path.data in the response
                            if (fotoUmumResult.id_path && fotoUmumResult.id_path.data) {
                                const newIds = fotoUmumResult.id_path.data.split(',').map((id : any) => id.trim());
                                fotoUmumIds.push(...newIds);
                                console.log("Foto umum uploaded, IDs:", newIds);
                            } else if (fotoUmumResult.id_dokumentasi) {
                                fotoUmumIds.push(fotoUmumResult.id_dokumentasi);
                                console.log("Foto umum uploaded, ID:", fotoUmumResult.id_dokumentasi);
                            } else {
                                // console.error("Missing ID information in response:", fotoUmumResult);
                            }
                        } else {
                            console.error("Failed to upload foto umum:", file.name);
                            const errorText = await fotoUmumResponse.text();
                            // console.error("Response status:", fotoUmumResponse.status);
                            // console.error("Response text:", errorText);
                        }
                    } catch (error) {
                        console.error("Exception during foto umum upload:", error);
                    }
                }
            }
        }

        // console.log("All foto umum IDs collected:", fotoUmumIds);
        const fotoUmumIdsString = fotoUmumIds.join(',');
        console.log("Final foto umum IDs string:", fotoUmumIdsString);
        
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
            // Get files from form data - FIXED: use getAll instead of get
            const bendera = data.get("inputbendera");
            const lambang = data.get("inputlambang");
            const fotoUmumFiles = data.getAll("dokumen"); // Changed from get to getAll
            console.log("Foto umum : ", fotoUmumFiles)
            const video = data.get("inputvideo");

            console.log("Bendera : ", bendera)
            console.log("Lambang : ", lambang)
            
            console.log("Number of dokumen files received:", fotoUmumFiles.length);
            
            let benderaId = "";
            let lambangId = "";
            let videoId = "";
            
            // Upload bendera if provided
            if (bendera instanceof File && bendera.size > 0) {
                const benderaFormData = new FormData();
                benderaFormData.append("nama_kerajaan", res.nama);
                benderaFormData.append("bendera_kerajaan", bendera);
                
                const benderaResponse = await fetch(env.BASE_URL + "/file/bendera", {
                    method: 'POST',
                    body: benderaFormData,
                });
                
                if (benderaResponse.ok) {
                    const benderaResult = await benderaResponse.json();
                    benderaId = benderaResult.id_path || "";
                    console.log("Bendera uploaded, ID:", benderaId);
                } else {
                    console.error("Failed to upload bendera");
                }
            }
            
            // Upload lambang if provided
            if (lambang instanceof File && lambang.size > 0) {
                const lambangFormData = new FormData();
                lambangFormData.append("nama_kerajaan", res.nama);
                lambangFormData.append("lambang_kerajaan", lambang);
                
                const lambangResponse = await fetch(env.BASE_URL + "/file/lambang", {
                    method: 'POST',
                    body: lambangFormData,
                });
                
                if (lambangResponse.ok) {
                    const lambangResult = await lambangResponse.json();
                    lambangId = lambangResult.id_path || "";
                    console.log("Lambang uploaded, ID:", lambangId);
                } else {
                    console.error("Failed to upload lambang");
                }
            }
            
            // We already processed the foto umum files above, so we don't need to do it again
            // Just use the fotoUmumIds and fotoUmumIdsString we already have
            
            // Upload video if provided
            if (video instanceof File && video.size > 0) {
                const videoFormData = new FormData();
                videoFormData.append("nama_kerajaan", res.nama);
                videoFormData.append("video_kerajaan", video);
                
                const videoResponse = await fetch(env.BASE_URL + "/file/video", {
                    method: 'POST',
                    body: videoFormData,
                });
                
                if (videoResponse.ok) {
                    const videoResult = await videoResponse.json();
                    videoId = videoResult.id_path || "";
                    console.log("Video uploaded, ID:", videoId);
                } else {
                    console.error("Failed to upload video");
                }
            }
            
            // Now send the main kerajaan data with file IDs as JSON
            const kerajaanData = {
                id_kerajaan: 10,
                longitude: Number(res.long),
                latitude: Number(res.lat),
                nama_kerajaan: res.nama,
                raja_sekarang: res.rajasekarang || " ",
                jenis_kerajaan: res.jenis,
                deskripsi_kerajaan: res.deskripsi,
                alamat_kerajaan: res.lokasi,
                bendera_kerajaan: Number(benderaId),
                lambang_kerajaan: Number(lambangId),
                foto_umum: fotoUmumIdsString,
                video_kerajaan: videoId,
                tahun_berdiri: res.tahun_berdiri || 1900,
                tahun_berakhir: res.tahunberakhir || 1980,
                era: res.era,
                rumpun: res.rumpun,
                email: res.email || " ",
                url_website: res.url_web || "",
                url_acara1: res.url_acara1 || "",
                url_acara2: res.url_acara2 || "",
                url_acara3: res.url_acara3 || "",
            };

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

            if (r.ok) { 
                console.log("Update successful");
                return { errors: "no", success: true, form: res };
            } else {
                console.log('Update failed');
                return fail(400, { request: `Error Code: ${result.status} ${r.message}` });
            }
        } catch (error) {
            if (error instanceof Error) console.error(error.message);
            return fail(500, { request: "An unexpected error occurred" });
        }
    }
};
