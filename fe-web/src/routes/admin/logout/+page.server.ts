import { redirect, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
    default: async ({ cookies }) => {
        cookies.delete('userSession', {path : '/'})
        console.log("Logout")
        redirect(302, '/login2')
        return { success: true };

    }

};