import { fail, type Actions } from "@sveltejs/kit";
import { z } from "zod";
import type { PageServerLoad } from "../$types";
import { env } from "$env/dynamic/private";

export const load: PageServerLoad = async ({fetch, cookies}) => {
    try {
        let token = cookies.get("userSession")? JSON.parse(cookies.get("userSession") as string): ''
        let resuser = await fetch(`${env.PUB_PORT}/users`,{
            headers: {
                "Authorization": `Bearer ${token?.token}`
            }
        })
        let resSitus = await fetch(`${env.URL_KERAJAAN}/situs`);
        if (!resSitus.ok) {
            throw new Error(`HTTP Error! Status: ${resSitus.status}`)
        }
        let situsData = await resSitus.json();
        let allSitus = situsData.filter((situs: any) => 
            situs.deleted_at === '0001-01-01T00:00:00Z' || !situs.deleted_at
        ).map((situs: any) => ({
            id: situs.id_situs,
            name: situs.nama_situs || 'Nama tidak tersedia'
        }));

        if (!resuser.ok) {
            throw new Error(`HTTP Error! Status: ${resuser.status}`)
        }
        let data = await resuser.json()
        console.log(data)
        data = data.filter((item: any) => {
            return item.deleted_at == '0001-01-01T00:00:00Z' || !item.deleted_at;
        }).map((item: any) => {
            return {
                id: item.id_user,
                name: item.nama_lengkap,
                email: item.email
            }
        });
       
        return {allUsers: data, allSitus}
    } catch (error) {
        
    }
};
export const actions: Actions = {
    tambahOrganisasi: async ({ request, cookies }) => {
        let token = cookies.get("userSession") ? JSON.parse(cookies.get("userSession") as string) : '';
         const data = await request.formData()
               console.log(data)
              const ver = z.object({
                   nama_organisasi:
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
                   deskripsi_organisasi:
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
                           .nonempty("Field ini mohon dipilih"),
                   pembina:
                       z.string({ message: "Field Pembina Harus diisi" })
                           .nonempty("Field ini tidak boleh kosong"),
                   pembina_id:
                       z.string({ message: "Field Pembina Harus dipilih" })
                           .nonempty("Field ini mohon dipilih"),
                   pelindung:
                       z.string({ message: "Field Pelindung Harus diisi" })
                           .nonempty("Field ini tidak boleh kosong"),
                   pelindung_id:
                       z.string({ message: "Field Pelindung Harus dipilih" })
                           .nonempty("Field ini mohon dipilih"),
                   tempat_operasional:
                       z.string({ message: "Field Tempat Operasional Harus dipilih" })
                           .nonempty("Field ini tidak boleh kosong"),
       
                //    jumlahanggota:
                //        z.string({ message: "Field harus diisi!" }).regex(/^\d+$/, "Harus berupa digit").nonempty("Field ini tidak boleh kosong"),
       
                   phone:
                       z.string({ message: "Field Nomer Telepon Harus diisi" })
                           .min(10, "Nomer telpon minimal 10 digit")
                           .max(13, "nomer telpon maximal 13 digit")
                           .regex(/^\d+$/, "Harus berupa digit")
       
       
               })
               const formData = {
                   nama_organisasi: String(data.get("nama_organisasi")),
                   alamat: String(data.get("alamat")),
                   email: String(data.get("email")),
                   deskripsi_organisasi: String(data.get("deskripsi_organisasi")),
                   penanggungjawab: String(data.get("penanggungjawab_nama")),
                   penanggungjawab_id: String(data.get("penanggungjawab_id")),
                   tanggal_berdiri: String(data.get("tanggal_berdiri")),
                   pembina: String(data.get("pembina_nama")),
                   pembina_id: String(data.get("pembina_id")),
                   image_name: String(data.get("image_name")),
                   tempat_operasional: String(data.get("tempat_operasional")),
                   pelindung: String(data.get("pelindung_nama")),
                   pelindung_id: String(data.get("pelindung_id")),
                //    jumlahanggota: String(data.get("jumlah_anggota")),
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
                //    formDataToSend.append("id_pemohon", data.get("id_pemohon") as string);
                   formDataToSend.append("id_admin", token.id_admin);
                   formDataToSend.append("penanggung_jawab", formData.penanggungjawab_id);
                   formDataToSend.append("nama_organisasi", formData.nama_organisasi);
                   formDataToSend.append("deskripsi", formData.deskripsi_organisasi);
                   formDataToSend.append("email", formData.email);
                   formDataToSend.append("no_telp", formData.phone);
                   formDataToSend.append("alamat", formData.alamat);
                   formDataToSend.append("pelindung", formData.pelindung_id);
                   formDataToSend.append("pembina", formData.pembina_id);
                   formDataToSend.append("tanggal_berdiri", formData.tanggal_berdiri);
                   formDataToSend.append("foto_organisasi", data.get("profile_image") as File);
                   formDataToSend.append("profile", data.get("profile_image") as File);
                   // formDataToSend.append("lokasi", '2');
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
       
                   const response = await fetch(`${env.URL_KERAJAAN}/organisasi`, {
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