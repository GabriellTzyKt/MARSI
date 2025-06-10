import { fail, type Actions } from "@sveltejs/kit";
import { z } from "zod";

import { env } from "$env/dynamic/private";
import { formatDatetoUI } from "$lib";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, cookies }) => {
    let token = cookies.get("userSession") ? JSON.parse(cookies.get("userSession") as string) : '';
    try {
        let res = await fetch(`${env.URL_KERAJAAN}/situs/kunjungan/${params.id}`);
        if (!res.ok) {
            throw new Error(`HTTP Error! Status: ${res.status}`)
        }
        let userRes = await fetch(`${env.PUB_PORT}/users`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        })
        let user = await userRes.json();
        user = user.filter((user: any) => user.deleted_at == '0001-01-01T00:00:00Z' || user.deleted_at == null);
        let kunjungan = await res.json();
        kunjungan = kunjungan.filter((kunjungan: any) => {
            return kunjungan.deleted_at == '0001-01-01T00:00:00Z' && kunjungan.deleted_at !== null;
        }).map((kunjungan: any) => ({
            ...kunjungan,
            tanggal_kunjungan: kunjungan.tanggal_kunjungan.split("T")[0]
        }));
        return { kunjungan, user: user };
    } catch (error) {
        console.error("Error fetching kunjungan:", error);
        return { kunjungan: [] };
    }
};

