import type { Actions, PageServerLoad } from "./$types";
import { dummyAcara } from "$lib/dummy";
import { z } from "zod";


export const load: PageServerLoad = async ({params}) => {
    const data_acara = dummyAcara[Number(params.id)]
    return {acara : data_acara}
  
};
export const actions: Actions = {
    submit: async ({request}) => {
        const data = await request.formData()
        let form = {
            namaAcara: "",
            tanggal: "",
            lokasi: "",
            penanggungjawab: "",
            jenisAcara: "",
            kapasitas: null
        }
        const ver = z.object({
            namaAcara:
                z.string({ message: "nama Acara Harus berupa String" })
                .nonempty({ message: "Input Tidak Boleh Kosong" })
                .max(255, { message: "Mencapai Batas maximum kata (255)" }),
            tanggal:
              z.coerce.date({message:"Tanggal Tidak Sesuai (YYYY-MM-DD)"}),
            lokasi: 
                z.string({ message: "namaUpacara Harus berupa String" })
                .nonempty({ message: "Input Tidak Boleh Kosong" })
                    .max(255, { message: "Mencapai Batas maximum kata (255)" }),
            penanggungjawab:
                z.string({ message: "namaUpacara Harus berupa String" })
                .nonempty({ message: "Input Tidak Boleh Kosong" })
                    .max(255, { message: "Mencapai Batas maximum kata (255)" }),
            jenisAcara: 
               z.string({ message: "namaUpacara Harus berupa String" })
                .nonempty({ message: "Input Tidak Boleh Kosong" })
                    .max(255, { message: "Mencapai Batas maximum kata (255)" }),
            kapasitas:
                z.number({ message: "Tolong masukkan Input berupa angka" })
                    .min(1, { message: "Minimal ada 1 orang kapasitas" }),
            
            
        })
        const nama_acara = data.get("nama_acara")
        const tanggal = data.get("tanggal")
        const lokasi_acara = data.get("lokasi_acara")
        const penanggungjawab = data.get("penanggungjawab")
        const jenis_acara = data.get("jenis_acara")
        const kapasitas = Number(data.get("kapasitas"))

        form = {
            namaAcara: nama_acara,
            tanggal: tanggal,
            lokasi: lokasi_acara,
            penanggungjawab: penanggungjawab,
            jenisAcara: jenis_acara,
            kapasitas: kapasitas
            
        }
        const validation =  ver.safeParse({
            ...form
        })
        if (!validation.success) {
            return { errors: validation.error.flatten().fieldErrors, success: false, FormData: form}
        }
        return {errors: "Success", success: true,  FormData: form}
    }
};