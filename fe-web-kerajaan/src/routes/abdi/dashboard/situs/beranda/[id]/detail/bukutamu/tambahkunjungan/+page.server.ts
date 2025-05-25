import { error, fail, type Actions } from "@sveltejs/kit";
import { any, z } from "zod";


export const actions: Actions = {
    tambah: async ({ request }) => {
        const data = await request.formData();
        console.log("data entries : ", data);
        
        // Get all unique IDs from form data
        const entryIds = new Set();
        for (const [key] of data.entries()) {
            if (key.includes('-')) {
                const id = key.split('-')[1];
                entryIds.add(id);
            }
        }
        
        // Create form object and validation errors
        let form = {
            namapengunjung: {},
            keterangankunjungan: {},
            kotaasal: {},
            orangyangditemui: {},
            tujuankunjungan: {},
            radioinput: {},
            notelp: {},
        };
        
        let errors = {};
        
        // Process each entry
        entryIds.forEach(id => {
            const namapengunjung = data.get(`namapengunjung-${id}`)?.toString() || '';
            const keterangankunjungan = data.get(`keterangankunjungan-${id}`)?.toString() || '';
            const notelp = data.get(`notelp-${id}`)?.toString() || '';
            const kotaasal = data.get(`kotaasal-${id}`)?.toString() || '';
            const radioinput = data.get(`menemui_seseorang-${id}`)?.toString() || '';
            const orangyangditemui = data.get(`orangyangditemui-${id}`)?.toString() || '';
            const tujuankunjungan = data.get(`tujuankunjungan-${id}`)?.toString() || '';
            
            // Skip empty entries (except the first one)
            if (id !== '1' && !namapengunjung && !keterangankunjungan && !notelp && !kotaasal) {
                return;
            }
            
            // Add to form object
            form.namapengunjung[id] = namapengunjung;
            form.keterangankunjungan[id] = keterangankunjungan;
            form.notelp[id] = notelp;
            form.kotaasal[id] = kotaasal;
            form.radioinput[id] = radioinput;
            form.orangyangditemui[id] = orangyangditemui;
            form.tujuankunjungan[id] = tujuankunjungan;
            
            // Validate required fields
            if (!namapengunjung.trim()) {
                errors[`namapengunjung.${id}`] = "Masukkan nama pengunjung!";
            }
            if (!keterangankunjungan.trim()) {
                errors[`keterangankunjungan.${id}`] = "Keterangan harus diisi!";
            }
            if (!kotaasal.trim()) {
                errors[`kotaasal.${id}`] = "Isi Kota!";
            }
            if (!radioinput) {
                errors[`radioinput.${id}`] = "Pilih salah satu!";
            }
            if (!notelp.trim()) {
                errors[`notelp.${id}`] = "Nomor telepon harus diisi!";
            } else if (!/^\d+$/.test(notelp)) {
                errors[`notelp.${id}`] = "Nomor telepon hanya boleh angka!";
            } else if (notelp.length < 10) {
                errors[`notelp.${id}`] = "Nomor telepon minimal 10 digit!";
            }
        });
        
        console.log("Form data:", form);
        
        // Return errors if any
        if (Object.keys(errors).length > 0) {
            console.log("Validation errors:", errors);
            return fail(406, {
                errors,
                success: false,
                formData: form,
                type: "add"
            });
        }
        
        return { errors: "Success", success: true, formData: form, type: "add" };
    }
};
