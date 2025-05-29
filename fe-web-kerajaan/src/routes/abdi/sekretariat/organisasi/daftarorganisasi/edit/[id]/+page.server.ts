import { env } from "$env/dynamic/private";
import { formatDate, formatDatetoUI } from "$lib";
import type { PageServerLoad } from "./$types";
import { fail, type Actions } from "@sveltejs/kit";
import { z } from "zod";
export const load: PageServerLoad = async ({params, cookies}) => {
    let token = cookies.get("userSession")? JSON.parse(cookies.get("userSession") as string): ''
    try {
        let res = await fetch(`${env.URL_KERAJAAN}/organisasi/${params.id}`);

        if (!res.ok) {
            throw new Error(`HTTP Error! Status: ${res.status}`);
        }
        let data = await res.json();
        console.log("API response data:", data);
        console.log("Data type:", typeof data);
        // Check if data is an array, if not, wrap it in an array
        let dataArray = Array.isArray(data) ? data : [data];
        
        let finalData = await Promise.all(dataArray.map(async (item: any) => {
            try {
                let resPj = await fetch(`${env.PUB_PORT}/user/${item.penanggung_jawab}`, {
                    headers: {
                        "Authorization": `Bearer ${token?.token}`
                    }
               });
                let resPl = await fetch(`${env.PUB_PORT}/user/${item.pelindung}`, {
                    headers: {
                        "Authorization": `Bearer ${token?.token}`
                    }
               });
                let resPb = await fetch(`${env.PUB_PORT}/user/${item.pembina}`, {
                    headers: {
                        "Authorization": `Bearer ${token?.token}`
                    }
               });
                if (resPj.ok && resPl.ok && resPb.ok) {
                    let pjData = await resPj.json();
                    let plData = await resPl.json();
                    let pbData = await resPb.json();
                    return {
                        ...item,
                        penanggung_jawab_nama: pjData.nama_lengkap || pjData.nama || `User ${item.penanggung_jawab}`,
                        pelindung_nama: plData.nama_lengkap || plData.nama || `User ${item.pelindung}`,
                        pembina_nama: pbData.nama_lengkap || pbData.nama || `User ${item.pembina}`,
                        tanggal_berdiri: formatDate(item.tanggal_berdiri),
                    };
                }
                else {
                    return {
                        ...item,
                        penanggung_jawab_nama: `User ${item.penanggung_jawab}`,
                        pelindung_nama: `User ${item.pelindung}`,
                        pembina_nama: `User ${item.pembina}`,
                        tanggal_berdiri: formatDate(item.tanggal_berdiri),
                    };
      
                }
            } catch (error) {
                console.log(error);
                // Return the item with default values when there's an error
                return {
                    ...item,
                    penanggung_jawab_nama: `User ${item.penanggung_jawab}`,
                    pelindung_nama: `User ${item.pelindung}`,
                    pembina_nama: `User ${item.pembina}`,
                    tanggal_berdiri: formatDatetoUI(item.tanggal_berdiri),
                };
            }
        }));
        
        // Filter out any undefined values that might have occurred during mapping
        finalData = finalData.filter(item => item !== undefined);
        if (finalData[0].profile) {
            try {
                const filePathResponse = await fetch(`${env.URL_KERAJAAN}/doc/${finalData[0].profile}`);
                if (filePathResponse.ok) {
                    const filePathData = await filePathResponse.json();
                    finalData[0].profile_path = `${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(filePathData.file_dokumentasi)}`;
                } else {
                    console.error("Failed to fetch profile image path:", filePathResponse.statusText);
                }
            } catch (error) {
                console.error("Error fetching profile image path:", error);
            }
        }
        console.log("finalData:", finalData);
        
        // Fetch all users for dropdown selection
        const usersResponse = await fetch(`${env.PUB_PORT}/users`, {
            headers: {
                "Authorization": `Bearer ${token?.token}`
            }
        });
        
        let allUsers = [];
       
       

        if (usersResponse.ok) {
            const userData = await usersResponse.json();
            allUsers = userData.filter((user: any) => 
                user.deleted_at === '0001-01-01T00:00:00Z' || !user.deleted_at
            ).map((user: any) => ({
                id: user.id_user,
                name: user.nama_lengkap || 'Nama tidak tersedia',
                email: user.email || 'Email tidak tersedia'
            }));
        }
        
        return { data: finalData[0], allUsers };
    } catch (error) {
        console.error("Error in load function:", error);
        return { data: [], allUsers: [] };
    }
};
export const actions: Actions = {
    ubahOrganisasi: async ({request}) => {
        const data = await request.formData()
        console.log(data)   
        let orgpp = data.get("profile_image") as File;
       const ver = z.object({
            nama_organisasi:
                z.string({ message: "Field Nama Situs Harus diisi" })
                    .nonempty("Field ini tidak boleh kosong"),

            image_name:
                z.string({ message: "Minimal 1 foto!" }).min(1, "Field ini tidak boleh kosong"),


            alamat:
                z.string({ message: "Field Alamat Harus diisi" })
                    .nonempty("Field ini tidak boleh kosong"),

            email:
                z.string({ message: "Field Email Harus diisi" })
                    .nonempty("Field ini tidak boleh kosong")
                    .email("Email Invalid"),
            deskripsi_organisasi:
                z.string({ message: "Field Deskripsi Situs Harus diisi" })
                    .nonempty("Field ini tidak boleh kosong"),
            tanggal_berdiri:
                z.string({ message: "Field Tanggal Berdiri Harus diisi" })
                    .nonempty("Field ini tidak boleh kosong")
                    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD")
                    .refine((dateStr) => {
                        const date = new Date(dateStr);
                        return !isNaN(date.getTime()) && dateStr === date.toISOString().split("T")[0];
                    }, { message: "Tanggal tidak valid" }),

            penanggungjawab:
                z.string({ message: "Field Penanggung Jawab Harus diisi" })
                    .nonempty("Field ini tidak boleh kosong"),
            penanggungjawab_id:
                z.string({ message: "Field Penanggung Jawab Harus dipilih" })
                    .nonempty("Field ini tidak boleh kosong"),
            pembina:
                z.string({ message: "Field Pembina Harus diisi" })
                    .nonempty("Field ini tidak boleh kosong"),
            pembina_id:
                z.string({ message: "Field Pembina Harus dipilih" })
                    .nonempty("Field ini tidak boleh kosong"),
            pelindung:
                z.string({ message: "Field Pelindung Harus diisi" })
                    .nonempty("Field ini tidak boleh kosong"),
            pelindung_id:
                z.string({ message: "Field Pelindung Harus dipilih" })
                    .nonempty("Field ini tidak boleh kosong"),
            tempat_operasional:
                z.string({ message: "Field Tempat Operasional Harus dipilih" })
                    .nonempty("Field ini tidak boleh kosong"),

          
            phone:
                z.string({ message: "Field Nomer Telepon Harus diisi" })
                    .min(10, "Nomer telpon minimal 10 digit")
                    .max(13, "nomer telpon maximal 13 digit")
                    .regex(/^\d+$/, "Harus berupa digit")


        })
        const formData = {
            nama_organisasi: String(data.get("nama_organisasi")),
            alamat: String(data.get("alamat")),
            email: String(data.get("email")),
            // nama_organisasi: String(data.get("nama_organisasi")),
            deskripsi_organisasi: String(data.get("deskripsi_organisasi")),
            penanggungjawab: String(data.get("penanggungjawab_nama")),
            penanggungjawab_id: String(data.get("penanggungjawab_id")),
            tanggal_berdiri: String(data.get("tanggal_berdiri")),
            pembina: String(data.get("pembina_nama")),
            pembina_id: String(data.get("pembina_id")),
            image_name: String(data.get("image_name")),
            tempat_operasional: String(data.get("tempat_operasional")),
            pelindung: String(data.get("pelindung_nama")),
            pelindung_id: String(data.get("pelindung_id")),
            // jumlahanggota: String(data.get("jumlah_anggota")),
            phone: String(data.get("phone")),
        }
        const verification = ver.safeParse({ ...formData })

        console.log(verification)


        if (!verification.success) {
            return fail(418, { errors: verification.error.flatten().fieldErrors, success: false, formData })
        }
        // return { success: true, formData }
        if (orgpp.size > 0) {
            const formData = new FormData();
            formData.append("nama_organisasi", String(data.get("nama_organisasi")));
            formData.append("foto_profile", orgpp);
            try {
                let res = await fetch(`${env.URL_KERAJAAN}/file/profile_organisasi`, {
                    method: "POST",
                    body: formData
                });
                if (!res.ok) {
                    throw new Error(`HTTP Error! Status: ${res.status}`);
                }
                let resData = await res.json();
                console.log("Response from file upload:", resData);
                orgpp = resData.id_path; // Use the uploaded file name
            } catch (error) {
                console.error("Error uploading file:", error);
                return fail(500, { 
                    errors: { server: ["Terjadi kesalahan saat mengupload file"] },
                    success: false
                });
            }
        }
        try {
            let senData = {
                id_organisasi: parseInt(String(data.get("id_organisasi"))),
                penanggung_jawab: parseInt(formData.penanggungjawab_id),
                nama_organisasi: formData.nama_organisasi,
                deskripsi: formData.deskripsi_organisasi,
                alamat: formData.alamat,
                no_telp: formData.phone,
                email: formData.email,
                pembina: formData.pembina_id,
                pelindung: formData.pelindung_id,
                tanggal_berdiri: formData.tanggal_berdiri,
                foto_organisasi: orgpp ? orgpp : null,
                profile: orgpp ? orgpp : null,
                
            }
           

            console.log("form data to send : " , senData)

            const response = await fetch(`${env.URL_KERAJAAN}/organisasi`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(senData)
            });

            const result = await response.json();
            console.log("result : ", result)
            
            if (response.ok) {
                return { success: true, message: "Data berhasil disimpan" };
            }
            
            return fail(400, { 
                errors: { server: [`Error: ${response.status} - ${result.message || "Terjadi kesalahan"}`] },
                success: false, 
                formData 
            });
        } catch (error) {
            console.error("Error saat mengirim data:", error);
            return fail(500, { 
                errors: { server: ["Terjadi kesalahan saat menghubungi server"] },
                success: false, 
                formData 
            });
        }
    }
};
