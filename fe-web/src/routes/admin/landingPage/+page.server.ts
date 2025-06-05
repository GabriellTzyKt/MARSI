import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "../aplikasiKerajaan/[id]/$types";
import { redirect } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";

export const load: PageServerLoad = async ({ cookies, fetch }) => {
    const userSession = cookies.get("userSession");
    if (!userSession) {
        throw redirect(302, '/login2');
    }
    const session = JSON.parse(userSession);
    if (!session.adminData || session.adminData.jenis_admin !== 'super admin') {
        throw redirect(302, '/admin/biodata');
    }

    const res = await fetch(`${env.BASE_URL}/beranda`);
    let sections = [];
    if (res.ok) {
        sections = await res.json();

        // Untuk setiap section, ambil file dokumentasi jika ada
        for (const section of sections) {
            if (section.dokumentasi) {
                // Bisa jadi dokumentasi berisi banyak id, pisahkan
                const ids = String(section.dokumentasi).split(',').filter(Boolean);
                section.dokumentasi_files = [];
                for (const id of ids) {
                    // Ambil detail file dari /doc/{id}
                    const docRes = await fetch(`${env.BASE_URL}/doc/${id}`);
                    if (docRes.ok) {
                        const docData = await docRes.json();
                        // Simpan path file untuk digunakan di client
                        section.dokumentasi_files.push({
                            id,
                            file_path: docData.file_dokumentasi, // misal: "uploads/beranda/xxx.jpg"
                            url: `${env.BASE_URL}/file?file_path=${docData.file_dokumentasi}`
                        });
                    }
                }
            }
        }
    }

    return {
        sections
    };
}


