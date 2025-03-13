import type { Actions } from "@sveltejs/kit";
import { z } from "zod"; 

export const actions: Actions = {
    submit: async ({request}) => {
        const data = await request.formData()
        console.log(data)
        const ver = z.object({
            namaAcara:
                z.string({ message: "namaUpacara Harus berupa String" })
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
        const lokasi_acara = data.get("nama_acara")
        const penanggungjawab = data.get("penanggungjawab")
        const jenis_acara = data.get("jenis_acara")
        const kapasitas = Number(data.get("kapasitas"))
        const validation =  ver.safeParse({
            namaAcara: nama_acara,
            tanggal: tanggal,
            lokasi: lokasi_acara,
            penanggungjawab: penanggungjawab,
            jenisAcara: jenis_acara,
            kapasitas: kapasitas
        })
        if (!validation.success) {
            return { errors: validation.error.flatten().fieldErrors, success: false}
        }
        return {errors: "Success", success: true}
  } 
};

