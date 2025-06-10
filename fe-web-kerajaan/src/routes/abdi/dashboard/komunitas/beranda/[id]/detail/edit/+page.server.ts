import { env } from "$env/dynamic/private";
import { error, fail, type Actions } from "@sveltejs/kit";
import { z } from "zod";

export const load = async ({ params, fetch }) => {
    const id = params.id;

    try {
        // Fetch organization data
        const response = await fetch(`${env.URL_KERAJAAN}/komunitas/${id}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch organization: ${response.status}`);
        }

        const komunitas = await response.json();
        console.log("Organization data:", komunitas);

        // Fetch organization members to get the count
        const membersResponse = await fetch(`${env.URL_KERAJAAN}/komunitas/anggota/${id}?limit=200`);
        let memberCount = 0;

        if (membersResponse.ok) {
            const membersData = await membersResponse.json();
            // Filter active members (not deleted)
            const activeMembers = membersData.filter((item: any) =>
                item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at
            );
            memberCount = activeMembers.length;
            console.log(`Found ${memberCount} active members`);
        } else {
            console.error(`Failed to fetch members: ${membersResponse.statusText}`);
        }

        // Fetch users for dropdown selections
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

        // Fetch profile image if available
        let profileUrl = null;
        let profileId = null;

        if (komunitas.profile) {
            try {
                const profileRes = await fetch(`${env.URL_KERAJAAN}/doc/${komunitas.profile}`);
                if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    if (profileData.file_dokumentasi) {
                        profileUrl = `${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(profileData.file_dokumentasi)}`;
                        profileId = komunitas.profile;
                    }
                }
            } catch (err) {
                console.error("Error fetching profile image:", err);
            }
        }
        let situsData = await fetch(`${env.URL_KERAJAAN}/situs?limit=700`);
        let situs = await situsData.json();

        situs = situs.filter((item: any) => item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at).map((item: any) => ({
            id_situs: item.id_situs,
            nama_situs: item.nama_situs,
           
        }));
        console.log("situs", situs)
        // Update the organization object with the actual member count
        komunitas.jumlah_anggota = memberCount;

        return {
            komunitas,
            profileUrl,
            profileId,
            usersList,
            memberCount,
            situs
        };
    } catch (err) {
        console.error("Error in load function:", err);
        throw error(500, "Failed to load organization details");
    }
};



