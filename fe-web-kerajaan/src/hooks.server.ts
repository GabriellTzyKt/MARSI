import { redirect, type Handle } from '@sveltejs/kit';

export const handle = async ({ event, resolve}) => {
    // Get auth from cookies
    const auth = event.cookies.get('userSession') ? JSON.parse(event.cookies.get("userSession") as string) : false
    console.log(auth)
    // Set up public routes that don't require authentication
    const publicRoutes = ['/login', '/signup', '/beranda',"/acara","/situs","/aset", "/sabdi"];
    const isPublicRoute = publicRoutes.some(route => event.url.pathname.startsWith(route));
    
    // Handle authentication
    if (auth) {
        // User is authenticated
        event.locals.token = auth.token;
        if (event.url.pathname.startsWith("/abdi/dashboard")) {
            if (!auth?.id_admin || auth.jenis_admin === 0 || auth.status_admin_aktif === 0) {
                throw redirect(302, '/beranda');
            }
        }
        if (event.url.pathname.startsWith("/abdi/sekretariat")) {
            if (!auth?.id_admin || auth.jenis_admin === 0 || auth.status_admin_aktif === 0) {
                throw redirect(302, '/beranda');
            }
        }
        // If user is authenticated and trying to access login page, redirect to dashboard
        
    } else {
        // User is not authenticated
        
        event.locals.token = null;
        
        // Only redirect to login if not accessing a public route
        if (!isPublicRoute) {
            throw redirect(302, '/login');
        }
    }
    
    // Continue with the request
    const response = await resolve(event);
    return response;
}
