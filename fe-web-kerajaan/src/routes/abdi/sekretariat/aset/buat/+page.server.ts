import { env } from "$env/dynamic/private";
import { z } from "zod";
import type { Actions, PageServerLoad } from "../$types";
import { fail } from "@sveltejs/kit";

export const load: PageServerLoad = async () => {
    try {
        const res = await fetch(`${env.URL_KERAJAAN}/aset/jenis`)
        if (!res.ok) {
            throw new Error(`HTTP Error! Status: ${res.status}`)
        }
        const data = await res.json()
        console.log(data)
        return {data}
    }
    catch (error) {
        console.log(error)
        return {data: "Failed"}
    }
};
export const actions: Actions = {
    buat: async ({request}) => {
        const data = await request.formData()
        const obj = Object.fromEntries(data)
        const nama_aset = data.get("nama_aset")
        const jenis_aset = data.get("jenis_aset")
        const deskripsi_aset = data.get("deskripsi_aset")
         const dokumentasiFiles = data.getAll("dokumentasi")
            .filter(item => item instanceof File && item.size > 0) as File[];
        
        const jenisres = await fetch(`${env.URL_KERAJAAN}/aset/jenis`)
         if (!jenisres.ok) {
                throw new Error(`Failed to fetch jenis aset: ${jenisres.status}`);
        }
        const jenisList = await jenisres.json();
        console.log(data)
        console.log(jenisList)
        const validationJenis = jenisList.map(item => {
            return item.nama_jenis
        })
        console.log("Valid jenis values:", validationJenis);
          // Define validation schema
        const schema = z.object({
            nama_aset: z.string().min(1, "Nama aset harus diisi"),
           jenis_aset: z.string()
                    .min(1, "Jenis aset harus dipilih")
                    .refine(val => validationJenis.includes(val), {
                        message: "Jenis aset tidak valid, pilih dari daftar yang tersedia"
                    }),
            deskripsi_aset: z.string({message:"Deskripsi Aset harus diisi"}).min(1, "Deskripsi harus diisi"),
            dokumentasi: z.array(z.any())
                .refine(files => files.length > 0, {
                    message: "Minimal satu dokumentasi harus diunggah"
                })
                .refine(files => files.every(file => file instanceof File), {
                    message: "File dokumentasi tidak valid"
                })
        });
        const dokumentasii = data.getAll("dokumentasi").filter(item => item instanceof File && item.size > 0).map(item => item as File)
         console.log("Dokumentasi files:", dokumentasii.map(file => ({
            name: file.name,
            type: file.type,
            size: file.size
        })));
        console.log("Dokumentasi: ",dokumentasiFiles)
         const validation = schema.safeParse({
      nama_aset,
      jenis_aset,
      deskripsi_aset,
      dokumentasi: dokumentasiFiles
         });
        const files = dokumentasiFiles.map((files)=> files.name)
        
        if (!validation.success) {
            return fail(406,{
                errors: validation.error.flatten().fieldErrors,
                success: false,
                // formData: Object.fromEntries(data)
            });
        }
        const formData = Object.fromEntries(data)
        console.log(data)
    }
};