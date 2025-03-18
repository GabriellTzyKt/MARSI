import { fail, type Actions } from "@sveltejs/kit";
import { z } from "zod";


export const actions: Actions = {
    tambah: async ({ request }) => {
        const today = new Date().toISOString().split("T")[0]

        const data = await request.formData()
        console.log(data)
        const data_selesai = String(data.get("tanggal_selesai"))
        const data_mulai = String(data.get("tanggal_mulai"))
        console.log(data_selesai)
        const ver = z.object({
            nama_acara:
                z.string({ message: "Field Nama Acara harus diisi" })
                    .nonempty("Minimal 1 huruf / tidak boleh kosong"),
            penanggungjawab_acara:
                z.string({ message: "Field Penanggung Jawab Acara harus diisi" })
                    .nonempty("Minimal 1 huruf / tidak boleh kosong"),
            penyelenggara_acara:
                z.string({ message: "Field Penyelenggara Acara harus diisi" })
                    .nonempty("Minimal 1 huruf / tidak boleh kosong"),
            lokasi_acara:
                z.string({ message: "Field Loaksi Acara harus diisi" })
                    .nonempty("Minimal 1 huruf / tidak boleh kosong"),
            tujuan_acara:
                z.string({ message: "Field Tujuan Acara harus diisi" })
                    .nonempty("Minimal 1 huruf / tidak boleh kosong"),
            
            kapasitas_acara:
                z.coerce.number({ message: "Field Kapasitas Acara harus berupa angka" })
                    .min(1, "Minimal 1 kapasitas"),
            jenis_acara:
                z.string({ message: "Field Jenis Acara harus diisi" })
                    .nonempty("Minimal 1 huruf / tidak boleh kosong"),
            tanggal_mulai:
                z.string({ message: "Field Tanggal Mulai harus diisi" })
                    .refine((v) => {
                        const date = new Date(v)
                        return !isNaN(date.getTime())
                    }, { message: "Format Tanggal Tidak Sesuai" })
                    .refine((v) => {
                        return new Date(v) >= new Date(today)
                    }, { message: "Tanggal Mulai tidak boleh kurang dari hari ini" }),
            tanggal_selesai:
                z.string({ message: "Field Tanggal Selesai harus diisi" })
                    .refine((v) => {
                        const date = new Date(v)
                        return !isNaN(date.getTime())
                    }, { message: "Format Tanggal Tidak Sesuai" })
                    .refine(() => {
                        console.log(new Date(data_selesai) >= new Date(data_mulai))
                        return new Date(data_selesai) >= new Date(data_mulai)
                       
                    }, { message: "Tanggal Selesai tidak boleh kurang dengan tanggal mulai" }),
            
            panggilan: z.string().nullable(),
            nama_lengkap: z.string().nullable(),
            no_telp: z.string({ message: "Field Nomer Telpon ini harus diisi" })
                
                .min(10, "Nomer Telpon minimal harus 10 digit")
                .max(15, "Nomer Telpon Maximal 15 digit")
                .regex(/^d+$/, "Harus Berupa digit atau nomer").nullable()
                ,
            waktu_mulai:
                z.string({ message: "Field Waktu Mulai harus diisi" })
                    .nonempty("Minimal 1 huruf / tidak boleh kosong"),
            waktu_selesai:
                z.string({ message: "Field Waktu Selesai harus diisi" })
                    .nonempty("Minimal 1 huruf / tidak boleh kosong"),
            deskripsi_acara:
                z.string({ message: "Field Deskripsi Acara harus diisi" })
                    .nonempty("Minimal 1 huruf / tidak boleh kosong"),
            
            
        })
        const formData = {
            nama_acara: String(data.get("nama_acara")),
            penanggungjawab_acara: String(data.get("penanggungjawab_acara")),
            penyelenggara_acara: String(data.get("penyelenggara_acara")),
            lokasi_acara: String(data.get("lokasi_acara")),
            tujuan_acara: String(data.get("tujuan_acara")),
            kapasitas_acara: String(data.get("kapasitas_acara")),
            jenis_acara: String(data.get("jenis_acara")),
            tanggal_mulai: String(data.get("tanggal_mulai")),
            tanggal_selesai: String(data.get("tanggal_selesai")),
            panggilan: String(data.get("panggilan")),
            nama_lengkap: String(data.get("nama_lengkap")),
            no_telp: String(data.get("no_telp")),
            waktu_mulai: String(data.get("waktu_mulai")),
            waktu_selesai: String(data.get("waktu_selesai")),
            deskripsi_acara: String(data.get("deskripsi_acara")),
           
        }
        const verif = ver.safeParse({ ...formData })
        if (!verif.success) {
            return fail(500, { errors: verif.error.flatten().fieldErrors, formData})
        }   
        return { errors: "success", formData}
    }
};
