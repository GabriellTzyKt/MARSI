import { error, fail, type Actions } from "@sveltejs/kit";
import { z } from "zod";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";
import { formatDatetoUI } from "$lib";

// function formatDate(date:any) {
//     let d = date.split("-")
//     return `${d[2]}-${d[1]}-${d[0]}`
// }

export const load = async ({ cookies }) => {
    let cookie = cookies.get("userSession") ? JSON.parse(cookies.get("userSession") as string) : '';
  
    try {
      let limitTugas = 1000;  // batasi limit supaya gak overload
      let limitSitus = 1000;
      let limitUser = 1000;
  
      // Fetch paralel semua data utama
      let [tugasRes, situsRes, userRes, acaraRes] = await Promise.all([
        fetch(`${env.URL_KERAJAAN}/tugas?limit=${limitTugas}`, {
          method: 'GET',
        
        }),
        fetch(`${env.URL_KERAJAAN}/situs?limit=1000`, {

          
        }),
        fetch(`${env.PUB_PORT}/users?limit=${limitUser}`, {
          headers: { "Authorization": `Bearer ${cookie.token}` }
        }),
        fetch(`${env.URL_KERAJAAN}/acara?limit=1000`)
      ]);
  
      if (tugasRes.ok && situsRes.ok && userRes.ok && acaraRes.ok) {
        // Parse semua data
        let [tugasData, situsData, userDataRaw, acaraDataRaw] = await Promise.all([
          tugasRes.json(),
          situsRes.json(),
          userRes.json(),
          acaraRes.json()
        ]);
        situsData = situsData.filter((doc: any) => {
                        return doc.deleted_at === '0001-01-01T00:00:00Z' || doc.deleted_at == null
                    })
         acaraDataRaw = acaraDataRaw.filter((doc: any) => {
                        return doc.deleted_at === '0001-01-01T00:00:00Z' || !doc.deleted_at
                    })        
        // Filter user yang aktif
        let userData = userDataRaw
          .filter((u: any) => u.deleted_at === '0001-01-01T00:00:00Z' || !u.deleted_at)
          .map((u: any) => ({ id: u.id_user, name: u.nama_lengkap, email: u.email }));
  
        // Buat map untuk lookup user berdasarkan id
        let userMap = new Map(userData.map(u => [u.id, u.name]));
  
        // Format tugas, tambahkan nama pemberi & penerima dari userMap
        let tugasFormatted = tugasData
          .filter((item: any) => item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at)
          .map((item: any) => ({
            ...item,
            tanggal_mulai: item.tanggal_mulai ? item.tanggal_mulai.split('T')[0] : item.tanggal_mulai,
            pemberi_tugas: userMap.get(item.id_pemberi_tugas) || 'Unknown',
            penerima_tugas: userMap.get(item.id_penerima_tugas) || 'Unknown'
          }));
  
        // Sorting tugas sesuai kebutuhan
        let sortedData = tugasFormatted.sort((a: any, b: any) => {
          if (a.status_tugas === "Ditugaskan" && b.status_tugas !== "Ditugaskan") return -1;
          if (a.status_tugas !== "Ditugaskan" && b.status_tugas === "Ditugaskan") return 1;
          return 0;
        });
  
        // Format acara
        let acaraData = acaraDataRaw.map((item: any) => ({
          id: item.id_acara,
          name: item.nama_acara,
          kapasitas: item.kapasitas_acara
        }));
          // console.log("Sorted Data:", sortedData);
          
        // console.log("Situs:", situsData);
        // console.log("User:", userData);
        return { data: sortedData, situs: situsData, userData, acaraData };
      }
  
      return { data: [], situs: [], userData: [], acaraData: [] };
    } catch (error) {
      console.error("Error fetching data:", error);
      return { data: [], situs: [], userData: [], acaraData: [] };
    }
  };
  

