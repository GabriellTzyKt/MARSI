import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async ({cookies}) => {
    const token = cookies.get("userSession") ? JSON.parse(cookies.get("userSession") as string) : '';
    try {
        let res = await fetch(`${env.URL_KERAJAAN}/anggota`,{
           
        })
        if (!res.ok) {
            throw new Error(`HTTP Error! Status: ${res.status}`);
        }
        let data = await res.json();
        data = data.filter((item: any) => {
            return item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at;
        });


        let resgelar = await fetch(`${env.URL_KERAJAAN}/gelar?limit=500`)

        if (!resgelar.ok) {
            throw new Error(`HTTP Error! Status: ${resgelar.status}`);
        }
        let gelarData = await resgelar.json();
        gelarData = gelarData.filter((item: any) => {
            return item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at;
        }
        ).map((item: any) => {
            return {
                id_gelar: item.id_gelar,
                nama_gelar: item.nama_gelar
            }
        });
        console.log("User data:", data);
        data = data.map((item: any) => ({
            ...item,
            nama_gelar: item.id_gelar ? gelarData.find((gelar: any) => gelar.id_gelar === item.id_gelar)?.nama_gelar || '-' : '-',
        }));

        return {
            data
        };
    } catch (error) {
        console.error("Error fetching users:", error);
        // Handle the error appropriately, e.g., redirect or return an error message
        return { data: [] };
    }
    return {
        data: []
    };
};