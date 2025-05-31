import { env } from "$env/dynamic/private";
import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { goto } from "$app/navigation";
import { date } from "zod";

export const load: PageServerLoad = async ({ cookies }) => {
    let cookie = cookies.get("userSession") ? JSON.parse(cookies.get("userSession") as string) : '';
return {data: cookie}
};