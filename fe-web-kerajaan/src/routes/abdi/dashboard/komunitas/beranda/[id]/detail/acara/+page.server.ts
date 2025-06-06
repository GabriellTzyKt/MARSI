import { fail, type Actions } from "@sveltejs/kit";
import { z } from "zod";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ fetch, params, depends }) => {
    // Add a dependency that can be invalidated
    depends('organisasi:acara');

    try {
        // Get the current organization ID from params
        const currentOrgId = params.id;
        console.log("Current organization ID:", currentOrgId);

        // Fetch current organization details
        const organisasiResponse = await fetch(`${env.URL_KERAJAAN}/komunitas/${currentOrgId}`, {
            cache: 'no-store'
        });

        if (!organisasiResponse.ok) {
            throw error(organisasiResponse.status, `Failed to fetch organisasi: ${organisasiResponse.statusText}`);
        }

        const currentOrganisasi = await organisasiResponse.json();
        console.log("Current organization:", currentOrganisasi);

        // Directly fetch events for the current organization using the correct API endpoint
        const acaraResponse = await fetch(`${env.URL_KERAJAAN}/acara/komunitas/${currentOrgId}?limit=200`, {
            cache: 'no-store'
        });

        if (!acaraResponse.ok) {
            console.error(`Failed to fetch acara for organization ${currentOrgId}: ${acaraResponse.statusText}`);
            throw error(acaraResponse.status, `Failed to fetch acara: ${acaraResponse.statusText}`);
        }

        const acaraData = await acaraResponse.json();
        console.log(`Events for organization ${currentOrgId}:`, acaraData);

        const filteredAcara = Array.isArray(acaraData)
            ? acaraData.filter((item: any) =>
                item.Acara.deleted_at === "0001-01-01T00:00:00Z" || item.Acara.deleted_at == null
            )
            : [];

        const usersResponse = await fetch(`${env.BASE_URL}/users?limit=2000`, {
            cache: 'no-store'
        });
        let users = [];
        if (usersResponse.ok) {
            users = await usersResponse.json();
        }

        console.log("Acara data : ", acaraData)


        // Add organization info to each acara without processing photos
        const processedAcara = filteredAcara.map((acara: any) => {
            // Cari user dengan id sama
            const user = users.find((u: any) => u.id_user == acara.Acara.id_penanggung_jawab);
            return {
                ...acara,
                organisasi_id: currentOrgId,
                organisasi_nama: currentOrganisasi.nama_komunitas || 'Unknown Organization',
                nama_penanggung_jawab: user ? user.nama_lengkap : 'Tidak diketahui'
            };
        });

        console.log("Processed acara : ", processedAcara)

        // Fetch all organizations for reference (if needed)
        const allOrganisasiResponse = await fetch(`${env.URL_KERAJAAN}/organisasi`, {
            cache: 'no-store'
        });

        let organisasiList = [];
        if (allOrganisasiResponse.ok) {
            organisasiList = await allOrganisasiResponse.json();
        }

        return {
            organisasi: currentOrganisasi,
            acaraList: processedAcara,
            organisasiList: organisasiList,
            id_org: params.id
        };
    } catch (err) {
        console.error("Error in load function:", err);
        throw err;
    }
};

export let actions: Actions = {
    hapusAcara: async ({ request }) => {
        let data = await request.formData()
        console.log(data)
        let id = data.get("id_acara")
        //   console.log("Deleting acara with ID:", id);
        try {
            let res = await fetch(`${env.URL_KERAJAAN}/acara/detail/${id}`, {
                method: "GET"
            })
            if (!res.ok) {
                console.error(`Failed to find event: ${res.status}`);
                return fail(404, { error: "Acara tidak ditemukan" });
            }

            let eventData = await res.json()
            console.log(eventData)

            let delres = await fetch(`${env.URL_KERAJAAN}/acara/${id}`, {
                method: "DELETE",

                // body: JSON.stringify(formattedEvents)
            })
            if (!delres.ok) {
                let errorData = await delres.json().catch(() => ({}));
                console.error("Delete failed:", delres.status, errorData);
                return fail(delres.status, {
                    error: errorData.message || `Gagal menghapus acara (${delres.status})`
                });
            }
            let successData = await delres.json().catch(() => ({ message: "Success" }));
            console.log("Delete successful:", successData);


            // Return success with the updated data
            return {
                success: true,
                message: "Acara berhasil dihapus"
            };
        }
        catch (error) {

        }
        console.log(id)
    }
};
