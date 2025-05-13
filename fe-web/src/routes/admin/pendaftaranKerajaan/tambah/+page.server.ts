import { env } from "$env/dynamic/private";
import type { Actions } from "@sveltejs/kit";
import { z } from "zod";
import { fail } from "@sveltejs/kit";

export const actions: Actions = {
    tambahKerajaan: async ({ request, fetch }) => {
        const formData = await request.formData();

        // Define schema for validation
        const kerajaanSchema = z.object({
            nama: z.string().nonempty("Nama Kerajaan tidak boleh kosong"),
            alamat: z.string().nonempty("Alamat tidak boleh kosong"),
            tanggalberdiri: z.string()
                .nonempty("Tanggal berdiri tidak boleh kosong")
                .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal tidak sesuai (YYYY-MM-DD)")
                .refine((dateStr) => {
                    const date = new Date(dateStr);
                    return !isNaN(date.getTime()) && dateStr === date.toISOString().split("T")[0];
                }, { message: "Tanggal tidak valid" }),
            era: z.string().nonempty("Era kerajaan tidak boleh kosong"),
            rumpun: z.string().nonempty("Rumpun kerajaan tidak boleh kosong"),
            jenis: z.string().nonempty("Jenis kerajaan tidak boleh kosong"),
            namaraja: z.string().nonempty("Nama raja tidak boleh kosong"),
            deskripsi: z.string().nonempty("Deskripsi tidak boleh kosong"),
        });

        // Extract form data
        const formValues = {
            nama: formData.get('nama'),
            alamat: formData.get('alamat'),
            tanggalberdiri: formData.get('tanggalberdiri'),
            era: formData.get('era'),
            rumpun: formData.get('rumpun'),
            jenis: formData.get('jenis'),
            namaraja: formData.get('namaraja'),
            deskripsi: formData.get('deskripsi')
        };

        // Validate form data
        const result = kerajaanSchema.safeParse(formValues);

        if (!result.success) {
            console.log(result.error.flatten().fieldErrors);
            return fail(400, {
                errors: result.error.flatten().fieldErrors,
                success: false,
                data: formValues
            });
        }

        console.log("Data valid:", result.data);
        
        // Proceed with API call or database operation
        // try {
        //     const response = await fetch(env.BASE_URL + "/kerajaan/tambah", {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify(result.data),
        //     });
        //     
        //     const responseData = await response.json();
        //     return { success: true, data: responseData };
        // } catch (error) {
        //     console.error("Error adding kerajaan:", error);
        //     return fail(500, { 
        //         success: false, 
        //         errors: { api: ["Terjadi kesalahan saat menambahkan kerajaan"] },
        //         data: formValues
        //     });
        // }

        return { success: true, data: result.data };
    }
}
