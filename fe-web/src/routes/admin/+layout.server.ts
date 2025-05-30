import type { PageServerLoad } from "./managemen/$types";
import type { RequestEvent } from "@sveltejs/kit"; // <-- Add this import

export const load: PageServerLoad = async ({ cookies }: RequestEvent) => {
    const nama = cookies.get('userSession');
    const hasil = nama ? JSON.parse(nama) : 'halo';
    const tes = cookies.get('userSession') ? JSON.parse(cookies.get('userSession') as string) : "Haslo";
    console.log(hasil);
    return { hasil: hasil.nama, id: tes.user_data.id_user };
};
