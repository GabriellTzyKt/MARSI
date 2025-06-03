import { fail, type Actions } from "@sveltejs/kit";
import { z } from "zod";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({fetch, params, depends}) => {
    // Add a dependency that can be invalidated
    depends('komunitas:acara');
    
    try {
        // Get the current komunitas ID from params
        const currentKomId = params.id;
        console.log("Current komunitas ID:", currentKomId);
        
        // Fetch all data in parallel using Promise.all
        const [komunitasResponse, acaraResponse, allKomunitasResponse] = await Promise.all([
            fetch(`${env.URL_KERAJAAN}/komunitas/${currentKomId}`, { cache: 'no-store' }),
            fetch(`${env.URL_KERAJAAN}/acara/komunitas/${currentKomId}`, { cache: 'no-store' }),
            fetch(`${env.URL_KERAJAAN}/komunitas`, { cache: 'no-store' })
        ]);
        
        // Handle komunitas response
        if (!komunitasResponse.ok) {
            throw error(komunitasResponse.status, `Failed to fetch komunitas: ${komunitasResponse.statusText}`);
        }
        const currentKomunitas = await komunitasResponse.json();
        
        // Handle acara response
        if (!acaraResponse.ok) {
            throw error(acaraResponse.status, `Failed to fetch acara: ${acaraResponse.statusText}`);
        }
        const acaraNestedData = await acaraResponse.json();
        
        // Fetch user profiles
        const userProfileRes = await fetch(`${env.BASE_URL}/users?limit=2000`, { cache: 'no-store' });
        let userProfiles: any[] = [];
        if (userProfileRes.ok) {
            const allProfiles = await userProfileRes.json();
            userProfiles = Array.isArray(allProfiles)
                ? allProfiles.filter(
                    (user: any) =>
                        user.deleted_at === null ||
                        user.deleted_at === "0001-01-01T00:00:00Z"
                )
                : [];
        }
        console.log("user : ", userProfiles)

        // Process acara data - extract from nested structure and attach penanggung jawab profile
        const processedAcara = acaraNestedData.map((item: any) => {
            let acaraObj = item.Acara ? item.Acara : item;
            // Cari user profile yang id-nya sama dengan id_penanggung_jawab
            const penanggungJawab = userProfiles.find(
                (user: any) => Number(user.id_user) === Number(acaraObj.id_penanggung_jawab)
            );
            return {
                ...acaraObj,
                id_komunitas: item.id_komunitas ?? currentKomId,
                komunitas_nama: currentKomunitas.nama_komunitas || 'Unknown Komunitas',
                penanggung_jawab_profile: penanggungJawab.nama_lengkap || null
            };
        });
        
        console.log("[Processed : ", processedAcara)

        // Handle all komunitas response
        let komunitasList = [];
        if (allKomunitasResponse.ok) {
            komunitasList = await allKomunitasResponse.json();
        }

        return {
            komunitas: currentKomunitas,
            allAcara: processedAcara,
            komunitasList: komunitasList
        };
    } catch (err) {
        console.error("Error in load function:", err);
        throw err;
    }
};
