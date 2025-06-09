import { page } from "$app/state";
import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./dashboard/$types";
import { env } from "$env/dynamic/private";


export const load: PageServerLoad = async ({ cookies }) => {
    const nama = cookies.get('userSession')
    const hasil = nama ? JSON.parse(nama) : 'halo'
    const tes = cookies.get('userSession') ? JSON.parse(cookies.get('userSession') as string) : "Haslo"
    let profile_p = ""
    try {
        let user = await fetch(`${env.PUB_PORT}/user/${tes.user_data.id_user}`, {
            headers: {
                'Authorization': `Bearer ${tes.token}`
            }
        })
        let userP = await user.json()
        if (userP.profile !=="") {
            let profile = await fetch(`${env.PUB_PORT}/doc/${userP.profile}`, {
            })
            let profileP = await profile.json()
            profile_p =  `${env.PUB_PORT}/file?file_path=${encodeURIComponent(profileP.file_dokumentasi)}`
        }
        console.log("Picture =", profile_p)
    } catch (error) {
        
    }
    // console.log(hasil)
    
    return { hasil: hasil.nama, id: tes?.user_data?.id_user || false, username: tes.username, profilePicture: profile_p }
}