export const actions: Actions = {
    tambahTugas: async ({ request }) => {
        const data = await request.formData()
        let today = new Date().toISOString().split("T")[0]
        const formDate = String(data.get("tanggal_penugasan"))
        console.log(data)
        console.log(today)
        const ver = z.object({
            pemberi_tugas:
                z.string({ message: "Field Pemberi Tugas harus diisi" })
                    .nonempty("Minimal 1 huruf / tidak boleh kosong"),
            id_pemberi: z.string({ message: "Pilih Dari DropDown" }).nonempty("Minimal 1 huruf / tidak boleh kosong"),
            jenis_tugas:
                z.string({ message: "Field Pemberi Tugas harus diisi" })
                    .nonempty("Minimal 1 huruf / tidak boleh kosong")
                    .refine(val => val === "pribadi" || val === "acara", {
                        message: "Jenis tugas harus pribadi atau acara"
                    }),
            nama_tugas:
                z.string({ message: "Field Pemberi Tugas harus diisi" })
                    .nonempty("Minimal 1 huruf / tidak boleh kosong"),
            tanggal_penugasan:
                z.string({ message: "Field Pemberi Tugas harus diisi" })
                    .nonempty("Minimal 1 huruf / tidak boleh kosong")
                    .refine(() => {
                        return formDate >= today
                    }, { message: "Tanggal penugasan tidak boleh kurang dari hari ini" }),

            anggota_yg_ditugaskan:
                z.string({ message: "Field Pemberi Tugas harus diisi" })
                    .nonempty("Minimal 1 huruf / tidak boleh kosong"),
            id_ditugaskan: z.string({ message: "Pilih Dari DropDown" }).nonempty("Minimal 1 huruf / tidak boleh kosong"),
            deskripsi_tugas:
                z.string({ message: "Field Pemberi Tugas harus diisi" })
                    .nonempty("Minimal 1 huruf / tidak boleh kosong"),
            nama_situs:
                z.string({ message: "Field harus diisi" })
                    .nonempty("Minimal 1 huruf / tidak boleh kosong"),
            nama_acara:
                z.string({ message: "Field harus diisi" })
                    .nonempty("Minimal 1 huruf / tidak boleh kosong"),


        })
        const formData = {
            pemberi_tugas: String(data.get("pemberi_tugas")),
            jenis_tugas: String(data.get("jenis_tugas")),
            nama_tugas: String(data.get("nama_tugas")),
            tanggal_penugasan: String(data.get("tanggal_penugasan")),
            anggota_yg_ditugaskan: String(data.get("anggota_yg_ditugaskan")),
            deskripsi_tugas: String(data.get("deskripsi_tugas")),
            nama_situs: String(data.get("nama_situs")),
            nama_acara: String(data.get("nama_acara")),
            id_pemberi: String(data.get("id_pemberi")),
            id_ditugaskan: String(data.get("id_ditugaskan")),
        }
        // console.log("FormData",formData)
        const verification = ver.safeParse({ ...formData })
        if (!verification.success) {
            // console.log(verification.error.flatten().fieldErrors)
            return fail(418, { errors: verification.error.flatten().fieldErrors, s: false, formData })
        }
        // return { errors: "No Error", formData, s: true }

        try {
            // Membuat objek JSON untuk dikirim ke API
            const tugasData = {
                pemberi_tugas: Number(data.get("id_pemberi")),
                penerima_tugas: Number(data.get("id_ditugaskan")),
                id_acara: formData.jenis_tugas === "acara" ? Number(data.get("id_acara")) : null,
                nama_tugas: formData.nama_tugas,
                deskripsi_tugas: formData.deskripsi_tugas,
                lokasi_tugas: formData.jenis_tugas === "pribadi" ? data.get("id_situs") : null,
                tanggal_mulai: formatDatetoUI(formData.tanggal_penugasan),
                nama_situs: formData.nama_situs|| null,
                nama_acara: formData.nama_acara || null,
                jenis_tugas: formData.jenis_tugas,
                status_tugas: "Ditugaskan"
                // lokasi
                // id_acara ?
            };
            console.log("data yang mau di submit: ", tugasData);
            const send = await fetch(`${env.BASE_URL_8008}/tugas`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(tugasData)
            });

            const r = await send.json();
            console.log("response:",r);

            if (send.ok) {
                return { errors: "no Error", success: true };
            }
            return fail(400, { request: `Error Code : ${send.status} ${r.message}` });
        } catch (e) {
            console.error("Fetch Error", e);
            return fail(500, { request: "Terjadi kesalahan saat mengirim data" });
        }


    },


    ubahTugas: async ({ request }) => {
        const data = await request.formData()
        let today = new Date().toISOString().split("T")[0]
        const formDate = String(data.get("tanggal_penugasan"))
        console.log(data)
        console.log(today)
        const ver = z.object({
            pemberi_tugas:
                z.string({ message: "Field Pemberi Tugas harus diisi" })
                    .nonempty("Minimal 1 huruf / tidak boleh kosong"),
            id_pemberi: z.string({ message: "Pilih Dari DropDown" }).nonempty("Minimal 1 huruf / tidak boleh kosong"),
            jenis_tugas:
                z.string({ message: "Field Pemberi Tugas harus diisi" })
                    .nonempty("Minimal 1 huruf / tidak boleh kosong")
                    .refine(val => val === "pribadi" || val === "acara", {
                        message: "Jenis tugas harus pribadi atau acara"
                    }),
            nama_tugas:
                z.string({ message: "Field Pemberi Tugas harus diisi" })
                    .nonempty("Minimal 1 huruf / tidak boleh kosong"),
            tanggal_penugasan:
                z.string({ message: "Field Pemberi Tugas harus diisi" })
                    .nonempty("Minimal 1 huruf / tidak boleh kosong")
                    ,

            anggota_yg_ditugaskan:
                z.string({ message: "Field Pemberi Tugas harus diisi" })
                    .nonempty("Minimal 1 huruf / tidak boleh kosong"),
            id_ditugaskan: z.string({ message: "Pilih Dari DropDown" }).nonempty("Minimal 1 huruf / tidak boleh kosong"),
            deskripsi_tugas:
                z.string({ message: "Field Pemberi Tugas harus diisi" })
                    .nonempty("Minimal 1 huruf / tidak boleh kosong"),
            nama_situs:
                z.string({ message: "Field harus diisi" })
                    .nonempty("Minimal 1 huruf / tidak boleh kosong"),
            nama_acara:
                z.string({ message: "Field harus diisi" })
                    .nonempty("Minimal 1 huruf / tidak boleh kosong"),


        })
        const formData = {
            pemberi_tugas: String(data.get("pemberi_tugas")),
            jenis_tugas: String(data.get("jenis_tugas")),
            nama_tugas: String(data.get("nama_tugas")),
            tanggal_penugasan: String(data.get("tanggal_penugasan")),
            anggota_yg_ditugaskan: String(data.get("anggota_yg_ditugaskan")),
            deskripsi_tugas: String(data.get("deskripsi_tugas")),
            nama_situs: String(data.get("nama_situs")),
            nama_acara: String(data.get("nama_acara")),
            id_pemberi: String(data.get("id_pemberi")),
            id_ditugaskan: String(data.get("id_ditugaskan")),
        }
        console.log("FormData",formData)
        const verification = ver.safeParse({ ...formData })
        if (!verification.success) {
            console.log(verification.error.flatten().fieldErrors)
            return fail(418, { errors: verification.error.flatten().fieldErrors, s: false, formData })
        }
        // return { errors: "No Error", formData, s: true }

        try {
            // Membuat objek JSON untuk dikirim ke API
            const tugasData = {
                id_tugas: Number(data.get("id_tugas")),
                pemberi_tugas: Number(data.get("id_pemberi")),
                penerima_tugas: Number(data.get("id_ditugaskan")),
                id_acara: formData.jenis_tugas === "acara" ? Number(data.get("id_acara")) : null,
                nama_tugas: formData.nama_tugas,
                deskripsi_tugas: formData.deskripsi_tugas,
                lokasi_tugas: formData.jenis_tugas === "pribadi" ? data.get("id_situs") : null,
                jenis_tugas: formData.jenis_tugas,
                tanggal_mulai: formatDatetoUI(formData.tanggal_penugasan),
                status: data.get("status_tugas"),
                 nama_situs: formData.nama_situs|| null,
                nama_acara: formData.nama_acara || null,
                
                // lokasi
                // id_acara ?
            };
            console.log("data yang mau di submit: ", tugasData);
            const send = await fetch(`${env.BASE_URL_8008}/tugas`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(tugasData)
            });

            const r = await send.json();
            console.log("response:",r);

            if (send.ok) {
                return { errors: "no Error", success: true };
            }
            return fail(400, { request: `Error Code : ${send.status} ${r.message}` });
        } catch (e) {
            console.error("Fetch Error", e);
            return fail(500, { request: "Terjadi kesalahan saat mengirim data" });
        }

    },
    hapusTugas: async ({ request }) => {
        const data = await request.formData()
        const id = data.get("id_tugas")
        try {
            const res = await fetch(`${env.BASE_URL_8008}/tugas/${id}`, {
                method: "DELETE"
            })
            if (!res.ok) {
                throw new Error(`HTTP Error! Status: ${res.status}`);
            }
            const data = await res.json();
            console.log(data)
            return { success: true };
        }
        catch (error) {
            console.error("Error deleting record:", error);
            return fail(500, { error: "Server error when deleting record" });
        }
    }

};
