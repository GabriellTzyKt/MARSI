import { fail, type Actions } from "@sveltejs/kit";
import { dummySekreAnggotaOrg } from '$lib/dummy'
import { string, z } from "zod";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";

export const load: PageServerLoad = async ({fetch, cookies}) => {
    try {
        let token = cookies.get("userSession")? JSON.parse(cookies.get("userSession") as string): ''
        let userRes = await fetch(`${env.PUB_PORT}/users`, {
            headers: {
                "Authorization": `Bearer ${token?.token}`
            }
        });
        if (!userRes.ok) {
            throw new Error(`HTTP Error! Status: ${userRes.status}`)
        }
        let userData = await userRes.json();
        userData = userData.filter((item: any) => {
            return item.deleted_at == '0001-01-01T00:00:00Z' || !item.deleted_at;
        }).map((item: any) => {
            return {
                id: item.id_user,
                nama_lengkap: item.nama_lengkap,
                email: item.email
            }
        });

        let res = await fetch(`${env.URL_KERAJAAN}/organisasi`)
        if (!res.ok) {
            throw new Error(`HTTP Error! Status: ${res.status}`)
        }
        let data = await res.json()
        let finalData = data.filter(item => item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at).map((item: any) => ({
            id_organisasi: item.id_organisasi,
            nama_organisasi: item.nama_organisasi,
            tanggal_berdiri: item.tanggal_berdiri ? item.tanggal_berdiri.split('T')[0] : item.tanggal_berdiri
        }));
        console.log(finalData)
        return { data: finalData, userData };
    } catch (error) {
        
    }

};



export const actions: Actions = {
    tambah: async ({request}) => {
        const data = await request.formData();
        console.log(data)


    
        const ver = z.object({
            namaanggota: z.string().trim().min(1, "Minimal 1 anggota!"),
            id_anggota: z.string().trim().min(1, "silahkan pilih dari dropdown!"),
            deskripsi: z.string().trim().min(1, "Deskripsi harus diisi!"),
            jabatan: z.string().trim().min(1, "Jabatan harus diisi!"),
        });

       let  form = {
            namaanggota: String(data.get("namaanggota") || "").trim(),
            id_anggota: String(data.get("id_anggota") || "").trim(),
            deskripsi: String(data.get("deskripsitugas") || "").trim(),
            jabatan: String(data.get("jabatan") || "").trim(),
        };

        console.log("Extracted Form:", form);


        const validation = ver.safeParse({ ...form });

        if (!validation.success) {
            console.log(validation.error.flatten().fieldErrors)
            return fail(406,{
                errors: validation.error.flatten().fieldErrors, success: false,
                formData: form, type: "add"
            });
        }
        try {
            let today = new Date().toISOString().split("T")[0]
            const response = await fetch(`${env.URL_KERAJAAN}/organisasi/anggota`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_organisasi : Number(data.get("id_organisasi")),
                    id_user : Number(form.id_anggota),
                    jabatan_anggota: String(form.jabatan),
                    tanggal_bergabung : today,
                    deskripsi_tugas: String(form.deskripsi),
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("API error:", errorText);
                return fail(response.status, {
                    errors: { api: ["Failed to add member to organization"] },
                    success: false,
                    formData: form,
                    type: "add"
                });
            }

            const result = await response.json();
            console.log("API response:", result);

            return { 
                success: true, 
                formData: form, 
                type: "add",
                message: "Anggota berhasil ditambahkan"
            };
        } catch (error) {
            console.error("Error adding member:", error);
            return fail(500, {
                errors: { api: ["An unexpected error occurred"] },
                success: false,
                formData: form,
                type: "add"
            });
        }

        return { errors: "Success", success: true, formData: form, type: "add" };
    },
    editAnggota: async ({ request }) => {
        const data = await request.formData();
        
        const organisasiId = data.get("id_organisasi");
        const userId = data.get("id_anggota");
        console.log(data)
        console.log("Updating member with organisasi ID:", organisasiId, "and user ID:", userId);
        
        if (!organisasiId || !userId) {
            return fail(400, {
                errors: { api: ["Missing required parameters"] },
                success: false,
                type: "edit"
            });
        }
        
     

        const ver = z.object({
            namaanggota: z.string().trim().min(1, "Minimal 1 anggota!"),
            id_user: z.string().trim().min(1, "Pilih dari DropDown!"),
            deskripsi: z.string().trim().min(1, "Deskripsi harus diisi!"),
            jabatan: z.string().trim().min(1, "Jabatan harus diisi!"),
        });

       let form = {
            namaanggota: String(data.get("namaanggota") || "").trim(),
            id_user: String(data.get("id_anggota") || "").trim(),
            deskripsi: String(data.get("deskripsitugas") || "").trim(),
            jabatan: String(data.get("jabatan") || "").trim(),
        };

        console.log("Extracted Form:", form);


        const validation = ver.safeParse({ ...form });

        if (!validation.success) {
            console.log(validation.error.flatten().fieldErrors)
            return fail(406, {
                errors: validation.error.flatten().fieldErrors, success: false,
                formData: form, type: "edit"
            });
        }
        
        try {
            const response = await fetch(`${env.URL_KERAJAAN}/organisasi/anggota`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_organisasi : Number(organisasiId),
                    id_user : Number(userId),
                    deskripsi_tugas: String(form.deskripsi),
                    jabatan_anggota: String(form.jabatan),
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("API error:", errorText);
                return fail(response.status, {
                    errors: { api: ["Failed to update member in organization"] },
                    success: false,
                    formData: form,
                    type: "edit"
                });
            }

            const result = await response.json();
            console.log("API response:", result);

            return { 
                success: true, 
                formData: form, 
                type: "edit",
                message: "Anggota berhasil diubah"
            };
        } catch (error) {
            console.error("Error updating member:", error);
            return fail(500, {
                errors: { api: ["An unexpected error occurred"] },
                success: false,
                formData: form,
                type: "edit"
            });
        }


    },

    hapusAnggota: async ({ request }) => {
        const data = await request.formData();
        const id = data.get("id_anggota");
        const organisasiId = data.get("id_organisasi");
        
        console.log("Deleting member with organisasi ID:", organisasiId, "and user ID:", id);
        
        if (!organisasiId || !id) {
            return fail(400, {
                errors: { api: ["Missing required parameters"] },
                success: false,
                type: "delete"
            });
        }
        
        try {
            const response = await fetch(`${env.URL_KERAJAAN}/organisasi/anggota/${organisasiId}/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error("API error:", errorText);
                return fail(response.status, {
                    errors: { api: ["Failed to delete member from organization"] },
                    success: false,
                    type: "delete"
                });
            }
            
            return {
                success: true,
                type: "delete",
                message: "Anggota berhasil dihapus"
            };
        } catch (error) {
            console.error("Error deleting member:", error);
            return fail(500, {
                errors: { api: ["An unexpected error occurred"] },
                success: false,
                type: "delete"
            });
        }
    }


};