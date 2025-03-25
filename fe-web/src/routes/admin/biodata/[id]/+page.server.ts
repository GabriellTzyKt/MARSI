import { data_showraja } from "$lib/dummy";
import { fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { z } from "zod";

export const load: PageServerLoad = async () => {
    const detil_kerajaan = data_showraja

    return { detil_kerajaan};
};

export const actions: Actions = {
    tambah: async ({ request }) => {
        const data = await request.formData();


        let form: any = {
            nama: "",
            lokasi: "",
            jenis: "",
            tanggal: "",
            era: "",
            rumpun: "",
            deskripsi: "",
            dokumen: "",
            inputbendera: "",
            inputlambang: "",
            inputvideo: "",
            linkkerajaan: "",
            promosi: "",
            linkacara1: "",
            linkacara2: "",
            linkacara3: "",
            namaraja: "",
            gelarraja: "",
            tanggallahir: "",
            kotalahir: "",
            agama: "", 
            wangsa: "",
            namaayah: "",
            namaibu : "",
            tanggalawal : "",
            tanggalakhir: "",
            inputcheckbox : "",
        }

        const ver = z.object({
            nama: z.string().optional(),
            lokasi: z.string().optional(),
            jenis: z.string().optional(),
            tanggal: z.string().optional(),
            era: z.string().optional(),
            rumpun: z.string().optional(),
            deskripsi: z.string().optional(),
            dokumen: z.string().optional(),
            inputbendera: z.string().optional(),
            inputlambang: z.string().optional(),
            inputvideo: z.string().optional(),
            linkkerajaan: z.string().optional(),
            promosi: z.string().optional(),
            linkacara1: z.string().optional(),
            linkacara2: z.string().optional(),
            linkacara3: z.string().optional(),
            namaraja: z.string().trim().min(1, "Minimal 1!"),
            gelarraja: z.string().trim().min(1, "Minimal 1!"),
            tanggallahir: z.coerce.date({ message: "Tanggal Tidak valid (YYYY-MM-DD)" }),
            kotalahir: z.string().trim().min(1, "Minimal 1!"),
            agama: z.string().trim().min(1, "Minimal 1!"),
            wangsa: z.string().trim().min(1, "Minimal 1!"),
            namaayah: z.string().trim().min(1, "Minimal 1!"),
            namaibu: z.string().trim().min(1, "Minimal 1!"),
            tanggalawal: z.coerce.date({ message: "Tanggal Tidak valid (YYYY-MM-DD)" }),
            tanggalakhir: z.coerce.date({ message: "Tanggal Tidak valid (YYYY-MM-DD)" }),
            inputcheckbox: z.string().trim().optional(),
        });

        form = {
            // nama: data.get("nama"),
            // lokasi: data.get("lokasi"),
            // jenis: data.get("jenis"),
            // tanggal: data.get("tanggal"),
            // era: data.get("era"),
            // rumpun: data.get("rumpun"),
            // deskripsi: data.get("deskripsi"),
            // dokumen: data.get("dokumen"),
            // inputbendera: data.get("inputbendera"),
            // inputlambang: data.get("inputlambang"),
            // inputvideo: data.get("inputvideo"),
            // linkkerajaan: data.get("linkkerajaan"),
            // promosi: data.get("promosi"),
            // linkacara1: data.get("linkacara1"),
            // linkacara2: data.get("linkacara2"),
            // linkacara3: data.get("linkacara3"),
            namaraja: data.get("namaraja"),
            gelarraja: data.get("gelarraja"),
            tanggallahir: data.get("tanggallahir"),
            kotalahir: data.get("kotalahir"),
            agama: data.get("agama"),
            wangsa: data.get("wangsa"),
            namaayah: data.get("namaayah"),
            namaibu: data.get("namaibu"),
            tanggalawal: data.get("tanggalawal"),
            tanggalakhir: data.get("tanggalakhir"),
            inputcheckbox: data.get("inputcheckbox") || " ",
        };

        const validation = ver.safeParse({ ...form });

        if (!validation.success) {
            const fieldErrors = validation.error.flatten().fieldErrors;

            console.log("errors : " , fieldErrors)
            
            return fail(406, {
                errors: fieldErrors,
                success: false,
                formData: form,
                type: "add"
            });
        }

        return { errors: "Success", success: true, formData: form, type: "add" };
    },

    selesai: async ({ request }) => {
        return { errors: "Success", success: true, type: "add" };
    }
};
