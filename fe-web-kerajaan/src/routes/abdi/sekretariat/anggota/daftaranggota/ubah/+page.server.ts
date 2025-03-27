import SuccessModal from "$lib/modal/SuccessModal.svelte";
import { fail, type Actions } from "@sveltejs/kit";
import { z } from "zod";

export const actions: Actions = {
    ubahAbdi: async ({request}) => {
        const data = await request.formData();
        const today = String(new Date().toISOString().split("T")[0])
        const input = String(data.get("tanggal_lahir"))
        console.log(data)
        const ver = z.object({
            nama_lengkap:
                z.string({ message: "Field Nama Lengkap harus diisi" })
            .nonempty("Field Nama Lengkap Tidak Boleh Kosong!"),
            tempat_lahir:
                z.string({ message: "Field Tempat Lahir harus diisi" })
            .nonempty("Field Tempat Lahir Tidak Boleh Kosong!"),
            tanggal_lahir:
                z.string({ message: "Field Tanggal lahir harus diisi" })
                    .nonempty("Field Tanggal lahir Tidak Boleh Kosong!")
                    .refine(() => { return input >= today }, { message: "Tanggal Tidak boleh kurang dari hari ini" })
            ,

            alamat:
                z.string({ message: "Field Alamat harus diisi" })
                    .nonempty("Field Alamat Tidak Boleh Kosong!")
                   ,
            no_telp:
                z.string({ message: "Field Nomer Telpon harus diisi" })
                    .min(10, "Nomer Telpon minimal 10 digit")
                    .max(13, "Nomer Telpon maximal 13 digit")
                    .regex(/^\d+$/, "Nomer Telpon harus berupa digit")
            ,
            jenis_kelamin:
                z.string({ message: "Field Jenis Kelamin harus diisi" })
            .nonempty("Field Jenis Kelamin Tidak Boleh Kosong!"),
            hobi:
                z.string({ message: "Field Hobi harus diisi" })
                .optional(),
            radio_ayah:
                z.string({ message: "Field Nama Ayah harus diisi" })
                .nonempty("Pilih salah 1"),
            nama_ayah:
                z.string({ message: "Field Nama Ayah harus diisi" })
            .nonempty("Field Nama Ayah Tidak Boleh Kosong!"),
            radio_ibu:
                z.string({ message: "Field Nama Ibu harus diisi" })
            .nonempty("Pilih salah 1"),
            nama_ibu:
                z.string({ message: "Field Nama Ibu harus diisi" })
            .nonempty("Field Nama Ibu Tidak Boleh Kosong!"),
            email:
                z.string({ message: "Field Email harus diisi" })
            .email("Email Tidak Valid").nullable(),
            wongso:
                z.string({ message: "Field Wongso harus diisi" })
            .nonempty("Field Wongso Tidak Boleh Kosong!"),
            pekerjaan:
                z.string({ message: "Field Pekerjaan harus diisi" })
                .optional(),
            agama: 
            z.string({ message: "Field Agama harus diisi" })
                .optional()
        })

        const form = {
            nama_lengkap: String(data.get("nama_lengkap")||""),
            tempat_lahir: String(data.get("tempat_lahir")||""),
            tanggal_lahir: String(data.get("tanggal_lahir")||""),
            alamat: String(data.get("alamat")||""),
            no_telp: String(data.get("no_telp")||""),
            jenis_kelamin: String(data.get("jenis_kelamin")||""),
            hobi: String(data.get("hobi")||""),
            radio_ayah: String(data.get("radioayah")||""),
            nama_ayah: String(data.get("nama_ayah")||""),
            radio_ibu: String(data.get("radioibu")||""),
            nama_ibu: String(data.get("nama_ibu")||""),
            email: String(data.get("email")||""),
            wongso: String(data.get("wongso")||""),
            pekerjaan: String(data.get("pekerjaan")||""),
            agama: String(data.get("agama")||""),
           
        }
        const verification = ver.safeParse({ ...form })
        if (!verification.success) {
            console.log(verification.error.flatten().fieldErrors)
            return fail(418,{errors: verification.error.flatten().fieldErrors, success: false, form})
        }
        return {errors: "no Error", success: true, form}
    }
};