import { env } from "$env/dynamic/private";
import { fail } from "@sveltejs/kit";
import { error, type Actions } from "@sveltejs/kit";
import { z } from "zod";
import type { PageServerLoad } from "../$types";


export const load: PageServerLoad = async () => {
    try {
        const res = await fetch(`${env.PUB_PORT}/kerajaan`, {
            method: 'GET',
            headers: {
                Accept: 'application/json'
            }
        });
        if (res.ok) {
            const data = await res.json();
            console.log(data);
            return { data }
        }
    } catch (error) { }
};
export const actions: Actions = {
    submit: async ({ request }) => {
        const data = await request.formData();
        const res = Object.fromEntries(data)
        console.log("RES: ", res)

        const ver = z.object({
            namaDokumen: z.string({ message: "Input Tidak Boleh Kosong" }).max(255).nonempty("Isi Nama"),
            jenisDokumen: z.string({ message: "Pilih 1 pilihan!" }).nonempty(),
            kategori: z.string({ message: "Pilih 1 pilihan!" }).nonempty(),
            // keterkaitan: z.string({ message: "Harus diisi!" }).nonempty("Isi Keterkaitan"),
            // subkategori: z.string({ message: "Harus diisi!" }).nonempty("Isi Sub Kategori"),
            urlfoto: z.array(z.string().min(1, { message: "Nama file tidak boleh kosong" })).min(1, { message: "Minimal 1 Foto!" }),
        });

        const namaDokumen = data.get("nama");
        const kategori = data.get("kategori");
        const jenisDokumen = data.get("jenisDokumen");
        const keterkaitan = data.get("keterkaitan");
        const subkategori = data.get("subkategori");
        const urlFoto = data.getAll("uploadfile")
            .filter((item) => item instanceof File && item.name !== "")
            .map((file) => file as File);


        const fileNames = urlFoto.map((file) => file.name); // ngambil nama file


        const validation = ver.safeParse({
            namaDokumen,
            kategori,
            // subkategori,
            jenisDokumen,
            // keterkaitan,
            urlfoto: fileNames,
        });

        if (!validation.success) {
            const fieldErrors = validation.error.flatten().fieldErrors;
            // console.log("Form Data:", { namaDokumen, kategori, jenisDokumen, subkategori, keterkaitan, urlFoto: fileNames });

            // console.log("Field Errors:", fieldErrors); // Debugging untuk memastikan error dikembalikan

            return fail(406, {
                errors: fieldErrors,
                success: false,
                formData: { namaDokumen, kategori, jenisDokumen, subkategori, keterkaitan, urlFoto: fileNames },
                type: "add"
            });
        }

        try {
            const formData = new FormData();
            formData.append("nama_arsip", namaDokumen || "");
            // formData.append("keterkaitan", keterkaitan || "");
            formData.append("kategori_arsip", kategori || "");
            formData.append("jenis_arsip", jenisDokumen || "");
            formData.append("sub_kategori_arsip", subkategori || "");

            // Tambahkan file ke FormData
            urlFoto.forEach((file) => {
                formData.append("dokumentasi", file);
            });

            // console.log("FormData:", formData); 

            const send = await fetch(env.PUB_PORT + "/arsip", {
                method: "POST",
                body: formData,
            });

            const r = await send.json();
            // console.log(r);

            if (send.ok) {
                // console.log("Form Data:", res);
                return { errors: "no Error", success: true };
            }
            return fail(400, { request: `Error Code : ${send.status} ${r.message}` });
        } catch (e) {
            console.error("Fetch Error", e);
        }
    }
    

    // return { errors: "Success", success: true };
};
