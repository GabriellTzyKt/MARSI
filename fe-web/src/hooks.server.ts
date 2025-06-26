import { redirect, type Handle } from "@sveltejs/kit";
// import { RunnableDevEnvironment } from "vite";

export const handle = async ({ event, resolve }) => {
    // Get the current path
    const path = event.url.pathname;
    
    // List of paths that should be accessible without authentication
    const publicPaths = [
        '/login', 
        '/signup', 
        '/otpDesign',  // Add this to allow access to the OTP design page
        '/login/forgetpassword',
        '/login/forgetpassword/verifOTP'
    ];
    
    // Check if the current path is in the public paths list
    const isPublicPath = publicPaths.some(pp => path.startsWith(pp));
    
    // If it's a public path, allow access without checking authentication
    if (isPublicPath) {
        return await resolve(event);
    }
    
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
   
    console.log("Token" +event.locals.token)
    
    const response = await resolve(event)
    return response
}
