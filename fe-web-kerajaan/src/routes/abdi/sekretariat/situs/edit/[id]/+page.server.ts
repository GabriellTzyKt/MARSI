import SuccessModal from "$lib/modal/SuccessModal.svelte";
import { error, fail, json, type Actions } from "@sveltejs/kit";
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
        let resWisata = await fetch(`${env.URL_KERAJAAN}/situs/wisata?limit=500`);
        if (!resWisata.ok) {
            throw new Error(`HTTP Error! Status: ${resWisata.status}`);
        }
          let dataWisata = await resWisata.json();
        dataWisata = dataWisata.filter((item: any) => {
            return item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at;
        });
          // Find the wisata data for the current situs
          let wisataData = dataWisata.find((item: any) => item.id_wisata == situsData.id_wisata);
        if (wisataData) {
            situsData.wisata = wisataData.nama_wisata || 'Tidak Tersedia';
            situsData.id_wisata = wisataData.id_wisata || 'Tidak Tersedia';
          }
          console.log("Wisata Data:",   wisataData);
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
            })) || [],
            wisata: dataWisata.map((item: any) => ({
                id: item.id_wisata,
                name: item.nama_wisata || 'Nama tidak tersedia',
                
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
        let profile_picture = data.get("profile_picture") as File;
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
            
            wisata_id:
                z.string({ message: "Field Wisata harus diisi" })
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
                    .nonempty("Field Ini tidak boleh kosong"),
            email:
                z.string({ message: "Field Email harus diisi" })
                    .nonempty("Field Ini tidak boleh kosong").email("Email tidak valid").optional(),
        })

          const formatTimeField = (timeString) => {
        if (!timeString) return '';
        
        // If it's already in HH:MM format, return as is
        if (/^\d{1,2}:\d{2}$/.test(timeString)) {
            // Ensure hours are padded with leading zero if needed
            const [hours, minutes] = timeString.split(':');
            return `${hours.padStart(2, '0')}:${minutes}`;
        }
        
        // If it's a Date object or timestamp, convert to HH:MM
        try {
            const date = new Date(timeString);
            if (!isNaN(date.getTime())) {
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                return `${hours}:${minutes}`;
            }
        } catch (e) {
            console.error("Error parsing time:", e);
        }
        
        return timeString;
    };
         let formData = {
            nama_situs: String(data.get("nama_situs")),
            alamat: String(data.get("alamat")),
            latitude: String(data.get("latitude")),
            longitude: String(data.get("longitude")),
            phone: String(data.get("phone")),
             kepemilikan: String(data.get("kepemilikan")),
            email: String(data.get("email")),
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
            wisata: String(data.get("wisata")),
            wisata_id: String(data.get("id_wisata"))
        }
        let verification = ver.safeParse({ ...formData })
        let profile = '';
        if (!verification.success) {
            return fail(418, {
                errors: verification.error.flatten().fieldErrors, success: false, formData
            })
        }
        if (profile_picture.size > 0) {
            // If a new profile picture is uploaded, handle it
            let formData = new FormData();
            formData.append("nama_situs", String(data.get("nama_situs")));
            formData.append("profile", profile_picture as File);
            console.log("Uploading profile picture:", formData);
            try {
                let response = await fetch(`${env.URL_KERAJAAN}/file/profile_situs`, {
                    method: "POST",
                    body: formData
                });
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`HTTP Error! Status: ${response.status}, Response: ${errorText}`);
                    return fail(400, { success: false, error: `Error: ${response.status} - ${errorText}` });
                }
                let result = await response.json();
                console.log("Profile picture upload result:", result);
                if (response.ok) {
                    // If the upload is successful, set the profile picture path
                    profile = result.id_path; // Use the uploaded file path
                    console.log("Profile picture uploaded successfully:", profile);
                }
            } catch (error) {
                console.error("Error uploading profile picture:", error);
                return fail(500, { success: false, error: String(error) });
            }
        }
        try {

            let sendData = {
                 id_situs: parseInt(String(data.get("id_situs"))),
                 id_wisata:parseInt( String(data.get("id_wisata"))),    
                 gambar_profile: profile ? String(profile) : '',
                 id_jenis_situs: parseInt(String(data.get("jenis_situs"))),
                foto_situs: '',
                nama_situs: String(data.get("nama_situs")),
                deskripsi_situs: String(data.get("deskripsi_situs")),
                alamat: String(data.get("alamat")),
                longitude: parseFloat(String(data.get("longitude"))),
                latitude: parseFloat(String(data.get("latitude"))),
                nama_pendiri: String(data.get("dibangun_oleh")),
                pemilik_situs: String(data.get("kepemilikan")),
                tahun_berdiri: parseInt(String(data.get("tahun_berdiri"))),
                pelindung: String(data.get("pelindung")),
                pembina: String(data.get("pembina")),
                juru_kunci: String(data.get("juru_kunci")),
                jam_buka: formatTimeField(String(data.get("jam_buka"))),
                jam_tutup: formatTimeField(String(data.get("jam_tutup"))),
                no_telp: String(data.get("phone")),
                email: String(data.get("email")),
    // jumlah_anggota: parseInt(String(data.get("jumlah_anggota"))),
            }
            console.log(sendData)
            const response = await fetch(`${env.URL_KERAJAAN}/situs`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(sendData)
            })
            console.log(response)
            if(!response.ok){
                const errorText = await response.text();
                console.error(`HTTP Error! Status: ${response.status}, Response: ${errorText}`);
                return fail(400,{ success: false, error: `Error: ${response.status} - ${errorText}` });

            }
            return {data: "berhasil", success: true}
        } catch (error) {
             console.error("Exception during API call:", error);
             return { success: false, error: String(error) };
        }
       
    }
};
