import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({cookies, locals}) => {
     // Remove the session cookie
        cookies.delete('userSession', { path: '/' });
        // Remove any token in locals if you use it
        locals.token = null;
        // Redirect to login
        throw redirect(302, '/login');
};