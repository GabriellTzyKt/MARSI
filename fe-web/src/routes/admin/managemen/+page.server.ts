import { fail, type Actions } from "@sveltejs/kit";
import { InternMap, xml } from "d3";
import { z } from "zod";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ cookies }) => {

    const userSession = cookies.get("userSession");
    if (!userSession) {
        throw redirect(302, '/login2');
    }
    const session = JSON.parse(userSession);
    if (!session.adminData || session.adminData.jenis_admin !== 'super admin') {
        throw redirect(302, '/admin/biodata');
    }


    try {
        // Fetch data dari BASE_URL dan BASE_URL_8008 secara paralel
        const [adminBaseResponse, allKerajaan, admin8008Response] = await Promise.all([
            fetch(`${env.BASE_URL}/admin?limit=200`, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            }),
            fetch(`${env.BASE_URL}/kerajaan?limit=200`, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            }),
            fetch(`${env.BASE_URL_8008}/admin?limit=200`, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            })
        ]);

        // Proses data admin dari BASE_URL
        let adminMarsiData = [];
        if (adminBaseResponse.ok) {
            const adminData = await adminBaseResponse.json();
            adminMarsiData = adminData.filter((admin: any) =>
                admin.deleted_at === "0001-01-01T00:00:00Z" || !admin.deleted_at
            );
        } else {
            console.error(`Error fetching from BASE_URL: ${adminBaseResponse.status}`);
        }

        // Proses data kerajaan (jika diperlukan)
        let kerajaanData = [];
        if (allKerajaan.ok) {
            const allKerajaanData = await allKerajaan.json();
            kerajaanData = allKerajaanData.filter((kerajaan: any) =>
                kerajaan.deleted_at === "0001-01-01T00:00:00Z" || !kerajaan.deleted_at
            );
        } else {
            console.error(`Error fetching kerajaan: ${allKerajaan.status}`);
        }

        // Proses data admin dari BASE_URL_8008
        let admin8008Data: any[] = [];
        if (admin8008Response.ok) {
            admin8008Data = await admin8008Response.json();
        } else {
            console.error(`Error fetching from BASE_URL_8008: ${admin8008Response.status}`);
        }

        // Ambil daftar id admin dari BASE_URL_8008
        const admin8008Ids = admin8008Data.map((admin: any) => Number(admin.id_user));
        console.log("ADMIN ID : ", admin8008Ids)

        // Cek pada adminMarsiData, jika id_admin ada pada admin8008Ids,
        // tambahkan properti "superadmin" dengan nilai "ya"
        adminMarsiData = adminMarsiData.map((admin: any) => {
            if (admin8008Ids.includes(Number(admin.id_user))) {
                return { ...admin, superadmin: "ya" };
            }
            return admin;
        });

        return {
            adminMarsiData,
            kerajaanData
        };
    } catch (error) {
        console.error("Error fetching admin data:", error);
        return {
            adminMarsiData: [],
            kerajaanData: []
        };
    }
}

