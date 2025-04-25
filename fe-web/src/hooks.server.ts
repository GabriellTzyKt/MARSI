import { redirect, type Handle } from "@sveltejs/kit";
// import { RunnableDevEnvironment } from "vite";

export const handle = async ({ event, resolve }) => {
    const auth = event.cookies.get('userSession') ? JSON.parse(event.cookies.get('userSession') as string) : false
    console.log(auth)
    if (auth) {
        if (!event.locals.token) {
            event.locals.username = auth.name
            event.locals.token = auth.token
        }
    }
    if (!auth) {
        event.locals.token = ''
    }
    if (auth) {
        if (event.url.pathname === '/login2') {
            redirect(308,'/admin/beranda')
        }
         if (event.url.pathname === "/admin") {
            redirect(308, '/admin/beranda')
        }
    }
    else {
        if ( event.url.pathname !== "/login2") {
            console.log("red")
            redirect(308, '/login2')
        }
    }
    console.log("Token" +event.locals.token)
    
    const response = await resolve(event)
    return response
}
