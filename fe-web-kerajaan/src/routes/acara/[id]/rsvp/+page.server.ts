import { fail, type Actions } from "@sveltejs/kit";
import { z } from "zod";
import { env } from "$env/dynamic/private";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, cookies }) => {
    const cookie = cookies.get("userSession") ? JSON.parse(cookies.get("userSession") as string) : '';
    try {
        // Fetch acara details using the ID
        const id = params.id;
        const response = await fetch(`${env.URL_KERAJAAN}/acara/${id}`);

        if (!response.ok) {
            console.error(`Failed to fetch acara with ID ${id}: ${response.status}`);
            // return { acara: null, error: `Failed to fetch acara details` };
        }

        const acara = await response.json();


        const usersResponse = await fetch(`${env.PUB_PORT}/users`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${cookie.token}`
            }
        });
        let allUsers = [];
        if (usersResponse.ok) {
            allUsers = await usersResponse.json();
            console.log("All users:", allUsers);
        } else {
            console.error(`Failed to fetch users: ${usersResponse.statusText}`);
        }

        return { acara, allUsers };
    } catch (error) {
        console.error("Error loading acara details:", error);
        return { acara: null, error: "Server error" };
    }
};

export const actions: Actions = {
    tambah: async ({ request, params }) => {
        const data = await request.formData();
        const id = params.id;
        console.log("Form data received:", data);
        console.log("ID : ", id);

        // Get the main attendee data
        const id_user = data.get("id_user");
        const nama_lengkap = data.get("nama_lengkap") || ""; // Get the name from the form
        const no_telp = data.get("nomortelepon") || "";
        const jenis_kelamin = data.get("jenis_kelamin") || "";
        
        // Create the main attendee object
        const mainAttendee = {
            id_user: Number(id_user),
            id_acara: Number(id),
            nama: String(nama_lengkap), // Use the name from the form
            no_telp: String(no_telp),
            jenis_kelamin: String(jenis_kelamin)
        };
        
        // mendefinisikan data yg diterima utk tamu
        interface TamuItem {
            id_user: Number;
            id_acara: Number;
            nama: string;
            no_telp: string;
            jenis_kelamin: string;
        }

        // Buat array untuk menyimpan semua peserta (utama + tambahan)
        let allAttendees: TamuItem[] = [];

        // Validasi schema untuk peserta
        const attendeeSchema = z.object({
            no_telp: z.string().trim().min(1, "No telepon harus diisi!"),
        });

        // nyimpen error-errornya, dengan tipe string
        let allErrors: { [key: string]: string } = {};

        // Extract main attendee data
        const mainGender = String(data.get("jenis_kelamin") || "").trim();
        const mainPhone = String(data.get("nomortelepon") || "").trim();
        const idUser = String(data.get("id_user") || "").trim();
        const namaLengkap = String(data.get("nama_lengkap") || "").trim();

        // Validate main attendee data
        const mainValidation = attendeeSchema.safeParse({
            jenis_kelamin: mainGender,
            no_telp: mainPhone
        });

        if (!mainValidation.success) {
            const mainErrors = mainValidation.error.flatten().fieldErrors;
            console.log("Main attendee validation failed:", mainErrors);

            // Convert array errors to string errors
            for (const [field, messages] of Object.entries(mainErrors)) {
                if (messages && messages.length > 0) {
                    // Map field names to match form field names
                    const fieldMap: { [key: string]: string } = {
                        'nama': 'namalengkap',
                        'jenis_kelamin': 'jeniskelamin',
                        'no_telp': 'nomortelepon'
                    };
                    allErrors[fieldMap[field] || field] = messages[0];
                }
            }
        } else {
            // Add main attendee to the array
            allAttendees.push({
                id_user: Number(idUser),
                id_acara: Number(id),
                nama: namaLengkap,
                no_telp: mainPhone,
                jenis_kelamin: mainGender || "None"
            });
        }

        // tambahan tamu
        const hasTamu = data.get("has_tamu") === "true";
        const tamuCount = hasTamu ? parseInt(String(data.get("tamu_count") || "0"), 10) : 0;

        console.log("Has additional guests:", hasTamu);
        console.log("Number of additional guests:", tamuCount);

        // Pengecekan untuk apakah ada tamu tambahan
        if (hasTamu && tamuCount > 0) {
            // Process each additional guest
            for (let i = 0; i < tamuCount; i++) {
                const guestName = String(data.get(`tamu_nama_${i}`) || "null").trim();
                const guestGender = String(data.get(`tamu_jeniskelamin_${i}`) || "null").trim();
                const guestPhone = String(data.get(`tamu_telepon_${i}`) || "null").trim();
                const getId = String(data.get(`tamu_id_${i}`) || "null").trim();

                console.log(`TamuS ${i}:`, {
                    name: guestName,
                    gender: guestGender,
                    phone: guestPhone
                });

                // Validate each guest
                if (!guestName) {
                    allErrors[`tamu_nama_${i}`] = "Nama tamu harus diisi!";
                }
                if (!guestGender) {
                    allErrors[`tamu_jeniskelamin_${i}`] = "Jenis kelamin harus diisi!";
                }
                if (!guestPhone) {
                    allErrors[`tamu_telepon_${i}`] = "No telepon harus diisi!";
                }

                // Add valid guest to the array
                if (guestName && guestGender && guestPhone) {
                    allAttendees.push({
                        id_user: Number(getId),
                        id_acara: Number(id),
                        nama: guestName,
                        no_telp: guestPhone,
                        jenis_kelamin: guestGender
                    });
                }
            }
        }

        // If there are any errors, return them
        if (Object.keys(allErrors).length > 0) {
            console.log("Validation errors:", allErrors);
            console.log("Error keys:", Object.keys(allErrors));
            return fail(406, {
                errors: allErrors,
                success: false,
                formData: {
                    jeniskelamin: mainGender,
                    nomortelepon: mainPhone,
                    id_acara: id
                },
                type: "add"
            });
        }

        console.log("Final data to submit:", allAttendees);

        try {
            const response = await fetch(`${env.URL_KERAJAAN}/acara/rsvp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(allAttendees)
            });

            if (response.ok) {
                const result = await response.json();
                console.log("RSVP submission successful:", result);
                return {
                    success: true,
                    message: "RSVP berhasil ditambahkan"
                };
            } else {
                const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
                console.error("RSVP submission failed:", errorData);
                return fail(response.status, {
                    errors: { server: [`Error: ${errorData.message || response.statusText}`] },
                    success: false,
                    formData: {
                        jeniskelamin: mainGender,
                        nomortelepon: mainPhone,
                        id_acara: id
                    },
                    type: "add"
                });
            }
        } catch (error) {
            console.error("Error submitting RSVP:", error);
            return fail(500, {
                errors: { server: ["Terjadi kesalahan saat menghubungi server"] },
                success: false,
                formData: {
                    jeniskelamin: mainGender,
                    nomortelepon: mainPhone,
                    id_acara: id
                },
                type: "add"
            });
        }
    }
};
