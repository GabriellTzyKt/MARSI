import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({cookies}) => {
    const nama = cookies.get('userSession')
    const hasil = nama ? JSON.parse(nama) : 'halo'
    const tes = cookies.get('userSession') ? JSON.parse(cookies.get('userSession') as string) : "Haslo"
    console.log(hasil)
    return {hasil : hasil.nama}
};

