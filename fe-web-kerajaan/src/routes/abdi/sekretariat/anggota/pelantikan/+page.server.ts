import { fail, type Actions } from "@sveltejs/kit";
import { z } from "zod";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";
import { AbdiListSchema } from "./AbdiListSchema";


export const load: PageServerLoad = async () => {
    try {
        let [anggotaRes, gelarRes, acaraRes] = await Promise.all([
            fetch(`${env.URL_KERAJAAN}/anggota?limit=500`),
            fetch(`${env.URL_KERAJAAN}/gelar`),
            fetch(`${env.URL_KERAJAAN}/acara?limit=600`)
        ]);
        if (!anggotaRes.ok || !gelarRes.ok) {
            throw new Error(`HTTP Error! Status: ${anggotaRes.status} ${gelarRes.status}`);
        }
        let [anggotaData, gelarData, acaraData] = await Promise.all([
            anggotaRes.json().then((data) => data.filter((item: any) => item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at)),
            gelarRes.json().then((data) => data.filter((item: any) => item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at)),
            acaraRes.json().then((data) => data.filter((item: any) => item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at))
        ]);
        return {
            anggotaData,
            gelarData,
            acaraData
        };
    } catch (error) {
        
    }
};
export const actions: Actions = {
    lantikAbdi: async ({ request }) => {
        
        const formData = await request.formData();
        
        const abdiList: any[] = [];
        const fileErrors: {path: [number, string], message: string}[] = [];

        // Parse form data into structured array
        for (const [key, value] of formData.entries()) {
            const match = key.match(/^abdi\[(\d+)\]\[(\w+)\]$/);
            if (match) {
                const index = parseInt(match[1]);
                const field = match[2];
                if (!abdiList[index]) abdiList[index] = {};
                abdiList[index][field] = value;
                
                // Manual file validation if needed
                if (field === 'bukti_abdi' && value instanceof File) {
                    // You can add manual file validation here if needed
                    // For example:
                    // if (value.size === 0) {
                    //     fileErrors.push({
                    //         path: [index, field],
                    //         message: "File tidak boleh kosong"
                    //     });
                    // }
                }
            }
        }
        console.log(abdiList)
        // Validate with Zod
        const validationResult = AbdiListSchema.safeParse(abdiList);
        
        if (!validationResult.success || fileErrors.length > 0) {
            // Transform Zod errors to a more usable format
            const zodErrors = validationResult.success ? [] : transformZodErrors(validationResult.error);
            const errors = [...zodErrors, ...fileErrors];
            
            // Create a serializable version of the form data
            const serializableData = abdiList.map(item => {
                if (!item) return null;
                
                // Create a new object without the File objects
                const serializable = { ...item };
                
                // Replace File objects with their names
                if (serializable.bukti_gelar instanceof File) {
                    serializable.bukti_gelar_name = serializable.bukti_gelar.name;
                    delete serializable.bukti_gelar;
                }
                
                return serializable;
            });
            console.log(errors)
            return fail(400, { errors, formData: serializableData });
        }

        // Process validated data
        try {
            
            // Your API call or data processing logic here
            // For example, you might want to upload the files to a server
            let tanggal = () => {
                let date = (formData.get("tanggal_pelantikan") as string).split('-')
                return `${date[2]}-${date[1]}-${date[0]}`
            }
            // Process each entry
            for (const abdi of abdiList) {
                const form = new FormData()
                form.append('id_anggota', abdi.abdi_id)
                form.append('id_gelar', abdi.gelar_id || '2')
                form.append('dokumentasi', abdi.bukti_gelar)
                form.append('pemberi_gelar', abdi.pemberi_id)
                form.append('acara_pemberian', abdi.acara_id)
                form.append('tanggal_penerimaan', tanggal())
                // form.append('panggilan', abdi.gelar_baru)
                console.log('yang akan di submit : ', form)
              
                const res = await fetch(`${env.URL_KERAJAAN}/anggota/gelar`, {
                    method: "POST",
                    body: form,
                });
                let msg = await res.json()
                console.log(msg)
                if (!res.ok) {
                    console.log(" ERROR", res)
                        return fail(400,{})
                    }
                    console.log("Berhasil untuk", form)
                
                
                // Then process the rest of the data
                // await saveAbdiData({...abdi, bukti_bintang_jasa: fileReference});
            }
            
            return { success: true };
        } catch (error) {
            console.error("Error processing data:", error);
            return fail(500, { 
                message: "Failed to process data"
            });
        }
    }
};

// Helper function to transform Zod errors into a more usable format
function transformZodErrors(error: z.ZodError) {
    const errors = [];
    const formattedErrors = error.format();
    
    Object.keys(formattedErrors).forEach(index => {
        if (index !== '_errors') {
            const fieldErrors = formattedErrors[index];
            Object.keys(fieldErrors).forEach(field => {
                if (field !== '_errors' && fieldErrors[field]?._errors?.length) {
                    errors.push({
                        path: [parseInt(index), field],
                        message: fieldErrors[field]._errors[0]
                    });
                }
            });
        }
    });
    
    return errors;
}
