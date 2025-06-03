import type { PageServerLoad } from "./managemen/$types";

export const load: PageServerLoad = async ({ cookies }) => {
    const nama = cookies.get('userSession')

    if (!nama) {
        // Kembalikan default ataupun redirect sesuai kebutuhan
        return { hasil: "", tipe: "", id_kerajaan: 0 };
    }

    const hasil = nama ? JSON.parse(nama) : 'halo'
    const tes = cookies.get('userSession') ? JSON.parse(cookies.get('userSession') as string) : "Haslo"
    console.log(hasil)
    return { hasil: hasil.nama, tipe: hasil.adminType, id_kerajaan: hasil.adminData.id_kerajaan || 0 }
};

