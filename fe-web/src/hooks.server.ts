import { redirect, type Handle } from "@sveltejs/kit";
// import { RunnableDevEnvironment } from "vite";

export const handle = async ({ event, resolve }) => {
    const auth = event.cookies.get('userSession') ? JSON.parse(event.cookies.get('userSession') as string) : false
    
    if (auth) {
        if (event.url.pathname === '/login2') {
            redirect(308,'/admin/beranda')
        }
         if (event.url.pathname === "/admin") {
            redirect(308, '/admin/beranda')
        }
    }
    else {
        if (event.url.pathname !== "/login2") {
            redirect(308, '/login2')
        }
    }
    
    const response = await resolve(event)
    return response
}