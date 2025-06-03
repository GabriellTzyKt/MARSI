import { env } from "$env/dynamic/private";
import Table from "$lib/table/Table.svelte";
import { z } from "zod";
import type { Actions, PageServerLoad } from "./$types";
import { schema } from "./schema";
import { fail } from "@sveltejs/kit";
import pLimit from 'p-limit';




export const load: PageServerLoad = async ({ fetch }) => {
    try {
        // Fetch both endpoints in parallel
        const [kerajaanResponse, jenisKerajaanResponse, gelarResponse] = await Promise.all([
            fetch(env.PUB_PORT + "/kerajaan?limit=200", {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            }),
            fetch(env.PUB_PORT + "/kerajaan/jenis?limit=200", {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            }),
            fetch(env.PUB_PORT + "/gelar?limit=200", {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            })
        ]);

        // Check if both requests were successful
        if (!kerajaanResponse.ok || !jenisKerajaanResponse.ok) {
            throw new Error("Failed to fetch data");
        }

        // Parse the JSON responses
        const kerajaanData = await kerajaanResponse.json();
        const jenisKerajaanData = await jenisKerajaanResponse.json();
        const gelarData = await gelarResponse.json();

        const filteredGelarData = gelarData.filter((item: any) => item.deleted_at === "0001-01-01T00:00:00Z")

        const filteredKerajaanData = kerajaanData.filter((item: any) => item.deleted_at === "0001-01-01T00:00:00Z");


        const formatDate = (iso: string) => {
            const date = new Date(iso);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        };

        // Create a map of jenis_kerajaan IDs for quick lookup
        const jenisKerajaanMap = new Map();
        jenisKerajaanData.forEach((jenis: any) => {
            jenisKerajaanMap.set(jenis.id_jenis_kerajaan, jenis);
        });

        // Format kerajaan data and add jenis_kerajaan name directly
        const kerajaanFormatted = await Promise.all(filteredKerajaanData.map(async (item: any) => {
            const jenisDetail = jenisKerajaanMap.get(item.jenis_kerajaan);

            // Helper untuk ambil url file dari id dokumen
            async function getFileUrlFromDocId(docId: string) {
                if (!docId) return null;
                // Ambil data dokumen
                const docRes = await fetch(env.PUB_PORT + `/doc/${docId}`, {
                    method: "GET",
                    headers: { "Accept": "application/json" }
                });
                if (!docRes.ok) {
                    console.log("Doc not found for id:", docId);
                    return null;
                }
                const docData = await docRes.json();
                const fileDok = docData.file_dokumentasi;
                if (!fileDok) {
                    console.log("No file_dokumentasi for doc id:", docId);
                    return null;
                }
                // Return url endpoint file, tidak perlu fetch lagi
                return `${env.PUB_PORT}/file?file_path=${encodeURIComponent(fileDok)}`;
            }

            // Cek dan ambil url bendera
            let url_bendera = null;
            if (item.bendera_kerajaan && typeof item.bendera_kerajaan === "string" && !item.bendera_kerajaan.startsWith("http")) {
                const idBendera = item.bendera_kerajaan.trim();
                console.log("Fetch bendera id:", idBendera);
                url_bendera = await getFileUrlFromDocId(idBendera);
                console.log("Result url_bendera:", url_bendera);
            }

            // Cek dan ambil url lambang
            let url_lambang = null;
            if (item.lambang_kerajaan && typeof item.lambang_kerajaan === "string" && !item.lambang_kerajaan.startsWith("http")) {
                const idLambang = item.lambang_kerajaan.trim();
                console.log("Fetch lambang id:", idLambang);
                url_lambang = await getFileUrlFromDocId(idLambang);
                console.log("Result url_lambang:", url_lambang);
            }

            return {
                ...item,
                tanggal_berdiri: formatDate(item.tanggal_berdiri),
                tanggal_berakhir:
                    item.tanggal_berakhir !== '0001-01-01T00:00:00Z'
                        ? formatDate(item.tanggal_berakhir)
                        : '-',
                jenis_kerajaan_nama: jenisDetail ? jenisDetail.nama_jenis_kerajaan : '-',
                url_bendera_kerajaan: url_bendera,
                url_lambang_kerajaan: url_lambang
            };
        }));

        const limit = pLimit(5);

        const anggotaPromises = kerajaanFormatted.map((kerajaan: any) =>
            limit(() => {
                return fetch(env.PUB_PORT + `/kerajaan/anggota/${kerajaan.id_kerajaan}`, {
                    method: "GET",
                    headers: {
                        "Accept": "application/json"
                    }
                })
                    .then((response: any) => {
                        if (!response.ok) {
                            console.error(`Failed to fetch anggota for kerajaan ${kerajaan.id_kerajaan}`);
                            return { id_kerajaan: kerajaan.id_kerajaan, anggota: [] };
                        }
                        return response.json().then((anggotaData: any) => {
                            // Filter out deleted anggota
                            const filteredAnggota = Array.isArray(anggotaData)
                                ? anggotaData.filter((anggota: any) =>
                                    anggota.deleted_at === '0001-01-01T00:00:00Z' || !anggota.deleted_at)
                                : [];

                            return {
                                id_kerajaan: kerajaan.id_kerajaan,
                                nama_kerajaan: kerajaan.nama_kerajaan,
                                anggota: filteredAnggota
                            };
                        });
                    })
                    .catch(error => {
                        console.error(`Error fetching anggota for kerajaan ${kerajaan.id_kerajaan}:`, error);
                        return { id_kerajaan: kerajaan.id_kerajaan, anggota: [] };
                    });
            })
        );

        // Wait for all anggota fetches to complete
        const anggotaResults = await Promise.all(anggotaPromises);

        return {
            dataKerajaan: kerajaanFormatted,
            jenisKerajaan: jenisKerajaanData,
            gelar: filteredGelarData,
            anggotaKerajaan: anggotaResults
        };
    }
    catch (e) {
        if (e instanceof Error) console.log(e.message);
        return {
            dataKerajaan: "Failed",
            jenisKerajaan: [],
            anggotaKerajaan: []
        };
    }
};

