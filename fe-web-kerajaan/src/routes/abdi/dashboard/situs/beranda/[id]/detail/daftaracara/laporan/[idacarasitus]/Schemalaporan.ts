import { z } from "zod";

// Schema untuk satu item RAB
const rabItemSchema = z.object({
    keterangan: z.string().min(1, "Keterangan RAB wajib diisi"),
    jumlah: z.number().min(1, "Jumlah harus lebih dari 0")
});

// Schema untuk array RAB
const rabSchema = z.array(rabItemSchema).min(1, "Minimal 1 data RAB");

// Schema untuk file dokumentasi (bisa lebih ketat jika perlu)
const dokumentasiSchema = z.array(
    z.instanceof(File).refine(file => file.size > 0, "File dokumentasi tidak boleh kosong")
).min(1, "Minimal 1 foto dokumentasi");

// Schema utama LPJ
const lpjSchema = z.object({
    jumlah_peserta: z.string().min(1, "Jumlah peserta wajib diisi"),
    perkiraan_jumlah_peserta: z.string().min(1, "Perkiraan jumlah peserta wajib diisi"),
    bukti_pelaksanaan: z.instanceof(File).refine(file => file.size > 0, "Bukti pelaksanaan wajib diunggah"),
    rab: rabSchema,
   
});
export const schemaLpj = lpjSchema;