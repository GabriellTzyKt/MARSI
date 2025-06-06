import { error, fail, type Actions } from "@sveltejs/kit";
import { z } from "zod";
import { env } from "$env/dynamic/private";

export const load = async ({ params }) => {
    const id = params.id;
    console.log("Id : ", id)

    try {
        // Fetch all situs data with limit 200
        const situsResponse = await fetch(`${env.URL_KERAJAAN}/situs?limit=200`);
        if (!situsResponse.ok) {
            throw error(situsResponse.status, `Failed to fetch situs data: ${situsResponse.statusText}`);
        }

        const situsList = await situsResponse.json();

        // Find the specific situs by ID
        const situsData = situsList.find((situs: any) =>
            situs.id_situs === Number(id) ||
            situs.id === Number(id)
        );

        if (!situsData) {
            throw error(404, `Situs with ID ${id} not found`);
        }

        // Process image URLs if profile is available (instead of foto_situs)
        let imageUrls = [];
        let fileDetails = [];
        
        if (situsData.profile && situsData.profile.trim() !== '') {
            try {
                const docIds = situsData.profile.split(',').map((id: any) => id.trim());

                for (const docId of docIds) {
                    if (!docId) continue;

                    const docRes = await fetch(`${env.URL_KERAJAAN}/doc/${docId}`);

                    if (docRes.ok) {
                        const docData = await docRes.json();

                        if (docData.file_dokumentasi) {
                            const imageUrl = `${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(docData.file_dokumentasi)}`;
                            imageUrls.push(imageUrl);
                            fileDetails.push({
                                id: docId,
                                url: imageUrl,
                                name: docData.nama_file || 'Unnamed file'
                            });
                        }
                    } else {
                        console.error(`Failed to fetch document ${docId}: ${docRes.statusText}`);
                    }
                }
            } catch (error) {
                console.error("Error processing images:", error);
            }
        }

        // Format time fields from HH:MM:SS to HH:MM
        const formatTimeField = (timeString: any) => {
            if (!timeString) return '';
            // If it's already in HH:MM format, return as is
            if (/^\d{1,2}:\d{2}$/.test(timeString)) return timeString;
            // If it's in HH:MM:SS format, remove the seconds
            return timeString.replace(/^(\d{1,2}:\d{2}):\d{2}$/, '$1');
        };

        // Fetch jenis situs data
        const jenisSitusResponse = await fetch(`${env.URL_KERAJAAN}/situs/jenis?limit=200`);
        let jenisSitusList = [];

        if (jenisSitusResponse.ok) {
            jenisSitusList = await jenisSitusResponse.json();
            // Filter active jenis situs (not deleted)
            jenisSitusList = jenisSitusList.filter((item: any) =>
                item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at
            );
        } else {
            console.error(`Failed to fetch jenis situs: ${jenisSitusResponse.statusText}`);
        }

        const wisataResponse = await fetch(`${env.URL_KERAJAAN}/situs/wisata?limit=200`);
        let wisataList = [];

        if (wisataResponse.ok) {
            wisataList = await wisataResponse.json();
            // Filter active wisata (not deleted)
            wisataList = wisataList.filter((item: any) =>
                item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at
            );
        } else {
            console.error(`Failed to fetch wisata: ${wisataResponse.statusText}`);
        }

        // Fetch users data for pembina and pelindung selection
        const usersResponse = await fetch(`${env.PUB_PORT}/users?limit=200`);

        let usersList = [];
        if (usersResponse.ok) {
            usersList = await usersResponse.json();
            // Filter active users (not deleted)
            usersList = usersList.filter((item: any) =>
                item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at
            ).map((item: any) => ({
                id: item.id_user,
                nama_lengkap: item.nama_lengkap || 'Unnamed',
                email: item.email || ''
            }));
        } else {
            console.error(`Failed to fetch users: ${usersResponse.statusText}`);
        }

        // Format the data for the form
        const formattedData = {
            id: situsData.id_situs || situsData.id,
            namasitus: situsData.nama_situs || '',
            notelepon: situsData.no_telp || '',
            email: situsData.email || '',
            kepemilikan: situsData.pemilik_situs || '',
            deskripsi: situsData.deskripsi_situs || '',
            foto_situs: situsData.foto_situs || '',
            dibangunoleh: situsData.nama_pendiri || '',
            tanggalberdiri: situsData.tahun_berdiri || '',
            alamat: situsData.alamat || '',
            jurukunci: situsData.juru_kunci || '',
            jenissitus: situsData.id_jenis_situs || '',
            pembina: situsData.pembina || '',
            pelindung: situsData.pelindung || '',
            jambuka: formatTimeField(situsData.jam_buka) || '',
            jamtutup: formatTimeField(situsData.jam_tutup) || '',
            wisata: situsData.id_wisata || '',
            latitude: situsData.latitude || '',
            longitude: situsData.longitude || '',
            profile: situsData.profile || '',
            imageUrls,
            fileDetails
        };
        console.log("situs final", formattedData)
        return {
            situs: formattedData,
            jenisSitusList,
            usersList,
            wisataList
        };
    } catch (err: any) {
        console.error("Error loading situs data:", err);
        throw error(500, err.message || "Failed to load situs data");
    }
};

