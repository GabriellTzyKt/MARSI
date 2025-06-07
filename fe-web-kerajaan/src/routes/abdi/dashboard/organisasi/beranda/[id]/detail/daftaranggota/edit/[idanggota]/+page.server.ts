import { fail } from "@sveltejs/kit";
import { error, type Actions } from "@sveltejs/kit";
import { z } from "zod";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";

export const load: PageServerLoad = async ({ params, cookies }) => {
    let token = cookies.get("userSession")? JSON.parse(cookies.get("userSession") as string): ''
    try {
        let allUser = await fetch(`${env.PUB_PORT}/users`, {
            headers: {
                "Authorization": `Bearer ${token?.token}`
            }
        })
        let alluserData = await allUser.json().then((res) => res.filter((item: any) => item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at));
        let userRes = await fetch(`${env.PUB_PORT}/user/${params.idanggota}`, {
            headers: {
                "Authorization": `Bearer ${token?.token}`
            }
        });
        let anggotaRes = await fetch(`${env.URL_KERAJAAN}/organisasi/anggota/${params.id}?limit=1000`, {
            method:"GET"
        })
        let user = await userRes.json();
        let anggota = await anggotaRes.json();
        let selectedAnggota = anggota.find((item: any) => item.id_user === user.id_user);
        console.log("User res:", user);
        console.log("Anggota res:", anggota);
        anggota = anggota.filter((item: any) => item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at);
        if (!anggotaRes.ok) {
            
        }
        return {
            user,
            selectedAnggota,
            alluserData,
            id_organisasi: params.id
        }
    } catch (error) {
        
    }
};

export const actions: Actions = {
    edit: async ({ request, cookies,params }) => {
        let token = cookies.get("userSession")? JSON.parse(cookies.get("userSession") as string): ''
        const data = await request.formData();

        console.log(data)

        const ver = z.object({
            namalengkap: z.string().trim().min(1, "Isi Nama organisasi"),
            tempatlahir: z.string().trim().min(1, "Tempat lahir harus diisi!"),
            tanggallahir: z.coerce.date({ message: "Tanggal Tidak valid (YYYY-MM-DD)" }),
            alamat: z.string().trim().min(1, "Alamat isiiiii!"),
            notelepon: z.string()
                .min(10, "Nomor telepon harus diisi!")
                .regex(/^\d+$/, "Nomor telepon hanya boleh angka!"),
            hobi: z.string().optional(),
            jeniskelamin: z.string().trim().min(1, "Isi Jenis Kelamin!"),
            jabatan: z.string().trim().min(1, "Isi jabatan!"),
          
            inputayah: z.string().trim().min(1, "Isi Input!"),
            inputibu: z.string().trim().min(1, "Isi input!"),
            wongso: z.string().trim().min(1, "Isi Wongso!"),
            pekerjaan: z.string().optional(),
            agama: z.string().min(1, "Isi Agama!"),
            email: z.string().optional(),
            deskripsitugas: z.string().trim().min(1, "Isi Deskripsi!"),
        });

       let  form = {
            namalengkap: data.get("namalengkap") ?? "",
            tempatlahir: data.get("tempatlahir") ?? "",
            tanggallahir: data.get("tanggallahir") ?? "",
            alamat: data.get("alamat") ?? "",
            notelepon: data.get("notelepon") ?? "",
            hobi: data.get("hobi") ?? "",
            jabatan: data.get("jabatan") ?? "",

            inputayah: data.get("nama_ayah") ?? "",
            inputibu: data.get("nama_ibu") ?? "",
            wongso: data.get("wongso") ?? "",
            pekerjaan: data.get("pekerjaan") ?? "",
            agama: data.get("agama") ?? "",
            email: data.get("email") ?? "",
            deskripsitugas: data.get("deskripsitugas") ?? "",
            jeniskelamin: data.get("jeniskelamin") ?? "",
        };

        const validation = ver.safeParse({ ...form });

        if (!validation.success) {
            console.log(validation.error.flatten().fieldErrors)
            return fail(406, {
                errors: validation.error.flatten().fieldErrors, success: false,
                formData: form, type: "add"
            });
        }
        try {
            // let tanggal = () => {
            //     let pisah = data.gettanggallahir.split("-");
            //     let year = date.getFullYear();
            //     let month = date.getMonth() + 1;
            //     let day = date.getDate();
            //     return `${year}-${month}-${day}`
            // }
            let payloadUser = {
                id_user: Number(params.idanggota),
                profile: '',
                nama_lengkap: form.namalengkap,
                alamat: form.alamat,
                tempat_lahir: form.tempatlahir,
                tanggal_lahir: form.tanggallahir,
                email: form.email,
                no_telp: form.notelepon,
                pekerjaan: form.pekerjaan,
                agama: form.agama,
                jenis_kelamin: form.jeniskelamin,
                hobi: form.hobi,
                nama_ayah: form.inputayah,
                nama_ibu: form.inputibu,
                keturunan: form.wongso,
            }
            console.log("payload USer",payloadUser)
            let userEditRes = await fetch(`${env.PUB_PORT}/user`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token?.token}`
                },
                body: JSON.stringify(payloadUser)
            })
            let userEdit = await userEditRes.json();
            console.log("User Edit:", userEdit)
             
            let anggota_edit = {
                id_organisasi: Number(params.id),
                id_user: Number(params.idanggota),
                jabatan_anggota: form.jabatan,
                deskripsi_tugas: form.deskripsitugas,
                tanggal_bergabung : (data.get("tanggal_bergabung") as string)?.split("T")[0]
            }
              console.log("Anggota Edit:", anggota_edit)
            let anggotaEditRes = await fetch(`${env.URL_KERAJAAN}/organisasi/anggota`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token?.token}`
                },
                body: JSON.stringify(anggota_edit)
            })
            let anggotaEdit = await anggotaEditRes.json();
            console.log("Anggota Edit:", anggotaEdit)
        } catch (error) {
            return fail(500, {mesg:"Internal Server Error"});
        }
        return { errors: "Success", success: true, formData: form, type: "add" };
    }
};