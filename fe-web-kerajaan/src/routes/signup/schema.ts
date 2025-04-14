import { z } from "zod";

export const schema = z.object({
  password: z
    .string({ message: "password bukan string" })
    .min(8, { message: "Password minimal 8 huruf" })
    .max(255, { message: "Password sudah maximal!" })
    .nonempty({ message: "Password tidak boleh kosong" })
    .regex(/[A-Z]/, { message: "Password Harus ada minimal 1 huruf Kapital" })
    .regex(/[0-9]/, { message: "Password Harus ada minimal 1 angka" })
        .regex(/[^A-Za-z0-9]/, { message: "Password harus ada simbol" }),
    
  username: z
    .string({ message: "Field Tidak Boleh Kosong" })
    .nonempty("Field Username Tidak Boleh Kosong"),

  nama_lengkap: z
    .string({ message: "Field Tidak Boleh Kosong" })
    .nonempty("Field Nama Lengkap Tidak Boleh kosong"),

  no_hp: z
    .string()
    .regex(/^\d{10,15}$/, { message: "Nomor HP harus berupa angka 10-15 digit" })
    .nonempty("Field No HP Tidak Boleh Kosong"),

  jenis_kelamin: z
    .string({ message: "Field Jenis Kelamin Tidak Boleh Kosong" })
    .nonempty("Field Jenis Kelamin Tidak Boleh Kosong"),

  wongso: z
    .string()
    .nonempty("Field Wongso Tidak Boleh Kosong")
    ,

  tempat_lahir: z
    .string()
    .nonempty("Field Tempat Lahir Tidak Boleh Kosong"),

  tanggal_lahir: z
    .string()
    .nonempty("Field Tanggal Lahir Tidak Boleh Kosong")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Format tanggal lahir tidak valid",
    }),

  alamat: z
    .string()
    .nonempty("Field Alamat Tidak Boleh Kosong"),

  email: z
    .string()
    .nonempty("Field Email Tidak Boleh Kosong")
    .email({ message: "Format email tidak valid" }),
});
