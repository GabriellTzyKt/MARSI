import { env } from "$env/dynamic/private";
import Table from "$lib/table/Table.svelte";
import {  z } from "zod";
import type { Actions, PageServerLoad } from "./$types";
import { fail } from "@sveltejs/kit";



export const load: PageServerLoad = async ({ parent }) => {
    try {
        const parentData = await parent();
        const id_kerajaan = parentData.id_kerajaan;
        console.log("ID Kerajaan from parent data:", id_kerajaan);

        const request = await fetch(env.PUB_PORT + "/kerajaan?limit=200", {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });
        
        if (request.ok) {
            const data = await request.json();
            
            // Filter data yang tidak dihapus (deleted_at = '0001-01-01T00:00:00Z')
            const filteredData = data.filter((item: any) => 
                item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at
            );
            
            // Format tanggal
            const formatDate = (iso: string) => {
                const date = new Date(iso);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                return `${day}-${month}-${year}`;
            };
            
            // Fungsi untuk ekstrak nama tempat dari alamat
            const extractPlaceName = (address: string) => {
                if (!address) return '';
                
                // Daftar region yang ingin diambil
                const regions = [
                    'sulawesi', 'bali', 'sumatera', 'papua', 'jawa', 'kalimantan', 'java',
                    'maluku', 'nusa tenggara', 'jakarta', 'yogyakarta', 'indonesia'
                ];
                
                const addressLower = address.toLowerCase();
                const extractedRegions = [];
                
                // Cari semua region yang ada dalam alamat
                for (const region of regions) {
                    if (addressLower.includes(region)) {
                        // Ambil huruf pertama, dibuat kapital + ngambil sisanya
                        extractedRegions.push(region.charAt(0).toUpperCase() + region.slice(1));
                    }
                }
                
                // Gabungkan region yang ditemukan dengan koma
                return extractedRegions.join(', ');
            };

            // Proses data kerajaan dan ambil foto untuk setiap kerajaan
            const kerajaanWithImages = await Promise.all(filteredData.map(async (item: any) => {
                const formattedItem = {
                    ...item,
                    tanggal_berdiri: formatDate(item.tanggal_berdiri),
                    tanggal_berakhir:
                        item.tanggal_berakhir !== '0001-01-01T00:00:00Z'
                            ? formatDate(item.tanggal_berakhir)
                            : '-',
                    imageUrl: '',
                    place_name: extractPlaceName(item.alamat_kerajaan || '')
                };
                
                // Jika ada foto_umum, ambil ID pertama
                if (item.foto_umum && item.foto_umum.trim() !== '') {
                    try {
                        const firstPhotoId = item.foto_umum.split(',')[0].trim();
                        
                        if (firstPhotoId) {
                            // Ambil file path dari /doc/(id_dokumen)
                            const docRes = await fetch(`${env.PUB_PORT}/doc/${firstPhotoId}`);
                            
                            if (docRes.ok) {
                                const docData = await docRes.json();
                                const filePath = docData.file_dokumentasi || docData;
                                
                                if (typeof filePath === 'string') {
                                    // Buat URL lengkap ke file
                                    formattedItem.imageUrl = `${env.PUB_PORT}/file?file_path=${encodeURIComponent(filePath)}`;
                                }
                            }
                        }
                    } catch (error) {
                        console.error(`Error processing image for kerajaan ${item.id_kerajaan}:`, error);
                    }
                }
                
                return formattedItem;
            }));
            
            return { dataKerajaan: kerajaanWithImages };
        }
        else return { dataKerajaan: "Failed" };
    }
    catch (e) {
        if (e instanceof Error) return console.log(e.message);
    }
};
