import { fail, type Actions } from "@sveltejs/kit";
import { z } from "zod";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";
import { formatDate, formatDatetoUI } from "$lib";
export const load: PageServerLoad = async ({cookies}) => {
    try {
        let token = cookies.get("userSession") ? JSON.parse(cookies.get("userSession") as string) : '';
        if (!token) {
            throw new Error("Token tidak ditemukan");
        }
        let [userRes, adminRes] = await Promise.all([
            fetch(`${env.PUB_PORT}/users`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token.token}`
                }
            }),
            fetch(`${env.URL_KERAJAAN}/admin?limit=10000`)
        ]);
        if (!userRes.ok || !adminRes.ok) {
            throw new Error(`HTTP Error! Status: ${userRes.status} ${adminRes.status}`);
        }
        let userData = await userRes.json();
        userData = userData.filter((item: any) => {
            return item.deleted_at === "0001-01-01T00:00:00Z" || !item.deleted_at;
        }).map((item: any) => {
            return {
                id: item.id_user,
                name: item.nama_lengkap,
                email: item.email,
                username: item.username,
                no_telp: item.no_telp,
                jenis_kelamin: item.jenis_kelamin,
                tempat_lahir: item.tempat_lahir,
                tanggal_lahir: formatDate(item.tanggal_lahir),
                password: item.password,
            };
        }
        );
        let data = await adminRes.json();
        data = data.filter(item => item.deleted_at === "0001-01-01T00:00:00Z");
        data = await Promise.all(data.map(async (item) => {
            try {
                let afiliasiData = null;
        if (item.jenis_admin.toLowerCase() === 'admin komunitas') {
            // Fetch komunitas
            const res = await fetch(`${env.URL_KERAJAAN}/komunitas/${item.afiliasi}`);
            afiliasiData = res.ok ? await res.json() : item.afiliasi;
        } else if (item.jenis_admin.toLowerCase() === 'admin organisasi') {
            // Fetch organisasi
            const res = await fetch(`${env.URL_KERAJAAN}/organisasi/${item.afiliasi}`);
            afiliasiData = res.ok ? await res.json() : item.afiliasi
        } else if (item.jenis_admin.toLowerCase() === 'admin situs') {
            // Fetch situs
            const res = await fetch(`${env.URL_KERAJAAN}/situs/${item.afiliasi}`);
            afiliasiData = res.ok ? await res.json() : item.afiliasi;
        } else if (item.jenis_admin.toLowerCase() === 'super admin') {
            afiliasiData = item.afiliasi; // Super admin tidak punya afiliasi khusus
            }
                
                return {
            ...item,
            afiliasi_data: afiliasiData.nama_organisasi||afiliasiData.nama_situs||afiliasiData.nama_komunitas||item.afiliasi
                };
                
            } catch (error) {
                
            }
        }))
        // console.log("User Data:", userData);
        return {data, user: userData, userSession: token};
    } catch (error) {

    }
};

export const actions: Actions = {
    tambah: async ({ request }) => {
        const data = await request.formData()
        console.log(data)
        const akun = data.get("superadmin")
        const accVer = z.object({
            nama_lengkap:
                z.string({ message: "Harus diisi / harus berupa string" })
                    .nonempty("Tidak Boleh kosong")
                    .max(300, "Nama Terlalu Panjang (max = 300)")
                    .trim(),
            id_user: z.string().nonempty("Field Tidak Boleh Kosong"),
            admin_role:
                z.string({ message: "Harus diisi / harus berupa string" })
                    .nonempty("Field Tidak Boleh Kosong")
                    .max(255, "Max 255 Kata")
                    .trim(),
            
           
        })
        const ver = z.object({
            nama_lengkap:
                z.string({ message: "Harus diisi / harus berupa string" })
                    .nonempty("Tidak Boleh kosong")
                    .max(300, "Nama Terlalu Panjang (max = 300)")
                    .trim(),

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

        

            admin_role:
                z.string({ message: "Harus diisi" })
                    .nonempty("Field Tidak Boleh Kosong")
                    .min(1, "Minimal pilih 1")
                    .trim()


        })
        if (akun === "sekre_ya") {
            const dt = {
                nama_lengkap: data.get("nama_lengkap"),
                id_user: data.get("id_user"),
                admin_role: data.get("admin_role"),
                afiliasi: data.get("afiliasi_id")||"-"
            }
            const verif = accVer.safeParse({...dt})

            if (!verif.success) {

                const fieldErrors = verif.error.flatten().fieldErrors;

                console.log("errors : ", fieldErrors)

                return fail(406, {
                    errors: fieldErrors,
                    success: false,
                    
                    type: "add"
                });

            }
             try {
                let role = ''
             
                let sendData = {
                    id_user: Number(data.get("id_user")),
                    afiliasi : data.get("afiliasi_id") || "Afiliasi Tidak Ada",
                    jenis_admin: data.get("admin_role")
                }
                console.log(sendData)
                const res = await fetch(`${env.URL_KERAJAAN}/admin/user`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(sendData)
                })
                if (!res.ok) {
                    return fail(406, { errors_api: "Gagal menambahkan admin" })
                    throw new Error(`HTTP Error! Status: ${res.status} ${res.statusText}`)
                }
                console.log(res)
            } catch (error) {
                console.log(error)
                return fail(406, { errors_api: "Gagal menambahkan admin (username/email terpakai)" })
            }
            return { success: true, type: "add" }
        }
        else {
            
            const nama_lengkap = data.get("nama_lengkap")
            const username = data.get("username")
            const email = data.get("email")
            const password = data.get("password")
            const jenis_kelamin = data.get("jenis_kelamin")
            const no_telp = data.get("no_telp")
            const tgl_lahir = data.get("tgl_lahir")
            const kota_lahir = data.get("kota_lahir")
            const afiliasi = data.get("afiliasi_id") ||"-";
            const afiliasiSingle = data.get("afiliasi") ||"-";
            const admin_role = data.get("admin_role")
            const formData = {
                nama_lengkap,
                jenis_kelamin,
                username,
                email,
                no_telp,
                password,
                tgl_lahir,
                kota_lahir,
                afiliasi: afiliasi,
                admin_role
            }
            const verif = ver.safeParse({ ...formData })
    
            if (!verif.success) {
    
                const fieldErrors = verif.error.flatten().fieldErrors;
    
                console.log("errors : ", fieldErrors)
    
                return fail(406, {
                    errors: fieldErrors,
                    success: false,
                    formData: formData,
                    type: "add"
                });
    
            }

            try {
                let role = ''
             
                let sendData = {
                    nama_lengkap,
                    jenis_kelamin,
                    tempat_lahir: kota_lahir,
                    tanggal_lahir: formatDatetoUI(tgl_lahir),
                    username,
                    password,
                    email,
                    no_telp,
                    afiliasi : data.get("afiliasi_id") || "0",
                    jenis_admin: admin_role
                }
                console.log(sendData)
                const res = await fetch(`${env.URL_KERAJAAN}/admin`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(sendData)
                })
                let msh = await res.json()
                if (!res.ok) {
                    console.log(msh)
                    return fail(406, { errors_api: msh.message })
                    throw new Error(`HTTP Error! Status: ${res.status} ${res.statusText}`)
                }
                console.log(res)
            } catch (error) {
                console.log(error)
                return fail(406, { errors_api: "Gagal menambahkan admin (username/email terpakai)" })
            }
            return { success: true, formData, type: "add" }
        }
    },

    ubahAdmin: async ({ request, cookies }) => {
        let token = cookies.get("userSession") ? JSON.parse(cookies.get("userSession") as string) : '';
        let sendData = {};
         const data = await request.formData()
         let obj = Object.fromEntries(data)
        console.log(data)
        const akun = data.get("superadmin")
        const accVer = z.object({
            nama_lengkap:
                z.string({ message: "Harus diisi / harus berupa string" })
                    .nonempty("Tidak Boleh kosong")
                    .max(300, "Nama Terlalu Panjang (max = 300)")
                    .trim(),
            admin_role:
                z.string({ message: "Harus diisi / harus berupa string" })
                    .nonempty("Field Tidak Boleh Kosong")
                    .max(255, "Max 255 Kata")
                    .trim(),
            afiliasi:
                z.array(z.string().nonempty("Tidak Boleh Kosong"))
                    .min(1, { message: "Minimal 1 Afiliasi" })
        })
        const ver = z.object({
            nama_lengkap:
                z.string({ message: "Harus diisi / harus berupa string" })
                    .nonempty("Tidak Boleh kosong")
                    .max(300, "Nama Terlalu Panjang (max = 300)")
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

           

            admin_role:
                z.string({ message: "Harus diisi" })
                    .nonempty("Field Tidak Boleh Kosong")
                    .min(1, "Minimal pilih 1")
                    .trim()


        })
        
        let dataVerif = {
            nama_lengkap: data.get("nama_lengkap"),
            email: data.get("email"),
          
            no_telp: data.get("no_telp"),
            
            tgl_lahir: data.get("tgl_lahir"),
            kota_lahir: data.get("kota_lahir"),
            jenis_kelamin: data.get("jenis_kelamin"),
            admin_role: data.get("admin_role"),
         
        }   
        const verif = ver.safeParse(dataVerif)
        console.log("dataFerif",dataVerif)
        if (!verif.success) {
    
            const fieldErrors = verif.error.flatten().fieldErrors;
    
            console.log("errors : ", fieldErrors)
    
            return fail(406, {
                errors: fieldErrors,
                success: false,
                
                type: "edit"
            });
    
        }
       try {
            let sendData = {
                id_admin: Number(data.get("id_admin") as string),
                nama_lengkap: data.get("nama_lengkap"),
                email: data.get("email"),
                no_telp: data.get("no_telp"),
                tanggal_lahir: data.get("tgl_lahir"),
                tempat_lahir: data.get("kota_lahir"),
                jenis_kelamin: data.get("jenis_kelamin"),
                afiliasi: data.get("afiliasi_id"),
                jenis_admin: data.get("admin_role"),
                status_aktif: 1
            }
            console.log("Form Data: ", sendData)
            let res = await fetch(`${env.URL_KERAJAAN}/admin`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization" : `Bearer ${token?.token}`
                },
                body: JSON.stringify(sendData)
            })
            let msg = await res.json()
            if (!res.ok) {
                console.log(msg)
                throw new Error(`HTTP Error! Status: ${res.status} ${res.statusText}`)
           }
            console.log(res.statusText, res.status)
            return { success: true }
        } catch (error) {
            
        }
    },
    hapusAdmin: async ({ request }) => {
        const data = await request.formData()
        const id = data.get("id_admin")
        console.log("Id yang dihapus: ",id)
        try {
            const del = await fetch(`${env.URL_KERAJAAN}/admin/${id}`, {
                method: "DELETE"
            })
            if (!del.ok) {
                throw new Error(`HTTP Error! Status: ${del.status} ${del.statusText}`)
            }
            console.log(del.statusText, del.status)
            return { success: true }
        } catch (error) {
            console.log(error)
            return fail(406, { errors_api: "Gagal menghapus admin" })
        }
    },
    nonAktifkan: async ({ request, cookies }) => {
        const token = cookies.get("userSession") ? JSON.parse(cookies.get("userSession") as string) : '';
        const data = await request.formData()
        const id = data.get("id_user")
        let status = data.get("status_aktif")
        let resStatus = Number(data.get("status_aktif") as string)
        if (status == "1") {
            resStatus = 0
        }
        else {
            resStatus = 1
        }
        console.log("data non aktif",data)
        console.log("Id yang dihapus: ",id)
        let dataSend = {
           id_admin: Number(data.get("id_admin") as string),
           nama_lengkap: data.get("nama_lengkap"),
                email: data.get("email"),
                no_telp: data.get("no_telp"),
                tanggal_lahir: formatDatetoUI(data.get("tanggal_lahir") as string),
                tempat_lahir: data.get("tempat_lahir"),
                jenis_kelamin: data.get("jenis_kelamin"),
                jenis_admin: data.get("jenis_admin"),
                status_aktif: resStatus,
        }
        console.log("Data yang dikirim: ",dataSend)
        try {
            const del = await fetch(`${env.URL_KERAJAAN}/admin`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token?.token}`
                },
                body: JSON.stringify(dataSend)
            })
            if (!del.ok) {
                throw new Error(`HTTP Error! Status: ${del.status} ${del.statusText}`)
            }
            console.log(del.statusText, del.status)
            return { success: true }
        } catch (error) {
            console.log(error)
            return fail(406, { errors_api: "Gagal menghapus admin" })
        }
    },

};