import { env } from "$env/dynamic/private";
import { fail, type Actions, error } from "@sveltejs/kit";
import { z } from "zod";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
    try {
        const id = params.id;
        
        // 1. Fetch data komunitas berdasarkan ID
        const komunitasResponse = await fetch(`${env.URL_KERAJAAN}/komunitas`);
        if (!komunitasResponse.ok) {
            throw error(komunitasResponse.status, `Failed to fetch komunitas: ${komunitasResponse.statusText}`);
        }
        
        const komunitasList = await komunitasResponse.json();
        console.log("komunitas : ", komunitasList)
        const komunitas = komunitasList.find((item: any) => item.id_komunitas == id);
        
        if (!komunitas) {
            throw error(404, `Komunitas dengan ID ${id} tidak ditemukan`);
        }
        
        console.log("Data komunitas:", komunitas);

        // jumlah anggota ambil
        const jumlahAnggota = await fetch(`${env.URL_KERAJAAN}/komunitas/anggota/${id}`);
        if (!jumlahAnggota.ok) {
            throw error(jumlahAnggota.status, `Failed to fetch komunitas: ${jumlahAnggota.statusText}`);
        }

        const jumlahAnggotaData = await jumlahAnggota.json();
        
        // 2. Jika ada ID foto profil, ambil file path
        let fileDetails = null;
        if (komunitas.profile) {
            try {
                const filePathResponse = await fetch(`${env.URL_KERAJAAN}/doc/${komunitas.profile}`);
                if (filePathResponse.ok) {
                    const filePathData = await filePathResponse.json();
                    console.log("File path data:", filePathData);
                    
                    const filePath = filePathData.file_dokumentasi;
                    if (filePath) {
                        fileDetails = {
                            path: filePath,
                            url: `${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(filePath)}`,
                            name: filePath.split('/').pop()
                        };
                    }
                }
            } catch (fileError) {
                console.error("Error fetching file details:", fileError);
            }
        }
        console.log("file : " , fileDetails)
        console.log("komunitas lengkap : ", komunitas)
        // 5. Return data komunitas dan file details
        return {
            komunitas,
            fileDetails,
            jumlahAnggotaData
        };
    } catch (error) {
        console.error("Error in load function:", error);
        throw error;
    }
};

export const actions: Actions = {
    tambahSitus: async ({ request, params }) => {
        const id : any = params.id;
        const data = await request.formData();
        console.log("Form data:", data);
        
        const ver = z.object({
            nama_situs: 
                z.string({ message: "Field Nama Situs Harus diisi" })
                    .nonempty("Field ini tidak boleh kosong"),
            
            alamat: 
                z.string({ message: "Field Alamat Harus diisi" })
                    .nonempty("Field ini tidak boleh kosong"),
            
            email: 
                z.string({ message: "Field Email Harus diisi" })
                    .nonempty("Field ini tidak boleh kosong")
                    .email("Email Invalid"),
            
            deskripsi_situs: 
                z.string({ message: "Field Deskripsi Situs Harus diisi" })
                    .nonempty("Field ini tidak boleh kosong"),
            
            penanggungjawab: 
                z.string({ message: "Field Penanggung Jawab Harus diisi" })
                    .nonempty("Field ini tidak boleh kosong"),
            
            pembina: 
                z.string({ message: "Field Pembina Harus diisi" })
                    .nonempty("Field ini tidak boleh kosong"),
            
            pelindung: 
                z.string({ message: "Field Pelindung Harus diisi" })
                    .nonempty("Field ini tidak boleh kosong"),
            
            phone:
                z.string({ message: "Field Nomer Telepon Harus diisi" })
                    .min(10, "Nomer telpon minimal 10 digit")
                    .max(13, "nomer telpon maximal 13 digit")
                    .regex(/^\d+$/, "Harus berupa digit"),
            
            jumlah_anggota:
                z.string({ message: "Field Jumlah Anggota Harus diisi" })
                    .nonempty("Field ini tidak boleh kosong")
                    .regex(/^\d+$/, "Harus berupa digit")
        });
        
        const formData = {
            nama_situs: String(data.get("nama_situs")),
            alamat: String(data.get("alamat")),
            email: String(data.get("email")),
            deskripsi_situs: String(data.get("deskripsi_situs")),
            penanggungjawab: String(data.get("penanggungjawab")),
            pembina: String(data.get("pembina")),
            pelindung: String(data.get("pelindung")),
            phone: String(data.get("phone")),
            jumlah_anggota: String(data.get("jumlah_anggota")),
            image_name: String(data.get("image_name") || '')
        };
        
        const verification = ver.safeParse({ ...formData });
        if (!verification.success) {
            return fail(418, {
                errors: verification.error.flatten().fieldErrors, 
                success: false, 
                formData
            });
        }
        
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("id_komunitas", id);
            formDataToSend.append("nama_komunitas", formData.nama_situs);
            formDataToSend.append("alamat", formData.alamat);
            formDataToSend.append("email", formData.email);
            formDataToSend.append("deskripsi", formData.deskripsi_situs);
            formDataToSend.append("penanggung_jawab", formData.penanggungjawab);
            formDataToSend.append("pembina", formData.pembina);
            formDataToSend.append("pelindung", formData.pelindung);
            formDataToSend.append("jumlah_anggota", formData.jumlah_anggota);
            formDataToSend.append("phone", formData.phone);
            
            // Tambahkan file gambar jika ada
            const profileImage = data.get("profile_image");
            if (profileImage && profileImage instanceof File && profileImage.size > 0) {
                formDataToSend.append("foto_profile", profileImage);
                console.log("Adding profile image to request");
            }
            
            console.log("Sending data to API:", Object.fromEntries(formDataToSend));
            
            const response = await fetch(`${env.URL_KERAJAAN}/komunitas`, {
                method: "PUT",
                body: formDataToSend
            });
            
            const result = await response.json();
            console.log("API response:", result);
            
            if (response.ok) {
                return { success: true, message: "Data berhasil diperbarui" };
            }
            
            return fail(400, { 
                errors: { server: [`Error: ${response.status} - ${result.message || "Terjadi kesalahan"}`] },
                success: false, 
                formData 
            });
        } catch (error) {
            console.error("Error updating komunitas:", error);
            return fail(500, {
                errors: { server: ["Terjadi kesalahan saat memperbarui data"] },
                success: false,
                formData
            });
        }
    }
};
