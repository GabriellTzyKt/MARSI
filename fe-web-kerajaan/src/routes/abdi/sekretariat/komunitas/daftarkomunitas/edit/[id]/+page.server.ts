import { env } from "$env/dynamic/private";
import { fail, type Actions, error } from "@sveltejs/kit";
import { z } from "zod";
import type { PageServerLoad } from "./$types";
import { formatDate } from "$lib";

export const load: PageServerLoad = async ({ params, cookies }) => {
    try {
        const id = params.id;
        let token = cookies.get("userSession")? JSON.parse(cookies.get("userSession") as string): ''
        
        // 1. Fetch data komunitas berdasarkan ID
        const komunitasResponse = await fetch(`${env.URL_KERAJAAN}/komunitas/${id}`);
        if (!komunitasResponse.ok) {
            throw error(komunitasResponse.status, `Failed to fetch komunitas: ${komunitasResponse.statusText}`);
        }
        
        let komunitas = await komunitasResponse.json();
        console.log("komunitas : ", komunitas)
        komunitas = {
            ...komunitas,
            tanggal_berdiri: formatDate(komunitas.tanggal_berdiri)
        }
        // const komunitas = komunitasList.find((item: any) => item.id_komunitas == id);
        

        // jumlah anggota ambil
        const jumlahAnggota = await fetch(`${env.URL_KERAJAAN}/komunitas/anggota/${id}`);
        if (!jumlahAnggota.ok) {
            throw error(jumlahAnggota.status, `Failed to fetch komunitas: ${jumlahAnggota.statusText}`);
        }

        const jumlahAnggotaData = await jumlahAnggota.json();
        
        // Fetch all users
        const usersResponse = await fetch(`${env.PUB_PORT}/users`, {
            headers: {
                "Authorization": `Bearer ${token?.token}`
            }
        });

        let allUsers = [];
        if (usersResponse.ok) {
            const userData = await usersResponse.json();
            allUsers = userData.filter((user: any) => 
                user.deleted_at === '0001-01-01T00:00:00Z' || !user.deleted_at
            ).map((user: any) => ({
                id: user.id_user,
                name: user.nama_lengkap || 'Nama tidak tersedia',
                email: user.email || 'Email tidak tersedia'
            }));
        } else {
            console.error(`Failed to fetch users: ${usersResponse.statusText}`);
        }

        // 2. Jika ada ID foto profil, ambil file path
        let fileDetails = null;
        let foto_komunitas_url = null
        if (komunitas.foto_komunitas) {
            try {
                const filePathResponse = await fetch(`${env.URL_KERAJAAN}/doc/${komunitas.foto_komunitas}`);
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
                        foto_komunitas_url = `${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(filePath)}`
                    }
                }
            } catch (fileError) {
                console.error("Error fetching file details:", fileError);
            }

        }
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
            foto_komunitas_url,
            jumlahAnggotaData,
            allUsers
        };
    } catch (error) {
        console.error("Error in load function:", error);
        throw error;
    }
};

