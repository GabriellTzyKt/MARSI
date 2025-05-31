import { env } from "$env/dynamic/private";
import { error, fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import { formatDatetoUI, formatTime } from "$lib";

function extractRegion(alamat: string) {
    if (!alamat) return 'Unknown Region';
    const lower = alamat.toLowerCase();

    if (lower.includes('jawa')) return 'Jawa';
    if (lower.includes('kalimantan')) return 'Kalimantan';
    if (lower.includes('sumatera')) return 'Sumatera';
    if (lower.includes('sulawesi')) return 'Sulawesi';
    if (lower.includes('papua')) return 'Papua';
    if (lower.includes('bali')) return 'Bali';
    if (lower.includes('ntt') || lower.includes('nusa tenggara timur') || lower.includes('ntb') || lower.includes('nusa tenggara barat')) return 'Nusa Tenggara';
    // Tambahkan region lain sesuai kebutuhan

    return 'Lainnya';
}

export const load: PageServerLoad = async ({ cookies, params }) => {
    try {
        // Get the situs ID from params
        const situsId = params.id;
        console.log("Fetching acara for situs ID:", situsId);
        
        // Get token from cookies
        const token = cookies.get("userSession") ? JSON.parse(cookies.get("userSession") as string) : '';
        console.log("Token:", token);
        
        // Fetch all data in parallel using Promise.all
        const [situsResponse, eventsResponse, usersResponse] = await Promise.all([
            fetch(`${env.URL_KERAJAAN}/situs/${situsId}`),
            fetch(`${env.URL_KERAJAAN}/acara/situs/${situsId}`),
            fetch(`${env.PUB_PORT}/users`, {
                headers: {
                    "Authorization": `Bearer ${token?.token}`
                }
            })
        ]);
        
        // Handle situs response
        if (!situsResponse.ok) {
            throw error(situsResponse.status, `Failed to fetch Situs: ${situsResponse.statusText}`);
        }
        const situsData = await situsResponse.json();
        console.log("Situs data:", situsData);
        
        // Handle events response
        if (!eventsResponse.ok) {
            throw error(eventsResponse.status, `Failed to fetch Events: ${eventsResponse.statusText}`);
        }
        let events = await eventsResponse.json();
        console.log(`Found ${events.length} events for situs ${situsId}`);
        events = events.filter((event : any) => {
            // Keep only items where deleted_at is the default value (not deleted)
            return event.deleted_at === '0001-01-01T00:00:00Z' || !event.deleted_at;
        });
        // Add situs info to each event
        const eventsWithSitusInfo = events.map((event : any) => ({
            ...event,
            situs_nama: situsData.nama_situs || 'Unknown',
            situs_alamat: extractRegion(event.alamat_acara || '') // gunakan fungsi ini
        }));
        
        // Handle users response
        let allUsers = [];
        if (usersResponse.ok) {
            allUsers = await usersResponse.json();
            console.log(`Retrieved ${allUsers.length} users`);
        } else {
            console.error(`Failed to fetch users: ${usersResponse.status}`);
        }
        
        // Create a map of user IDs to user details for quick lookup
        const userMap = new Map();
        allUsers.forEach((user : any) => {
            userMap.set(user.id_user, user);
        });
        
        // Add penanggung_jawab names to events and format dates
        const eventsWithUserInfo = eventsWithSitusInfo.map((event : any) => {
            let penanggungJawabName = 'Unknown';
            
            if (event.id_penanggung_jawab && userMap.has(event.id_penanggung_jawab)) {
                const userData = userMap.get(event.id_penanggung_jawab);
                penanggungJawabName = userData.nama_lengkap || userData.nama || `User ${event.id_penanggung_jawab}`;
            }
            
            return {
                ...event,
                penanggung_jawab_nama: penanggungJawabName,
                tanggal_mulai: formatDatetoUI(event.waktu_mulai),
                tanggal_selesai: formatDatetoUI(event.waktu_selesai),
                waktu_mulai: formatTime(event.waktu_mulai),
                waktu_selesai: formatTime(event.waktu_selesai)
            };
        });
        
        // Sort events by date (newest first)
        eventsWithUserInfo.sort((a, b) => {
            const dateA : any = new Date(a.tanggal_mulai || a.created_at || 0);
            const dateB : any = new Date(b.tanggal_mulai || b.created_at || 0);
            return dateB - dateA;
        });
        
        return {
            events: eventsWithUserInfo,
            situs: situsData
        };
    } catch (err) {
        console.error("Error in load function:", err);
        throw error(500, "Failed to load situs and events data");
    }
}
export const actions: Actions = {
    delete: async ({ request }) => {
        console.log("Deleting acara");
        const data = await request.formData();
        const id = data.get("id_acara");
        console.log("Deleting acara with ID:", id);
        try {
            const delres = await fetch(`${env.URL_KERAJAAN}/acara/${id}`, {
                method: "DELETE"
            });
            if (!delres.ok) {
                const errorData = await delres.json().catch(() => ({}));
                console.error("Delete failed:", delres.status, errorData);
                return fail(delres.status, { 
                    error: errorData.message || `Gagal menghapus acara (${delres.status})` 
                });
            }
            const successData = await delres.json().catch(() => ({ message: "Success" }));
            console.log("Delete successful:", successData);
            return {
                success: true,
                message: "Acara berhasil dihapus"
            };
        }
        catch (error) {
            console.log(error)
            return fail(500, { error: "Terjadi kesalahan saat menghapus acara" });
        }
    }
};
