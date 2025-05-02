import { env } from "$env/dynamic/private";
import { fail, type Actions } from "@sveltejs/kit";
import { z } from "zod";

export const actions: Actions = {
    tambahSitus: async ({ request }) => {
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
            deskripsi_situs: String(data.get("deskripsi_situs")),
            penanggungjawab: String(data.get("penanggungjawab")),
            pembina: String(data.get("pembina")),
            image_name: String(data.get("image_name")),
            pelindung: String(data.get("pelindung")),
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
            formDataToSend.append("id_pemohon", "1");
            formDataToSend.append("nama_komunitas", formData.nama_situs);
            formDataToSend.append("alamat", formData.alamat);
            // formDataToSend.append("email", formData.email);
            formDataToSend.append("deskripsi", formData.deskripsi_situs);
            formDataToSend.append("penanggung_jawab", formData.penanggungjawab);
            formDataToSend.append("pembina", formData.pembina);
            formDataToSend.append("pelindung", formData.pelindung);
            // formDataToSend.append("jumlah_anggota", formData.jumlahanggota);
            // formDataToSend.append("phone", formData.phone);
            formDataToSend.append("jenis_komunitas", "Public")
            formDataToSend.append("tanggal_berdiri", "2025-04-28");
            // Tanggal berdiri? jenis komunitas?

            
            // Tambahkan file gambar jika ada
            const profileImage = data.get("profile_image");
            if (profileImage) {
                formDataToSend.append("foto_profile", profileImage);
            }

            console.log("form data to send : " , formDataToSend)

            const response = await fetch(`${env.URL_KERAJAAN}/komunitas`, {
                method: "POST",
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
