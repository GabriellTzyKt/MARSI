import { env } from "$env/dynamic/private";
import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { z } from "zod";

export const load: PageServerLoad = async ({params}) => {
    try {
        const res = await fetch(`${env.URL_KERAJAAN}/aset/${params.id}`, {
            method: "GET"
        });

        if (!res.ok) {
            throw new Error(`Gagal fetch aset: ${res.status}`);
        }

        const data = await res.json();

        const getD = typeof data.dokumentasi === "string"
            ? data.dokumentasi.split(",").map((id: string) => id.trim())
            : [];

        const result = await Promise.all(
            getD.map(async (id) => {
                try {
                    const res = await fetch(`${env.URL_KERAJAAN}/doc/${id}`);
                    if (!res.ok) {
                        console.error(`Failed to fetch doc/${id}: ${res.status}`);
                        return null;
                    }
                    const docData = await res.json();
                    const filePaths = docData.file_dokumentasi || docData;
                    const pathsArray = Array.isArray(filePaths) ? filePaths : [filePaths];

                    return pathsArray.map((path) =>
                        typeof path === "string"
                            ? `${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(path)}`
                            : null
                    );
                } catch (e) {
                    console.error("Fetch doc error:", e);
                    return null;
                }
            })
        );
        
        // Flatten and clean null
        const imageUrls = result
            .filter((url) => url !== null)
            .flat()
            .filter((url) => url !== null);

        // Gabungkan ke dalam data
        const dataWithImages = {
            ...data,
            dokumentasi: data.dokumentasi ? data.dokumentasi.split(",") : [],
            gambarUrls: imageUrls
        };
        
        try {
            const res = await fetch(`${env.URL_KERAJAAN}/aset/jenis`);
            if (!res.ok) {
                throw new Error(`HTTP Error! Status: ${res.status}`);
            }
            const dataJenis = await res.json();
            
            return {data: dataWithImages, jenis_aset: dataJenis};
        } catch (error) {
            console.log(error);
            return {data: "Failed"};
        }
    } catch (error) {
        console.error("Load error:", error);
        return { data: null };
    }
};
export const actions: Actions = {
    edit: async ({request}) => {
       const data = await request.formData()
               const obj = Object.fromEntries(data)
               const nama_aset = data.get("nama_aset")
               const id_kerajaan = data.get("id_kerajaan")
               const id_aset = data.get("id_aset")
               const jenis_aset = data.get("jenis_aset")
               const deskripsi_aset = data.get("deskripsi_aset")
               const gambar = data.getAll("gambar")
              
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
                //    dokumentasi: z.array(z.any())
                //        .refine(files => files.length > 0, {
                //            message: "Minimal satu dokumentasi harus diunggah"
                //        })
                //        .refine(files => files.every(file => file instanceof File), {
                //            message: "File dokumentasi tidak valid"
                //        })
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
               // const files = dokumentasiFiles.map((files)=> files.name)
               
               if (!validation.success) {
                   console.log(validation.error.flatten().fieldErrors)
                   return fail(406,{
                       errors: validation.error.flatten().fieldErrors,
                       success: false,
                       // formData: Object.fromEntries(data)
                   });
        }
        const id_jenis_aset = jenisList.find(item => item.nama_jenis === jenis_aset)
        let gambarf;
       
            let sendData = {
                    id_aset: Number(id_aset),

                    id_jenis_aset: Number(String(id_jenis_aset.id_jenis_aset)),
                    dokumentasi: gambar.join(","),
                    nama_aset: nama_aset,
                    deskripsi: deskripsi_aset,
                    kategori_aset: jenis_aset
        }
        console.log(sendData)
               try {
                   const res = await fetch(`${env.URL_KERAJAAN}/aset`, {
                       headers: {
                           "Content-Type": "application/json"
                       }
                   , method: "PUT", body: JSON.stringify(sendData) })
                   if(!res.ok){
                       throw new Error(`HTTP Error! Status: ${res.status}`)
                   }
                   console.log(res)
                   return {data: "berhasil", success: true}
               }
               catch (error) {
                   console.log(error)
                   return {data: "gagal", success: false}
               }
               
           }
    }