export const actions: Actions = {
    ubahKomunitas: async ({ request, params }) => {
         const data = await request.formData()
        console.log("komunitas : ", data)
        const ver = z.object({
            nama_situs:
                z.string({ message: "Field Nama Situs Harus diisi" })
                    .nonempty("Field ini tidak boleh kosong"),

            image_name:
                z.string({ message: "Minimal 1 foto!" }).min(1, "Field ini tidak boleh kosong"),


            alamat:
                z.string({ message: "Field Alamat Harus diisi" })
                    .nonempty("Field ini tidak boleh kosong"),

            email:
                z.string({ message: "Field Email Harus diisi" })
                    .nonempty("Field ini tidak boleh kosong")
                    .email("Email Invalid"),
            deskripsi_komunitas:
                z.string({ message: "Field Deskripsi Situs Harus diisi" })
                    .nonempty("Field ini tidak boleh kosong"),
            tanggal_berdiri:
                z.string({ message: "Field Tanggal Berdiri Harus diisi" })
                    .nonempty("Field ini tidak boleh kosong")
                    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD")
                    .refine((dateStr) => {
                        const date = new Date(dateStr);
                        return !isNaN(date.getTime()) && dateStr === date.toISOString().split("T")[0];
                    }, { message: "Tanggal tidak valid" }),

            penanggungjawab:
                z.string({ message: "Field Penanggung Jawab Harus diisi" })
                    .nonempty("Field ini tidak boleh kosong"),
            penanggungjawab_id:
                z.string({ message: "Field Penanggung Jawab Harus dipilih" })
                    .nonempty("Field ini tidak boleh kosong"),
            pembina:
                z.string({ message: "Field Pembina Harus diisi" })
                    .nonempty("Field ini tidak boleh kosong"),
            pembina_id:
                z.string({ message: "Field Pembina Harus dipilih" })
                    .nonempty("Field ini tidak boleh kosong"),
            pelindung:
                z.string({ message: "Field Pelindung Harus diisi" })
                    .nonempty("Field ini tidak boleh kosong"),
            pelindung_id:
                z.string({ message: "Field Pelindung Harus dipilih" })
                    .nonempty("Field ini tidak boleh kosong"),
            tempat_operasional:
                z.string({ message: "Field Tempat Operasional Harus dipilih" })
                    .nonempty("Field ini tidak boleh kosong"),

            jumlahanggota:
                z.string({ message: "Field harus diisi!" }).regex(/^\d+$/, "Harus berupa digit").nonempty("Field ini tidak boleh kosong"),

            phone:
                z.string({ message: "Field Nomer Telepon Harus diisi" })
                    .min(10, "Nomer telpon minimal 10 digit")
                    .max(13, "nomer telpon maximal 13 digit")
                    .regex(/^\d+$/, "Harus berupa digit")


        })
        const formData = {
            nama_situs: String(data.get("nama_situs")),
            alamat: String(data.get("alamat")),
            email: String(data.get("email")),
            deskripsi_komunitas: String(data.get("deskripsi_situs")),
            penanggungjawab: String(data.get("penanggungjawab_nama")),
            penanggungjawab_id: String(data.get("penanggungjawab_id")),
            tanggal_berdiri: String(data.get("tanggal_berdiri")),
            pembina: String(data.get("pembina_nama")),
            pembina_id: String(data.get("pembina_id")),
            image_name: String(data.get("image_name")),
            tempat_operasional: String(data.get("tempat_operasional")),
            pelindung: String(data.get("pelindung_nama")),
            pelindung_id: String(data.get("pelindung_id")),
            jumlahanggota: String(data.get("jumlah_anggota")),
            phone: String(data.get("phone")),
        }
        const verification = ver.safeParse({ ...formData })

        console.log(verification)


        if (!verification.success) {
            return fail(418, { errors: verification.error.flatten().fieldErrors, success: false, formData })
        }
        // return { success: true, formData }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("id_pemohon", data.get("id_pemohon") as string);
            formDataToSend.append("penanggung_jawab", formData.penanggungjawab_id);
            formDataToSend.append("nama_komunitas", formData.nama_situs);
            formDataToSend.append("deskripsi", formData.deskripsi_komunitas);
            formDataToSend.append("lokasi", '2');
            formDataToSend.append("pelindung", formData.pelindung_id);
            formDataToSend.append("pembina", formData.pembina_id);
            formDataToSend.append("alamat", formData.alamat);
            formDataToSend.append("tanggal_berdiri", formData.tanggal_berdiri);
            formDataToSend.append("foto_komunitas", data.get("profile_image") as File);
            formDataToSend.append("foto_profile", data.get("profile_image") as File);
            formDataToSend.append("email", formData.email);
            formDataToSend.append("no_telp", formData.phone);
            // formDataToSend.append("tempat_operasional", formData.tempat_operasional);
            // formDataToSend.append("jumlah_anggota", formData.jumlahanggota);
            // formDataToSend.append("jenis_komunitas", "Public")
            // Tanggal berdiri? jenis komunitas?

            
            // Tambahkan file gambar jika ada
            // const profileImage = data.get("profile_image");
            // if (profileImage) {
            //     formDataToSend.append("foto_profile", profileImage);
            // }

            console.log("form data to send : " , formDataToSend)

            const response = await fetch(`${env.URL_KERAJAAN}/komunitas`, {
                method: "PUT",
                body: formDataToSend
            });

            const result = await response.json();
            console.log("result : ", result)
            
            if (response.ok) {
                return { success: true, message: "Data berhasil disimpan" };
            }
            
            return fail(400, { 
                errors: { server: [`Error: ${response.status} - ${result.message || "Terjadi kesalahan"}`] },
                success: false, 
                formData 
            });
        } catch (error) {
            console.error("Error saat mengirim data:", error);
            return fail(500, { 
                errors: { server: ["Terjadi kesalahan saat menghubungi server"] },
                success: false, 
                formData 
            });
        }
    }
};
