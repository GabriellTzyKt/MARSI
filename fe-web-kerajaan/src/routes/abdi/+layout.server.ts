import { page } from "$app/state";
import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./dashboard/$types";
import { env } from "$env/dynamic/private";


export const load: PageServerLoad = async ({ cookies }) => {
    const nama = cookies.get('userSession')
    const hasil = nama ? JSON.parse(nama) : 'halo'
    const tes = cookies.get('userSession') ? JSON.parse(cookies.get('userSession') as string) : "Haslo"
    // console.log(hasil)
    
    return {hasil : hasil.nama, id : tes.user_data.id_user, username: tes.username}
}

