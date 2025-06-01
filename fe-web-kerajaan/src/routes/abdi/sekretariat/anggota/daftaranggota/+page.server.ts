import { env } from "$env/dynamic/private";
import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import { formatDatetoUI } from "$lib";

export const load: PageServerLoad = async ({cookies}) => {
    const token = cookies.get("userSession")? JSON.parse(cookies.get("userSession") as string): ''
   
    let userid = token.user_data
    console.log("Token:", token);
    console.log("User ID:", userid.id_user);
    if(!token) redirect(302, '/login') ;
    try {
        // Fetch anggota and gelar data in parallel
        let [anggotaRes, gelarRes] = await Promise.all([
            fetch(`${env.URL_KERAJAAN}/anggota?limit=300`, {
                headers: {
                    'Authorization': `Bearer ${token?.token}`
                }
            }),
            fetch(`${env.URL_KERAJAAN}/gelar`)
        ]);

        if (!anggotaRes.ok) {
            throw new Error(`HTTP Error! Status: ${anggotaRes.status}`);
        }
        
        let data = await anggotaRes.json();
        let finalData = data.filter(item => item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at);
        
        // Create gelar mapping if gelar fetch was successful
        let gelarMap = new Map();
        if (gelarRes.ok) {
            let gelarData = await gelarRes.json();
            gelarMap = new Map(gelarData.map(item => [item.id_gelar, item.nama_gelar]));
        }
        
        // Map anggota data with gelar information
        finalData = finalData.map((item: any) => ({
            ...item,
            tanggal_lahir: formatDatetoUI(item.tanggal_lahir) || '-',
            nama_gelar: item.id_gelar ? gelarMap.get(item.id_gelar) || '-' : '-'
        }));
        
        console.log("Data", finalData);
        return { 
            data: finalData,
            gelarList: Array.from(gelarMap.entries()).map(([id, nama]) => ({ id_gelar: id, nama_gelar: nama }))
        };
    } catch (error) {
        console.log(error);
        return { data: [], gelarList: [] };
    }
};
export const actions: Actions = {
    hapusAnggota: async ({ request, cookies }) => {
        const token = cookies.get("userSession")? JSON.parse(cookies.get("userSession") as string): ''
        const data = await request.formData();
        const id = data.get("id_anggota");
        console.log("Deleting user with ID:", id);
        try {
            const delres = await fetch(`${env.URL_KERAJAAN}/anggota/${id}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${token?.token}`
                }
            });
            if (!delres.ok) {
                const errorData = await delres.json().catch(() => ({}));
                console.error("Delete failed:", delres.status, errorData);
                return fail(delres.status, { 
                    error: errorData.message || `Gagal menghapus user (${delres.status})` 
                });
            }
            const successData = await delres.json().catch(() => ({ message: "Success" }));
            console.log("Delete successful:", successData);
            return {
                success: true,
                message: "User berhasil dihapus"
            };
        }
        catch (error) {
            console.log(error);
        }
    }   

};
