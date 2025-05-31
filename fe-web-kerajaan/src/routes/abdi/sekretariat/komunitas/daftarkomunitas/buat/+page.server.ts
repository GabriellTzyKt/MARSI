import { env } from "$env/dynamic/private";
import { fail, type Actions } from "@sveltejs/kit";
import { z } from "zod";
import type { PageServerLoad } from "../$types";
import pLimit from "p-limit";
export const load: PageServerLoad = async ({ cookies,locals }) => {
    let limit = pLimit(5)
    let dataCookies = cookies.get("userSession") ? JSON.parse(cookies.get("userSession") as string) : '';
    let token = dataCookies.token
    try {
        let res = await fetch(`${env.PUB_PORT}/users`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        

        if (!res.ok) {
            throw new Error(`HTTP Error! Status: ${res.status}`);
        }
        let data = await res.json();
        data = data.filter((item: any) => {
            return item.deleted_at == '0001-01-01T00:00:00Z' || !item.deleted_at;
        }).map((item: any) => {
            return {
                id: item.id_user,
                name: item.nama_lengkap,
                email: item.email
            }
        });
        let situsResdata = await fetch(`${env.URL_KERAJAAN}/situs?limit=500`);
        if (!situsResdata.ok) {
            throw new Error(`HTTP Error! Status: ${situsResdata.status}`);
        }
        let situsData = await situsResdata.json();
        console.log("Situs data:", situsData);
        situsData = situsData.filter((item: any) => {
            return item.deleted_at == '0001-01-01T00:00:00Z' || !item.deleted_at;
        }).map((item: any) => {
            return {
                id: item.id_situs,
                name: item.nama_situs,
            }
        });
        console.log("Raw admin data:", data);
        return { data, user: dataCookies.user_data, situsData, locals };
    }
    catch (error) {
        console.log(error);
        return { data: "Failed" };
    }
};
let permohonanPelindung = false
let permohonanPembina = false
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
            return fail(418, { errors: verification.error.flatten().fieldErrors, success: false, formData, permohonanPelindung, permohonanPembina })
        }
        // return { success: true, formData }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("id_pemohon", data.get("id_pemohon") as string);
            formDataToSend.append("penanggung_jawab", formData.penanggungjawab_id);
            formDataToSend.append("nama_komunitas", formData.nama_situs);
            formDataToSend.append("deskripsi", formData.deskripsi_komunitas);
            formDataToSend.append("lokasi", formData.tempat_operasional);
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
                method: "POST",
                body: formDataToSend
            });

            const result = await response.json();
            console.log("result : ", result)
            
            if (response.ok) {
                return { success: true, message: "Data berhasil disimpan", permohonanPelindung, permohonanPembina };
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
    },
    permohonanPelindung: async ({ request, cookies }) => {
        try {
            const form = await request.formData();
            console.log("Form data received:", form);

            // Get user session and token
            const dataCookies = cookies.get("userSession") ? JSON.parse(cookies.get("userSession") as string) : '';
            const token = dataCookies.token;

            // Extract fields from form
            const id_pemohon = Number(form.get("id_pemohon"));
            const id_pelindung = Number(form.get("pelindung_id"));
            const asal_lembaga = form.get("nama_situs");
            const jenis_lembaga = "Komunitas";
            const jenis_permohonan = "Pelindung";
            // Default waktu_berlaku: 3 days from now
            const now = new Date();
            now.setDate(now.getDate() + 3);
            const waktu_berlaku = now.toLocaleDateString("en-GB").split('/').reverse().join('-'); // dd-mm-yyyy

            // Error checking
            const errors: Record<string, string[]> = {};
            if (!id_pemohon) errors.id_pemohon = [" Pemohon wajib diisi"];
            if (!id_pelindung) errors.id_pelindung = [" Pelindung wajib diisi"];
            if (!asal_lembaga) errors.asal_lembaga = [" Nama Komunitas wajib diisi"];

            if (Object.keys(errors).length > 0) {
                return fail(400, { errors, success: false });
            }

            // Build payload
            const payload = {
                id_pemohon,
                id_pelindung,
                asal_lembaga,
                jenis_lembaga,
                jenis_permohonan,
                waktu_berlaku
            };

            // Send to API
            // const response = await fetch(`${env.URL_KERAJAAN}/permohonan`, {
            //     method: "POST",
            //     body: JSON.stringify(payload)
            // });

            // const result = await response.json();
            // console.log("PermohonanPelindung result:", result);

            permohonanPelindung = true;
            return { success: true, message: "Permohonan pelindung berhasil dikirim",  permohonanPelindung };
            if (response.ok) {
            }

            return fail(400, {
                errors: { server: [`Error: ${response.status} - ${result.message || "Terjadi kesalahan"}`] },
                success: false
            });
        } catch (error) {
            console.error("Error saat mengirim permohonan pelindung:", error);
            return fail(500, {
                errors: { server: ["Terjadi kesalahan saat menghubungi server"] },
                success: false
            });
        }
    },
    permohonanPembina: async ({ request, cookies }) => {
        try {
            const form = await request.formData();
            console.log("Form data received:", form);

            // Get user session and token
            const dataCookies = cookies.get("userSession") ? JSON.parse(cookies.get("userSession") as string) : '';
            const token = dataCookies.token;

            // Extract fields from form
            const id_pemohon = Number(form.get("id_pemohon"));
            const id_pembina = Number(form.get("pembina_id"));
            const asal_lembaga = form.get("nama_situs");
            const jenis_lembaga = "Komunitas";
            const jenis_permohonan = "Pembina";
            // Default waktu_berlaku: 3 days from now
            const now = new Date();
            now.setDate(now.getDate() + 3);
            const waktu_berlaku = now.toLocaleDateString("en-GB").split('/').reverse().join('-'); // dd-mm-yyyy

            // Error checking
            const errors: Record<string, string[]> = {};
            if (!id_pemohon) errors.id_pemohon = [" Pemohon wajib diisi"];
            if (!id_pembina) errors.id_pembina = [" Pembina wajib diisi"];
            if (!asal_lembaga) errors.asal_lembaga = [" Nama Komunitas wajib diisi"];

            if (Object.keys(errors).length > 0) {
                return fail(400, { errors, success: false });
            }

            // Build payload
            const payload = {
                id_pemohon,
                id_pembina,
                asal_lembaga,
                jenis_lembaga,
                jenis_permohonan,
                waktu_berlaku
            };

            // Send to API
            // const response = await fetch(`${env.URL_KERAJAAN}/permohonan`, {
            //     method: "POST",
            //     body: JSON.stringify(payload)
            // });

            // const result = await response.json();
            // console.log("PermohonanPembina result:", result);

            permohonanPembina = true;
            return { success: true, message: "Permohonan pembina berhasil dikirim",  permohonanPembina };
            if (response.ok) {
            }

            return fail(400, {
                errors: { server: [`Error: ${response.status} - ${result.message || "Terjadi kesalahan"}`] },
                success: false
            });
        } catch (error) {
            console.error("Error saat mengirim permohonan pembina:", error);
            return fail(500, {
                errors: { server: ["Terjadi kesalahan saat menghubungi server"] },
                success: false
            });
        }
    },

};
