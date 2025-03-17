import { addAPIProvider } from "@iconify/svelte";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";

export const load: PageServerLoad = async () => {
    const data_role = await fetch(`${env.PUB_PORT}/role`).then((r) => r.json())
    if (data_role) {
        return {role: data_role}
    }
};