export const actions: Actions = {
    tambahKerajaan: async ({ request }) => {
        const data = await request.formData()
        const entry = Object.fromEntries(data)
        console.log("DATA ANGGOTA : ", data)
        const verif = schema.safeParse(entry)
        if (!verif.success) {
            console.log(verif.error.flatten().fieldErrors)
            return fail(418, { errors: verif.error.flatten().fieldErrors, success: false, entry })
        }

        try {
            const response = await fetch(env.PUB_PORT + "/kerajaan/anggota", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id_kerajaan: Number(entry.id_kerajaan),
                    id_gelar: Number(entry.gelar_anggota),
                    nama_anggota: entry.nama_lengkap_anggota,
                    posisi: entry.posisi_anggota
                })
            });

            const result = await response.json();
            console.log("API Response:", result);

            if (!response.ok) {
                return fail(response.status, {
                    errors: { api: [`Error: ${response.status} - ${result.message || "Terjadi kesalahan"}`] },
                    success: false,
                    entry
                });
            }

            return { errors: "No Error", success: true }
        } catch (error) {
            console.error("API Error:", error);
            return fail(500, {
                errors: { api: ["Terjadi kesalahan saat menghubungi server"] },
                success: false,
                entry
            });
        }
    },
    ubahAnggota: async ({ request }) => {
        const data = await request.formData().then((v) => Object.fromEntries(v))
        console.log("Data anggota : ", data)

        const verif = schema.safeParse(data)
        if (!verif.success) {
            console.log(verif.error.flatten().fieldErrors)
            return fail(418, { errors: verif.error.flatten().fieldErrors, success: false, data })
        }

        try {
            // Membuat request ke API untuk mengubah data anggota
            const response = await fetch(env.PUB_PORT + "/kerajaan/anggota", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id_keanggotaan: Number(data.id_keanggotaan),
                    id_kerajaan: Number(data.id_kerajaan2),
                    id_gelar: Number(data.gelar_anggota),
                    nama_anggota: data.nama_lengkap_anggota,
                    posisi: data.posisi_anggota
                })
            });

            const result = await response.json();
            console.log("API Response:", result);

            if (!response.ok) {
                return fail(response.status, {
                    errors: { api: [`Error: ${response.status} - ${result.message || "Terjadi kesalahan"}`] },
                    success: false,
                    data
                });
            }

            return { errors: "No Error", success: true }
        } catch (error) {
            console.error("API Error:", error);
            return fail(500, {
                errors: { api: ["Terjadi kesalahan saat menghubungi server"] },
                success: false,
                data
            });
        }
    },

    hapusAnggota: async ({ request }) => {
        const data = await request.formData();
        const id_keanggotaan = Number(data.get("id_keanggotaan"));

        console.log("Menghapus anggota dengan ID:", id_keanggotaan);

        if (!id_keanggotaan) {
            return fail(400, {
                errors: { api: ["ID keanggotaan tidak ditemukan"] },
                success: false
            });
        }

        try {
            // Membuat request ke API untuk menghapus data anggota
            const response = await fetch(`${env.PUB_PORT}/kerajaan/anggota/${id_keanggotaan}`, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json"
                }
            });

            console.log("Ay")

            // Jika response tidak OK, kembalikan error
            if (!response.ok) {
                let errorMessage = "Terjadi kesalahan saat menghapus anggota";
                console.log(errorMessage)

                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    // Jika tidak bisa parse JSON, gunakan pesan default
                }

                return fail(response.status, {
                    errors: { api: [`Error: ${response.status} - ${errorMessage}`] },
                    success: false
                });
            }
            console.log("berhasil")

            return { success: true, message: "Anggota berhasil dihapus" };
        } catch (error) {
            console.error("API Error:", error);
            return fail(500, {
                errors: { api: ["Terjadi kesalahan saat menghubungi server"] },
                success: false
            });
        }
    }
};