export const actions: Actions = {
    tambah: async ({ request,params }) => {
        const data = await request.formData();
        console.log("data entries : ", data);
        
        // Get all unique IDs from form data
        const entryIds = new Set<string>();
        for (const [key] of data.entries()) {
            if (key.includes('-')) {
                const id = key.split('-')[1];
                entryIds.add(id);
            }
        }
        
        // Create form object and validation errors
        let form = {
            id_situs: {} as Record<string, string>,
            id_user_ditemui: {} as Record<string, string>,
            nama_user: {} as Record<string, string>,
            nama_pengunjung: {} as Record<string, string>,
            tanggal_kunjungan: {} as Record<string, string>,
            no_telp: {} as Record<string, string>,
            kota_asal: {} as Record<string, string>,
            tujuan_kunjungan: {} as Record<string, string>,
            keterangan: {} as Record<string, string>,
        };
        
        let errors = {} as Record<string, string>;
        
        // Define validation schema for a single entry
        const entrySchema = z.object({
            id_user_ditemui: z.number().int().positive(),
            nama_user: z.string().min(1, "Masukkan nama user!"),
            tanggal_kunjungan: z.string().min(1, "Tanggal kunjungan harus diisi!"),
            no_telp: z.string()
                .min(1, "Nomor telepon harus diisi!")
                .regex(/^\d+$/, "Nomor telepon hanya boleh angka!")
                .refine(val => val.length >= 10, "Nomor telepon minimal 10 digit!"),
            kota_asal: z.string().min(1, "Kota asal harus diisi!"),
            keterangan: z.string().optional(),
            tujuan_kunjungan: z.string().optional(),
        });
        
        // Process each entry with individual validation
        const entryPromises = Array.from(entryIds).map(async id => {
            const id_situs = parseInt(params.id)
            const id_user_ditemui = parseInt(data.get(`id_user_ditemui-${id}`)?.toString() || '3'); // Default to 3 as specified
            const nama_user = (data.get(`nama_user-${id}`)?.toString() || '3'); // Default to 3 as specified
        
            const tanggal_kunjungan = data.get(`tanggal_kunjungan-${id}`)?.toString() || '';
            const tujuan_kunjungan = data.get(`tujuan_kunjungan-${id}`)?.toString() || '';
            const no_telp = data.get(`no_telp-${id}`)?.toString() || '';
            const kota_asal = data.get(`kota_asal-${id}`)?.toString() || '';
            const keterangan = data.get(`keterangan-${id}`)?.toString() || '';
            
            // Skip empty entries (except the first one)
            if (id !== '1' && !nama_user && !tanggal_kunjungan && !no_telp && !kota_asal) {
                return null;
            }
            
            // Add to form object
            form.id_situs[id] = id_situs.toString();
            form.id_user_ditemui[id] = id_user_ditemui.toString();
            form.tujuan_kunjungan[id] = tujuan_kunjungan.toString();
            form.nama_user[id] = nama_user.toString();
          
            form.tanggal_kunjungan[id] = tanggal_kunjungan;
            form.no_telp[id] = no_telp;
            form.kota_asal[id] = kota_asal;
            form.keterangan[id] = keterangan;
            
            // Validate this entry
            const validation = entrySchema.safeParse({
                
                id_user_ditemui,
                tujuan_kunjungan,
                nama_user,
                tanggal_kunjungan,
                no_telp,
                kota_asal,
                keterangan
            });
            
            if (!validation.success) {
                // Add field errors with the entry ID
                const fieldErrors = validation.error.flatten().fieldErrors;
                Object.entries(fieldErrors).forEach(([field, messages]) => {
                    if (messages && messages.length > 0) {
                        errors[`${field}.${id}`] = messages[0];
                    }
                });
                return null;
            }
            
            // Format date for API
            const formattedDate = formatDatetoUI(tanggal_kunjungan);
            
            // Return the validated and formatted entry
            return {
                id_situs,
                id_user_ditemui,
                nama_pengunjung: nama_user,
                tanggal_kunjungan: formattedDate,
                tujuan_kunjungan,
                no_telp,
                kota_asal,
                keterangan
            };
        });
        
        // Wait for all entry validations to complete
        const processedEntries = (await Promise.all(entryPromises)).filter(entry => entry !== null);
        
        console.log("Form data:", form);
        
        // Return errors if any
        if (Object.keys(errors).length > 0) {
            console.log("Validation errors:", errors);
            return fail(406, {
                errors,
                success: false,
                formData: form,
                type: "add"
            });
        }
        
        // Send the data to the API
        try {
            // Upload each entry individually
            const uploadPromises = processedEntries.map(async entry => {
                if (!entry) return null;
                console.log(entry)
                try {
                    console.log(entry)
                    const response = await fetch(`${env.URL_KERAJAAN}/situs/kunjungan`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(entry), // API expects an array
                    });
                    
                    if (!response.ok) {
                        console.error(`Error submitting entry for ${entry.nama_pengunjung}:`, await response.text());
                        return null;
                    }
                    
                    const result = await response.json();
                    console.log(`Entry for ${entry.nama_pengunjung} submitted successfully:`, result);
                    return result;
                } catch (error) {
                    console.error(`Error submitting entry for ${entry.nama_pengunjung}:`, error);
                    return null;
                }
            });
            
            // Wait for all uploads to complete
            const results = await Promise.all(uploadPromises);
            const successfulUploads = results.filter(Boolean);
            
            if (successfulUploads.length === 0 && processedEntries.length > 0) {
                // All uploads failed
                return fail(500, { 
                    errors: "Gagal menambahkan data pengunjung", 
                    success: false, 
                    formData: form, 
                    type: "add" 
                });
            } else if (successfulUploads.length < processedEntries.length) {
                // Some uploads failed
                return { 
                    errors: "Beberapa data berhasil ditambahkan", 
                    success: true, 
                    formData: form, 
                    type: "add",
                    partialSuccess: true
                };
            } else {
                // All uploads succeeded
                return { 
                    errors: "Success", 
                    success: true, 
                    formData: form, 
                    type: "add" 
                };
            }
        } catch (error) {
            console.error("Error submitting data:", error);
            return fail(500, { 
                errors: "Error submitting data", 
                success: false, 
                formData: form, 
                type: "add" 
            });
        }
    },
    hapusPengunjung: async ({ request }) => {
        const data = await request.formData();
        const id = data.get("id_kunjungan");
        try {
            const res = await fetch(`${env.URL_KERAJAAN}/situs/kunjungan/${id}`, {
                method: "DELETE"
            });
            if (!res.ok) {
                throw new Error(`HTTP Error! Status: ${res.status}`);
            }
            const data = await res.json();
            console.log(data);
            return { success: true };
        }
        catch (error) {
            console.error("Error deleting record:", error);
            return fail(500, { error: "Server error when deleting record" });
        }
    }

};

function formatDateForAPI(dateString: string): string {
    if (!dateString) return '';
    
    try {
        const [year, month, day] = dateString.split('-');
        return `${year}-${month}-${day}`;
    } catch (e) {
        console.error("Error formatting date:", e);
        return dateString;
    }
}
