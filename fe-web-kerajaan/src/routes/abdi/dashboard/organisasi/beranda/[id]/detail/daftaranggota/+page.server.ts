import { fail, type Actions } from "@sveltejs/kit";
import { z } from "zod";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";
import { error } from "@sveltejs/kit";
import { page } from "$app/state";
import { formatDate } from "$lib";

export const load: PageServerLoad = async ({ fetch, params, cookies }) => {
    const id_organisasi  = params.id
    const token = cookies.get("userSession")? JSON.parse(cookies.get("userSession") as string): ''
    try {
        // Fetch all organizations
        const organisasiResponse = await fetch(`${env.URL_KERAJAAN}/organisasi?limit=20000000`);
        if (!organisasiResponse.ok) {
            throw error(organisasiResponse.status, `Failed to fetch organisasi: ${organisasiResponse.statusText}`);
        }
        
        const organisasiList = await organisasiResponse.json();
        // console.log("organisasi : ", organisasiList);

        // Filter out deleted organizations (keep only non-deleted ones)
        const filteredList = organisasiList.filter((doc: any) => {
            return doc.deleted_at === '0001-01-01T00:00:00Z' || doc.deleted_at === null;
        });

        console.log("Filtered List : ", filteredList)
        
        // Fetch all users
        const usersResponse = await fetch(`${env.PUB_PORT}/users`, {
            headers: {
                "Authorization": `Bearer ${token?.token}`
            }
        });
        let allUsers = [];
        if (usersResponse.ok) {
            allUsers = await usersResponse.json();
            // console.log("All users:", allUsers);
        } else {
            console.error(`Failed to fetch users: ${usersResponse.statusText}`);
        }
        
        const organisasiWithUsers = await Promise.all(
            filteredList.map(async (organisasi: any) => {
                if (organisasi.id_user) {
                    try {
                        const userResponse = await fetch(`${env.PUB_PORT}/user/${organisasi.id_user}`, {
                            headers: {
                                "Authorization": `Bearer ${token?.token}`
                            }
                        });
                        if (userResponse.ok) {
                            const userData = await userResponse.json();
                            console.log("User data : ", userData);
                            return {
                                ...organisasi,
                                user_name: userData.nama_lengkap || 'Unknown User',
                                user_notelp: userData.no_telp || "08120219421",
                                user_email: userData.email || 'No Email'
                            };
                        }
                    } catch (userError) {
                        console.error(`Error fetching user for organisasi ${organisasi.id_organisasi}:`, userError);
                    }
                }
                return {
                    ...organisasi,
                    user_name: 'Unknown User',
                    user_notelp: "No Notelp!",
                    user_email: 'No Email'
                };
            })
        );
        
        // Array untuk menyimpan semua data anggota dari semua organisasi
        let allAnggota: any = [];
        
        // Iterasi melalui setiap organisasi untuk mengambil anggotanya
        for (const organisasi of organisasiWithUsers) {
            try {
                const anggotaResponse = await fetch(`${env.URL_KERAJAAN}/organisasi/anggota/${organisasi.id_organisasi}?limit=200`);
                if (anggotaResponse.ok) {
                    const anggotaList = await anggotaResponse.json();
                    // console.log(`Anggota organisasi ${organisasi.id_organisasi}:`, anggotaList);
                    
                    // Process each member to add user information
                    const anggotaWithUserInfo = await Promise.all(
                        anggotaList.map(async (anggota: any) => {
                            // Skip members with deleted_at not equal to default value
                            if (anggota.deleted_at && anggota.deleted_at !== '0001-01-01T00:00:00Z') {
                                return null;
                            }
                            
                            // First add organization info to the member
                            let memberWithInfo = {
                                ...anggota,
                                nama_organisasi: organisasi.nama_organisasi,
                                id_organisasi: organisasi.id_organisasi,
                                user_name: 'Unknown User',
                                user_email: 'No Email',
                                user_notelp: 'No Phone'
                            };
                            
                            // If the member has an id_user, fetch their user information
                            if (anggota.id_user) {
                                try {
                                    const userResponse = await fetch(`${env.PUB_PORT}/user/${anggota.id_user}`);
                                    if (userResponse.ok) {
                                        const userData = await userResponse.json();
                                        
                                        // Skip users that have been deleted
                                        if (userData.deleted_at && userData.deleted_at !== '0001-01-01T00:00:00Z') {
                                            return null;
                                        }
                                        
                                        memberWithInfo = {
                                            ...memberWithInfo,
                                            tanggal_bergabung: formatDate(anggota.tanggal_bergabung || organisasi.tanggal_bergabung),
                                            user_name: userData.nama_lengkap || userData.nama || 'Unknown User',
                                            user_email: userData.email || 'No Email',
                                            user_notelp: userData.no_telp || 'No Phone'
                                        };
                                    } else {
                                        console.error(`Failed to fetch user for anggota ${anggota.id_anggota}: ${userResponse.statusText}`);
                                    }
                                } catch (userError) {
                                    console.error(`Error fetching user for anggota ${anggota.id_anggota}:`, userError);
                                }
                            }
                            
                            return memberWithInfo;
                        })
                    );
                    
                    // Filter out null values (deleted members) and add to main array
                    const filteredAnggota = anggotaWithUserInfo.filter(item => item !== null);
                    allAnggota = [...allAnggota, ...filteredAnggota];
                }
            } catch (anggotaError) {
                console.error(`Error fetching anggota for organisasi ${organisasi.id_organisasi}:`, anggotaError);
                // Lanjutkan ke organisasi berikutnya meskipun ada error
            }
        }
        // console.log("all anggota with user info: ", allAnggota);
       

        return {
            organisasiList: organisasiWithUsers.filter(item => item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at),
            allAnggota,
            allUsers,
            organisasi_id: id_organisasi
        };
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
