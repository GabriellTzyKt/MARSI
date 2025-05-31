import { page } from "$app/state";
import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./dashboard/$types";
import { env } from "$env/dynamic/private";


export const load: PageServerLoad = async ({ cookies }) => {
    const nama = cookies.get('userSession')
    const hasil = nama ? JSON.parse(nama) : 'halo'
    const tes = cookies.get('userSession') ? JSON.parse(cookies.get('userSession') as string) : "Haslo"
    // console.log(hasil)
    if (page.route.id?.startsWith(`abdi/dashboard`)) {
        try {
            let res = await fetch(`${env.URL_KERAJAAN}/admin?limit=500`);
        
            if (!res.ok) {
                return fail(404, { error: "Admin not found" })
            }
            console.log(res)
            let id_user = hasil?.user_data
            console.log('data user', id_user);
            let data = await res.json();
            data = data.filter((item: any) => item.deleted_at == '0001-01-01T00:00:00Z' || !item.deleted_at);
            console.log("data: ", data);
            let foundUser = data.find((item: any) => item.id_user == id_user.id_user);
            console.log("user: ", foundUser);
            if (!foundUser || foundUser.status_aktif == 0) {
                throw redirect(302, "/beranda");
            }
        }
        catch (e) {
            
        }
    }
    return {hasil : hasil.nama, id : tes.user_data.id_user, username: tes.username}
}