export const actions: Actions = {
    ubahLanding: async ({ request, fetch }) => {
        const data = await request.formData();
        console.log("Data kirim : ", data)
        const existingIds2Arr = data.getAll('id_exist_section2');
        const existingIds2 = existingIds2Arr.flatMap(str => (typeof str === 'string' ? str.split(',') : [])).filter(Boolean);
        const files2 = data.getAll('gambar_section2');
        const uniqueExistingIds2 = [...new Set(existingIds2)];

        const existingIds3Arr = data.getAll('id_exist_section3');
        const existingIds3 = existingIds3Arr.flatMap(str => (typeof str === 'string' ? str.split(',') : [])).filter(Boolean);
        const files3 = data.getAll('gambar_section3');
        const uniqueExistingIds3 = [...new Set(existingIds3)];

        const existingIds4Arr = data.getAll('id_exist_section4');
        const existingIds4 = existingIds4Arr.flatMap(str => (typeof str === 'string' ? str.split(',') : [])).filter(Boolean);
        const files4 = data.getAll('gambar_section4');
        const uniqueExistingIds4 = [...new Set(existingIds4)];

        const existingIds5Arr = data.getAll('id_exist_section5');
        const existingIds5 = existingIds5Arr.flatMap(str => (typeof str === 'string' ? str.split(',') : [])).filter(Boolean);
        const files5 = data.getAll('gambar_section5');
        const uniqueExistingIds5 = [...new Set(existingIds5)];

        const existingIds6Arr = data.getAll('id_exist_section6');
        const existingIds6 = existingIds6Arr.flatMap(str => (typeof str === 'string' ? str.split(',') : [])).filter(Boolean);
        const files6 = data.getAll('gambar_section6');
        const uniqueExistingIds6 = [...new Set(existingIds6)];

        let idPaths2: string[] = [...uniqueExistingIds2];
        if (files2.length > 0 && files2[0] instanceof File && files2[0].size > 0) {
            for (const file of files2) {
                if (file instanceof File && file.size > 0) {
                    const uploadForm = new FormData();
                    uploadForm.append('dokumentasi', file);
                    const res = await fetch(`${env.BASE_URL}/file/beranda`, {
                        method: 'POST',
                        body: uploadForm
                    });
                    const resJson = await res.json();
                    if (res.ok && resJson.id_path) {
                        console.log("berhasil", resJson.id_path
                        )
                        idPaths2.push(resJson.id_path);
                    }
                }
            }
        }

        const dokumentasi2 = String(idPaths2.join(','));
        console.log("dokumentasi 2 : ", dokumentasi2)

        // ===========================================

        let idPaths3: string[] = [...uniqueExistingIds3];
        if (files3.length > 0 && files3[0] instanceof File && files3[0].size > 0) {
            for (const file of files3) {
                if (file instanceof File && file.size > 0) {
                    const uploadForm = new FormData();
                    uploadForm.append('dokumentasi', file);
                    const res = await fetch(`${env.BASE_URL}/file/beranda`, {
                        method: 'POST',
                        body: uploadForm
                    });
                    const resJson = await res.json();
                    if (res.ok && resJson.id_path) {
                        console.log("berhasil", resJson.id_path
                        )
                        idPaths3.push(resJson.id_path);
                    }
                }
            }
        }

        const dokumentasi3 = String(idPaths3.join(','));
        console.log("dokumentasi 3 : ", dokumentasi3)

        // ===========================================

        let idPaths4: string[] = [...uniqueExistingIds4];
        if (files4.length > 0 && files4[0] instanceof File && files4[0].size > 0) {
            for (const file of files4) {
                if (file instanceof File && file.size > 0) {
                    const uploadForm = new FormData();
                    uploadForm.append('dokumentasi', file);
                    const res = await fetch(`${env.BASE_URL}/file/beranda`, {
                        method: 'POST',
                        body: uploadForm
                    });
                    const resJson = await res.json();
                    if (res.ok && resJson.id_path) {
                        console.log("berhasil", resJson.id_path
                        )
                        idPaths4.push(resJson.id_path);
                    }
                }
            }
        }

        const dokumentasi4 = String(idPaths4.join(','));
        console.log("dokumentasi 4 : ", dokumentasi4)

        // ===========================================

        let idPaths5: string[] = [...uniqueExistingIds5];
        if (files5.length > 0 && files5[0] instanceof File && files5[0].size > 0) {
            for (const file of files5) {
                if (file instanceof File && file.size > 0) {
                    const uploadForm = new FormData();
                    uploadForm.append('dokumentasi', file);
                    const res = await fetch(`${env.BASE_URL}/file/beranda`, {
                        method: 'POST',
                        body: uploadForm
                    });
                    const resJson = await res.json();
                    if (res.ok && resJson.id_path) {
                        console.log("berhasil", resJson.id_path
                        )
                        idPaths5.push(resJson.id_path);
                    }
                }
            }
        }

        const dokumentasi5 = String(idPaths5.join(','));
        console.log("dokumentasi 5 : ", dokumentasi5)

        // ===========================================

        let idPaths6: string[] = [...uniqueExistingIds6];
        if (files6.length > 0 && files6[0] instanceof File && files6[0].size > 0) {
            for (const file of files6) {
                if (file instanceof File && file.size > 0) {
                    const uploadForm = new FormData();
                    uploadForm.append('dokumentasi', file);
                    const res = await fetch(`${env.BASE_URL}/file/beranda`, {
                        method: 'POST',
                        body: uploadForm
                    });
                    const resJson = await res.json();
                    if (res.ok && resJson.id_path) {
                        console.log("berhasil", resJson.id_path
                        )
                        idPaths6.push(resJson.id_path);
                    }
                }
            }
        }

        const dokumentasi6 = String(idPaths6.join(','));
        console.log("dokumentasi 5 : ", dokumentasi6)




        // Contoh: mapping section
        const sections = [
            {
                id: 1,
                judul: (() => {
                    const arr = data.getAll("judulpage_section1");
                    return arr[arr.length - 1] || "";
                })(),
            },
            {
                id: 2,
                judul: (() => {
                    const arr = data.getAll("judulpage_section2");
                    return arr[arr.length - 1] || "";
                })(),
                isi: (() => {
                    const arr = data.getAll("isipage_section2");
                    return arr[arr.length - 1] || "";
                })(),
                dokumentasi: dokumentasi2
            },
            {
                id: 3,
                judul: (() => {
                    const arr = data.getAll("judulpage_section3");
                    return arr[arr.length - 1] || "";
                })(),
                isi: (() => {
                    const arr = data.getAll("isipage_section3");
                    return arr[arr.length - 1] || "";
                })(),
                dokumentasi: dokumentasi3
            },
            {
                id: 4,
                judul: (() => {
                    const arr = data.getAll("judulpage_section4");
                    return arr[arr.length - 1] || "";
                })(),
                isi: (() => {
                    const arr = data.getAll("isipage_section4");
                    return arr[arr.length - 1] || "";
                })(),
                dokumentasi: dokumentasi4
            },
            {
                id: 5,
                judul: (() => {
                    const arr = data.getAll("judulpage_section5");
                    return arr[arr.length - 1] || "";
                })(),
                isi: (() => {
                    const arr = data.getAll("isipage_section5");
                    return arr[arr.length - 1] || "";
                })(),
                dokumentasi: dokumentasi5
            },
            {
                id: 6,
                judul: (() => {
                    const arr = data.getAll("judulpage_section6");
                    return arr[arr.length - 1] || "";
                })(),
                isi: (() => {
                    const arr = data.getAll("isipage_section6");
                    return arr[arr.length - 1] || "";
                })(),
                dokumentasi: dokumentasi6
            },
        ];

        // Loop setiap section, jika judul ada isinya, lakukan PUT ke /beranda
        for (const section of sections) {

            const payload = {
                id_section: section.id,
                judul_section: section.judul,
                isi_section: section.isi ? section.isi : "",
                dokumentasi: section.dokumentasi ? section.dokumentasi : "",
                url: ""
            };
            console.log("paylod : ", payload)
            await fetch(`${env.BASE_URL}/beranda`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

        }
        return { success: true };
    }
};