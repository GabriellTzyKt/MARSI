import { env } from "$env/dynamic/private";
import { fail } from "@sveltejs/kit";
import { error, type Actions } from "@sveltejs/kit";
import { z } from "zod";


export const actions: Actions = {
    submit: async ({ request }) => {
        const data = await request.formData();
        const res = Object.fromEntries(data)
        console.log("RES: ", res)

        const ver = z.object({
            namaDokumen: z.string({ message: "Input Tidak Boleh Kosong" }).max(255).nonempty("Isi Nama"),
            jenisDokumen: z.string({ message: "Pilih 1 pilihan!" }).nonempty(),
            kategori: z.string({ message: "Pilih 1 pilihan!" }).nonempty(),
            keterkaitan: z.string({ message: "Harus diisi!" }).nonempty("Isi Keterkaitan"),
            subkategori: z.string({ message: "Harus diisi!" }).nonempty("Isi Sub Kategori"),
            urlfoto: z.array(z.string().min(1, { message: "Nama file tidak boleh kosong" })).min(1, { message: "Minimal 1 Foto!" }),
        });

        const namaDokumen = data.get("nama");
        const kategori = data.get("kategori");
        const jenisDokumen = data.get("jenisDokumen");
        const keterkaitan = data.get("keterkaitan");
        const subkategori = data.get("subkategori");
        const urlFoto = data.getAll("uploadfile")
            .filter((item) => item instanceof File && item.name !== "") 
            .map((file) => (file as File).name);

        console.log("Nama file yang diproses:", urlFoto);

        const validation = ver.safeParse({
            namaDokumen,
            kategori,
            subkategori,
            jenisDokumen,
            keterkaitan,
            urlfoto: urlFoto,
        });

        if (!validation.success) {
            const fieldErrors = validation.error.flatten().fieldErrors;

            console.log("Field Errors:", fieldErrors); // Debugging untuk memastikan error dikembalikan

            return fail(406, {
                errors: fieldErrors,
                success: false,
                formData: { namaDokumen, kategori, jenisDokumen, subkategori, keterkaitan, urlFoto },
                type: "add"
            });
        }

        try {
            const send = await fetch(env.BASE_URL + "/kerajaan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nama_arsip: namaDokumen,
                    // keterkaitan: keterkaitan,
                    kategori_arsip: kategori,
                    jenis_arsip: jenisDokumen,
                    sub_kategori_arsip: subkategori,
                    dokumentasi: urlFoto,
                })
            })
            const r = await send.json()
            console.log(r)
            if (send.ok) {
                return { errors: "no Error", success: true, form: res }
            }
            return fail(400, { request: `Error Code : ${send.status} ${r.message}` })
        }
        catch (e) {
            console.error("Fetch Error", e)
        }
    }

    // return { errors: "Success", success: true };
};
