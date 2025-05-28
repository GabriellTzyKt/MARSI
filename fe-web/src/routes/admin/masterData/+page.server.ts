import { addAPIProvider } from "@iconify/svelte";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";
import { error, fail, type Actions } from "@sveltejs/kit";
import { number, z } from "zod";
import { invalidate, invalidateAll } from "$app/navigation";
import { filter } from "d3";
import pLimit from "p-limit";

export const load: PageServerLoad = async () => {
    try {
        // Membatasi maksimal 2 request paralel
        const limit = pLimit(2);

        // Fungsi fetch dengan penanganan error
        const fetchData = async (url: string) => {
            try {
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Accept": "application/json"
                    },
                    // Timeout 15 detik
                    signal: AbortSignal.timeout(15000)
                });

                if (response.ok) {
                    return await response.json();
                } else {
                    console.error(`Error fetching ${url}: ${response.status}`);
                    return [];
                }
            } catch (error) {
                console.error(`Failed to fetch ${url}:`, error);
                return [];
            }
        };

        // Menggunakan p-limit untuk membatasi request paralel
        const [dataArsip, dataGelar, dataJenisKerajaan, dataEra, dataRumpun] = await Promise.all([
            limit(() => fetchData(`${env.PUB_PORT}/jenis-arsip`).then(data =>
                Array.isArray(data) ? data.filter((item: any) => item.deleted_at === "0001-01-01T00:00:00Z") : []
            )),
            limit(() => fetchData(`${env.PUB_PORT}/gelar?limit=200`).then(data =>
                Array.isArray(data) ? data.filter((item: any) => item.deleted_at === "0001-01-01T00:00:00Z") : []
            )),
            limit(() => fetchData(`${env.PUB_PORT}/kerajaan/jenis?limit=200`).then(data =>
                Array.isArray(data) ? data.filter((item: any) => item.deleted_at === "0001-01-01T00:00:00Z") : []
            )),

            // Fix for era data - include items with null deleted_at
            limit(() => fetchData(`${env.PUB_PORT}/era?limit=200`).then(data => {
                console.log("Raw era data:", data);
                return Array.isArray(data)
                    ? data.filter((item: any) => item.deleted_at === null || item.deleted_at === "0001-01-01T00:00:00Z")
                    : [];
            })),

            limit(() => fetchData(`${env.PUB_PORT}/rumpun?limit=200`).then(data => {
                return Array.isArray(data)
                    ? data.filter((item: any) => item.deleted_at === null || item.deleted_at === "0001-01-01T00:00:00Z")
                    : [];
            })),
        ]);

        console.log("Filtered era data:", dataEra);

        return {
            dataArsip,
            dataGelar,
            dataJenisKerajaan,
            dataEra,
            dataRumpun
        };
    } catch (error) {
        console.log("Load function error:", error);
        return {
            dataArsip: [],
            dataGelar: [],
            dataJenisKerajaan: []
        };
    }
};


