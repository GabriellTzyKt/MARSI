import { env } from "$env/dynamic/private";
import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    try {
        // Fetch all data in parallel for better performance
        const [gelarRes,penghargaanRes, jenisSitusRes, jenisAsetRes, kategoriSitusRes, wisataRes] = await Promise.all([
            fetch(`${env.URL_KERAJAAN}/gelar?limit=1000`),
            fetch(`${env.URL_KERAJAAN}/penghargaan?limit=1000`),
            fetch(`${env.URL_KERAJAAN}/situs/jenis?limit=1000`),
            fetch(`${env.URL_KERAJAAN}/aset/jenis?limit=1000`),
            fetch(`${env.URL_KERAJAAN}/situs/kategori?limit=1000`),
            fetch(`${env.URL_KERAJAAN}/situs/wisata?limit=1000`)
        ]);

        // Process responses
        const gelar = await processResponse(gelarRes);
        const penghargaan = await processResponse(penghargaanRes);
        const jenisSitus = await processResponse(jenisSitusRes);
        const jenisAset = await processResponse(jenisAsetRes);
        const kategoriSitus = await processResponse(kategoriSitusRes);
        const wisata = await processResponse(wisataRes);
        
        return {
            gelar,
            penghargaan,
            jenisSitus,
            jenisAset,
            kategoriSitus,
            wisata
        };
    }
    catch (error) {
        console.error("Error fetching data:", error);
        return {
            penghargaan: [],
            jenisSitus: [],
            jenisAset: [],
            kategoriSitus: [],
            wisata: [],
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
};

// Helper function to process API responses
async function processResponse(response: Response) {
    if (!response.ok) {
        console.error(`API error: ${response.status} ${response.statusText}`);
        return [];
    }
    
    const data = await response.json();
    
    // Filter out deleted items - items are not deleted if deleted_at is the default value or null/undefined
    return Array.isArray(data) 
        ? data.filter(item => 
            item.deleted_at === "0001-01-01T00:00:00Z" || 
            !item.deleted_at || 
            item.deleted_at === null)
        : [];
}

export const actions: Actions = {
    // Add new item
    tambah: async ({ request }) => {
        const formData = await request.formData();
        const type = formData.get("type")?.toString();
        const nama = formData.get("nama")?.toString();
        const singkatan = formData.get("singkatan")?.toString();
        const level = formData.get("level")?.toString();
        console.log(formData)
        
        if (!type || !nama) {
            return fail(400, { error: "Missing required fields" });
        }
        
        try {
            let endpoint = "";
            let payload = {};
            
            switch (type) {
                case "gelar":
                    endpoint = `${env.URL_KERAJAAN}/gelar`;
                    payload = { nama_gelar: nama, singkatan, level : Number(level) };
                    break;
                case "penghargaan":
                    endpoint = `${env.URL_KERAJAAN}/penghargaan`;
                    payload = { nama_penghargaan: nama };
                    break;
                case "jenisSitus":
                    endpoint = `${env.URL_KERAJAAN}/situs/jenis`;
                    payload = {id_kategori: 1 ,jenis_situs: nama };
                    break;
                case "jenisAset":
                    endpoint = `${env.URL_KERAJAAN}/aset/jenis`;
                    payload = { nama_jenis: nama };
                    break;
                case "kategoriSitus":
                    endpoint = `${env.URL_KERAJAAN}/situs/kategori`;
                    payload = { nama_kategori: nama };
                    break;
                case "wisata":
                    endpoint = `${env.URL_KERAJAAN}/situs/wisata`;
                    payload = { nama_wisata: nama };
                    break;
                case "gelar":
                    endpoint = `${env.URL_KERAJAAN}/gelar`;
                    payload = { nama_gelar: nama };
                    break;
                default:
                    return fail(400, { error: "Invalid type" });
            }
            
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                return fail(response.status, { 
                    error: `Error ${response.status}: ${errorData.message || "Unknown error"}` 
                });
            }
            
            return { success: true };
        } catch (error) {
            console.error("Error adding item:", error);
            return fail(500, { error: error instanceof Error ? error.message : "Unknown error" });
        }
    },
    
    // Update existing item
    ubah: async ({ request }) => {
        const formData = await request.formData();
        const type = formData.get("type")?.toString();
        const id = formData.get("id")?.toString();
        const nama = formData.get("nama")?.toString();
        const level = formData.get("level")?.toString();
        const singkatan = formData.get("singkatan")?.toString();
        console.log("update",formData)
        if (!type || !id || !nama) {
            return fail(400, { error: "Missing required fields" });
        }
        
        try {
            let endpoint = "";
            let payload = {};
            
            switch (type) {
                case "gelar":
                    endpoint = `${env.URL_KERAJAAN}/gelar`;
                    payload = {id_gelar: Number(id), nama_gelar: nama, singkatan, level: Number(level) };
                    break;
                case "penghargaan":
                    endpoint = `${env.URL_KERAJAAN}/penghargaan`;
                    payload = {id_penghargaan: Number(id), nama_penghargaan: nama};
                    break;
                case "jenisSitus":
                    endpoint = `${env.URL_KERAJAAN}/situs/jenis`;
                    payload = {id_jenis_situs: Number(id),id_kategori:1, jenis_situs: nama };
                    break;
                case "jenisAset":
                    endpoint = `${env.URL_KERAJAAN}/aset/jenis`;
                    payload = {id_jenis_aset: Number(id), nama_jenis: nama };
                    break;
                case "kategoriSitus":
                    endpoint = `${env.URL_KERAJAAN}/situs/kategori`;
                    payload = {id_kategori:Number(id), nama_kategori: nama };
                    break;
                case "wisata":
                    endpoint = `${env.URL_KERAJAAN}/situs/wisata`;
                    payload = {id_wisata:Number(id), nama_wisata: nama };
                    break;
                default:
                    return fail(400, { error: "Invalid type" });
            }
            
            const response = await fetch(endpoint, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                return fail(response.status, { 
                    error: `Error ${response.status}: ${errorData.message || "Unknown error"}` 
                });
            }
            
            return { success: true };
        } catch (error) {
            console.error("Error updating item:", error);
            return fail(500, { error: error instanceof Error ? error.message : "Unknown error" });
        }
    },
    
    // Delete (soft delete) item
    hapus: async ({ request }) => {
        const formData = await request.formData();
        const type = formData.get("type")?.toString();
        const id = formData.get("id")?.toString();
        console.log("delete",formData)
        if (!type || !id) {
            return fail(400, { error: "Missing required fields" });
        }
        
        try {
            let endpoint = "";
            
            switch (type) {
                case "gelar":
                    endpoint = `${env.URL_KERAJAAN}/gelar/${id}`;
                    break;
                case "penghargaan":
                    endpoint = `${env.URL_KERAJAAN}/penghargaan/${id}`;
                    break;
                case "jenisSitus":
                    endpoint = `${env.URL_KERAJAAN}/situs/jenis/${id}`;
                    break;
                case "jenisAset":
                    endpoint = `${env.URL_KERAJAAN}/aset/jenis/${id}`;
                    break;
                case "kategoriSitus":
                    endpoint = `${env.URL_KERAJAAN}/situs/kategori/${id}`;
                    break;
                case "wisata":
                    endpoint = `${env.URL_KERAJAAN}/situs/wisata/${id}`;
                    break;
                default:
                    return fail(400, { error: "Invalid type" });
            }
            
            const response = await fetch(endpoint, {
                method: "DELETE"
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                return fail(response.status, { 
                    error: `Error ${response.status}: ${errorData.message || "Unknown error"}` 
                });
            }
            
            return { success: true };
        } catch (error) {
            console.error("Error deleting item:", error);
            return fail(500, { error: error instanceof Error ? error.message : "Unknown error" });
        }
    }
};
