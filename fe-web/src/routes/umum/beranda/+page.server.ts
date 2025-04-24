import { env } from "$env/dynamic/private";
import { data_flipcard } from "$lib/dummy";
import type { Actions } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";
import { schema } from "../../admin/keanggotaan/daftaranggota/schema";
import type { PageServerLoad } from "./$types";

export const ssr = false;

function getRandomIDs(count: number, max: number): number[] {
    let ids = new Set<number>();
    while (ids.size < count) {
        ids.add(Math.floor(Math.random() * max) + 1);
    }
    return Array.from(ids);
}

export const load: PageServerLoad = async () => {
    try {
        // First fetch to get all kerajaan data
        const request = await fetch(`${env.PUB_PORT}/kerajaan?limit=200`, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });
        
        if (request.ok) {
            const data = await request.json();
            // console.log("ini dari beranda: ", data)
            
            // Format dates and extract place names
            const kerajaanFormatted = await Promise.all(data.map(async (item: any) => {
                const formatDate = (iso: string) => {
                    const date = new Date(iso);
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
                    return `${day}-${month}-${year}`;
                };
                
                const extractPlaceName = (address: string) => {
                    const regions = ['sulawesi', 'bali', 'sumatera', 'papua', 'jawa', 'kalimantan', 
                                    'maluku', 'nusa tenggara', 'jakarta', 'yogyakarta'];
                    
                    const addressLower = address.toLowerCase();
                    // console.log("address : ", addressLower)
                    for (const region of regions) {
                        if (addressLower.includes(region)) {
                            // kalo ada ambil huruf pertama, dibuat kapital + ngambil sisanya
                            return region.charAt(0).toUpperCase() + region.slice(1);
                        }
                    }
                    return address; 
                };
                
                let latitude = null;
                let longitude = null;
                
                if (item.id_lokasi) {
                    try {
                        const locResponse = await fetch(`${env.PUB_PORT}/loc/${item.id_lokasi}`, {
                            method: "GET",
                            headers: {
                                "Accept": "application/json"
                            }
                        });
                        
                        if (locResponse.ok) {
                            const locData = await locResponse.json();
                            latitude = locData.latitude;
                            longitude = locData.longitude;
                        }
                    } catch (locError) {
                        console.error(`Error fetching location for id ${item.id_lokasi}:`, locError);
                    }
                }
                
                return {
                    ...item,
                    tanggal_berdiri: formatDate(item.tanggal_berdiri),
                    tanggal_berakhir: item.tanggal_berakhir !== '0001-01-01T00:00:00Z'
                        ? formatDate(item.tanggal_berakhir)
                        : '-',
                    place_name: extractPlaceName(item.alamat_kerajaan || ''),
                    latitude,
                    longitude
                };
            }));
            
            console.log("ini dari beranda 1: ", kerajaanFormatted);
            return { dataKerajaan: kerajaanFormatted };
        }
        else return { dataKerajaan: "Failed" };
    }
    catch (e) {
        if (e instanceof Error) console.error(e.message);
        return { dataKerajaan: "Failed", error: e instanceof Error ? e.message : "Unknown error" };
    }
};




export const actions: Actions = {
    refresh: async ({ request }) => {

        console.log("Data flipcard:", data_flipcard);

        let randomIDs = getRandomIDs(3, data_flipcard.length);

        console.log("ID : ", randomIDs)

        let selectedFlip = data_flipcard.filter(item => randomIDs.includes(item.id));

        console.log("Final Data yang Dikirim:", { selectedFlip });
        return { selectedFlip };
    },
}
