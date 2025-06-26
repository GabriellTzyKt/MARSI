import { z } from "zod";

export const schema = z.object({
    username: z.string().nonempty("Field Username Tidak Boleh Kosong"),
    password: z
    .string({ message: "password bukan string" })
    .min(8, { message: "Password minimal 8 huruf" })
    .max(255, { message: "Password sudah maximal!" })
    .nonempty({ message: "Password tidak boleh kosong" })
    .regex(/[A-Z]/, { message: "Password Harus ada minimal 1 huruf Kapital" })
    .regex(/[0-9]/, { message: "Password Harus ada minimal 1 angka" })
    .regex(/[^A-Za-z0-9]/, { message: "Password harus ada simbol" })
})