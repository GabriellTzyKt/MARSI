import type { Actions } from "@sveltejs/kit";

export const actions: Actions = {
    tambah: async ({ request }) => {
        const data = await request.formData()
    }
};