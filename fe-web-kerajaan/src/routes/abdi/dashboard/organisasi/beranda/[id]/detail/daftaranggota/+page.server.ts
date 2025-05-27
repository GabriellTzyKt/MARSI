import { fail, type Actions } from "@sveltejs/kit";
import { z } from "zod";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";
import { error } from "@sveltejs/kit";
import { page } from "$app/state";
import { formatDate } from "$lib";

export const load: PageServerLoad = async ({ fetch, params, cookies }) => {
    let id_organisasi  = params.id
    let token = cookies.get("userSession")? JSON.parse(cookies.get("userSession") as string): ''
    try {
     
        let users = await fetch(`${env.PUB_PORT}/users`, {
            headers: {
                "Authorization": `Bearer ${token?.token}`
            }
        });
        if (!users.ok) {
            throw error(users.status, `Failed to fetch users: ${users.statusText}`);
        }
        let userData = await users.json();
        userData = userData.filter((item: any) => {
            return item.deleted_at == '0001-01-01T00:00:00Z' || !item.deleted_at;
        }).map((item: any) => {
            return {
                id: item.id_user,
                nama_lengkap: item.nama_lengkap,
                email: item.email
            }
        });


        return {
            userData,
            id_organisasi: id_organisasi
        }
  
        // console.log("organisasi : ", organisasiList);

        // Filter out deleted organizations (keep only non-deleted ones)
    
        
        
        // Array untuk menyimpan semua data anggota dari semua organisasi
        
        
        // console.log("all anggota with user info: ", allAnggot

       
    } catch (error) {
        console.error("Error in load function:", error);
        throw error;
    }
};

export const actions: Actions = {
    tambah: async ({request, params}) => {
        const data = await request.formData();
        
        // Get the ID directly from URL params
        const organisasiId = params.id;
        console.log("Organisasi ID from URL:", organisasiId);

        const idUser = data.get("id_user")
        console.log("ID User : ", idUser);

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
                errors: validation.error.flatten().fieldErrors, 
                success: false,
                formData: form, 
                type: "add"
            });
        }

        console.log( "Deskripsi : " , form.deskripsi, "Jabatan : ", form.jabatan)

        try {
            const response = await fetch(`${env.URL_KERAJAAN}/organisasi/anggota`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_organisasi : Number(organisasiId),
                    id_user : Number(idUser),
                    deskripsi_tugas: String(form.deskripsi),
                    jabatan_anggota: String(form.jabatan),
                    tanggal_bergabung : "2025-05-08"
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
    },
    
    hapus: async ({request}) => {
        const data = await request.formData();
        
        const organisasiId = data.get("id_organisasi");
        const userId = data.get("id_user");
        
        console.log("Deleting member with organisasi ID:", organisasiId, "and user ID:", userId);
        
        if (!organisasiId || !userId) {
            return fail(400, {
                errors: { api: ["Missing required parameters"] },
                success: false,
                type: "delete"
            });
        }
        
        try {
            const response = await fetch(`${env.URL_KERAJAAN}/organisasi/anggota/${organisasiId}/${userId}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json"
                }
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
    },
    ubah: async ({request}) => {
        const data = await request.formData();
        console.log(data);
        const organisasiId = data.get("id_organisasi");
        const userId = data.get("id_user");
        
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
            id_user: String(data.get("id_user") || "").trim(),
            deskripsi: String(data.get("deskripsitugas") || "").trim(),
            jabatan: String(data.get("jabatan") || "").trim(),
        };

        console.log("Extracted Form:", form);

        const validation = ver.safeParse({ ...form });

        if (!validation.success) {
            console.log(validation.error.flatten().fieldErrors)
            return fail(406, {
                errors: validation.error.flatten().fieldErrors, 
                success: false,
                formData: form, 
                type: "edit"
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
    }






};
