import { fail, type Actions } from "@sveltejs/kit";
import { z } from "zod";
import { env } from "$env/dynamic/private";
import type { PageServerLoad } from "./$types";

// Load function to fetch users
export const load: PageServerLoad = async ({ cookies }) => {
    const token = cookies.get('userSession') ? 
        JSON.parse(cookies.get('userSession') as string).token : '';
    
    try {
        // Fetch users for pembina and pelindung selection
        const usersResponse = await fetch(`${env.PUB_PORT}/users`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const situsResponse = await fetch(`${env.URL_KERAJAAN}/situs/jenis`);
        if (!usersResponse.ok) {
            console.error("Failed to fetch users:", usersResponse.statusText);
            return { users: [] };
        }
        if(!situsResponse.ok){
            console.error("Failed to fetch situs:", situsResponse.statusText);
            return { situs: [] };
        }
        const users = await usersResponse.json();
        const situs = await situsResponse.json();

        const activeSitus = situs.filter((doc: any) => {
            return doc.deleted_at == '0001-01-01T00:00:00Z' && doc.deleted_at !== null;
        });
        // Filter active users (not deleted)
        const activeUsers = users.filter((user: any) => 
            user.deleted_at === '0001-01-01T00:00:00Z' || !user.deleted_at
        );
        console.log(situs)
         let resWisata = await fetch(`${env.URL_KERAJAAN}/situs/wisata`);
        if (!resWisata.ok) {
            throw new Error(`HTTP Error! Status: ${resWisata.status}`)
        }
        let wisataData = await resWisata.json();
        wisataData = wisataData.filter((item: any) => {
            return item.deleted_at == '0001-01-01T00:00:00Z' || !item.deleted_at;
        }).map((item: any) => {
            return {
                id: item.id_wisata,
                name: item.nama_wisata || 'Nama tidak tersedia',
               
            }
        });
        console.log(wisataData)
        return { 
            users: activeUsers.map((user: any) => ({
                id: user.id_user,
                name: user.nama_lengkap || 'Nama tidak tersedia',
                email: user.email || 'Email tidak tersedia'
            })),
            situs: activeSitus.map((doc: any) => ({
                id: doc.id_jenis_situs,
                name: doc.jenis_situs || 'Nama tidak tersedia',
            })),
            wisata: wisataData
        };
    } catch (error) {
        console.error("Error fetching users:", error);
        return { users: [] };
    }
};


export const actions: Actions = {
    tambahSitus: async ({request}) => {
        const data = await request.formData()
        console.log(data)

        // Ambil file
        const profile_picture = data.get("profile_picture");

        // Validasi file secara manual
        if (!(profile_picture instanceof File) || profile_picture.size === 0) {
            return fail(400, {
                errors: {
                    profile_picture: ["Wajib mengunggah foto profil."]
                },
                success: false
            });
        }

        // Batas ukuran: 5 MB = 5 * 1024 * 1024 bytes
        const MAX_SIZE = 5 * 1024 * 1024;
        if (profile_picture.size > MAX_SIZE) {
            return fail(400, {
                errors: {
                    profile_picture: ["Ukuran file maksimal 5MB."]
                },
                success: false
            });
        }

        // Get latitude and longitude
        const latitude = data.get("latitude");
        const longitude = data.get("longitude");

        const ver = z.object({
            nama_situs: 
                z.string({ message: "Field Nama Situs Harus diisi" })
                    .nonempty("Field ini tidak boleh kosong"),
            
            alamat: 
                z.string({ message: "Field Alamat Harus diisi" })
                    .nonempty("Field ini tidak boleh kosong"),
            
            email: 
                z.string({ message: "Field Email Harus diisi" })
                    .nonempty("Field ini tidak boleh kosong")
                    .email("Email Invalid"),
            deskripsi_situs: 
                z.string({ message: "Field Deskripsi Situs Harus diisi" })
                    .nonempty("Field ini tidak boleh kosong"),
            
            juru_kunci: 
                z.string({ message: "Field Juru Kunci Harus diisi" })
                    .nonempty("Field ini tidak boleh kosong"),
            // juru_kunci_id: 
            //     z.string({ message: "Field Juru Kunci Harus dipilih" })
            //         .nonempty("Field ini tidak boleh kosong"),
            pembina: 
                z.string({ message: "Field Pembina Harus diisi" })
                    .nonempty("Field ini tidak boleh kosong"),
            // pembina_id:
            //     z.string({ message: "Field Pembina Harus dipilih" })
            //         .nonempty("Field ini tidak boleh kosong"),
            pelindung: 
                z.string({ message: "Field Pelindung Harus diisi" })
                    .nonempty("Field ini tidak boleh kosong"),
            // pelindung_id: 
            //     z.string({ message: "Field Pelindung Harus dipilih" })
            //         .nonempty("Field ini tidak boleh kosong"),
            wisata_id: 
                z.string({ message: "Field Wisata Harus dipilih" })
                    .nonempty("Field ini tidak boleh kosong"),
            phone:
                z.string({ message: "Field Nomer Telepon Harus diisi" })
                    .min(10, "Nomer telpon minimal 10 digit")
                    .max(13, "Nomer telpon maximal 13 digit")
                    .regex(/^\d+$/, "Harus berupa digit"),
                
            latitude: 
                z.string({ message: "Koordinat latitude diperlukan" })
                    .optional()
                    .refine(val => !val || (!!val && !isNaN(parseFloat(val))), 
                        "Latitude harus berupa angka"),
                
            longitude: 
                z.string({ message: "Koordinat longitude diperlukan" })
                    .optional()
                    .refine(val => !val || (!!val && !isNaN(parseFloat(val))), 
                        "Longitude harus berupa angka"),
              jam_buka: 
                z.string({ message: "Field Jam Buka harus diisi" })
                    .nonempty("Field Ini tidak boleh kosong").regex(/^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/, {
                    message: "Format jam buka: HH(jam):mm(menit).",
                }),
                
            jam_tutup: 
                z.string({ message: "Field Jam Tutup harus diisi" })
                    .nonempty("Field Ini tidak boleh kosong").regex(/^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/, {
                    message: "Format jam tutup: HH(jam):mm(menit).",
                })
        })
        .refine(
            data => {
                // Jika alamat diisi, pastikan koordinat juga diisi
                if (data.alamat && data.alamat.trim() !== '') {
                    return (data.latitude && data.latitude.trim() !== '' && 
                            data.longitude && data.longitude.trim() !== '');
                }
                return true;
            },
            {
                message: "Pilih alamat dari daftar untuk mendapatkan koordinat",
                path: ["alamat"]
            }
        );

        const formData = {
            nama_situs: String(data.get("nama_situs")),
            alamat: String(data.get("alamat")),
            email: String(data.get("email")),
            deskripsi_situs: String(data.get("deskripsi_situs")),
            juru_kunci: String(data.get("juru_kunci")),
            pembina: String(data.get("pembina")),
            pelindung: String(data.get("pelindung")),
            phone: String(data.get("phone")),
            latitude: latitude ? String(latitude) : "",
            
            longitude: longitude ? String(longitude) : "",
            jam_buka: String(data.get("jam_buka")),
            jam_tutup: String(data.get("jam_tutup")),
            wisata_id: data.get("wisata_id") ? String(data.get("wisata_id")) : "",
        }
        console.log("Extracted Form:", formData);

        const verification = ver.safeParse({ ...formData })
        if (!verification.success) {
            console.log(verification.error.flatten().fieldErrors);
            return fail(418, {
                errors: verification.error.flatten().fieldErrors, 
                success: false, 
                formData
            });
        }
        try {
            let formDataToSend = new FormData();
            formDataToSend.append("id_jenis_situs", data.get("jenis_situs") as string);
            formDataToSend.append("id_wisata", data.get("wisata_id") as string);
            formDataToSend.append("gambar_profile", data.get("profile_picture") as File);
            formDataToSend.append("nama_situs", formData.nama_situs);
            formDataToSend.append("deskripsi_situs", formData.deskripsi_situs);
            formDataToSend.append("alamat", formData.alamat);
            formDataToSend.append("nama_pendiri", "Pemilik Susuhunan");
            formDataToSend.append("pemilik_situs", "Pemilik Susuhunan");
            formDataToSend.append("tahun_berdiri", "2025");
            formDataToSend.append("pelindung", formData.pelindung);
            formDataToSend.append("pembina", formData.pembina);
            formDataToSend.append("juru_kunci", formData.juru_kunci);
            formDataToSend.append("jam_buka", formData.jam_buka);
            formDataToSend.append("jam_tutup", formData.jam_tutup);
            formDataToSend.append("longitude", formData.longitude);
            formDataToSend.append("latitude", formData.latitude);
            formDataToSend.append("no_telp", formData.phone);
            formDataToSend.append("email", formData.email);
                formDataToSend.append("foto_situs", data.get("profile_picture") as File);
            console.log("Sending data to API:", Object.fromEntries(formDataToSend));
            const res = await fetch(`${env.URL_KERAJAAN}/situs`, {
                method: "POST",
                body: formDataToSend
            })
            if(!res.ok){
                throw new Error(`HTTP Error! Status: ${res.status}`)
            }
            console.log(res)
            return {data: "berhasil", success: true}
        } catch (error) {
            
        }
        return {success: true, formData};
    }
};
