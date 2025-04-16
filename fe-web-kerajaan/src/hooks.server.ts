// import { redirect, type Handle } from '@sveltejs/kit';

import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve, }) => {
    const auth = event.cookies.get('userSession')? JSON.parse(event.cookies.get("userSession") as string): false
    if (auth) {
        event.locals.token = auth.user_data
    }
    if (!auth) {
        event.locals.token = null
    }
    console.log(event.locals.token)
	const response = await resolve(event);
	return response;
}