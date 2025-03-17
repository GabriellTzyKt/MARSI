import { error, type Actions } from "@sveltejs/kit";
import { z } from "zod";


export const actions: Actions = {
    submit: async ({ request }) => {
        const data = await request.formData();

        const ver = z.object({
            namaDokumen: z.string({ message: "Input Tidak Boleh Kosong" }).max(255).nonempty("Isi Nama"),
            asalKerajaan: z.string({ message: "Pilih 1 pilihan!" }),
            jenisDokumen: z.string({ message: "Pilih 1 pilihan!" }),
            kategori: z.string({ message: "Pilih 1 pilihan!" }),
            urlfoto: z.array(z.string({message : "Input Minimal 1 Foto!"})).min(1, { message: "Minimal 1 Foto!" }), // Ubah jadi array
        });

        const namaDokumen = data.get("nama");
        const asalKerajaan = data.get("asalKerajaan");
        const kategori = data.get("kategori");
        const jenisDokumen = data.get("jenisDokumen");
        const urlFoto = data.getAll("uploadfile")
            .filter((file) => file instanceof File && file.size > 0)
            .map((file) => (file as File).name);

        const validation = ver.safeParse({
            namaDokumen,
            asalKerajaan,
            kategori,
            jenisDokumen,
            urlfoto: urlFoto,
        });

        if (!validation.success) {
            return {
                errors: validation.error.flatten().fieldErrors, success: false,
                values: { namaDokumen, asalKerajaan, kategori, jenisDokumen, urlfoto: urlFoto },
            };
        }

        return { errors: "Success", success: true };
    }
};
