import { env } from "$env/dynamic/private";
import type { PageServerLoad } from "./$types";

// Tambahkan fungsi extractPlaceName
const extractPlaceName = (address: string) => {
    const regions = ['sulawesi', 'bali', 'sumatera', 'papua', 'surabaya','jawa', 
        'kalimantan', 'java', 'indonesia', 'jakarta', 'yogyakarta'];

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

export const load: PageServerLoad = async ({ fetch }) => {
    try {
        // Fetch daftar kerajaan
        const res = await fetch(`${env.BASE_URL}/kerajaan?limit=200`);
        if (!res.ok) {
            throw new Error(`HTTP Error! Status: ${res.status}`);
        }

        const kerajaanData = await res.json();
        console.log("Raw kerajaan data:", kerajaanData);

        // Filter out deleted kerajaan
        const filteredKerajaanData = kerajaanData.filter((kerajaan: any) => {
            return kerajaan.deleted_at === '0001-01-01T00:00:00Z' || kerajaan.deleted_at === null;
        });
        console.log("Filtered kerajaan data count:", filteredKerajaanData.length);

        // Proses data kerajaan untuk menambahkan URL gambar
        const processedKerajaan = await Promise.all(filteredKerajaanData.map(async (kerajaan: any) => {
            // Buat objek baru dengan data kerajaan asli
            const processedItem = { ...kerajaan, imageUrl: '', region: '' };

            // Ekstrak region dari alamat kerajaan jika ada
            if (kerajaan.alamat_kerajaan) {
                processedItem.region = extractPlaceName(kerajaan.alamat_kerajaan);
                console.log(`Extracted region for ${kerajaan.nama_kerajaan}: ${processedItem.region}`);
            }

            // Jika ada foto_umum, ambil ID pertama
            if (kerajaan.foto_umum && kerajaan.foto_umum.trim() !== '') {
                try {
                    // Ambil ID foto pertama (jika ada beberapa dipisahkan koma)
                    const firstPhotoId = kerajaan.foto_umum.split(',')[0].trim();

                    if (firstPhotoId) {
                        console.log(`Fetching document with ID: ${firstPhotoId} for kerajaan ${kerajaan.nama_kerajaan}`);

                        // Ambil file path dari endpoint /doc/{id}
                        const docRes = await fetch(`${env.BASE_URL}/doc/${firstPhotoId}`);

                        if (docRes.ok) {
                            const docData = await docRes.json();
                            console.log(`Document data for ID ${firstPhotoId}:`, docData);

                            // Ekstrak file path dari respons
                            const filePath = docData.file_dokumentasi || docData;

                            if (typeof filePath === 'string') {
                                // Buat URL lengkap ke file
                                processedItem.imageUrl = `${env.BASE_URL}/file?file_path=${encodeURIComponent(filePath)}`;
                                console.log(`Image URL created: ${processedItem.imageUrl}`);
                            }
                        } else {
                            console.error(`Failed to fetch document with ID ${firstPhotoId}: ${docRes.status}`);
                        }
                    }
                } catch (error) {
                    console.error(`Error processing image for kerajaan ${kerajaan.id_kerajaan}:`, error);
                }
            }

            return processedItem;
        }));

        return { detil_kerajaan: processedKerajaan };
    } catch (error) {
        console.error("Error fetching data:", error);
        return { detil_kerajaan: [] };
    }
};
