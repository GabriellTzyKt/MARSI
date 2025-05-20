import SuccessModal from "$lib/modal/SuccessModal.svelte";
import { error, fail, type Actions } from "@sveltejs/kit";
import { number, z } from "zod";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";

export let load: PageServerLoad = async ({ params, cookies }) => {
    let token = cookies.get("userSession")? JSON.parse(cookies.get("userSession") as string): ''
      try {
        // Fetch situs data by ID
          let situsRes = await fetch(`${env.URL_KERAJAAN}/situs/${params.id}`);
          let userRes = await fetch(`${env.PUB_PORT}/users`, {
              headers: {
                  "Authorization": `Bearer ${token?.token}`
              }
          });
        if (!situsRes.ok) {
            throw error(situsRes.status, `Failed to fetch situs: ${situsRes.statusText}`);
          }
          if(!userRes.ok){
            throw error(userRes.status, `Failed to fetch user: ${userRes.statusText}`);
          }
          let userData = await userRes.json()
          let situsData = await situsRes.json()
          
        // Fetch situs types for dropdown
        let situsTypesRes = await fetch(`${env.URL_KERAJAAN}/situs/jenis`);
        if (!situsTypesRes.ok) {
            console.error(`Failed to fetch situs types: ${situsTypesRes.statusText}`);
        }
        let situsTypes = await situsTypesRes.json();
        
        // Fetch users for pembina, pelindung, and juru kunci dropdowns
          console.log("situs data:", situsData);
          let final = userData.filter((item: any) => item && (item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at));
       
        
        // Process image URLs if foto_situs is available
        let imageUrls = [];
        let fileDetails = [];
        if (situsData.foto_situs && situsData.foto_situs.trim() !== '') {
            try {
                let docIds = situsData.foto_situs.split(',').map(id => id.trim());
                
                for (let docId of docIds) {
                    if (!docId) continue;
                    
                    let docRes = await fetch(`${env.URL_KERAJAAN}/doc/${docId}`);
                    
                    if (docRes.ok) {
                        let docData = await docRes.json();
                        
                        if (docData.file_dokumentasi) {
                            let imageUrl = `${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(docData.file_dokumentasi)}`;
                            imageUrls.push(imageUrl);
                            fileDetails.push({
                                id: docId,
                                url: imageUrl,
                                name: docData.nama_file || 'Unnamed file'
                            });
                        }
                    } else {
                        console.error(`Failed to fetch document ${docId}: ${docRes.statusText}`);
                    }
                }
            } catch (error) {
                console.error("Error processing image URLs:", error);
            }
        }
        situsTypes = situsTypes.filter((item: any) => item && (item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at));
        console.log("Situs TYPES", situsTypes)
        // Fetch user data for pembina, pelindung, and juru_kunci if available
        // let [pembina, pelindung, juruKunci] = await Promise.all([
        //     fetchUserData(situsData.pembina),
        //     fetchUserData(situsData.pelindung),
        //     fetchUserData(situsData.juru_kunci)
        // ]);
        
        return { 
            situs: {
                ...situsData,
                imageUrls,
                fileDetails,
                // pembina,
                // pelindung,
                // juruKunci
            },
            situsTypes: situsTypes.map((item: any) => ({
                id: item.id_jenis_situs,
                name: item.jenis_situs || 'Nama tidak tersedia',
            })) || [],
            users: final.map((user: any) => ({
                id: user.id_user,
                name: user.nama_lengkap || 'Nama tidak tersedia',
                email: user.email || 'Email tidak tersedia'
            })) || []
        };
    } catch (err) {
        console.error("Error in load function:", err);
        throw error(500, "Failed to load situs details for editing");
    }
};
async function fetchUserData(userId: number | string) {
    if (!userId || userId === '0') return null;
    
    try {
        let response = await fetch(`${env.URL_KERAJAAN}/user/${userId}`);
        
        if (response.ok) {
            return await response.json();
        }
        console.error(`Failed to fetch user ${userId}: ${response.statusText}`);
        return null;
    } catch (error) {
        console.error(`Error fetching user ${userId}:`, error);
        return null;
    }
}
export let actions: Actions = {
    editSitus: async ({request}) => {
        let data = await request.formData()
        console.log(data)
        let ver = z.object({
            nama_situs:
                z.string({ message: "Field Nama Situs harus diisi" })
                    .nonempty("Field Ini tidak boleh kosong"),
            
            alamat:
                z.string({ message: "Field Alamat harus diisi" })
                    .nonempty("Field Ini tidak boleh kosong"),
            
            latitude: z.string().optional(),
            longitude: z.string().optional(),
            
            phone:
                z.string({ message: "Field Nomer Telepon harus diisi" })
                    .min(10, "Nomer Telepon Minimal 10 digit")
                    .max(13, "Nomer Telepon Maximal 13 digit")
                    .regex(/^\d+$/, "Input Harus Berupa Angka / Digit"),
            
            kepemilikan:
                z.string({ message: "Field Kepemilikan harus diisi" })
                    .nonempty("Field Ini tidak boleh kosong"),
            
            deskripsi_situs:
                z.string({ message: "Field Deskripsi Situs harus diisi" })
                    .nonempty("Field Ini tidak boleh kosong"),
            
            juru_kunci:
                z.string({ message: "Field Juru Kunci harus diisi" })
                    .nonempty("Field Ini tidak boleh kosong"),
            
            dibangun_oleh:
                z.string({ message: "Field Dibangun Oleh harus diisi" })
                    .nonempty("Field Ini tidak boleh kosong"),
            
            tahun_berdiri:
                z.string({ message: "Field Tahun Beridir harus diisi" })
                    .nonempty("Field Ini tidak boleh kosong")
                    .regex(/^\d+$/, "Input Harus Berupa Angka / Digit"),
            
            pembina:
                z.string({ message: "Field Pembina harus diisi" })
                    .nonempty("Field Ini tidak boleh kosong"),
            
            pelindung:
                z.string({ message: "Field Pelindung harus diisi" })
                    .nonempty("Field Ini tidak boleh kosong"),
            
            jenis_situs:
                z.string({ message: "Field Jenis Situs harus diisi" })
                    .nonempty("Field Ini tidak boleh kosong"),
            
            jam_buka:
                z.string({ message: "Field Jam Buka harus diisi" })
                    .nonempty("Field Ini tidak boleh kosong"),
            
            jam_tutup:
                z.string({ message: "Field Jam Tutup harus diisi" })
                    .nonempty("Field Ini tidak boleh kosong"),
            
            jumlah_anggota:
                z.string({ message: "Field Jumlah Anggota harus diisi" })
                    .nonempty("Field Ini tidak boleh kosong")
                    .regex(/^\d+$/, "Input Harus Berupa Angka / Digit")
                    .transform(val => Number(val))
                    .pipe(z.number().min(1, "minimal 1 anggota")),
                    
            wisata:
                z.string({ message: "Field Wisata harus diisi" })
                    .nonempty("Field Ini tidak boleh kosong")
        })
         let formData = {
            nama_situs: String(data.get("nama_situs")),
            alamat: String(data.get("alamat")),
            latitude: String(data.get("latitude")),
            longitude: String(data.get("longitude")),
            phone: String(data.get("phone")),
            kepemilikan: String(data.get("kepemilikan")),
            deskripsi_situs: String(data.get("deskripsi_situs")),
            juru_kunci: String(data.get("juru_kunci")),
            dibangun_oleh: String(data.get("dibangun_oleh")),
            tahun_berdiri: String(data.get("tahun_berdiri")),
            pembina: String(data.get("pembina")),
            pelindung: String(data.get("pelindung")),
            jenis_situs: String(data.get("jenis_situs")),
            jam_buka: String(data.get("jam_buka")),
            jam_tutup: String(data.get("jam_tutup")),
            jumlah_anggota: String(data.get("jumlah_anggota")),
            wisata: String(data.get("wisata"))
        }
        let verification = ver.safeParse({ ...formData })
        
        if (!verification.success) {
            return fail(418, {
                errors: verification.error.flatten().fieldErrors, success: false, formData
            })
        }
        return { success: true, formData}
    }
};