export const actions: Actions = {
    tambah: async ({ request }) => {
        const data = await request.formData()
        console.log("Data tamba : ", data)

        const ver = z.object({
            nama_lengkap:
                z.string({ message: "Harus diisi / harus berupa string" })
                    .nonempty("Tidak Boleh kosong")
                    .max(300, "Nama Terlalu Panjang (max = 300)")
                    .trim(),

            // inputradio: z.string().trim().min(1, "Minimal 1!"),

            email:
                z.string({ message: "Harus diisi / harus berupa string" })
                    .email("Email Tidak Valid")
                    .nonempty("Field Tidak Boleh Kosong")
                    .trim(),

            username:
                z.string({ message: "Harus diisi / harus berupa string" })
                    .nonempty("Field Tidak Boleh Kosong")
                    .max(255, "Max 255 Kata")
                    .trim(),

            no_telp:
                z.string({ message: "Input Harus Ada" })
                    .min(10, { message: "nomer telepon minimal  10 angka" })
                    .max(13, { message: "nomer telepon maximal 15 angka" })
                    .regex(/^\d+$/, "Harus berupa nomer")
                    .trim(),

            password:
                z.string({ message: "password bukan string" })
                    .min(8, { message: "Password minimal 8 huruf" })
                    .max(255, { message: "Password sudah maximal!" })
                    .nonempty({ message: "Password tidak boleh kosong" })
                    .regex(/[A-Z]/, { message: "Password Harus ada minimal 1 huruf Kapital" })
                    .regex(/[0-9]/, { message: "Password Harus ada miniam 1 angka" })
                    .regex(/[^A-Za-z0-9]/, { message: "Password harus ada simbol" }),

            tgl_lahir:
                z.coerce.date({ message: "Tanggal Tidak valid (YYYY-MM-DD)" }),

            kota_lahir:
                z.string({ message: "Harus diisi / harus berupa kata" })
                    .nonempty("Tidak Boleh kosong")
                    .max(255, "Input hanya bisa sampai 255 kata")
                    .trim(),

            jenis_kelamin:
                z.string({ message: "Harus diisi / harus berupa kata" })
                    .nonempty("Tidak Boleh kosong")
                    .max(255, "Input hanya bisa sampai 255 kata")
                    .trim(),

            afiliasi:
                z.string({ message: "Harus diisi / harus berupa kata" })
                    .nonempty("Filed Tidak Boleh Kosong")
                    .max(255, "Input Terlalu Banyak (Max 255 Kata)")
                    .trim(),

            admin_role:
                z.string({ message: "Harus diisi / harus berupa string" })
                    .nonempty("FieldTidak Boleh Kosong")
                    .max(255, "Max 255 Kata")
                    .trim()
        })

        const nama_lengkap = data.get("nama_lengkap")
        const username = data.get("username")
        const email = data.get("email")
        const password = data.get("password")
        const jenis_kelamin = data.get("jenis_kelamin")
        const no_telp = data.get("no_telp")
        const tgl_lahir = data.get("tgl_lahir")
        const kota_lahir = data.get("kota_lahir")

        // Handle afiliasi as an array and get the first value
        const afiliasi_values = data.getAll("afiliasi")
        const afiliasi = afiliasi_values.length > 0 ? afiliasi_values[0] : ""

        // Handle admin_role as an array and get the first value
        const admin_role_values = data.getAll("admin_role")
        const admin_role = admin_role_values.length > 0 ? admin_role_values[0] : ""

        // Get id_kerajaan directly
        const id_kerajaan = data.get("id_kerajaan")

        const formData = {
            nama_lengkap,
            username,
            email,
            no_telp,
            password,
            tgl_lahir,
            kota_lahir,
            jenis_kelamin,
            afiliasi,
            admin_role
        }
        const verif = ver.safeParse({ ...formData })

        if (!verif.success) {
            const fieldErrors = verif.error.flatten().fieldErrors;
            console.log("errors di tambah: ", fieldErrors)
            return fail(406, {
                errors: fieldErrors,
                success: false,
                formData: formData,
                type: "add"
            });
        }

        try {
            const formattedDate = tgl_lahir instanceof Date
                ? tgl_lahir.toISOString().split('T')[0]
                : new Date(String(tgl_lahir)).toISOString().split('T')[0];

            // Use the id_kerajaan from the form data directly if available
            // Otherwise, determine it based on afiliasi
            const kerajaanId = id_kerajaan ? Number(id_kerajaan) :
                (afiliasi === "marsi" || afiliasi === "marsi2" ? 0 : Number(afiliasi));

            // Prepare payload for API
            const adminPayload = {
                nama_lengkap: String(nama_lengkap),
                jenis_kelamin: String(jenis_kelamin),
                tempat_lahir: String(kota_lahir),
                tanggal_lahir: formattedDate,
                username: String(username),
                password: String(password),
                email: String(email),
                no_telp: String(no_telp),
                id_kerajaan: kerajaanId,
                jenis_admin: String(admin_role)
            };

            console.log("Sending admin data to API:", adminPayload);

            // Send data to API
            const response = await fetch(`${env.BASE_URL}/admin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(adminPayload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error creating admin:", errorData);
                return fail(response.status, {
                    errors: { api: [errorData.message || "Failed to create admin"] },
                    success: false,
                    formData: formData,
                    type: "add"
                });
            }

            // --- Tambahan pengecekan superadmin ---
            const superadmin = data.get("superadmin");
            let response8008Data = null;
            let response8008Success = null;

            if (superadmin === "ya") {
                // Setelah admin berhasil dibuat, ambil id_user dari user terakhir
                const usersResponse = await fetch(`${env.BASE_URL}/users?limit=2000`, {
                    method: "GET",
                    headers: { "Accept": "application/json" }
                });

                if (!usersResponse.ok) {
                    // Tangani error jika perlu
                    console.error("Failed to fetch users:", usersResponse.status);
                } else {
                    const usersData = await usersResponse.json();
                    const lastUser = usersData[usersData.length - 1];
                    const lastUserId = Number(lastUser.id_user);
                    console.log("ID user terakhir:", lastUserId);

                    // Gunakan lastUserId sesuai kebutuhan, misalnya untuk payload baru:
                    const superAdminPayload = {
                        id_user: lastUserId,
                        afiliasi: "",
                        jenis_admin: "Super Admin"
                    };

                    const response8008 = await fetch(`${env.BASE_URL_8008}/admin/user`, {
                        method: 'POST',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(superAdminPayload)
                    });

                }
            }

            return {
                success: true,
                message: "Admin berhasil ditambahkan",
                formData,
                type: "add",
                superadmin8008: {
                    success: response8008Success,
                    data: response8008Data
                }
            };
        } catch (error) {
            console.error("Error in tambah action:", error);
            return fail(500, {
                errors: { exception: ["Server error when creating admin"] },
                success: false,
                formData: formData,
                type: "add"
            });
        }
    },

    ubah: async ({ request }) => {
        const data = await request.formData();
        console.log("Edit form data:", data);

        const ver = z.object({
            nama_lengkap:
                z.string({ message: "Harus diisi / harus berupa string" })
                    .nonempty("Tidak Boleh kosong")
                    .max(300, "Nama Terlalu Panjang (max = 300)")
                    .trim(),
            username:
                z.string({ message: "Harus diisi / harus berupa string" })
                    .nonempty("Field Tidak Boleh Kosong")
                    .max(255, "Max 255 Kata")
                    .trim(),
            email:
                z.string({ message: "Harus diisi / harus berupa string" })
                    .email("Email Tidak Valid")
                    .nonempty("Field Tidak Boleh Kosong")
                    .trim(),
            no_telp:
                z.string({ message: "Input Harus Ada" })
                    .min(10, { message: "nomer telepon minimal  10 angka" })
                    .max(13, { message: "nomer telepon maximal 15 angka" })
                    .regex(/^\d+$/, "Harus berupa nomer")
                    .trim(),
            jenis_kelamin:
                z.string({ message: "Harus diisi / harus berupa kata" })
                    .nonempty("Tidak Boleh kosong")
                    .max(255, "Input hanya bisa sampai 255 kata")
                    .trim(),
            tgl_lahir:
                z.coerce.date({ message: "Tanggal Tidak valid (YYYY-MM-DD)" }),
            kota_lahir:
                z.string({ message: "Harus diisi / harus berupa kata" })
                    .nonempty("Tidak Boleh kosong")
                    .max(255, "Input hanya bisa sampai 255 kata")
                    .trim(),
            afiliasi:
                z.string({ message: "Harus diisi / harus berupa kata" })
                    .nonempty("Filed Tidak Boleh Kosong")
                    .max(255, "Input Terlalu Banyak (Max 255 Kata)")
                    .trim(),
            admin_role:
                z.string({ message: "Harus diisi / harus berupa string" })
                    .nonempty("FieldTidak Boleh Kosong")
                    .max(255, "Max 255 Kata")
                    .trim()
        });

        // Extract form fields
        const id_admin = data.get("id_admin");
        const id_user = data.get("id_user");
        const nama_lengkap = data.get("nama_lengkap");
        const username = data.get("username");
        const email = data.get("email");
        const no_telp = data.get("no_telp");
        const tgl_lahir = data.get("tgl_lahir");
        const kota_lahir = data.get("kota_lahir");
        const jenis_kelamin = data.get("jenis_kelamin");
        const afiliasi = data.get("afiliasi");
        const admin_role = data.get("admin_role");
        const status_aktif = data.get("status_aktif") || 0;

        const formData = {
            nama_lengkap,
            username,
            email,
            no_telp,
            tgl_lahir,
            jenis_kelamin,
            kota_lahir,
            afiliasi,
            admin_role
        };

        const verif = ver.safeParse({ ...formData });

        if (!verif.success) {
            const fieldErrors = verif.error.flatten().fieldErrors;
            return fail(406, {
                errors: fieldErrors,
                success: false,
                formData: formData,
                type: "edit"
            });
        }

        try {
            // Format date for API
            const formattedDate = tgl_lahir instanceof Date
                ? tgl_lahir.toISOString().split('T')[0]
                : new Date(String(tgl_lahir)).toISOString().split('T')[0];

            // Determine id_kerajaan based on afiliasi
            const id_kerajaan = afiliasi === "marsi" ? 0 : Number(afiliasi);

            // Prepare payload for API
            const adminPayload = {
                id_admin: Number(id_admin),
                nama_lengkap: String(nama_lengkap),
                jenis_kelamin: String(jenis_kelamin),
                tempat_lahir: String(kota_lahir),
                tanggal_lahir: formattedDate,
                username: String(username),
                email: String(email),
                no_telp: String(no_telp),
                id_kerajaan: id_kerajaan,
                jenis_admin: String(admin_role),
                status_aktif: Number(status_aktif)
            };

            console.log("Sending admin update to API:", adminPayload);

            // Send data to API
            const response = await fetch(`${env.BASE_URL}/admin`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(adminPayload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error updating admin:", errorData);
                return fail(response.status, {
                    errors: { api: [errorData.message || "Failed to update admin"] },
                    success: false,
                    formData: formData,
                    type: "edit"
                });
            }

            // Setelah berhasil update di BASE_URL/admin
            const responseData = await response.json();
            console.log("Admin updated successfully:", responseData);

            // Ambil nilai field "superadmin" dari form
            const superadmin = data.get("superadmin") || "tidak";

            // Ambil id_user dari form (pastikan field id_user ada pada form)
            const id_user_val = data.get("id_user") ? Number(data.get("id_user")) : null;

            if (id_user_val) {
                if (superadmin === "tidak") {
                    // Cek terlebih dahulu di BASE_URL_8008, apakah admin dengan id_user sama sudah ada
                    console.log("hi22")
                    const admin8008Get = await fetch(`${env.BASE_URL_8008}/admin?limit=1000`, {
                        method: "GET",
                        headers: { "Accept": "application/json" }
                    });
                    if (admin8008Get.ok) {
                        const admin8008Data = await admin8008Get.json();
                        const exists = admin8008Data.find((admin: any) => Number(admin.id_user) === id_user_val);
                        console.log("exist : ", exists)
                        if (exists) {
                            // Jalankan update di BASE_URL_8008
                            const updateResponse = await fetch(`${env.BASE_URL_8008}/admin/${exists.id_admin}`, {
                                method: "DELETE",
                                headers: { "Content-Type": "application/json" },
                            });
                            if (!updateResponse.ok) {
                                const errText = await updateResponse.text();
                                console.error("Gagal update admin di BASE_URL_8008:", errText);
                            } else {
                                console.log("Berhasil update admin di BASE_URL_8008 untuk id_user:", id_user_val);
                            }
                        }
                    } else {
                        console.error("Error fetching admin dari BASE_URL_8008:", admin8008Get.status);
                    }
                } else if (superadmin === "ya") {
                    // Langsung POST ke endpoint BASE_URL_8008/admin/user dengan payload baru
                    const superAdminPayload = {
                        id_user: id_user_val,
                        afiliasi: "",
                        jenis_admin: "Super Admin"
                    };
                    const response8008 = await fetch(`${env.BASE_URL_8008}/admin/user`, {
                        method: 'POST',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(superAdminPayload)
                    });
                    if (!response8008.ok) {
                        const errText = await response8008.text();
                        console.error("Gagal membuat superadmin di BASE_URL_8008:", errText);
                    } else {
                        console.log("Berhasil membuat superadmin di BASE_URL_8008 untuk id_user:", id_user_val);
                    }
                }
            }

            return {
                success: true,
                message: "Admin berhasil diperbarui",
                formData,
                type: "edit"
            };
        } catch (error) {
            console.error("Error in ubah action:", error);
            return fail(500, {
                errors: { exception: ["Server error when updating admin"] },
                success: false,
                formData: formData,
                type: "edit"
            });
        }
    },

    updateStatus: async ({ request }) => {
        const data = await request.formData();
        console.log(data);

        const adminId = data.get("id_admin");
        const newStatus = data.get("status_aktif") === "1" ? 0 : 1;

        try {
            // Get all admin data from the form
            const adminData: any = Object.fromEntries(data);
            console.log("Data admin : ", adminData)

            // Convert ID fields to numbers
            adminData.id_admin = Number(adminData.id_admin);
            adminData.id_kerajaan = Number(adminData.id_kerajaan);
            adminData.password = adminData.password || "password";
            adminData.tanggal_lahir = adminData.tanggal_lahir.split("T")[0];

            // Update the status_aktif field with the new value
            adminData.status_aktif = newStatus;

            console.log("Sending admin update with data:", adminData);

            const response = await fetch(`${env.BASE_URL}/admin`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(adminData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error updating admin:", errorData);
                return fail(response.status, {
                    success: false,
                    message: `Failed to update admin: ${errorData.message || response.statusText}`
                });
            }

            if (response.ok) {
                console.log("Saya mau main juga")
            }

            return {
                success: true,
                message: "Admin updated successfully",
                adminId,
                newStatus
            };
        } catch (error) {
            console.error("Error in updateStatus action:", error);
            return fail(500, {
                success: false,
                message: "Server error when updating admin"
            });
        }
    },

    delete: async ({ request }) => {
        const data = await request.formData();
        const id_admin = data.get("id_admin");

        if (!id_admin) {
            return fail(400, { error: "ID Admin tidak ditemukan" });
        }

        console.log("Deleting admin with ID:", id_admin);

        try {
            // First, check if the admin exists
            const checkRes = await fetch(`${env.BASE_URL}/admin/${id_admin}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            });

            if (!checkRes.ok) {
                console.error(`Failed to find admin: ${checkRes.status}`);
                return fail(404, { error: "Admin tidak ditemukan" });
            }

            // Perform the delete operation
            const deleteRes = await fetch(`${env.BASE_URL}/admin/${id_admin}`, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json"
                }
            });

            if (!deleteRes.ok) {
                const errorData = await deleteRes.json().catch(() => ({}));
                console.error("Delete failed:", deleteRes.status, errorData);
                return fail(deleteRes.status, {
                    error: errorData.message || `Gagal menghapus admin (${deleteRes.status})`
                });
            }

            const successData = await deleteRes.json().catch(() => ({ message: "Success" }));
            console.log("Delete successful:", successData);

            // Return success response
            return {
                success: true,
                message: "Admin berhasil dihapus"
            };
        } catch (error) {
            console.error("Error in delete action:", error);
            return fail(500, { error: "Terjadi kesalahan saat menghapus admin" });
        }
    }
};
