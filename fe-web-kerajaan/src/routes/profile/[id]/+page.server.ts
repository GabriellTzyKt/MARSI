import { accounts } from "$lib/dummy";
import { date, z } from "zod";
import type { Actions, PageServerLoad } from "./$types";
import { fail } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
import { formatDatetoUI } from "$lib";


export const load: PageServerLoad = async ({ params, fetch }) => {
    try {
        const res = await fetch(`${env.PUB_PORT}/user/${params.id}`);
        let final = [];
        
        if(!res.ok){
            throw new Error(`HTTP Error! Status: ${res.status}`);
        }
        
        const data = await res.json();
        
        if (data.profile && data) {
            try {
                const resProfilepict = await fetch(`${env.URL_KERAJAAN}/doc/${data.profile.profile_pict}`);
                if (!resProfilepict.ok) {
                    console.error(`HTTP Error! Status: ${resProfilepict.status}`);
                    final = [{
                        ...data,
                        tanggal_lahir_UI: formatDatetoUI(data.tanggal_lahir || ''),
                        profilepict: null
                    }];
                    return { akun: final[0] };
                }
                const profilepict = await resProfilepict.json()
                const pict = await fetch(`${env.URL_KERAJAAN}/file?file_path=${profilepict.file_dokumentasi}`)
                final = [{
                    ...data,
                    tanggal_lahir_UI: formatDatetoUI(data.tanggal_lahir || ''),
                    profilepict: resProfilepict.ok ? resProfilepict : null
                }];
                return { akun: final[0] }
            }
            catch (pictError) {
                console.error("Error fetching profile picture:", pictError);
                final = [{
                    ...data,
                    tanggal_lahir_UI: formatDatetoUI(data.tanggal_lahir || ''),
                    profilepict: null
                }];
                return { akun: final[0] };
            }
        } else if (data) {
            final = Array.isArray(data) ? data.map(item => ({
                ...item,
                tanggal_lahir_UI: formatDatetoUI(item.tanggal_lahir || '')
            })) : [data];
            return { data: final[0] };
        }
        return { data: null, error: "No data returned from API" };
    }
    catch (error) {
        console.error("Error in profile load:", error);
        return { data: null, error: error.message };
    }
};
export const actions: Actions = {
    ubah: async ({ request, params, fetch }) => {
        const data = await request.formData();
        console.log("Form data received:", data);
        
        // Handle profile picture upload
        const profilePicture = data.get("profile_picture");
        let profilePictId = null;
        
        if (profilePicture instanceof File && profilePicture.size > 0) {
            try {
                console.log("Uploading profile picture:", profilePicture.name, profilePicture.size);
                
                // Create a new FormData for the file upload
                const fileFormData = new FormData();
                fileFormData.append("profile_picture", profilePicture);
                fileFormData.append("user_id", params.id);
                
                // Upload the profile picture
                const uploadResponse = await fetch(`${env.URL_KERAJAAN}/file/profile`, {
                    method: 'POST',
                    body: fileFormData
                });
                
                if (!uploadResponse.ok) {
                    console.error("Failed to upload profile picture:", uploadResponse.status);
                    const errorText = await uploadResponse.text();
                    console.error("Upload error:", errorText);
                } else {
                    const uploadResult = await uploadResponse.json();
                    profilePictId = uploadResult.id_path || uploadResult.id;
                    console.log("Profile picture uploaded successfully, ID:", profilePictId);
                    
                    // Add the profile picture ID to the form data
                    data.append("profile_pict_id", profilePictId);
                }
            } catch (uploadError) {
                console.error("Error uploading profile picture:", uploadError);
            }
        }
        
        // Continue with form validation
        const ver = z.object({
            nama_lengkap: 
                z.string({ message: "Field Nama Lengkap tidak boleh kosong" })
                    .nonempty("Minimal harus ada 1 huruf")
                    .max(255, "Nama mencapai Maximal huruf (255 huruf)")
            ,
            tempat_lahir: 
                z.string({ message: "Field Tempat Lahir tidak boleh kosong" })
                    .nonempty("Minimal harus ada 1 huruf")
                    .max(255, "Nama mencapai Maximal huruf (255 huruf)"),
            tanggal_lahir: 
                z.string()
                    .min(1, "Tanggal Harus diisi")
                    .transform((v) => new Date(v))
                    .refine((d) => !isNaN(d.getTime()), { message: "Tanggal Harus Sesuai Format (YYYY-MM-DD)" }),
            jenis_kelamin:
                z.string({ message: "Field Jenis Kelamin tidak boleh kosong" })
                    .min(1, "Minimal Pilih 1 pilihan"),
            alamat:
                z.string({ message: "Mohon Field Alamat diisi" })
                    .nonempty("Tolong isi minimal 1 huruf")
                    .max(500, "Maximal 500 huruf!"),
            no_telp:
                z.string({ message: "Field Nomer Telepon tidak boleh kosong" })
                    .min(10, "Nomer telepon minimal 10 digit")
                    .max(13, "Nomer Telpon maximal 13 digit!")
                    .regex(/^\d+$/, "Input harus berupa Angka / Digit"),
            pekerjaan: 
                z.string({ message: "Field Pekerjaan tidak boleh kosong" })
                    .nonempty("Minimal ada 1 huruf dalam field pekerjaan")
                    .max(255, "Pekerjaan lebih dari 255 huruf"),
            wongso:
                z.string({ message: " Field Wongso tidak boleh kosong" })
                    .nonempty("Tolong isi minimal 1 huruf")
                    .max(255, "wongso mencapai maximal huruf (255)"),
            email:
                z.string({ message: "Field email Harus tidak boleh kosong" })
                    .email("Tolong isi dengan email yang valid"),
            hobi: 
                z.string({ message: "Field Hobi tidak boleh kosong" })
                    .nonempty("Tolong isi minimal 1 huruf")
                    .max(155, "Hobi sudah mencapai batas max (255 huruf)"),
            agama: 
                z.string({ message: "Field agama tidak boleh kosong" })
                    .nonempty("Tolong isi minimal 1 huruf")
                    .max(155, "Field Agama sudah mencapai batas max (255 huruf)"),
            asma_dalem:
                z.string({ message: "Field Asma Dalem tidak boleh kosong" })
                    .nonempty("Tolong isi minimal 1 huruf")
                    .max(155, "Field Asma Dalem sudah mencapai batas max (255 huruf)"),
            nama_ayah:
                z.string({ message: "Field Nama Ayah tidak boleh kosong" })
                    .nonempty("Tolong isi minimal 1 huruf")
                    .max(155, "Field Nama Ayah sudah mencapai batas max (255 huruf)"),
            nama_ibu:
                z.string({ message: "Field Nama Ibu tidak boleh kosong" })
                    .nonempty("Tolong isi minimal 1 huruf")
                    .max(155, "Field Nama Ibu sudah mencapai batas max (255 huruf)")            
        });

        const form = {
            nama_lengkap: data.get("nama_lengkap"),
            tempat_lahir: data.get("tempat_lahir"),
            tanggal_lahir: data.get("tanggal_lahir"),
            jenis_kelamin: data.get("jenis_kelamin"),
            alamat: data.get("alamat"),
            no_telp: data.get("no_telp"),
            pekerjaan: data.get("pekerjaan"),
            wongso: data.get("wongso"),
            email: data.get("email"),
            hobi: data.get("hobi"),
            agama: data.get("agama"),
            asma_dalem: data.get("asma_dalem"),
            nama_ayah: data.get("nama_ayah"),
            nama_ibu: data.get("nama_ibu")
        };
        
        const verif = ver.safeParse({ ...form });
        if (!verif.success) {
            return fail(500, {
                errors: verif.error.flatten().fieldErrors, 
                success: false, 
                FormData: form
            });
        }
        
        // Prepare data for API update
        const updateData = {
            ...verif.data,
            id_user: params.id,
            tanggal_lahir: verif.data.tanggal_lahir.toISOString().split('T')[0],
            ayah_abdi: data.get("ayah_abdi") === "yes",
            ibu_abdi: data.get("ibu_abdi") === "yes"
        };
        
        // Add profile picture ID if available
        if (profilePictId) {
            updateData.profile_pict = profilePictId;
        }
        
        try {
            // Send the update to the API
            const updateResponse = await fetch(`${env.PUB_PORT}/user/update`, {
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
                    errors: { server: [errorData.message || `Failed to update profile (${updateResponse.status})`] },
                    success: false,
                    FormData: form
                });
            }
            
            const updateResult = await updateResponse.json();
            console.log("Profile updated successfully:", updateResult);
            
            return {
                success: true,
                message: "Profile berhasil diperbarui",
                FormData: form
            };
        } catch (updateError) {
            console.error("Error updating profile:", updateError);
            return fail(500, {
                errors: { server: ["Terjadi kesalahan saat memperbarui profil"] },
                success: false,
                FormData: form
            });
        }
    }
};
