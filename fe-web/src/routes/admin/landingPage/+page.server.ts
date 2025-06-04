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
        const files2 = data.getAll('gambar_section2');
        const files3 = data.getAll('gambar_section3');
        const files4 = data.getAll('gambar_section4');
        const files5 = data.getAll('gambar_section5');
        const files6 = data.getAll('gambar_section6');
        console.log("Files 2 : ", files2)
        // ...files3, files4, dst jika perlu...

        let idPaths2: string[] = [];
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

        const dokumentasi2 = String(idPaths2.join(','));
        console.log("dokumentasi 2 : ", dokumentasi2)

        // ===========================================

        let idPaths3: string[] = [];
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

        const dokumentasi3 = String(idPaths3.join(','));
        console.log("dokumentasi 3 : ", dokumentasi3)

        // ===========================================

        let idPaths4: string[] = [];
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

        const dokumentasi4 = String(idPaths4.join(','));
        console.log("dokumentasi 4 : ", dokumentasi4)

        // ===========================================

        let idPaths5: string[] = [];
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

        const dokumentasi5 = String(idPaths5.join(','));
        console.log("dokumentasi 5 : ", dokumentasi5)

        // ===========================================

        let idPaths6: string[] = [];
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

        const dokumentasi6 = String(idPaths6.join(','));
        console.log("dokumentasi 5 : ", dokumentasi6)




        // Contoh: mapping section
        const sections = [
            {
                id: 1,
                judul: data.get("judulpage_section1"),
            },
            {
                id: 2,
                judul: data.get("judulpage_section2"),
                isi: data.get("isipage_section2"),
                dokumentasi: dokumentasi2
            },
            {
                id: 3,
                judul: data.get("judulpage_section3"),
                isi: data.get("isipage_section3"),
                dokumentasi: dokumentasi3
            },
            {
                id: 4,
                judul: data.get("judulpage_section4"),
                isi: data.get("isipage_section4"),
                dokumentasi: dokumentasi4
            },
            {
                id: 5,
                judul: data.get("judulpage_section5"),
                isi: data.get("isipage_section5"),
                dokumentasi: dokumentasi5
            },
            {
                id: 6,
                judul: data.get("judulpage_section6"),
                isi: data.get("isipage_section6"),
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