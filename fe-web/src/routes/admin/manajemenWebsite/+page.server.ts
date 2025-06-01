import { env } from "$env/dynamic/private";
import { fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { Actions } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ fetch }) => {
    try {
        // Fetch all data in parallel
        const [websiteResponse, mobileResponse, kerajaanResponse] = await Promise.all([
            fetch(`${env.BASE_URL}/fitur/website?limit=200`),
            fetch(`${env.BASE_URL}/fitur/mobile?limit=200`),
            fetch(`${env.BASE_URL}/kerajaan?limit=200`)
        ]);

        if (!websiteResponse.ok) {
            throw new Error(`Failed to fetch website features: ${websiteResponse.status} ${websiteResponse.statusText}`);
        }

        if (!mobileResponse.ok) {
            throw new Error(`Failed to fetch mobile features: ${mobileResponse.status} ${mobileResponse.statusText}`);
        }

        const websiteFeatures = await websiteResponse.json();
        const mobileFeatures = await mobileResponse.json();
        let kerajaanData = [];

        if (kerajaanResponse.ok) {
            kerajaanData = await kerajaanResponse.json();
        } else {
            console.error(`Failed to fetch kerajaan data: ${kerajaanResponse.status}`);
        }

        // Create a map of kerajaan IDs to names for quick lookup
        const kerajaanMap = new Map();
        if (Array.isArray(kerajaanData)) {
            kerajaanData.forEach(kerajaan => {
                kerajaanMap.set(kerajaan.id_kerajaan, kerajaan.nama_kerajaan);
            });
        }

        // Create a map to store combined data by id_kerajaan
        const combinedDataMap = new Map();

        // Process website features
        if (Array.isArray(websiteFeatures)) {
            websiteFeatures.forEach(website => {
                const id_kerajaan = website.id_kerajaan;
                combinedDataMap.set(id_kerajaan, {
                    id_permintaan: website.id_request || id_kerajaan,
                    id_kerajaan: id_kerajaan,
                    asal_kerajaan: kerajaanMap.get(id_kerajaan) || `Kerajaan ${id_kerajaan}`,
                    link_website: websiteFeatures.find((website: any) => website.id_kerajaan === id_kerajaan)?.url_website || "...",
                    tanggal_buat: website.tanggal_request || "01-01-2023",
                    tanggal_selesai: website.tanggal_selesai || "31-12-2023",
                    status: website.status_permintaan || "Diajukan",
                    websiteFeatures: website,
                    mobileFeatures: null
                });
            });
        }

        // Process mobile features and update or add to the combined data
        if (Array.isArray(mobileFeatures)) {
            mobileFeatures.forEach(mobile => {
                const id_kerajaan = mobile.id_kerajaan;

                // Check if all mobile features are 0
                const allFeaturesZero =
                    mobile.fitur_kalender === 0 &&
                    mobile.fitur_tugas_pribadi === 0 &&
                    mobile.fitur_tugas_acara === 0 &&
                    mobile.fitur_situs === 0 &&
                    mobile.fitur_check_in === 0 &&
                    mobile.fitur_acara === 0 &&
                    mobile.fitur_chat === 0 &&
                    mobile.fitur_forum === 0 &&
                    mobile.fitur_permohonan === 0;

                // If all features are 0, treat as if mobile features don't exist
                if (allFeaturesZero) {
                    // Don't add mobile features if they're all 0
                    return;
                }

                if (combinedDataMap.has(id_kerajaan)) {
                    // Update existing entry with mobile features
                    const existingData = combinedDataMap.get(id_kerajaan);
                    existingData.mobileFeatures = mobile;

                    // Don't update status from mobile features
                    // Keep the website status as priority
                } else {
                    // Create new entry for this kerajaan
                    combinedDataMap.set(id_kerajaan, {
                        id_permintaan: mobile.id_request || id_kerajaan,
                        id_kerajaan: id_kerajaan,
                        asal_kerajaan: kerajaanMap.get(id_kerajaan) || `Kerajaan ${id_kerajaan}`,
                        link_website: websiteFeatures.find((website: any) => website.id_kerajaan === id_kerajaan)?.url_website || "...",
                        tanggal_buat: mobile.tanggal_request || "01-01-2023",
                        tanggal_selesai: mobile.tanggal_selesai || "31-12-2023",
                        status: mobile.status_permintaan || "Diajukan",
                        websiteFeatures: null,
                        mobileFeatures: mobile
                    });
                }
            });
        }

        // Convert map to array
        const formattedData = Array.from(combinedDataMap.values());

        console.log("Formatted data:", formattedData);

        // Definisikan urutan status
        const statusOrder: Record<string, number> = {
            'Ditinjau': 1,
            'Diproses': 2,
            'Selesai': 3
        };

        // Urutkan data berdasarkan status
        formattedData.sort((a, b) => {
            const orderA = statusOrder[a.status] || 999;
            const orderB = statusOrder[b.status] || 999;
            return orderA - orderB;
        });

        return {
            dataArsip: formattedData,
        };
    } catch (e) {
        if (e instanceof Error) {
            console.error("Error in load function:", e.message);
            return { dataArsip: "Failed", error: e.message };
        }
        return { dataArsip: "Failed", error: "Unknown error" };
    }
};

