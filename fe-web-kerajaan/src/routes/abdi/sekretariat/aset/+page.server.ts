import { env } from "$env/dynamic/private";
import { fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { filterArsip } from "$lib";

export const load: PageServerLoad = async () => {
    try {
        const res = await fetch(`${env.URL_KERAJAAN}/aset?limit=300`, {
            method:"GET"
        });
       
        if (!res.ok) {
            throw new Error(`HTTP Error! Status: ${res.status}`);
        }
        
    
        const data = await res.json();
        console.log(data)
        const final = data.filter(item => item.deleted_at === "0001-01-01T00:00:00Z")
       
        console.log(final)
        return { data: final };
    }
    catch (error) {
        
    }
};
export const actions: Actions = {
    delete: async ({request}) => {
        try {
            const data = await request.formData();
            const id = data.get("id_aset");
            
            if (!id) {
                return fail(400, { error: "ID aset tidak ditemukan" });
            }
            
            console.log("Deleting asset with ID:", id);
            
            // First, get the asset details to confirm it exists
            const checkRes = await fetch(`${env.URL_KERAJAAN}/aset/${id}`, {
                method: "GET"
            });
            
            if (!checkRes.ok) {
                console.error(`Failed to find asset: ${checkRes.status}`);
                return fail(404, { error: "Aset tidak ditemukan" });
            }
            
            // Perform the delete operation
            const deleteRes = await fetch(`${env.URL_KERAJAAN}/aset/${id}`, {
                method: "DELETE"
            });
            
            if (!deleteRes.ok) {
                const errorData = await deleteRes.json().catch(() => ({}));
                console.error("Delete failed:", deleteRes.status, errorData);
                return fail(deleteRes.status, { 
                    error: errorData.message || `Gagal mengarsipkan aset (${deleteRes.status})` 
                });
            }
            
            const successData = await deleteRes.json().catch(() => ({ message: "Success" }));
            console.log("Delete successful:", successData);
            
            // Return success response
            return {
                success: true,
                message: "Aset berhasil diarsipkan"
            };
        } catch (error) {
            console.error("Error in delete action:", error);
            return fail(500, { error: "Terjadi kesalahan saat mengarsipkan aset" });
        }
    }
};