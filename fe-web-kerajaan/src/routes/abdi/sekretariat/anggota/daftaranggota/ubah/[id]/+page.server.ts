import SuccessModal from "$lib/modal/SuccessModal.svelte";
import { fail, type Actions } from "@sveltejs/kit";
import { z } from "zod";
// import type { PageServerLoad } from "../$types";
import { env } from "$env/dynamic/private";
import type { PageServerLoad } from "./$types";
import { formatDate } from "$lib";
export const load: PageServerLoad = async ({ params, cookies }) => {
    
    let token = cookies.get("userSession")? JSON.parse(cookies.get("userSession") as string): ''
    try {
        let cookie = cookies.get("userSession") ? JSON.parse(cookies.get("userSession") as string) : '';
        let [resUser, resJabatan, detailAbdi] = await Promise.all([
            fetch(`${env.PUB_PORT}/users`, {
                headers: {
                    "Authorization": `Bearer ${token?.token}`
                }
            }),
            fetch(`${env.URL_KERAJAAN}/jabatan`),
            fetch(`${env.URL_KERAJAAN}/anggota/${params.id}`)
        ]);
        if (!resUser.ok) {
            throw new Error(`HTTP Error! Status: ${resUser.status}`)
        }
        
        let userData = await resUser.json();
        console.log("User res:", userData);
        userData = userData.filter((item: any) => {
            return item.deleted_at == '0001-01-01T00:00:00Z' || !item.deleted_at;
        }).map((item: any) => {
            return {
                id: item.id_user,
                nama_lengkap: item.nama_lengkap,
                email: item.email
            }
        });

        let jabatanData = [];
        if (resJabatan.ok) {
            const jabatan = await resJabatan.json();
            jabatanData = jabatan.filter((item: any) => 
                item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at
            );
        }
        console.log("Jabatan res:", jabatanData);
        let detailAbdiData = await detailAbdi.json();
        let userDetailData = await fetch(`${env.PUB_PORT}/user/${detailAbdiData.id_user}`, {
            headers: {
                "Authorization": `Bearer ${token?.token}`
            }
        });
        if (!userDetailData.ok) {
            throw new Error(`HTTP Error! Status: ${userDetailData.status}`)
        }
        let userDetail = await userDetailData.json();
        console.log("Detail Abdi res:", detailAbdiData);
        let combinedDataUser = {
            nama_lengkap: userDetail.nama_lengkap,
            alamat: userDetail.alamat,
            tempat_lahir: userDetail.tempat_lahir,
            tanggal_lahir: formatDate(userDetail.tanggal_lahir),
            nama_ayah: userDetail.nama_ayah,
            nama_ibu: userDetail.nama_ibu,
            username: userDetail.username,
            password: userDetail.password,
            jenis_kelamin: userDetail.jenis_kelamin,
            email: userDetail.email,
            no_telp: userDetail.no_telp,
            pekerjaan: userDetail.pekerjaan,
            agama: userDetail.agama,
            hobi: userDetail.hobi,
            keturunan: userDetail.keturunan,
            jabatan: detailAbdiData.jabatan,
            id_gelar: detailAbdiData.id_gelar,
            id_user: userDetail.id_user,


        }
        return {
            userData,
            jabatanData,
            detailAbdiData,
            userDetail,
            combinedDataUser
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        return { userData: [], jabatanData: [] };
    }
};
export const actions: Actions = {
    ubahAbdi: async ({ request, params, cookies }) => {
        let token = cookies.get("userSession")? JSON.parse(cookies.get("userSession") as string): ''
        const data = await request.formData();
        const today = String(new Date().toISOString().split("T")[0])
        const input = String(data.get("tanggal_lahir"))
        console.log(data)
        const ver = z.object({
            nama_lengkap:
                z.string({ message: "Field Nama Lengkap harus diisi" })
            .nonempty("Field Nama Lengkap Tidak Boleh Kosong!"),
            tempat_lahir:
                z.string({ message: "Field Tempat Lahir harus diisi" })
            .nonempty("Field Tempat Lahir Tidak Boleh Kosong!"),
            tanggal_lahir:
                z.string({ message: "Field Tanggal lahir harus diisi" })
                    .nonempty("Field Tanggal lahir Tidak Boleh Kosong!")
            ,

            alamat:
                z.string({ message: "Field Alamat harus diisi" })
                    .nonempty("Field Alamat Tidak Boleh Kosong!")
                   ,
            no_telp:
                z.string({ message: "Field Nomer Telpon harus diisi" })
                    .min(10, "Nomer Telpon minimal 10 digit")
                    .max(13, "Nomer Telpon maximal 13 digit")
                    .regex(/^\d+$/, "Nomer Telpon harus berupa digit")
            ,
           
            jenis_kelamin:
                z.string({ message: "Field Jenis Kelamin harus diisi" })
            .nonempty("Field Jenis Kelamin Tidak Boleh Kosong!"),
            hobi:
                z.string({ message: "Field Hobi harus diisi" })
                .optional(),
           
            jabatan:
                z.string({ message: "Field Jabatan harus diisi" })
            .nonempty("Field Jabatan Tidak Boleh Kosong!"),
            // nama_ayah:
            //     z.string({ message: "Field Nama Ayah harus diisi" })
            // .nonempty("Field Nama Ayah Tidak Boleh Kosong!"),
           
            // nama_ibu:
            //     z.string({ message: "Field Nama Ibu harus diisi" })
            // .nonempty("Field Nama Ibu Tidak Boleh Kosong!"),
            email:
                z.string({ message: "Field Email harus diisi" })
            .email("Email Tidak Valid").nullable(),
            // wongso:
            //     z.string({ message: "Field Wongso harus diisi" })
            // .nonempty("Field Wongso Tidak Boleh Kosong!"),
            pekerjaan:
                z.string({ message: "Field Pekerjaan harus diisi" })
                .optional(),
            agama: 
            z.string({ message: "Field Agama harus diisi" })
                .optional()
        })

        const form = {
            nama_lengkap: String(data.get("nama_lengkap")||""),
            tempat_lahir: String(data.get("tempat_lahir")||""),
            tanggal_lahir: String(data.get("tanggal_lahir")||""),
            alamat: String(data.get("alamat")||""),
            no_telp: String(data.get("no_telp")||""),
        
            jenis_kelamin: String(data.get("jenis_kelamin")||""),
            hobi: String(data.get("hobi")||""),    
            // nama_ayah: String(data.get("nama_ayah")||""),
            // nama_ibu: String(data.get("nama_ibu")||""),
            email: String(data.get("email")||""),
            // wongso: String(data.get("wongso")||""),
            pekerjaan: String(data.get("pekerjaan")||""),
            agama: String(data.get("agama")||""),
            jabatan: String(data.get("jabatan")||"")
        }
        const verification = ver.safeParse({ ...form })
        if (!verification.success) {
            console.log(verification.error.flatten().fieldErrors)
            return fail(418,{errors: verification.error.flatten().fieldErrors, success: false, form})
        }

        try {
            let formSend = {
                id_anggota: parseInt(params.id as string),
                nama_lengkap: form.nama_lengkap,
                alamat: form.alamat,
                tempat_lahir: form.tempat_lahir,
                tanggal_lahir: form.tanggal_lahir,
                nama_ayah: data.get("nama_ayah")||"",
                nama_ibu: data.get("nama_ibu")||"",
                jenis_kelamin: form.jenis_kelamin,
                       
                email: form.email,
                no_telp: form.no_telp,  
                pekerjaan: form.pekerjaan,
                agama: form.agama,
                hobi: form.hobi,
                keturunan: data.get("wongso")||"",
                jabatan: form.jabatan,
                id_gelar: 1,
                

            }
            console.log("Form Data to Send",formSend)
            let res = await fetch(`${env.URL_KERAJAAN}/anggota`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token?.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formSend)
            })
            console.log(res)
            let msg = await res.json()
            console.log(msg)
            if (!res.ok) {
                return fail(406, { errors_api: "Gagal menambahkan anggota", errors: {api: msg.message} })
                throw new Error(`HTTP Error! Status: ${res.status} ${res.statusText}`)
            }
            console.log(res)
        } catch (error) {
            
        }
        return {errors: "no Error", success: true, form}
    }
};
