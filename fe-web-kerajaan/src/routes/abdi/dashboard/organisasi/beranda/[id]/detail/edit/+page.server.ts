import { fail } from "@sveltejs/kit";
import { error, type Actions } from "@sveltejs/kit";
import { z } from "zod";
import { env } from "$env/dynamic/private";

export const load = async ({ params, fetch }) => {
    const id = params.id;

    try {
        // Fetch organization data
        const response = await fetch(`${env.URL_KERAJAAN}/organisasi/${id}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch organization: ${response.status}`);
        }

        const organisasi = await response.json();
        console.log("Organization data:", organisasi);

        // Fetch organization members to get the count
        const membersResponse = await fetch(`${env.URL_KERAJAAN}/organisasi/anggota/${id}?limit=200`);
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

        if (organisasi.profile) {
            try {
                const profileRes = await fetch(`${env.URL_KERAJAAN}/doc/${organisasi.profile}`);
                if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    if (profileData.file_dokumentasi) {
                        profileUrl = `${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(profileData.file_dokumentasi)}`;
                        profileId = organisasi.profile;
                    }
                }
            } catch (err) {
                console.error("Error fetching profile image:", err);
            }
        }

        // Update the organization object with the actual member count
        organisasi.jumlah_anggota = memberCount;

        return {
            organisasi,
            profileUrl,
            profileId,
            usersList,
            memberCount
        };
    } catch (err) {
        console.error("Error in load function:", err);
        throw error(500, "Failed to load organization details");
    }
};

export const actions: Actions = {
    edit: async ({ request, params, fetch }) => {
        const data = await request.formData();
        const id = params.id;
        
        // Log all form data for debugging
        console.log("Form data entries:");
        for (const [key, value] of data.entries()) {
            console.log(`${key}: ${value instanceof File ? `File: ${value.name}` : value}`);
        }

        // Get form values
        const namaOrganisasi = data.get("namaorganisasi")?.toString() ?? "";
        const alamat = data.get("alamat")?.toString() ?? "";
        const email = data.get("email")?.toString() ?? "";
        const deskripsiOrganisasi = data.get("deskripsiorganisasi")?.toString() ?? "";
        const penanggungjawab = data.get("penanggungjawab")?.toString() ?? "";
        const pembina = data.get("pembina")?.toString() ?? "";
        const pelindung = data.get("pelindung")?.toString() ?? "";
        const notelepon = data.get("notelepon")?.toString() ?? "";
        const tanggalBerdiri = data.get("tanggal_berdiri")?.toString() ?? " ";
        
        // Get the profile picture file and existing ID
        const profilePicture = data.get("profile_picture");
        const existingProfileId = data.get("existing_profile_id")?.toString() ?? "";
        
        console.log("Profile picture:", profilePicture instanceof File ? `File: ${profilePicture.name}` : "No file");
        console.log("Existing profile ID:", existingProfileId);

        // Get the current member count from the API
        let memberCount = 0;
        try {
            const membersResponse = await fetch(`${env.URL_KERAJAAN}/organisasi/anggota/${id}?limit=200`);
            if (membersResponse.ok) {
                const membersData = await membersResponse.json();
                const activeMembers = membersData.filter((item: any) => 
                    item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at
                );
                memberCount = activeMembers.length;
            }
        } catch (err) {
            console.error("Error fetching member count:", err);
        }

        let form = {
            namaOrganisasi,
            alamat,
            email,
            deskripsiOrganisasi,
            penanggungjawab,
            pembina,
            pelindung,
            notelepon,
            tanggalBerdiri,
            jumlahanggota: memberCount.toString(),
        };
        
        console.log("Parsed form data:", form);
        
        // Validation schema
        const ver = z.object({
            namaOrganisasi: z.string().trim().min(1, "Isi Nama organisasi"),
            alamat: z.string().trim().min(1, "Alamat harus diisi!"),
            email: z.string().email("Email Tidak Valid").
                trim().min(1, "Email harus diisi!"),
            deskripsiOrganisasi: z.string().trim().min(1, "Deskripsi harus terisi!"),
            penanggungjawab: z.string().trim().min(1, "Isi penanggungjawab!"),
            pembina: z.string().trim().min(1, "Isi pembina!"),
            pelindung: z.string().trim().min(1, "Isi pelindung!"),
            notelepon: z.string()
                .trim()
                .min(1, "Masukkan no telepon")
                .regex(/^\d+$/, "Hanya angka diperbolehkan")
                .max(12, "Nomor telepon max 12 digit!"),
            tanggalBerdiri: z.string()
                .nonempty("Tanggal berdiri harus diisi!")
                .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD")
                .refine((dateStr) => {
                    const date = new Date(dateStr);
                    return !isNaN(date.getTime()) && dateStr === date.toISOString().split("T")[0];
                }, { message: "Tanggal tidak valid" })
                .refine((dateStr) => {
                    const date = new Date(dateStr);
                    const today = new Date();
                    return date >= today;
                }, { message: "Tanggal tidak boleh kurang dari hari ini" })
        });

        const validation = ver.safeParse({
            namaOrganisasi: form.namaOrganisasi,
            alamat: form.alamat,
            email: form.email,
            deskripsiOrganisasi: form.deskripsiOrganisasi,
            penanggungjawab: form.penanggungjawab,
            pembina: form.pembina,
            pelindung: form.pelindung,
            notelepon: form.notelepon,
            tanggalBerdiri: form.tanggalBerdiri,
        });

        if (!validation.success) {
            console.log(validation.error.flatten().fieldErrors)
            return fail(406, {
                errors: validation.error.flatten().fieldErrors, 
                success: false,
                formData: form, 
                type: "edit"
            });
        }

        try {
            // Handle profile picture upload
            let profileId = existingProfileId;
            
            if (profilePicture instanceof File && profilePicture.size > 0) {
                console.log("Uploading profile picture:", profilePicture.name, profilePicture.size);
                
                // Create a new FormData for the file upload
                const fileFormData = new FormData();
                fileFormData.append("foto_profile", profilePicture);
                fileFormData.append("nama_organisasi", namaOrganisasi);
                
                // Upload the profile picture
                const uploadResponse = await fetch(`${env.URL_KERAJAAN}/file/profile_organisasi`, {
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
                id_organisasi: Number(id),
                penanggung_jawab: Number(form.penanggungjawab),
                nama_organisasi: form.namaOrganisasi,
                deskripsi: form.deskripsiOrganisasi,
                alamat: form.alamat,
                no_telp: form.notelepon,
                email: form.email,
                pembina: form.pembina,
                tanggal_berdiri : data.get("tanggal_berdiri") || "",
                foto_organisasi : data.get("existing_foto_organisasi") || "",
                pelindung: form.pelindung,
                profile: profileId || null
            };
            
            console.log("SendData:", updateData);
            
            // Send the update to the API
            const updateResponse = await fetch(`${env.URL_KERAJAAN}/organisasi`, {
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
                    errors: { server: [errorData.message || `Failed to update organization (${updateResponse.status})`] },
                    success: false,
                    formData: form
                });
            }
            
            const result = await updateResponse.json();
            console.log("Update successful:", result);
            
            return { 
                success: true,
                message: "Organisasi berhasil diperbarui"
            };
            
        } catch (error) {
            console.error("Error updating organization:", error);
            return fail(500, {
                errors: { server: ["Terjadi kesalahan saat memperbarui organisasi"] },
                success: false,
                formData: form
            });
        }
    }
};
