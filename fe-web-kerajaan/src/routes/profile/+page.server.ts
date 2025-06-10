import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";
import { date } from "zod";
import { formatDate, formatDatetoUI } from "$lib";
function formatDateToUI(isoString: string): string {
    if (!isoString) return '-';
    const date = new Date(isoString);
    const day = date.getDate();
    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
        "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
}

export const load: PageServerLoad = async ({locals, cookies}) => {
    try {
        const sessionCookie = cookies.get("userSession");
        console.log(sessionCookie)
        if (!sessionCookie) {
            return redirect(302, '/login');
        }
        
        const session = JSON.parse(sessionCookie);
        console.log(sessionCookie)
        if (!session || !session.token) {
            return redirect(302, '/login');
        }
        
        console.log("Session contents:", session.user_data);
        
        const res = await fetch(`${env.PUB_PORT}/user/profile`, {
            headers: {
                "Authorization": `Bearer ${session.token}`
            }
        });
        
        const data = await res.json();
        console.log("Profile",data.profile)
        if (res.ok) {
            let resAcara = await fetch(`${env.URL_KERAJAAN}/acara/user/terdaftar/${data.id_user}`)
            let acaraData = await resAcara.json();
            if (!Array.isArray(acaraData)) {
                acaraData = acaraData ? [acaraData] : [];
            }
            acaraData = acaraData.filter((item: any) => item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at);
            // Ambil data penanggung jawab untuk setiap acara
    acaraData = await Promise.all(acaraData.map(async (item: any) => {
        let penanggungjawab_nama = '';
        if (item.id_penanggung_jawab) {
            try {
                const resUser = await fetch(`${env.PUB_PORT}/user/${item.id_penanggung_jawab}`, {
                    headers: {
                        "Authorization": `Bearer ${session.token}`
                    }
                });
                if (resUser.ok) {
                    const userData = await resUser.json();
                    penanggungjawab_nama = userData?.nama_lengkap || '';
                }
            } catch (e) {
                console.error("Error fetching penanggung jawab:", e);
            }
        }
        return {
            ...item,
            penanggungjawab_nama,
            tanggal_mulai: formatDateToUI(item.waktu_mulai)
        };
    }));


             const res = await fetch(`${env.PUB_PORT}/doc/${data.profile}`);
            const dataPath = await res.json();
            console.log(dataPath)
             const foto_profile = dataPath.file_dokumentasi 
                ? `${env.PUB_PORT}/file?file_path=${encodeURIComponent(dataPath.file_dokumentasi)}`
                : ''; // ganti dengan path default image kamu
            const resData = {
                ...data,
                foto_profile,
                tanggal_lahir: formatDate(data.tanggal_lahir)
            };
            
            console.log(data);
            return {data: resData, historyAcara: acaraData};
        }
        
        console.log(data);
        return redirect(302, '/login');
    } catch (error) {
        console.error("Error in profile load function:", error);
        return redirect(302, '/login');
    }
};

export const actions: Actions = {
    logout: async ({cookies}) => {
        try {
            const session = cookies.get("userSession")
            console.log(session)
            if (!session) {
                return {success: false}
            }
            else {
                const sess = JSON.parse(session as string)
                
                
                cookies.delete("userSession", { path: "/" })
                return {success: true}
            }
           
        }
        catch (error) {
            console.log("Logout Error", error)
            return fail(500, {error: "An error occurred during logout"})
            
        }
    }
};
