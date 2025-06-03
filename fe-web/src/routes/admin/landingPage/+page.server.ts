import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "../aplikasiKerajaan/[id]/$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ cookies }) => {
    const userSession = cookies.get("userSession");
    if (!userSession) {
        throw redirect(302, '/login2');
    }
    const session = JSON.parse(userSession);
    if (!session.adminData || session.adminData.jenis_admin !== 'super admin') {
        throw redirect(302, '/admin/biodata');
    }
}


export const actions: Actions = {
    ubahLanding: async ({cookies,request}) => {
        const data = await request.formData()
        
        console.log(data)
    }
};