export const actions: Actions = {
    delete: async ({ request }) => {
        const data = await request.formData()
        console.log("data id : ", data)
        try {
            const del = await fetch(`${env.PUB_PORT}/arsip/${data.get("id_arsip")}`, {
                method: "DELETE"
            })
            const m = await del.json()
            if (!del.ok) {
                return fail(406, { error: `Code ${del.status} Message: ${m.message}` })
            }
            console.log(m.message)
            return { error: "no error" }
        }
        catch (error) {
            console.error("Error deleting record:", error);
            return fail(500, { error: "Server error when deleting record" });
        }
    },

    // Tambahkan action baru untuk memproses permintaan
    processRequest: async ({ request, fetch }) => {
        try {
            const data = await request.formData();
            const idPermintaan = data.get("id_permintaan");

            console.log(`Processing website request for ID: ${idPermintaan}`);

            if (!idPermintaan) {
                return fail(400, { error: "ID permintaan tidak ditemukan" });
            }

            // Buat payload sederhana dengan id_request dan status_permintaan
            const payload = {
                id_request: Number(idPermintaan),
                status_permintaan: "Diproses"
            };

            console.log("Sending payload:", payload);

            // Kirim update ke API
            const updateEndpoint = `${env.BASE_URL}/fitur/website`;
            const updateResponse = await fetch(updateEndpoint, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!updateResponse.ok) {
                console.log("error")
                const errorText = await updateResponse.text();
                return fail(updateResponse.status, {
                    error: `Gagal memperbarui status: ${updateResponse.status} ${errorText}`
                });
            }

            const result = await updateResponse.json();
            console.log("Update successful:", result);

            return { success: true, message: "Permintaan berhasil diproses" };

        } catch (error) {
            console.error("Error processing request:", error);
            return fail(500, { error: "Terjadi kesalahan saat memproses permintaan" });
        }
    },

    processRequest2: async ({ request, fetch }) => {
        try {
            const data = await request.formData();
            const idPermintaan = data.get("id_permintaan");
            const linkkerajaan = data.get("linkkerajaan")

            console.log(`Processing website request for ID: ${idPermintaan}`);

            if (!idPermintaan) {
                return fail(400, { error: "ID permintaan tidak ditemukan" });
            }

            // Buat payload sederhana dengan id_request dan status_permintaan
            const payload = {
                id_request: Number(idPermintaan),
                status_permintaan: "Selesai",
                url_website : linkkerajaan,
            };

            console.log("Sending payload:", payload);

            // Kirim update ke API
            const updateEndpoint = `${env.BASE_URL}/fitur/website`;
            const updateResponse = await fetch(updateEndpoint, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!updateResponse.ok) {
                console.log("error")
                const errorText = await updateResponse.text();
                return fail(updateResponse.status, {
                    error: `Gagal memperbarui status: ${updateResponse.status} ${errorText}`
                });
            }

            const result = await updateResponse.json();
            console.log("Update successful:", result);

            return { success: true, message: "Permintaan berhasil diproses" };

        } catch (error) {
            console.error("Error processing request:", error);
            return fail(500, { error: "Terjadi kesalahan saat memproses permintaan" });
        }
    }
};