export const actions: Actions = {
    tambah: async ({ request }) => {
        const data = await request.formData();
        const res = data.getAll("nama_jenis")
        const ver =
            // Schema untuk array tanpa string kosong
            z.array(z.string()).transform(arr => arr.filter(str => str !== ''))


        const form = {
            nama_jenis: {},
        };
        const validation = ver.parse(res);

        console.log(validation)
        try {
            if (validation.length === 0) {
                return fail(406, { errors: "No Data" });
            }
            for (const nama of validation) {
                const payload = { nama_jenis: nama };
                console.log(payload)

                const submit = await fetch(`${env.PUB_PORT}/jenis-arsip`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" }, // Tambahkan header
                    body: JSON.stringify(payload),
                });

                if (!submit.ok) {
                    const m = await submit.json();
                    return fail(406, { errors: `Error ${submit.status}: ${m.message}` });
                }

            }
        }

        catch (error) {

        }


        return { errors: "Success", success: true, formData: form, type: "add" };
    },
    hapus: async ({ request }) => {
        const data = await request.formData()
        try {
            const del = await fetch(`${env.PUB_PORT}/jenis-arsip/${data.get("id_jenis_arsip")}`, {
                method: "DELETE"
            })
            if (!del.ok) {
                const m = await del.json()
                return fail(406, { error: `Code ${del.status} Message: ${m.message}` })
            }
            return { error: "no error" }
        }
        catch (error) {

        }
    },
    ubah: async ({ request }) => {
        try {
            const req = await request.formData()
            const data = Object.fromEntries(req)
            const ver = z.object({
                id_jenis_arsip: z.string().nullable(),
                nama_jenis: z.string().nonempty("Field Ini Tidak Boleh Kosong")
            });
            console.log(data);

            const verification = ver.safeParse(data)
            if (!verification.success) {
                return fail(406, { error: verification.error.flatten().fieldErrors })
            }
            const obj = {
                id_jenis_arsip: Number(data.id_jenis_arsip),
                nama_jenis: data.nama_jenis
            }
            console.log(JSON.stringify(obj));

            const edit = await fetch(`${env.PUB_PORT}/jenis-arsip`, {
                method: "PUT",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(obj),
            })
            if (!edit.ok) {
                const m = await edit.json()
                return fail(406, { error: `Error ${edit.status} Message : ${m.message}` })
            }
            return { error: "No Error" }
        }
        catch (error) {
            console.log(error)
        }
    },


    tambahKerajaan: async ({ request }) => {
        const data = await request.formData();
        const res = data.getAll("nama_jenis")
        console.log("res : ", res)
        const ver =
            // Schema untuk array tanpa string kosong
            z.array(z.string()).transform(arr => arr.filter(str => str !== ''))


        const form = {
            nama_jenis: {},
        };
        const validation = ver.parse(res);

        console.log(validation)
        try {
            if (validation.length === 0) {
                return fail(406, { errors: "No Data" });
            }
            for (const nama of validation) {
                const payload = { nama_jenis: nama };
                console.log("nama : ", payload)

                const submit = await fetch(`${env.PUB_PORT}/kerajaan/jenis`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                if (!submit.ok) {
                    const m = await submit.json();
                    return fail(406, { errors: `Error ${submit.status}: ${m.message}` });
                }

            }
        }
        catch (error) {
            console.error("Error adding jenis kerajaan:", error);
            return fail(500, { errors: "Server error when adding jenis kerajaan" });
        }

        return { errors: "Success", success: true, formData: form, type: "add" };
    },

    ubahKerajaan: async ({ request }) => {
        try {
            const req = await request.formData()
            const data = Object.fromEntries(req)
            console.log("Data : ", data)
            const ver = z.object({
                id_jenis_kerajaan: z.string().nullable(),
                nama_jenis_kerajaan: z.string().nonempty("Field Ini Tidak Boleh Kosong")
            });
            console.log(data);

            const verification = ver.safeParse(data)
            if (!verification.success) {
                return fail(406, { error: verification.error.flatten().fieldErrors })
            }
            const obj = {
                id_jenis: Number(data.id_jenis_kerajaan),
                nama_jenis: data.nama_jenis_kerajaan
            }
            console.log(JSON.stringify(obj));

            const edit = await fetch(`${env.PUB_PORT}/kerajaan/jenis`, {
                method: "PUT",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(obj),
            })
            if (!edit.ok) {
                const m = await edit.json()
                return fail(406, { error: `Error ${edit.status} Message : ${m.message}` })
            }
            return { error: "No Error" }
        }
        catch (error) {
            console.log(error)
        }
    },
    hapusKerajaan: async ({ request }) => {
        const data = await request.formData()
        try {
            console.log("ID : ", data.get("id_jenis_kerajaan"))
            console.log("Ya")
            // Menggunakan id_jenis_kerajaan bukan id_jenis_arsip
            const del = await fetch(`${env.PUB_PORT}/kerajaan/jenis/${data.get("id_jenis_kerajaan")}`, {
                method: "DELETE"
            })
            if (!del.ok) {
                const m = await del.json()
                return fail(406, { error: `Code ${del.status} Message: ${m.message}` })
            }
            return { error: "no error" }
        }
        catch (error) {
            console.error("Error deleting jenis kerajaan:", error);
            return fail(500, { error: "Server error when deleting record" });
        }
    },

    tambahGelar: async ({ request }) => {
        const data = await request.formData();
        const namaGelar = data.getAll("nama_gelar");
        const singkatanGelar = data.getAll("singkatan_gelar");

        const ver = z.array(z.string()).transform(arr => arr.filter(str => str !== ''));

        const validation = ver.parse(namaGelar);
        const validationSingkatan = ver.parse(singkatanGelar);

        console.log("Nama Gelar:", validation);
        console.log("Singkatan:", validationSingkatan);

        try {
            if (validation.length === 0) {
                return fail(406, { errors: "No Data" });
            }

            for (let i = 0; i < validation.length; i++) {
                const nama = validation[i];
                const singkatan = i < validationSingkatan.length ? validationSingkatan[i] : '';

                const payload = {
                    nama_gelar: nama,
                    singkatan: singkatan
                };

                console.log("Payload:", payload);

                const submit = await fetch(`${env.PUB_PORT}/gelar`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                if (!submit.ok) {
                    const m = await submit.json();
                    return fail(406, { errors: `Error ${submit.status}: ${m.message}` });
                }
            }

            return { errors: "Success", success: true, type: "add" };
        } catch (error) {
            console.error("Error adding gelar:", error);
            return fail(500, { errors: "Server error" });
        }
    },
    ubahGelar: async ({ request }) => {
        try {
            const req = await request.formData()
            const data = Object.fromEntries(req)
            console.log("Data gelar:", data)

            // Schema validasi untuk gelar
            const ver = z.object({
                id_gelar: z.string().nullable(),
                nama_gelar: z.string().nonempty("Field Nama Gelar Tidak Boleh Kosong"),
                singkatan_gelar: z.string().optional()
            });

            const verification = ver.safeParse(data)
            if (!verification.success) {
                return fail(406, { error: verification.error.flatten().fieldErrors })
            }

            // Format data sesuai dengan API
            const obj = {
                id_gelar: Number(data.id_gelar),
                nama_gelar: data.nama_gelar,
                singkatan: data.singkatan_gelar
            }
            console.log("Payload gelar:", JSON.stringify(obj));

            const edit = await fetch(`${env.PUB_PORT}/gelar`, {
                method: "PUT",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(obj),
            })

            if (!edit.ok) {
                const m = await edit.json()
                return fail(406, { error: `Error ${edit.status} Message: ${m.message}` })
            }

            return { error: "No Error", success: true }
        }
        catch (error) {
            console.error("Error updating gelar:", error)
            return fail(500, { error: "Server error when updating gelar" })
        }
    },
    hapusGelar: async ({ request }) => {
        const data = await request.formData()
        try {
            console.log("ID : ", data.get("id_gelar"))
            console.log("Ya")
            // Menggunakan id_jenis_kerajaan bukan id_jenis_arsip
            const del = await fetch(`${env.PUB_PORT}/gelar/${data.get("id_gelar")}`, {
                method: "DELETE"
            })
            if (!del.ok) {
                const m = await del.json()
                return fail(406, { error: `Code ${del.status} Message: ${m.message}` })
            }
            return { error: "no error" }
        }
        catch (error) {
            console.error("Error deleting jenis kerajaan:", error);
            return fail(500, { error: "Server error when deleting record" });
        }
    },


    ubahEra: async ({ request }) => {
        try {
            const req = await request.formData();
            const data = Object.fromEntries(req);

            const ver = z.object({
                id_era: z.string().nullable(),
                nama_era: z.string().nonempty("Field Ini Tidak Boleh Kosong")
            });

            console.log("Era data:", data);

            const verification = ver.safeParse(data);
            if (!verification.success) {
                return fail(406, { error: verification.error.flatten().fieldErrors });
            }

            const obj = {
                id_era: Number(data.id_era),
                nama_era: data.nama_era
            };

            console.log("Payload era:", JSON.stringify(obj));

            const edit = await fetch(`${env.PUB_PORT}/era`, {
                method: "PUT",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(obj),
            });

            if (!edit.ok) {
                const m = await edit.json();
                return fail(406, { error: `Error ${edit.status} Message: ${m.message}` });
            }

            return { error: "No Error", success: true };
        }
        catch (error) {
            console.error("Error updating era:", error);
            return fail(500, { error: "Server error when updating era" });
        }
    },
    hapusEra: async ({ request }) => {
        const data = await request.formData();
        try {
            console.log("ID Era:", data.get("id_era"));

            const del = await fetch(`${env.PUB_PORT}/era/${data.get("id_era")}`, {
                method: "DELETE"
            });

            if (!del.ok) {
                const m = await del.json();
                return fail(406, { error: `Code ${del.status} Message: ${m.message}` });
            }

            return { error: "no error" };
        }
        catch (error) {
            console.error("Error deleting era:", error);
            return fail(500, { error: "Server error when deleting era" });
        }
    },
    tambahEra: async ({ request }) => {
        const data = await request.formData();
        const res = data.getAll("nama_era");

        // Schema untuk array tanpa string kosong
        const ver = z.array(z.string()).transform(arr => arr.filter(str => str !== ''));

        const validation = ver.parse(res);
        console.log("Era names:", validation);

        try {
            if (validation.length === 0) {
                return fail(406, { errors: "No Data" });
            }

            for (const nama of validation) {
                const payload = { nama_era: nama };
                console.log("Payload:", payload);

                const submit = await fetch(`${env.PUB_PORT}/era`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                if (!submit.ok) {
                    const m = await submit.json();
                    return fail(406, { errors: `Error ${submit.status}: ${m.message}` });
                }
            }

            return { errors: "Success", success: true, type: "add" };
        } catch (error) {
            console.error("Error adding era:", error);
            return fail(500, { errors: "Server error when adding era" });
        }
    },


    tambahRumpun: async ({ request }) => {
        const data = await request.formData();
        const res = data.getAll("nama_rumpun");

        // Schema untuk array tanpa string kosong
        const ver = z.array(z.string()).transform(arr => arr.filter(str => str !== ''));

        const validation = ver.parse(res);
        console.log("Rumpun names:", validation);

        try {
            if (validation.length === 0) {
                return fail(406, { errors: "No Data" });
            }

            for (const nama of validation) {
                const payload = { nama_rumpun: nama };
                console.log("Payload:", payload);

                const submit = await fetch(`${env.PUB_PORT}/rumpun`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                if (!submit.ok) {
                    const m = await submit.json();
                    return fail(406, { errors: `Error ${submit.status}: ${m.message}` });
                }
            }

            return { errors: "Success", success: true, type: "add" };
        } catch (error) {
            console.error("Error adding rumpun:", error);
            return fail(500, { errors: "Server error when adding rumpun" });
        }
    },
    ubahRumpun: async ({ request }) => {
        try {
            const req = await request.formData();
            const data = Object.fromEntries(req);
            console.log(
                "Data " , data
            )

            const ver = z.object({
                id_rumpun: z.string().nullable(),
                nama_rumpun: z.string().nonempty("Field Ini Tidak Boleh Kosong")
            });


            console.log("Era data:", data);

            const verification = ver.safeParse(data);
            if (!verification.success) {
                return fail(406, { error: verification.error.flatten().fieldErrors });
            }

            const obj = {
                id_rumpun: Number(data.id_rumpun),
                nama_rumpun: data.nama_rumpun
            };

            console.log("Payload era:", JSON.stringify(obj));

            const edit = await fetch(`${env.PUB_PORT}/rumpun`, {
                method: "PUT",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(obj),
            });

            if (!edit.ok) {
                const m = await edit.json();
                return fail(406, { error: `Error ${edit.status} Message: ${m.message}` });
            }

            return { error: "No Error", success: true };
        }
        catch (error) {
            console.error("Error updating era:", error);
            return fail(500, { error: "Server error when updating era" });
        }
    },
    hapusRumpun: async ({ request }) => {
        const data = await request.formData();
        try {
            console.log("ID Era:", data.get("id_rumpun"));

            const del = await fetch(`${env.PUB_PORT}/rumpun/${data.get("id_rumpun")}`, {
                method: "DELETE"
            });

            if (!del.ok) {
                const m = await del.json();
                return fail(406, { error: `Code ${del.status} Message: ${m.message}` });
            }

            return { error: "no error" };
        }
        catch (error) {
            console.error("Error deleting era:", error);
            return fail(500, { error: "Server error when deleting era" });
        }
    },
};
