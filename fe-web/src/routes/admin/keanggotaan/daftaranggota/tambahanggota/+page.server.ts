import { error, fail, type Actions } from "@sveltejs/kit";
import { string, z } from "zod";
import { schema } from "./schema";
import { env } from "$env/dynamic/private";
import { redirect } from "@sveltejs/kit";

export const load = async ({ fetch, cookies }) => {

    const userSession = cookies.get("userSession");
    if (!userSession) {
        throw redirect(302, '/login2');
    }
    const session = JSON.parse(userSession);
    if (!session.adminData || session.adminData.jenis_admin !== 'super admin') {
        throw redirect(302, '/admin/biodata');
    }


    try {
        const [jenisKerajaanResponse, eraResponse, rumpunResponse] = await Promise.all([
            fetch(`${env.PUB_PORT}/kerajaan/jenis?limit=200`, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            }),
            fetch(`${env.PUB_PORT}/era?limit=200`, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            }),
            fetch(`${env.PUB_PORT}/rumpun?limit=200`, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            })
        ]);

        if (!jenisKerajaanResponse.ok || !eraResponse.ok || !rumpunResponse.ok) {
            throw new Error(`HTTP Error! Status: ${jenisKerajaanResponse.status}, ${eraResponse.status}, ${rumpunResponse.status}`);
        }

        const [jenisKerajaan, eraData, rumpunData] = await Promise.all([
            jenisKerajaanResponse.json(),
            eraResponse.json(),
            rumpunResponse.json()
        ]);

        console.log("Jenis kerajaan data:", jenisKerajaan);
        console.log("Era data:", eraData);
        console.log("Rumpun data:", rumpunData);

        // Filter out deleted items
        const filteredJenisKerajaan = Array.isArray(jenisKerajaan)
            ? jenisKerajaan.filter((item) => item.deleted_at === "0001-01-01T00:00:00Z" || !item.deleted_at)
            : [];

        const filteredEra = Array.isArray(eraData)
            ? eraData.filter((item) => item.deleted_at === "0001-01-01T00:00:00Z" || item.deleted_at === null)
            : [];

        const filteredRumpun = Array.isArray(rumpunData)
            ? rumpunData.filter((item) => item.deleted_at === "0001-01-01T00:00:00Z" || item.deleted_at === null)
            : [];

        return {
            jenisKerajaan: filteredJenisKerajaan,
            era: filteredEra,
            rumpun: filteredRumpun
        };
    } catch (e) {
        console.error("Error fetching jenis kerajaan:", e);
        return { jenisKerajaan: [] };
    }
};

export const actions: Actions = {
    tambah: async ({ request }) => {
        const data = await request.formData()
        console.log("data: ", data)
        const res = Object.fromEntries(data)
        console.log("RES: ", res)
        const verif = schema.safeParse(res)

        const nama_kerajaan = data.get('nama_kerajaan')
        const alamat_kerajaan = data.get('alamat_kerajaan')
        const tanggal_berdiri = data.get('tanggal_berdiri')
        const era_kerajaan = data.get('era_kerajaan')
        const rumpun_kerajaan = data.get('rumpun_kerajaan')
        const jenis_kerajaan = data.get('jenis_kerajaan')
        const raja_sekarang = data.get('raja_sekarang')
        const deskripsi_kerajaan = data.get('deskripsi_kerajaan')
        const lat = data.get('lat')
        const long = data.get('long')




        if (!verif.success) {

            return fail(418, { errors: verif.error.flatten().fieldErrors, success: false, form: res })
        }
        try {
            const send = await fetch(env.PUB_PORT + "/kerajaan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    longitude: Number(long),
                    latitude: Number(lat),
                    nama_kerajaan: nama_kerajaan,
                    raja_sekarang: raja_sekarang,
                    jenis_kerajaan: Number(jenis_kerajaan),
                    deskripsi_kerajaan: deskripsi_kerajaan,
                    alamat_kerajaan: alamat_kerajaan,
                    tahun_berdiri: tanggal_berdiri,
                    era: Number(era_kerajaan),
                    rumpun: Number(rumpun_kerajaan),
                })
            })
            const r = await send.json()
            console.log(r)
            if (send.ok) {
                return { errors: "no Error", success: true, form: res }
            }
            return fail(400, { request: `Error Code : ${send.status} ${r.message}` })
        }
        catch (e) {
            console.error("Fetch Error", e)
        }
    }

}
