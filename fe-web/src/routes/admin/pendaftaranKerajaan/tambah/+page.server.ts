import { env } from "$env/dynamic/private";
import type { Actions } from "@sveltejs/kit";


export const actions: Actions = {
    tambahKerajaan: async ({ request, fetch }) => {
        const formData = await request.formData();

        console.log(formData)

        const namaKerajaan = formData.get('nama');
        const provinsi = formData.get('provinsi')

        console.log("nama kerajaan" , namaKerajaan)
        console.log("provinsi" , provinsi)
    //     const password = formData.get('password');

    //     try {
    //         const result = await fetch(env.BASE_URL + "/login", {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({
    //                 username: userName,
    //                 password: password,
    //                 expiresInMins: 30
    //             }),
    //         });

    //         const resultJSON = await result.json();
    //     }
    //     catch (error) {
    //         if (error instanceof Error) console.error(error.message);

    //     }
    }
}