import { z } from "zod";

export const schema = z.object({
    nama_kerajaan: z.string().nonempty("Field Nama Kerajaan Tidak Boleh Kosong"),
    alamat_kerajaan: z.string().nonempty("Field Alamat Kerajaan Tidak Boleh Kosong"),
    tanggal_berdiri: z.string().nonempty("Field Tanggal berdiri Tidak Boleh Kosong")
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Format Tidak Sesuai (DD-MM-YYYY)")
        .refine((datetostr) => {
            const date = new Date(datetostr)
            return (!isNaN(date.getTime())&& datetostr === date.toISOString().split("T")[0])
    },{message:"Tanggal Tidak Valid"}),
    era_kerajaan: z.string().nonempty("Field Era Kerajaan Tidak Boleh Kosong"),
    rumpun_kerajaan: z.string().nonempty("Field Rumpun Kerajaan Tidak Boleh Kosong"),
    jenis_kerajaan: z.string().nonempty("Field Jenis Kerajaan Tidak Boleh Kosong"),
    raja_sekarang: z.string().nonempty("Field Raja Sekarang Tidak Boleh Kosong"),
    deskripsi_kerajaan: z.string().nonempty("Field Deskripsi Kerajaan Tidak Boleh Kosong"),
})