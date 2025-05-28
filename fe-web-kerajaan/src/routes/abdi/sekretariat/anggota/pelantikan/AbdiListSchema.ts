import { z } from "zod";

// Schema for a single Abdi entry
const AbdiSchema = z.object({
	abdi_id: z.string().min(1, "Wajib diisi"),
	acara_id: z.string().min(1, "Wajib diisi"),
	pemberi_id: z.string().min(1, "Wajib diisi"),
	bukti_gelar: z.any(), // Accept any value for the file field
	gelar_lama: z.string().min(1, "Wajib diisi"),
	gelar_baru: z.string().min(1, "Wajib diisi"),
	gelar_id: z.string().optional()
});

// Schema for the entire list of Abdi entries
export const AbdiListSchema = z.array(AbdiSchema);