export const actions: Actions = {
    edit: async ({ request, params, fetch }) => {
        const data: any = await request.formData();
        const id = params.id;

        console.log("Form data received:", data);

        // Get form values
        const namakomunitas = data.get("namakomunitas")?.toString() ?? "";
        const alamat = data.get("alamat")?.toString() ?? "";
        const email = data.get("email")?.toString() ?? "";
        const deskripsikomunitas = data.get("deskripsikomunitas")?.toString() ?? "";
        const penanggungjawab = data.get("penanggungjawab")?.toString() ?? "";
        const pembina = data.get("pembina")?.toString() ?? "";
        const pelindung = data.get("pelindung")?.toString() ?? "";
        const notelepon = data.get("notelepon")?.toString() ?? "";
        const jumlahanggota = data.get("jumlahanggota")?.toString() ?? "";
        const tanggalBerdiri = data.get("tanggal_berdiri")?.toString() ?? " ";
        const id_situs = data.get("id_situs")?.toString() ?? " ";


        // Get the profile picture file and existing ID
        const profilePicture = data.get("profile_picture");
        const existingProfileId = data.get("existing_profile_id")?.toString() ?? "";
        const existingFotoKomunitasId = data.get("existing_foto_komunitas")?.toString() ?? "";

        let form = {
            namakomunitas,
            alamat,
            email,
            deskripsikomunitas,
            penanggungjawab,
            pembina,
            pelindung,
            notelepon,
            jumlahanggota,
            tanggalBerdiri,
            id_situs
        };

        console.log("Parsed form data:", form);

        const ver = z.object({
            namakomunitas: z.string().trim().min(1, "Isi Nama komunitas"),
            alamat: z.string().trim().min(1, "Alamat harus diisi!"),
            email: z.string().email("Email Tidak Valid").
                trim().min(1, "Email harus diisi!"),
            deskripsikomunitas: z.string().trim().min(1, "Deskripsi harus terisi!"),
            penanggungjawab: z.string().trim().min(1, "Isi penanggungjawab!"),
            pembina: z.string().trim().min(1, "Isi pembina!"),
            pelindung: z.string().trim().min(1, "Isi pelindung!"),
            notelepon: z.string()
                .trim()
                .min(1, "Masukkan no telepon")
                .regex(/^\d+$/, "Hanya angka diperbolehkan")
                .max(12, "Nomor telepon max 12 digit!"),
            jumlahanggota: z.string()
                .trim()
                .min(1, "Minimal 1 anggota")
                .regex(/^\d+$/, "Jumlah anggota harus angka"),
            tanggalBerdiri: z.string()
                .nonempty("Tanggal berdiri harus diisi!")
                .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD")
                .refine((dateStr) => {
                    const date = new Date(dateStr);
                    return !isNaN(date.getTime()) && dateStr === date.toISOString().split("T")[0];
                }, { message: "Tanggal tidak valid" })
               ,
            id_situs: z.string().min(1,"Harus Select")

        });

        const validation = ver.safeParse({ ...form });

        if (!validation.success) {
            console.log("Validation errors:", validation.error.flatten().fieldErrors);
            return fail(406, {
                errors: validation.error.flatten().fieldErrors,
                success: false,
                formData: form,
                type: "edit"
            });
        }

        try {
            // Handle profile picture upload if provided
            let profileId = existingProfileId;

            if (profilePicture instanceof File && profilePicture.size > 0) {
                console.log("Uploading profile picture:", profilePicture.name, profilePicture.size);

                // Create a new FormData for the file upload
                const fileFormData = new FormData();
                fileFormData.append("foto_profile", profilePicture);
                fileFormData.append("nama_komunitas", namakomunitas);

                // Upload the profile picture
                const uploadResponse = await fetch(`${env.URL_KERAJAAN}/file/profile_komunitas`, {
                    method: 'POST',
                    body: fileFormData
                });

                if (!uploadResponse.ok) {
                    console.error("Failed to upload profile picture:", uploadResponse.status);
                    const errorText = await uploadResponse.text();
                    console.error("Upload error:", errorText);
                    return fail(500, {
                        errors: { profile_picture: ["Gagal mengunggah foto profil"] },
                        success: false,
                        formData: form
                    });
                } else {
                    const uploadResult = await uploadResponse.json();
                    profileId = uploadResult.id_path || uploadResult.id;
                    console.log("Profile picture uploaded successfully, ID:", profileId);
                }
            }

            // Prepare data for API
            const updateData = {
                id_komunitas: Number(id),
                penanggung_jawab: Number(form.penanggungjawab),
                nama_komunitas: form.namakomunitas,
                deskripsi: form.deskripsikomunitas,
                alamat: form.alamat,
                no_telp: form.notelepon,
                email: form.email,
                pembina: form.pembina,
                pelindung: form.pelindung,
                profile: profileId || null,
                tanggal_berdiri: form.tanggalBerdiri,
                lokasi: form.id_situs,
                foto_komunitas: existingFotoKomunitasId || null,
            };

            console.log("Data to send to API:", updateData);

            // Send the update to the API
            const updateResponse = await fetch(`${env.URL_KERAJAAN}/komunitas`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });

            if (!updateResponse.ok) {
                const errorData = await updateResponse.json().catch(() => ({}));
                console.error("Update failed:", updateResponse.status, errorData);
                return fail(updateResponse.status, {
                    errors: { server: [errorData.message || `Failed to update community (${updateResponse.status})`] },
                    success: false,
                    formData: form
                });
            }

            const result = await updateResponse.json();
            console.log("Update successful:", result);

            return {
                success: true,
                message: "Komunitas berhasil diperbarui"
            };

        } catch (err) {
            console.error("Error in edit action:", err);
            return fail(500, {
                errors: { server: ["Terjadi kesalahan saat memproses permintaan"] },
                success: false,
                formData: form
            });
        }
    }
};