export const actions: Actions = {
    edit: async ({ request, params, cookies }) => {
        let token = cookies.get('userSession') ? JSON.parse(cookies.get('userSession') as string) : '';
        const data: any = await request.formData();
        const id = params.id;
        console.log("data : ", data);
        try {
            let resSitus = await fetch(`${env.URL_KERAJAAN}/situs/${id}`, { method: 'GET' });

        } catch (error) {
            
        }
        let form = {
            namasitus: data.get("namasitus") ?? "",
            notelepon: data.get("notelepon") ?? "",
            email: data.get("email") ?? "",
            kepemilikan: data.get("kepemilikan") ?? "",
            deskripsi: data.get("deskripsi") ?? "",
            dibangunoleh: data.get("dibangunoleh") ?? "",
            tanggalberdiri: data.get("tanggalberdiri") ?? "",
            alamat: data.get("alamat") ?? "",
            jurukunci: data.get("jurukunci") ?? "",
            jenissitus: data.get("jenissitus") ?? "",
            pembina: data.get("pembina") ?? "",
            pelindung: data.get("pelindung") ?? "",
            jambuka: data.get("jambuka") ?? "",
            jamtutup: data.get("jamtutup") ?? "",
            wisata: data.get("wisata") ?? "",
            latitude: data.get("latitude") ?? "",
            longitude: data.get("longitude") ?? "",
        };

        const ver = z.object({
            namasitus: z.string().trim().min(1, "Isi Nama komunitas"),
            tanggalberdiri: z.string().trim().min(1, "Isi taun!!"),
            kepemilikan: z.string().trim().min(1, "Isi penanggungjawab!"),
            deskripsi: z.string().trim().min(1, "Isi Deskripsi!"),
            dibangunoleh: z.string().trim().min(1, "Harus ada isi!"),
            notelepon: z.string()
                .trim()
                .min(1, "Masukkan no telepon")
                .regex(/^\d+$/, "Hanya angka diperbolehkan")
                .max(12, "Nomor telepon max 12 digit!"),
            alamat: z.string().trim().min(1, "Alamat harus diisi!"),
            jurukunci: z.string().trim().min(1, "Isi Juru Kunci"),
            jenissitus: z.string().trim().min(1, "Isi Jenis Situs"),
            pembina: z.string().trim().min(1, "Isi Pembina"),
            pelindung: z.string().trim().min(1, "Isi Pelindung"),
            jambuka: z.string().regex(/^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/, {
                message: "pakai format : HH(jam):mm(menit).",
            }),
            jamtutup: z.string().regex(/^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/, {
                message: "pakai format : HH(jam):mm(menit).",
            }),
            wisata: z.string().trim().min(1, "Isi Wisata"),
        });

        const validation = ver.safeParse({ ...form });

        if (!validation.success) {
            const fieldErrors = validation.error.flatten().fieldErrors;
            console.log("errors : ", fieldErrors);
            return fail(406, {
                errors: fieldErrors,
                success: false,
                formData: form,
                type: "edit"
            });
        }

        try {
            // Handle profile picture if provided
            const profile_picture = data.get("profile_picture");
            let profile_id = data.get("existing_foto_profile") || "";

            // Upload new profile picture if provided
            if (profile_picture instanceof File && profile_picture.size > 0) {
                const pictureFormData = new FormData();
                pictureFormData.append("profile", profile_picture);
                pictureFormData.append("nama_situs", form.namasitus);

                const pictureResponse = await fetch(`${env.URL_KERAJAAN}/file/profile_situs`, {
                    method: 'POST',
                    body: pictureFormData
                });

                if (pictureResponse.ok) {
                    const pictureResult = await pictureResponse.json();
                    profile_id = pictureResult.id_path || "";
                    console.log("Profile picture uploaded, ID:", profile_id);
                } else {
                    console.error("Failed to upload profile picture");
                }
            }

            // Prepare data for API
            const situsData = {
                id_admin: Number(token.id_admin),
                id_situs: Number(id),
                id_wisata: Number(form.wisata),
                id_jenis_situs: Number(form.jenissitus),
                profile: profile_id, // Changed from foto_situs to profile
                foto_situs: data.get("existing_foto_situs") || "",
                nama_situs: form.namasitus,
                deskripsi_situs: form.deskripsi,
                alamat: form.alamat,
                longitude: parseFloat(form.longitude)||1.01,
                latitude: parseFloat(form.latitude)||1.01,
                nama_pendiri: form.dibangunoleh,
                pemilik_situs: form.kepemilikan,
                tahun_berdiri: Number(form.tanggalberdiri),
                pelindung: form.pelindung,
                pembina: form.pembina,
                juru_kunci: form.jurukunci,
                jam_buka: form.jambuka,
                jam_tutup: form.jamtutup,
                no_telp: form.notelepon,
                email: form.email
            };

            console.log("Sending data to API:", situsData);

            // Send PUT request to update situs
            const response = await fetch(`${env.URL_KERAJAAN}/situs`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(situsData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("API Error:", errorText);
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }

            const result = await response.json();
            console.log("API Response:", result);

            return {
                success: true,
                message: "Data situs berhasil diperbarui",
                formData: form,
                type: "edit"
            };

        } catch (error) {
            console.error("Error updating situs:", error);
            return fail(500, {
                errors: { general: ["Terjadi kesalahan saat memperbarui data situs."] },
                success: false,
                formData: form,
                type: "edit"
            });
        }
    }
};
