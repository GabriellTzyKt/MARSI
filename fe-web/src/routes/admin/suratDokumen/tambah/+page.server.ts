import { env } from "$env/dynamic/private";
import { fail } from "@sveltejs/kit";
import { error, type Actions } from "@sveltejs/kit";
import { z } from "zod";
import type { PageServerLoad } from "../$types";
import { filter } from 'd3';


export const load: PageServerLoad = async () => {
    try {
        const [kerajaanRes, arsipRes, jenisRes] = await Promise.all([
            fetch(`${env.PUB_PORT}/kerajaan?limit=200`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json'
                }
            }),
            fetch(`${env.PUB_PORT}/arsip?limit=200`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json'
                }
            }),
            fetch(`${env.PUB_PORT}/jenis-arsip?limit=200`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json'
                }
            })
        ]);
        if (kerajaanRes.ok && arsipRes.ok) {
            const kerajaanData = await kerajaanRes.json();
            const filteredKerajaanData = kerajaanData.filter((item : any) => item.deleted_at === "0001-01-01T00:00:00Z")
            const arsipData = await arsipRes.json();
            console.log("Arsip data : ", arsipData)
            const filteredArsipData = arsipData.filter((item : any) => item.deleted_at === "0001-01-01T00:00:00Z")
             const jenisData = await jenisRes.json();
            const filteredJenisData = jenisData.filter((item: any) => item.deleted_at === "0001-01-01T00:00:00Z");
           
            return { filteredKerajaanData, filteredArsipData, filteredJenisData };
        }
    } catch (error) { }
};
export const actions: Actions = {
    submit: async ({ request }) => {
        try {
            const data = await request.formData();
            console.log('Form data received:', Object.fromEntries(data.entries()));

            // Get form fields
            const namaDokumen = data.get('nama')?.toString();
            const kategori = data.get('kategori')?.toString();
            const jenisDokumen = data.get('jenisDokumen')?.toString();
            const subkategori = data.get('subkategori')?.toString();
            const keterkaitan = data.get('keterkaitan')?.toString();
            const idKerajaan = data.get('id_kerajaan')?.toString(); // Ambil id_kerajaan dari hidden input

            // Get all uploaded files
            const uploadedFiles = data.getAll('uploadfile')
                .filter(item => item instanceof File && item.size > 0) as File[];

            console.log('Files received:', uploadedFiles.map(f => `${f.name} (${f.size} bytes)`));

            // Validate the form data
            const ver = z.object({
                namaDokumen: z.string({ message: "Input Tidak Boleh Kosong" }).max(255).nonempty("Isi Nama"),
                jenisDokumen: z.string({ message: "Pilih 1 pilihan!" }).nonempty(),
                kategori: z.string({ message: "Pilih 1 pilihan!" }).nonempty(),
            });

            const validation = ver.safeParse({
                namaDokumen,
                kategori,
                jenisDokumen,
            });

            if (!validation.success) {
                const fieldErrors = validation.error.flatten().fieldErrors;
                console.log("Validation errors:", fieldErrors);

                return fail(406, {
                    errors: fieldErrors,
                    success: false,
                    formData: { namaDokumen, kategori, jenisDokumen, subkategori, keterkaitan },
                    type: "add"
                });
            }

            // Prepare form data for API request
            const formData = new FormData();
            formData.append("nama_arsip", namaDokumen || '');
            formData.append("kategori_arsip", kategori || '');
            formData.append("jenis_arsip", jenisDokumen || '');
            formData.append("sub_kategori_arsip", subkategori || '');

            if (keterkaitan) {
                formData.append("keterkaitan", keterkaitan);
            }

            // Add all files to the form data
            uploadedFiles.forEach((file, index) => {
                console.log(`Adding file ${index + 1}/${uploadedFiles.length} to API request: ${file.name}`);
                formData.append("dokumentasi", file);
            });

            // Send the data to the API
            const response = await fetch(`${env.PUB_PORT}/arsip`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            console.log('API response:', result);

            if (response.ok) {
                // Fetch the latest arsip data to get the last id_arsip
                const arsipResponse = await fetch(`${env.PUB_PORT}/arsip?limit=2000`, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json'
                    }
                });

                if (arsipResponse.ok) {
                    const arsipData = await arsipResponse.json();
                    const lastArsip = arsipData[arsipData.length - 1]; // Ambil data terakhir
                    const idArsip = lastArsip.id_arsip;
                    console.log("ID Last arsip : ", idArsip)

                    // Send id_arsip and id_kerajaan to /arsip/kerajaan
                    const kerajaanResponse = await fetch(`${env.PUB_PORT}/arsip/kerajaan`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            id_arsip: Number(idArsip),
                            id_kerajaan: Number(idKerajaan)
                        })
                    });

                    if (!kerajaanResponse.ok) {
                        console.error('Failed to link arsip with kerajaan:', await kerajaanResponse.text());
                        return fail(400, {
                            errors: { general: ['Failed to link arsip with kerajaan'] },
                            success: false
                        });
                    }

                    console.log('Successfully linked arsip with kerajaan');
                }

                return { success: true };
            } else {
                return fail(400, { 
                    errors: { general: [`Error: ${response.status} - ${result.message || 'Unknown error'}`] },
                    success: false 
                });
            }
        } catch (error) {
            console.error('Error processing request:', error);
            return fail(500, { 
                errors: { general: ['Terjadi kesalahan saat memproses permintaan'] },
                success: false 
            });
        }
    }
};
