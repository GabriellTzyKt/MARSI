import type { Actions } from "@sveltejs/kit";

export const actions: Actions = {
    ubahLanding: async ({cookies,request}) => {
        const data = await request.formData()
        console.log(data)
    }
};