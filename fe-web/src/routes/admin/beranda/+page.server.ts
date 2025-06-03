import { env } from "$env/dynamic/private";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    try {

        // Fetch admin and arsip data in parallel
        const [adminResponse, arsipResponse, kerajaanResponse, jenisResponse, acaraResponse] = await Promise.all([
            fetch(`${env.BASE_URL}/admin?limit=200`, {
                method: "GET",
                headers: { "Accept": "application/json" }
            }),
            fetch(`${env.PUB_PORT}/arsip?limit=200`, {
                method: "GET",
                headers: { "Accept": "application/json" }
            }),
            fetch(`${env.PUB_PORT}/kerajaan?limit=200`, {
                method: "GET",
                headers: { "Accept": "application/json" }
            }),
            fetch(`${env.PUB_PORT}/kerajaan/jenis?limit=200`, {
                method: "GET",
                headers: { "Accept": "application/json" }
            }),
            fetch(`${env.BASE_URL_8008}/acara?limit=200`, {
                method: "GET",
                headers: { "Accept": "application/json" }
            }),
        ]);

        let kerajaanData: any = [];
        if (kerajaanResponse.ok) {
            const rawData = await kerajaanResponse.json();
            kerajaanData = rawData.filter((kerajaan: any) =>
                kerajaan.deleted_at === "0001-01-01T00:00:00Z" || !kerajaan.deleted_at
            );
            console.log("Data kerajaan for dashboard:", kerajaanData);
        } else {
            console.error(`Error fetching arsip data: ${kerajaanResponse.status}`);
        }

        let jenisData: any = [];
        if (jenisResponse.ok) {
            const rawData = await jenisResponse.json();
            jenisData = rawData.filter((jenis: any) =>
                jenis.deleted_at === "0001-01-01T00:00:00Z" || !jenis.deleted_at
            );
            console.log("Data kerajaan for dashboard:", jenisData);
        } else {
            console.error(`Error fetching arsip data: ${jenisResponse.status}`);
        }

        // Process admin response
        let adminData = [];
        if (adminResponse.ok) {
            const rawData = await adminResponse.json();

            // Filter out deleted admins
            const filteredAdmins = rawData.filter((admin: any) =>
                admin.deleted_at === "0001-01-01T00:00:00Z" || !admin.deleted_at
            );

            // Process each admin
            adminData = filteredAdmins.map((admin: any) => {
                // If id_kerajaan is 0, return as is (MARSI)
                if (admin.id_kerajaan === 0) {
                    return {
                        ...admin,
                        kerajaan_nama: "-",
                        jenis_kerajaan_nama: "-"
                    };
                }

                // Find matching kerajaan from kerajaanData
                const matchingKerajaan = kerajaanData.find((k: any) =>
                    k.id_kerajaan === admin.id_kerajaan
                );

                if (matchingKerajaan) {
                    // Find matching jenis from jenisData
                    const matchingJenis = jenisData.find((j: any) =>
                        Number(j.id_jenis_kerajaan) === Number(matchingKerajaan.jenis_kerajaan)
                    );

                    console.log("Jenis data : ", jenisData)
                    console.log("Matchin Kerajaan : ", matchingKerajaan)

                    console.log("OI")

                    return {
                        ...admin,
                        kerajaan_nama: matchingKerajaan.nama_kerajaan || "-",
                        jenis_kerajaan_nama: matchingJenis ? matchingJenis.nama_jenis_kerajaan : "-"
                    };
                }


                // If no matching kerajaan found
                return {
                    ...admin,
                    kerajaan_nama: `Unknown (ID: ${admin.id_kerajaan})`,
                    jenis_kerajaan_nama: "-"
                };
            });

            console.log("Enhanced admin data for dashboard:", adminData);
        } else {
            console.error(`Error fetching admin data: ${adminResponse.status}`);
        }

        let acaraData = [];
        if (acaraResponse.ok) {
            const rawData = await acaraResponse.json();
            acaraData = rawData.filter((acara: any) =>
                acara.deleted_at === "0001-01-01T00:00:00Z" || !acara.deleted_at
            );
            console.log("Acara data for dashboard:", acaraData);
        } else {
            console.error(`Error fetching acara data: ${acaraResponse.status}`);
        }

        // Process arsip response
        let arsipData = [];
        if (arsipResponse.ok) {
            const rawData = await arsipResponse.json();
            arsipData = rawData.filter((arsip: any) =>
                arsip.deleted_at === "0001-01-01T00:00:00Z" || !arsip.deleted_at
            );
            console.log("Arsip data for dashboard:", arsipData);
        } else {
            console.error(`Error fetching arsip data: ${arsipResponse.status}`);
        }

        console.log("Acara data  : ", acaraData)

        return {
            adminData,
            adminCount: adminData.length,
            arsipData,
            arsipCount: arsipData.length,
            kerajaanData,
            kerajaanCount: kerajaanData.length,
            acaraData, 
            acaraCount: acaraData.length
        };
    } catch (error) {
        console.error("Error in beranda load function:", error);
        return {
            adminData: [],
            adminCount: 0,
            arsipData: [],
            arsipCount: 0,
            error: error instanceof Error ? error.message : String(error)
        };
    }
};




















