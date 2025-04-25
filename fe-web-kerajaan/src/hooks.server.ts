import { redirect, type Handle } from '@sveltejs/kit';

// import type { Handle } from "@sveltejs/kit";

export const handle = async ({ event, resolve}) => {
    const auth = event.cookies.get('userSession') ? JSON.parse(event.cookies.get("userSession") as string) : false
    console.log(auth)
    if (auth && !event.locals.token) {
        event.locals.token = auth.token
    }
    if (auth) {
        console.log(event.locals.token)
    }
    if (!auth) {
        event.locals.token = null
    }
    console.log("Token : " +event.locals.token)
	const response = await resolve(event);
	return response;
}