import { env } from "$env/dynamic/private";
import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async ({cookies}) => {
    const token = cookies.get("userSession")? JSON.parse(cookies.get("userSession") as string): ''
    console.log("Token:", token);
    if(!token) redirect(302, '/login') ;
    try {
        const res = await fetch(`${env.URL_KERAJAAN}/anggota`, {
            headers: {
                'Authorization': `Bearer ${token?.token}`
            }
        });

        if (!res.ok) {
            throw new Error(`HTTP Error! Status: ${res.status}`);
        }
        let data = await res.json();
        let finalData = data.filter(item => item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at);
        finalData = finalData.map((item: any) => ({
            ...item,
            tanggal_lahir: item.tanggal_lahir ? item.tanggal_lahir.split('T')[0] : item.tanggal_lahir
        }));
        console.log("Data",data);
        return { data: finalData };
    } catch (error) {
        console.log(error);
    }
};
export const actions: Actions = {
    delete: async ({ request, cookies }) => {
        const token = cookies.get("userSession")? JSON.parse(cookies.get("userSession") as string): ''
        const data = await request.formData();
        const id = data.get("id_user");
        console.log("Deleting user with ID:", id);
        try {
            const delres = await fetch(`${env.PUB_PORT}/profile/users/${id}`, {
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