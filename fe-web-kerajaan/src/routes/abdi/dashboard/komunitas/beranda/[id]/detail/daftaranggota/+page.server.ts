import { error, fail, type Actions } from "@sveltejs/kit";
import { z } from "zod";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";
import { formatDate } from "$lib";


export const load: PageServerLoad = async ({ params, cookies }) => {
    console.log("id komunitas", params.id)
    const token = cookies.get("userSession")? JSON.parse(cookies.get("userSession") as string): ''
    try {
        let komunitasResponse = await fetch(`${env.URL_KERAJAAN}/komunitas/anggota/${params.id}`);
        if (!komunitasResponse.ok) {
            throw error(komunitasResponse.status, `Failed to fetch komunitas: ${komunitasResponse.statusText}`);
        }
        
        let komunitasList = await komunitasResponse.json();
        let filteredData = komunitasList.filter(item => item && (item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at));
        // let finalData = await Promise.all(filteredData.map(async (data: any) => {
        //     if (!data) return null;
        //     let res = await fetch(`${env.PUB_PORT}/user/${data.id_user}`,{
        //         headers: {
        //             "Authorization": `Bearer ${token?.token}`
        //         }
        //     })
        //     if (res.ok) {
        //         let dataAnggota = await res.json()
        //         if(!dataAnggota || dataAnggota.deleted_at !== '0001-01-01T00:00:00Z') return null;
        //         return {
        //             ...dataAnggota, 
        //             tanggal_bergabung: formatDate(data.tanggal_bergabung),
        //             jabatan_komunitas: data.jabatan_anggota
        //         }
        //     }
        //     return null
        // }))
        //  filteredData = finalData.filter(item => item && (item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at));
        console.log("filtered data : ", filteredData)
        const userData = await fetch(`${env.PUB_PORT}/users`, {
            headers: {
                "Authorization": `Bearer ${token?.token}`
            }
        });
        if (!userData.ok) {
            throw error(userData.status, `Failed to fetch user: ${userData.statusText}`);
        }
        const dataUser = await userData.json()
        // console.log("data user : ", dataUser)
        return {
            data: filteredData,
            dataUser,
            komunitas_id: params.id,
            komunitasList: komunitasList.filter(item => item && (item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at))
        }
        
        // Array untuk menyimpan semua data anggota dari semua komunitas
        
        // Iterasi melalui setiap komunitas untuk mengambil anggotanya
        

       
    } catch (error) {
        console.error("Error in load function:", error);
        throw error;
    }
};


export const actions: Actions = {
    tambah: async ({ request }) => {
        const data = await request.formData();
        console.log(data)

        let form = {
            namaanggota: "",
            deskripsi: "",
            jabatan: ""
        }


        const ver = z.object({
            namaanggota: z.string().trim().min(1, "Minimal 1 anggota!"),
            deskripsi: z.string().trim().min(1, "Deskripsi harus diisi!"),
            jabatan: z.string().trim().min(1, "Jabatan harus diisi!"),
        });

        form = {
            namaanggota: String(data.get("namaanggota") || "").trim(),
            deskripsi: String(data.get("deskripsitugas") || "").trim(),
            jabatan: String(data.get("jabatan") || "").trim(),
        };

        console.log("Extracted Form:", form);


        const validation = ver.safeParse({ ...form });


        if (!validation.success) {
            console.log(validation.error.flatten().fieldErrors)
            return fail(406, {
                errors: validation.error.flatten().fieldErrors, success: false,
                formData: form, type: "add"
            });
        }

        try {
            // Format current date and time as DD-MM-YYYY HH:MM:SS
            const now = new Date();
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            
            const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
            const senddata = {
                id_komunitas: Number(data.get("id_komunitas")),
                id_user: Number(data.get("id_user")),
                jabatan_anggota: String(form.jabatan),
                deskripsi_tugas: String(form.deskripsi),
                tanggal_bergabung: formattedDate
            }
            console.log("send data: ", senddata)
            const res = await fetch(`${env.URL_KERAJAAN}/komunitas/anggota`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(senddata)
            })
            if (!res.ok) {
                return fail(406,{errors_api: "Gagal menambahkan anggota"})
            }
            return true
        }
        catch (error) {
            console.log(error)
        }
        
        return { errors: "Success", success: true, formData: form, type: "add" };
    },
    hapus: async ({ request }) => {
        const form = await request.formData()
        console.log(form)
        try {
            const res = await fetch(`${env.URL_KERAJAAN}/komunitas/anggota/${form.get("id_komunitas")}/${form.get("id_user")}`, {
                method: "DELETE"
            })
            if (!res.ok) {
                return fail(406,{errors_api: "Gagal menghapus anggota"})
            }
            return true
        } catch (error) {
            console.log(error)
        }
    },
    ubah: async ({ request }) => {

        const data = await request.formData();
        console.log(data)
       


        const ver = z.object({
            namaanggota: z.string().trim().min(1, "Minimal 1 anggota!"),
            id_user: z.string().trim().min(1, "Pilih dari DropDown!"),
            deskripsi: z.string().trim().min(1, "Deskripsi harus diisi!"),
            jabatan: z.string().trim().min(1, "Jabatan harus diisi!"),
        });

        let form = {
            namaanggota: String(data.get("namaanggota") || "").trim(),
            id_user: String(data.get("id_user") || "").trim(),
            deskripsi: String(data.get("deskripsitugas") || "").trim(),
            jabatan: String(data.get("jabatan") || "").trim(),
        };

        console.log("Extracted Form:", form);


        const validation = ver.safeParse({ ...form });


        if (!validation.success) {
            console.log(validation.error.flatten().fieldErrors)
            return fail(406, {
                errors: validation.error.flatten().fieldErrors, success: false,
                formData: form, type: "add"
            });
        }

        try {
            // Format current date and time as DD-MM-YYYY HH:MM:SS
            const now = new Date();
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            
            const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}`;
            let senddata = {
                id_komunitas: Number(data.get("id_komunitas")),
                id_user: Number(data.get("id_user")),
                jabatan_anggota: String(form.jabatan),
                deskripsi_tugas: String(form.deskripsi),
                // tanggal_bergabung: formattedDate
            }
            console.log("send data: ", senddata)
            const res = await fetch(`${env.URL_KERAJAAN}/komunitas/anggota`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(senddata)
            })
            if (!res.ok) {
                return fail(406, { errors_api: "Gagal menambahkan anggota" })
            }
            return true
        }
        catch (error) {
            console.log(error)
        }
        
        return { errors: "Success", success: true, formData: form, type: "add" };
    }
};
