import { data_flipcard } from "$lib/dummy";
import type { Action, Actions } from "@sveltejs/kit";
// import type { PageServerLoad } from "./$types";
export const ssr = false;

function getRandomIDs(count: number, max: number): number[] {
    let ids = new Set<number>();
    while (ids.size < count) {
        ids.add(Math.floor(Math.random() * max) + 1);
    }
    return Array.from(ids);
}


export const actions: Actions = {
    refresh: async ({ request }) => {

        console.log("Data flipcard:", data_flipcard);

        let randomIDs = getRandomIDs(3, data_flipcard.length);

        console.log("ID : ", randomIDs)

        let selectedFlip = data_flipcard.filter(item => randomIDs.includes(item.id));

        console.log("Final Data yang Dikirim:", { selectedFlip });
        return { selectedFlip };
    }
}