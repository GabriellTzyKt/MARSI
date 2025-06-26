import { accounts } from "$lib/dummy";
import { date, z } from "zod";
import type { Actions, PageServerLoad } from "./$types";
import { fail } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
import { formatDatetoUI } from "$lib";


export const load: PageServerLoad = async ({ params }) => {
    try {
        const res = await fetch(`${env.PUB_PORT}/user/${params.id}`)
        let final = []
        if(!res.ok){
            throw new Error(`HTTP Error! Status: ${res.status}`);
        }
        const data = await res.json()
        if (data.profile && data) {
            try {
                const resProfilepict = await fetch(`${env.URL_KERAJAAN}/doc/${data.profile.profile_pict}`)
                if (!resProfilepict.ok) {
                    console.error(`HTTP Error! Status: ${resProfilepict.status}`);
                    final = [{
                        ...data,
                        tanggal_lahir_UI: formatDatetoUI(data.tanggal_lahir || ''),
                        profilepict: null
                    }];
                    return { akun: final[0] };
                }
                const profilepict = await resProfilepict.json()
                const pict = await fetch(`${env.URL_KERAJAAN}/file?file_path=${profilepict.file_dokumentasi}`)
                final = [{
                    ...data,
                    tanggal_lahir_UI: formatDatetoUI(data.tanggal_lahir || ''),
                    profilepict: resProfilepict.ok ? resProfilepict : null
                }];
                return { akun: final[0] }
            }
            catch (pictError) {
                console.error("Error fetching profile picture:", pictError);
                final = [{
                    ...data,
                    tanggal_lahir_UI: formatDatetoUI(data.tanggal_lahir || ''),
                    profilepict: null
                }];
                return { akun: final[0] };
            }
        } else if (data) {
            final = Array.isArray(data) ? data.map(item => ({
                ...item,
                tanggal_lahir_UI: formatDatetoUI(item.tanggal_lahir || '')
            })) : [data];
            return { data: final[0] };
        }
        return { data: null, error: "No data returned from API" };
    }
    catch (error) {
        console.error("Error in profile load:", error);
        return { data: null, error: error.message };
    }
};
export const actions: Actions = {
    ubah: async({request}) => {
        const data = await request.formData()
        console.log(data)
        const ver = z.object({
            nama_lengkap: 
                z.string({ message: "Field Nama Lengkap tidak boleh kosong" })
                    .nonempty("Minimal harus ada 1 huruf")
                    .max(255, "Nama mencapai Maximal huruf (255 huruf)")
            ,
            tempat_lahir: 
                z.string({ message: "Field Tempat Lahir tidak boleh kosong" })
                    .nonempty("Minimal harus ada 1 huruf")
                    .max(255, "Nama mencapai Maximal huruf (255 huruf)"),
            tanggal_lahir: 
                z.string()
                    .min(1, "Tanggal Harus diisi")
                    .transform((v) => new Date(v))
                    .refine((d) => !isNaN(d.getTime()), { message: "Tanggal Harus Sesuai Format (YYYY-MM-DD)" }),
            jenis_kelamin:
                z.string({ message: "Field Jenis Kelamin tidak boleh kosong" })
                    .min(1, "Minimal Pilih 1 pilihan"),
            alamat:
                z.string({ message: "Mohon Field Alamat diisi" })
                    .nonempty("Tolong isi minimal 1 huruf")
                    .max(500, "Maximal 500 huruf!"),
            no_telp:
                z.string({ message: "Field Nomer Telepon tidak boleh kosong" })
                    .min(10, "Nomer telepon minimal 10 digit")
                    .max(13, "Nomer Telpon maximal 13 digit!")
                    .regex(/^\d+$/, "Input harus berupa Angka / Digit"),
            pekerjaan: 
                z.string({ message: "Field Pekerjaan tidak boleh kosong" })
                    .nonempty("Minimal ada 1 huruf dalam field pekerjaan")
                    .max(255, "Pekerjaan lebih dari 255 huruf"),
            wongso:
                z.string({ message: " Field Wongso tidak boleh kosong" })
                    .nonempty("Tolong isi minimal 1 huruf")
                    .max(255, "wongso mencapai maximal huruf (255)"),
            email:
                z.string({ message: "Field email Harus tidak boleh kosong" })
                    .email("Tolong isi dengan email yang valid"),
            hobi: 
                z.string({ message: "Field Hobi tidak boleh kosong" })
                    .nonempty("Tolong isi minimal 1 huruf")
                    .max(155, "Hobi sudah mencapai batas max (255 huruf)"),
            agama: 
                z.string({ message: "Field agama tidak boleh kosong" })
                    .nonempty("Tolong isi minimal 1 huruf")
                    .max(155, "Field Agama sudah mencapai batas max (255 huruf)"),
            asma_dalem:
                z.string({ message: "Field Asma Dalem tidak boleh kosong" })
                    .nonempty("Tolong isi minimal 1 huruf")
                    .max(155, "Field Asma Dalem sudah mencapai batas max (255 huruf)"),
            nama_ayah:
                z.string({ message: "Field Nama Ayah tidak boleh kosong" })
                    .nonempty("Tolong isi minimal 1 huruf")
                    .max(155, "Field Nama Ayah sudah mencapai batas max (255 huruf)"),
            nama_ibu:
                z.string({ message: "Field Nama Ibu tidak boleh kosong" })
                    .nonempty("Tolong isi minimal 1 huruf")
                    .max(155, "Field Nama Ibu sudah mencapai batas max (255 huruf)")            
        })

        const nama_lengkap = data.get("nama_lengkap")
        const tempat_lahir = data.get("tempat_lahir")
        const tanggal_lahir = data.get("tanggal_lahir")
        const jenis_kelamin = data.get("jenis_kelamin")
        const alamat = data.get("alamat")
        const no_telp = data.get("no_telp")
        const pekerjaan = data.get("pekerjaan")
        const wongso = data.get("wongso")
        const email = data.get("email")
        const hobi = data.get("hobi")
        const agama = data.get("agama")
        const asma_dalem = data.get("asma_dalem")
        const nama_ayah = data.get("nama_ayah")
        const nama_ibu = data.get("nama_ibu")
        const form = {
            nama_lengkap,
            tempat_lahir,
            tanggal_lahir,
            jenis_kelamin,
            alamat,
            no_telp,
            pekerjaan,
            wongso,
            email,
            hobi,
            agama,
            asma_dalem,
            nama_ayah,
            nama_ibu
        }
        const verif = ver.safeParse({ ...form })
        if (!verif.success) {
            return fail(500,{errors: verif.error.flatten().fieldErrors, success: false, FormData: form})
        }
         return {errors: "no error", success: true, FormData: form}
    }
};