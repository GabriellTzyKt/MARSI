import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, cookies }) => {
    const user =  JSON.parse(cookies.get('userSession') || '{}' ) as string | null;
    console.log("User data:", user);
    if (!user) {
        throw redirect(302, '/login');
    }
    return { user };
};