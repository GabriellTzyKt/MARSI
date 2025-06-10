import { env } from "$env/dynamic/private";
import { z } from "zod";
import type { Actions, PageServerLoad } from "../$types";
import { fail } from "@sveltejs/kit";

export const load: PageServerLoad = async () => {
    try {
        const res = await fetch(`${env.URL_KERAJAAN}/aset/jenis?limit=1000`)
        if (!res.ok) {
            throw new Error(`HTTP Error! Status: ${res.status}`)
        }
        const data = await res.json()
        let finalData = data.filter(item => item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at || item.deleted_at === null).map((item: any) => ({...item, nama: item.jenis_aset}));
        console.log(data)
        return {data: finalData}
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
          // Get all uploaded files
            const uploadedFiles = data.getAll('uploadfile')
            .filter(item => item instanceof File && item.size > 0) as File[];
        console.log("Uploaded files:", uploadedFiles)
        console.log("Form data:", data);
        console.log("Parsed form data:", obj);
        // Get all dokumentasi files, including videos and audios
        const dokumentasiFiles = data.getAll("dokumentasi")
            .filter(item => item instanceof File && item.size > 0) as File[];
        let file = data.getAll("fileee").filter(item => item instanceof File && item.size > 0) as File[];
        console.log("Dokumentasi files grom fileee:", file)
        // Validate file types
        const validFileTypes = ['image/', 'video/', 'audio/'];
        const invalidFiles = dokumentasiFiles.filter(file => 
            !validFileTypes.some(type => file.type.startsWith(type)));
        
        if (invalidFiles.length > 0) {
            return fail(400, {
                errors: {
                    dokumentasi: ["File yang diunggah harus berupa gambar, video, atau audio"]
                }
            });
        }
        
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
     
        });
       
        console.log("Dokumentasi: ",dokumentasiFiles)
         const validation = schema.safeParse({
        nama_aset,
         jenis_aset,
          deskripsi_aset,
         
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
        const formData = new FormData()
        const id_jenis_aset = jenisList.find(item => item.nama_jenis === jenis_aset)
        console.log(id_jenis_aset)
        formData.append("id_kerajaan", String("3"))
        formData.append("id_jenis_aset", String(id_jenis_aset.id_jenis_aset))
          uploadedFiles.forEach((file, index) => {
                console.log(`Adding file ${index + 1}/${uploadedFiles.length} to API request: ${file.name}`);
                formData.append("dokumentasi", file);
            });
        formData.append("nama_aset", String(nama_aset))
        formData.append("deskripsi_aset", String(deskripsi_aset))
        formData.append("kategori_aset", String(jenis_aset))

        console.log("Send the data : ", formData)
        try {
            const res = await fetch(`${env.URL_KERAJAAN}/aset`, { method: "POST", body: formData })
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
};
