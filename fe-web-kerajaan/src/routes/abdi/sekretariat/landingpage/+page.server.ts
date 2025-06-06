import { fail, type Actions } from "@sveltejs/kit";
import { z } from "zod";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";

export const load: PageServerLoad = async () => {
    try {
        let berandaRes = await fetch(
            `${env.URL_KERAJAAN}/beranda`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
            
        );
        let beranda = await berandaRes.json();
        beranda = await Promise.all(beranda.map(async (item: any) => {
            let dokumentasi_url = "";
            if (item.dokumentasi && typeof item.dokumentasi === "string" && item.dokumentasi.trim() !== "") {
                try {
                    const pict = await fetch(`${env.URL_KERAJAAN}/doc/${item.dokumentasi}`);
                    if (pict.ok) {
                        const filePathData = await pict.json();
                        const filePath = filePathData.file_dokumentasi || filePathData;
                        if (typeof filePath === "string") {
                            dokumentasi_url = `${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(filePath)}`;
                        }
                    }
                } catch (err) {
                    console.error("Error fetching dokumentasi for beranda:", err);
                }
            }
            return {
                ...item,
                dokumentasi_url
            };
        }));
        return { beranda };
    } catch (error) {
        
    }
};

export const actions: Actions = {
    tambahLanding: async ({ request }) => {
        const data = await request.formData()
        console.log(data)
        const ver = z.object({
            judul_halaman:
                z.string({ message: "Field Judul halaman Harus diisi" })
                    .nonempty("Tidak Boleh Kosong"),
            
            deskripsi_halaman: 
            z.string({ message: "Field deskripsi halaman Harus diisi" })
                    .nonempty("Tidak Boleh Kosong"),
            deskripsi_1: 
            z.string({ message: "Field Deskripsi Card 1 Harus diisi" })
            .nonempty("Tidak Boleh Kosong"),
            deskripsi_2: 
            z.string({ message: "Field Deskripsi Card 2 Harus diisi" })
            .nonempty("Tidak Boleh Kosong"),
            deskripsi_3: 
            z.string({ message: "Field Deskripsi Card 3 Harus diisi" })
            .nonempty("Tidak Boleh Kosong"),
        })

        const formData = {
            judul_halaman : String(data.get("judul_header")),
            deskripsi_halaman : String(data.get("deskripsi_header")),
            deskripsi_1 : String(data.get("deskripsi_1")),
            deskripsi_2 : String(data.get("deskripsi_2")),
            deskripsi_3 : String(data.get("deskripsi_3")),
        }
        const verif = ver.safeParse({ ...formData })
        if (!verif.success) {
            console.log(verif.error.flatten().fieldErrors)
            return fail(418,{errors: verif.error.flatten().fieldErrors, formData})
        }

        // Cek file untuk setiap section
        const headerFile = data.get("header");
        const card1File = data.get("card1");
        const card2File = data.get("card2");
        const card3File = data.get("card3");

         // Helper untuk cek apakah file diupload
        function isFile(f: any) {
            return f && typeof f === "object" && "size" in f && f.size > 0;
        }
        let resBeranda = await fetch(`${env.URL_KERAJAAN}/beranda`, {
            method: "GET",
        })
        let beranda = await resBeranda.json();
        console.log("Dari apI",beranda)
        // Simpan hasil dokumentasi (bisa file baru atau dokumentasi lama)
        let dokumentasiHeader = null;
        let dokumentasiCard1 = null;
        let dokumentasiCard2 = null;
        let dokumentasiCard3 = null;

        let payload = beranda
        payload[0].judul_section = formData.judul_halaman
        payload[0].isi_section = formData.deskripsi_halaman
        payload[1].isi_section = formData.deskripsi_1
        payload[2].isi_section = formData.deskripsi_2
        payload[3].isi_section = formData.deskripsi_3
        
        // Jika file diupload, lakukan upload ke API, jika tidak, ambil dokumentasi lama (misal dari DB)
        if (isFile(headerFile)) {
            let form = new FormData();
            form.append("dokumentasi", headerFile as File);
            let upload = await fetch(`${env.URL_KERAJAAN}/file/beranda`, {
                method: "POST",
                body: form,
            })
            let hasilUploadHeader = await upload.json();
            payload[0].dokumentasi = hasilUploadHeader.id_path
            // upload headerFile ke API, dapatkan url/filepath
            // dokumentasiHeader = hasilUploadHeader;
        } else {
            payload[0].dokumentasi = beranda[0].dokumentasi
            // dokumentasiHeader = dokumentasi lama dari DB
        }
        if (isFile(card1File)) {
            let form = new FormData();
            console.log("card1",card1File)
            form.append("dokumentasi", data.get("card1") as File);
            let upload = await fetch(`${env.URL_KERAJAAN}/file/beranda`, {
                method: "POST",
                body: form,
            })
            let hasilUploadHeader = await upload.json();
            payload[1].dokumentasi = hasilUploadHeader.id_path
            // upload card1File ke API, dapatkan url/filepath
            // dokumentasiCard1 = hasilUploadCard1;
        } else {
            // dokumentasiCard1 = dokumentasi lama dari DB
            payload[1].dokumentasi = beranda[1].dokumentasi
        }
        if (isFile(card2File)) {
            let form = new FormData();
            console.log("card2",card2File)
            form.append("dokumentasi", card2File as File);
            let upload = await fetch(`${env.URL_KERAJAAN}/file/beranda`, {
                method: "POST",
                body: form,
            })
            let hasilUploadHeader = await upload.json();
            payload[2].dokumentasi = hasilUploadHeader.id_path
            // upload card2File ke API, dapatkan url/filepath
            // dokumentasiCard2 = hasilUploadCard2;
        } else {
            payload[2].dokumentasi = beranda[2].dokumentasi
            // dokumentasiCard2 = dokumentasi lama dari DB
        }
        if (isFile(card3File)) {
            let form = new FormData();
            console.log("card3",card3File)
            form.append("dokumentasi", card3File as File);
            let upload = await fetch(`${env.URL_KERAJAAN}/file/beranda`, {
                method: "POST",
                body: form,
            })
            let hasilUploadHeader = await upload.json();
            payload[3].dokumentasi = hasilUploadHeader.id_path
            // upload card3File ke API, dapatkan url/filepath
            // dokumentasiCard3 = hasilUploadCard3;
        } else {
            payload[3].dokumentasi = beranda[3].dokumentasi
            // dokumentasiCard3 = dokumentasi lama dari DB
        }

        // Lanjutkan proses simpan data ke API/database dengan dokumentasi yang sudah dipilih
        // ...
        console.log("final Payload data", payload)
        try {
            
            let res = await Promise.all(payload.map(async (item: any) => {
                let beranda = await fetch(`${env.URL_KERAJAAN}/beranda`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(item),
                
                })
                let resBeranda = await beranda.json();
                console.log("resBeranda",resBeranda);
            }
            ))
           
        } catch (error) {
            
        }
        return {errrors: "no error", formData}
    }
};