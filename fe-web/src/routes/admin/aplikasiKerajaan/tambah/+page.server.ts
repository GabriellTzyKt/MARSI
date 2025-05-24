import { fail, type Actions } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
import { z } from "zod";
import { data_flipcard } from "$lib/dummy";

export const actions: Actions = {
    tambahAplikasi: async ({ request }) => {
        const data = await request.formData();

        console.log("Data : ", data)
        
        // Ambil file logo dari form data
        const logoFile = data.get("logo") as File | null;
        
        // Cek apakah fitur mobile dipilih
        const fiturMobile = data.get("fitur-mobile") as string;
        const isMobileEnabled = fiturMobile === "ya";

        const fiturPenanggalan1 = data.get("fitur-penanggalan1") as string;
        const isPenanggalanEnabled = fiturPenanggalan1 === "ya";

        // Buat skema dasar untuk validasi
        const baseSchema = {
            id_kerajaan: z.string().min(1, "ID Kerajaan harus diisi"),

            // Validasi file logo
            logo_kerajaan: z.instanceof(File, { message: "Logo harus berupa file" })
                .refine(file => file.size > 0, { 
                    message: "File logo tidak boleh kosong" 
                })
                .refine(file => file.size <= 5 * 1024 * 1024, { 
                    message: "Ukuran logo tidak boleh lebih dari 5MB" 
                })
                .refine(file => 
                    ['image/jpeg', 'image/png', 'image/webp'].includes(file.type), { 
                    message: "Format logo harus JPG, PNG, atau WEBP" 
                }),

            // Website features
            "fitur-situs": z.string({
                required_error: "Silahkan pilih Ya atau Tidak",
                invalid_type_error: "Silahkan pilih Ya atau Tidak "
            }),
            "fitur-acara": z.string({
                required_error: "Silahkan pilih Ya atau Tidak",
                invalid_type_error: "Silahkan pilih Ya atau Tidak "
            }),
            "fitur-aset": z.string({
                required_error: "Silahkan pilih Ya atau Tidak",
                invalid_type_error: "Silahkan pilih Ya atau Tidak "
            }),
            "fitur-organisasi": z.string({
                required_error: "Silahkan pilih Ya atau Tidak",
                invalid_type_error: "Silahkan pilih Ya atau Tidak "
            }),
            "fitur-komunitas": z.string({
                required_error: "Silahkan pilih Ya atau Tidak",
                invalid_type_error: "Silahkan pilih Ya atau Tidak "
            }),
            "fitur-tugas-web": z.string({
                required_error: "Silahkan pilih Ya atau Tidak",
                invalid_type_error: "Silahkan pilih Ya atau Tidak "
            }),

            // Colors
            // warna_utama: z.string({
            //     required_error: "Silahkan pilih warna utama untuk website kerajaan"
            // }),
            // warna_secondary: z.string({
            //     required_error: "Silahkan pilih warna sekunder untuk website kerajaan"
            // }),
            // warna_aksen1: z.string({
            //     required_error: "Silahkan pilih warna aksen 1 untuk website kerajaan"
            // }),
            // warna_aksen2: z.string({
            //     required_error: "Silahkan pilih warna aksen 2 untuk website kerajaan"
            // }),
        };

        // Skema untuk fitur mobile (hanya jika mobile diaktifkan)
        let mobileSchema: any = {};

        if (isMobileEnabled) {
            mobileSchema = {
                "fitur-penanggalan1": z.string({
                    required_error: "Silahkan pilih Ya atau Tidak",
                    invalid_type_error: "Silahkan pilih Ya atau Tidak "
                }),
                "fitur-tugas-mobile": z.string({
                    required_error: "Silahkan pilih Ya atau Tidak",
                    invalid_type_error: "Silahkan pilih Ya atau Tidak "
                }),
                "fitur-tugasacara": z.string({
                    required_error: "Silahkan pilih Ya atau Tidak",
                    invalid_type_error: "Silahkan pilih Ya atau Tidak"
                }),
                "fitur-situskerajaan": z.string({
                    required_error: "Silahkan pilih Ya atau Tidak",
                    invalid_type_error: "Silahkan pilih Ya atau Tidak"
                }),
                "fitur-checkin": z.string({
                    required_error: "Silahkan pilih Ya atau Tidak",
                    invalid_type_error: "Silahkan pilih Ya atau Tidak"
                }),
                "fitur-acarakerajaan": z.string({
                    required_error: "Silahkan pilih Ya atau Tidak",
                    invalid_type_error: "Silahkan pilih Ya atau Tidak"
                }),
                "fitur-groupchat": z.string({
                    required_error: "Silahkan pilih Ya atau Tidak",
                    invalid_type_error: "Silahkan pilih Ya atau Tidak"
                }),
                "fitur-forum": z.string({
                    required_error: "Silahkan pilih Ya atau Tidak",
                    invalid_type_error: "Silahkan pilih Ya atau Tidak"
                }),
                "fitur-permohonan": z.string({
                    required_error: "Silahkan pilih Ya atau Tidak",
                    invalid_type_error: "Silahkan pilih Ya atau Tidak"
                }),
            };

            // Tambahkan validasi untuk fitur-penanggalan2 hanya jika penanggalan diaktifkan
            if (isPenanggalanEnabled) {
                mobileSchema["fitur-penanggalan2"] = z.string({
                    required_error: "Silahkan pilih jenis penanggalan",
                    invalid_type_error: "Silahkan pilih Ya atau Tidak untuk fitur forum"
                });
            }
        }

        // Gabungkan skema
        const schemaObj = { ...baseSchema, ...mobileSchema };

        // Buat skema Zod dari objek skema
        const schema = z.object(schemaObj);

        // Siapkan data untuk validasi
        const formData: Record<string, any> = {
            id_kerajaan: data.get("id_kerajaan") as string,
            logo_kerajaan: logoFile,
            "fitur-situs": data.get("fitur-situs") as string,
            "fitur-acara": data.get("fitur-acara") as string,
            "fitur-aset": data.get("fitur-aset") as string,
            "fitur-organisasi": data.get("fitur-organisasi") as string,
            "fitur-komunitas": data.get("fitur-komunitas") as string,
            "fitur-tugas-web": data.get("fitur-tugas-web") as string,
        };

        // Tambahkan fitur mobile ke formData jika diaktifkan
        if (isMobileEnabled) {
            formData["fitur-penanggalan1"] = fiturPenanggalan1;
            formData["fitur-tugas-mobile"] = data.get("fitur-tugas-mobile") as string;
            formData["fitur-tugasacara"] = data.get("fitur-tugasacara") as string;
            formData["fitur-situskerajaan"] = data.get("fitur-situskerajaan") as string;
            formData["fitur-checkin"] = data.get("fitur-checkin") as string;
            formData["fitur-acarakerajaan"] = data.get("fitur-acarakerajaan") as string;
            formData["fitur-groupchat"] = data.get("fitur-groupchat") as string;
            formData["fitur-forum"] = data.get("fitur-forum") as string;
            formData["fitur-permohonan"] = data.get("fitur-permohonan") as string;

            // Tambahkan fitur-penanggalan2 hanya jika penanggalan diaktifkan
            if (isPenanggalanEnabled) {
                const penanggalanValues = data.getAll("fitur-penanggalan2");
                formData["fitur-penanggalan2"] = penanggalanValues.length > 0
                    ? penanggalanValues.join(",")
                    : data.get("fitur-penanggalan2") as string;
            }
        }

        // Lakukan validasi
        const validation = schema.safeParse(formData);

        if (!validation.success) {
            console.error("Validation errors:", validation.error.flatten().fieldErrors);

            const fieldMapping: Record<string, string> = {
                "logo_kerajaan": "logo",
                "fitur-situs": "fitur_situs",
                "fitur-acara": "fitur_acara",
                "fitur-aset": "fitur_aset",
                "fitur-organisasi": "fitur_organisasi",
                "fitur-komunitas": "fitur_komunitas",
                "fitur-tugas-web": "fitur_tugas_web",
                "fitur-penanggalan1": "fitur_penanggalan1",
                "fitur-penanggalan2": "fitur_penanggalan2",
                "fitur-tugas-mobile": "fitur_tugas_mobile",
                "fitur-tugasacara": "fitur_tugasacara",
                "fitur-situskerajaan": "fitur_situskerajaan",
                "fitur-checkin": "fitur_checkin",
                "fitur-acarakerajaan": "fitur_acarakerajaan",
                "fitur-groupchat": "fitur_groupchat",
                "fitur-forum": "fitur_forum",
                "fitur-permohonan": "fitur_permohonan",
            };

            const errors: any = {};
            const zodErrors = validation.error.flatten().fieldErrors;

            for (const [field, fieldErrors] of Object.entries(zodErrors)) {
                const mappedField = fieldMapping[field] || field;
                errors[mappedField] = fieldErrors;
            }

            // Buat salinan formData tanpa objek File
            const safeFormData: Record<string, any> = {};
            for (const [key, value] of Object.entries(formData)) {
                // Jangan sertakan objek File
                if (!(value instanceof File)) {
                    safeFormData[key] = value;
                } else {
                    // Untuk File, hanya simpan nama file
                    safeFormData[key] = value.name;
                }
            }

            return fail(400, {
                error: "Harap lengkapi semua field yang diperlukan",
                errors,
                success: false,
                formData: safeFormData
            });
        }

        const penanggalanValues = data.getAll("fitur-penanggalan2");

        const websiteFeatures = {
            id_kerajaan: parseInt(data.get("id_kerajaan") as string) || 5, // Default semisal gada ( buat coba aja )
            fitur_situs: data.get("fitur-situs") === "ya" ? 1 : 0,
            fitur_acara: data.get("fitur-acara") === "ya" ? 1 : 0,
            fitur_aset: data.get("fitur-aset") === "ya" ? 1 : 0,
            fitur_organisasi: data.get("fitur-organisasi") === "ya" ? 1 : 0,
            fitur_komunitas: data.get("fitur-komunitas") === "ya" ? 1 : 0,
            fitur_tugas: data.get("fitur-tugas-web") === "ya" ? 1 : 0,
            warna_utama: data.get("warna_utama") as string,
            warna_secondary: data.get("warna_secondary") as string,
            warna_aksen1: data.get("warna_aksen1") as string,
            warna_aksen2: data.get("warna_aksen2") as string,
        };

        // Mobile features (hanya jika fitur mobile diaktifkan)
        const mobileFeatures = isMobileEnabled ? {
            id_kerajaan: parseInt(data.get("id_kerajaan") as string) || 5, // Default semisal gada ( buat coba aja )
            kalender: data.get("fitur-penanggalan1") === "ya" ? 1 : 0,
            penanggalan: penanggalanValues.length > 0 ? penanggalanValues.join(",") : "", // dikasi koma 
            tugas_pribadi: data.get("fitur-tugas-mobile") === "ya" ? 1 : 0,
            tugas_acara: data.get("fitur-tugasacara") === "ya" ? 1 : 0,
            situs: data.get("fitur-situskerajaan") === "ya" ? 1 : 0,
            check_in: data.get("fitur-checkin") === "ya" ? 1 : 0,
            acara: data.get("fitur-acarakerajaan") === "ya" ? 1 : 0,
            grup: data.get("fitur-groupchat") === "ya" ? 1 : 0,
            forum: data.get("fitur-forum") === "ya" ? 1 : 0,
            permohonan: data.get("fitur-permohonan") === "ya" ? 1 : 0,
        } : null;

        // Debug: Log payload yang akan dikirim ke API
        console.log("Website features payload:", websiteFeatures);
        console.log("Mobile features payload:", mobileFeatures);

        try {
            const websiteResponse = await fetch(`${env.BASE_URL}/fitur/website`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(websiteFeatures)
            });

            let mobileResponse = { ok: true };
            if (isMobileEnabled && mobileFeatures) {
                mobileResponse = await fetch(`${env.BASE_URL}/fitur/mobile`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(mobileFeatures)
                });
            }

            if (!websiteResponse.ok || !mobileResponse.ok) {
                return fail(400, {
                    error: "Gagal menyimpan fitur aplikasi",
                    success: false
                });
            }

            return {
                success: true,
                message: "Aplikasi kerajaan berhasil dibuat"
            };
        } catch (error) {
            console.error("Error saving application features:", error);
            return fail(500, {
                error: "Terjadi kesalahan server saat menyimpan fitur aplikasi",
                success: false
            });
        }
    }
};





































