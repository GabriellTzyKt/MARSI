import { fail, type Actions } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
export const actions: Actions = {
    tambahAplikasi: async ({ request }) => {
        const data = await request.formData();
        
        // Get all selected penanggalan values (checkboxes can have multiple values)
        const penanggalanValues = data.getAll("fitur-penanggalan2");
        
        // Website features
        const websiteFeatures = {
            id_kerajaan: parseInt(data.get("id_kerajaan") as string) || 5, // Default semisal gada ( buat coba aja )
            fitur_situs: data.get("fitur-situs") === "ya" ? 1 : 0,
            fitur_acara: data.get("fitur-acara") === "ya" ? 1 : 0,
            fitur_aset: data.get("fitur-aset") === "ya" ? 1 : 0,
            fitur_organisasi: data.get("fitur-organisasi") === "ya" ? 1 : 0,
            fitur_komunitas: data.get("fitur-komunitas") === "ya" ? 1 : 0,
            fitur_tugas: data.get("fitur-tugas-web") === "ya" ? 1 : 0,
        };

        // Mobile features
        const mobileFeatures = {
            id_kerajaan: parseInt(data.get("id_kerajaan") as string) || 5, // Default semisal gada ( buat coba aja )
            kalender: data.get("fitur-penanggalan1") === "ya" ? 1 : 0,
            penanggalan: penanggalanValues.length > 0 ? penanggalanValues.join(",") : "", // dikasi koma 
            tugas_pribadi: data.get("fitur-tugas-mobile") === "ya" ? 1 : 0, 
            tugas_acara: data.get("fitur-tugasacara") === "ya" ? 1 : 0,
            situs: data.get("fitur-situskerajaan") === "ya" ? 1 : 0,
            check_in: data.get("fitur-checkin") === "ya" ? 1 : 0,
            acara: data.get("fitur-acarakerajaan") === "ya" ? 1 : 0,
            grup: data.get("fitur-groupchat") === "ya" ? 1 : 0,
            forum: data.get("fitur-forum") === "ya" ? 1 : 0,
            permohonan: data.get("fitur-permohonan") === "ya" ? 1 : 0,
        };
        
        // Debug: Log payload yang akan dikirim ke API
        console.log("Website features payload:", websiteFeatures);
        console.log("Mobile features payload:", mobileFeatures);

        try {
            // Send website features to API
            const websiteResponse = await fetch(`${env.BASE_URL}/fitur/website`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(websiteFeatures)
            });

            // Send mobile features to API
            const mobileResponse = await fetch(`${env.BASE_URL}/fitur/mobile`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(mobileFeatures)
            });

            if (!websiteResponse.ok || !mobileResponse.ok) {
                return fail(400, { 
                    error: "Failed to save application features",
                    success: false
                });
            }

            return { 
                success: true,
                message: "Aplikasi kerajaan berhasil dibuat"
            };
        } catch (error) {
            console.error("Error saving application features:", error);
            return fail(500, { 
                error: "Server error when saving application features",
                success: false
            });
        }
    }
};





































