import { data_showraja } from "$lib/dummy";
import { fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { z } from "zod";
import { env } from "$env/dynamic/private";

export const load: PageServerLoad = async () => {
    const detil_kerajaan = data_showraja

    return { detil_kerajaan };
};

export const actions: Actions = {
    tambah: async ({ request }) => {
        const data = await request.formData();

        console.log("ini data ", data)


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
            namaibu: "",
            tanggalawal: "",
            tanggalakhir: "",
            inputcheckbox: "",
        }

        const ver = z.object({
            nama: z.string().trim().min(1, "Isi Nama!"),
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
            nama: data.get("namaraja"),
            lokasi: data.get("lokasi"),
            jenis: data.get("jenis"),
            tanggal: data.get("tanggal"),
            era: data.get("era"),
            rumpun: data.get("rumpun"),
            deskripsi: data.get("deskripsi"),
            dokumen: data.get("dokumen"),
            inputbendera: data.get("inputbendera"),
            inputlambang: data.get("inputlambang"),
            inputvideo: data.get("inputvideo"),
            linkkerajaan: data.get("linkkerajaan"),
            promosi: data.get("promosi"),
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

            console.log("errors : ", fieldErrors)

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
        const data = await request.formData();
        const res = Object.fromEntries(data)

        console.log("res", res)

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
        }

        const ver = z.object({
            nama: z.string().trim().min(1, "Isi Nama!"),
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
        });

        form = {
            nama: data.get("nama"),
            lokasi: data.get("lokasi"),
            jenis: data.get("jenis"),
            tanggal: data.get("tanggalberdiri"),
            era: data.get("era"),
            rumpun: data.get("rumpun"),
            deskripsi: data.get("deskripsi"),
            // dokumen: data.get("dokumen"),
            // inputbendera: data.get("inputbendera"),
            // inputlambang: data.get("inputlambang"),
            // inputvideo: data.get("inputvideo"),
            longitude: data.get("long") || " ",
            latitude: data.get("lat") || " ",

            linkkerajaan: data.get("linkkerajaan"),
            promosi: data.get("promosi"),
            linkacara1: data.get("linkacara1"),
            linkacara2: data.get("linkacara2"),
            linkacara3: data.get("linkacara3"),
        }; 

        const validation = ver.safeParse({ ...form });

        if (!validation.success) {
            const fieldErrors = validation.error.flatten().fieldErrors;

            console.log("errors : ", fieldErrors)

            return fail(406, {
                errors: fieldErrors,
                success: false,
                formData: form,
                type: "add"
            });
        }

        try {
            const formData = new FormData()
            formData.append("nama_kerajaan", res.nama)
            formData.append("alamat_kerajaan", res.lokasi)
            formData.append("longitude", res.long)
            formData.append("latitude", res.lat)
            formData.append("jenis_kerajaan", res.jenis)
            formData.append("tahun_berdiri", res.tanggalberdiri)
            formData.append("raja_sekarang", res.rajasekarang || " ")
            formData.append("deskripsi_kerajaan", res.deskripsi)
            formData.append("bendera_kerajaan", res.inputbendera || " ")
            formData.append("lambang_kerajaan", res.inputlambang || " ")
            formData.append("tahun_berakhir", res.tahunberakhir || " ")
            formData.append("era" , res.era)
            formData.append("rumpun", res.rumpun)
            formData.append("email", res.email || " ")
            formData.append("foto_umum", res.dokumen)
            formData.append("video_kerajaan", res.inputvideo)

            const result = await fetch(env.BASE_URL + "/kerajaan", {
                method: 'POST',
                body: formData,
            });

            const r = await result.json()

            if (result.ok) { 
                console.log("yayayayayaya")
                return { errors: " no ", success : true, form: res};
            } else {
                console.log('bruh')
                return fail(400,{request:`Error Code : ${result.status} ${r.message}`})
            }
        } catch (error) {
            if (error instanceof Error) console.error(error.message);

        }
        // return { errors: "Success", success: true, formData: form, type: "add" };
    }
};
