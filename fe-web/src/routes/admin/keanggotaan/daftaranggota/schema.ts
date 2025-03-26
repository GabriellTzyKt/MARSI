
import { z } from "zod";

export const schema = z.object({
    nama_lengkap_anggota: z.string().nonempty("Minimal ada 1 huruf/ tidak boleh kosong!"),
    gelar_anggota: z.string().nonempty("Minimal ada 1 huruf/ tidak boleh kosong!"),
    posisi_anggota: z.string().nonempty("Minimal ada 1 huruf/ tidak boleh kosong!"),
})