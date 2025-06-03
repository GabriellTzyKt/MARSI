import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';

const regionMap = [
    { keyword: 'jawa', lokasi: 'Jawa' },
    { keyword: 'sumatera', lokasi: 'Sumatera' },
    { keyword: 'kalimantan', lokasi: 'Kalimantan' },
    { keyword: 'sulawesi', lokasi: 'Sulawesi' },
    { keyword: 'papua', lokasi: 'Papua' },
    { keyword: 'bali', lokasi: 'Bali' },
    { keyword: 'ntt', lokasi: 'Ntt' },
    { keyword: 'ntb', lokasi: 'Ntb' },
    { keyword: 'maluku', lokasi: 'Maluku' }
];

function detectRegion(alamat: string) {
    if (!alamat) return '-';
    const lower = alamat.toLowerCase();
    for (const region of regionMap) {
        if (lower.includes(region.keyword)) {
            return region.lokasi;
        }
    }
    return '-';
}

export const load: PageServerLoad = async ({ fetch, cookies }) => {

    const userSession = cookies.get("userSession");
    if (!userSession) {
        throw redirect(302, '/login2');
    }
    const session = JSON.parse(userSession);
    if (!session.adminData || session.adminData.jenis_admin !== 'super admin') {
        throw redirect(302, `/admin/biodata`);
    }


    try {
        const res = await fetch(env.BASE_URL_8008 + "/acara?limit=200");
        if (!res.ok) {
            console.log("ERROR")
            throw new Error('Failed to fetch acara');
        }
        const acaraData = await res.json();
        const filtered = acaraData
            .filter(
                (a: any) =>
                    !a.deleted_at ||
                    a.deleted_at === '0001-01-01T00:00:00Z'
            )
            .map((a: any) => ({
                ...a,
                tanggalmulai: a.waktu_mulai.split("T")[0],
                lokasi: detectRegion(a.alamat_acara)
            }));
        return { acara: filtered };
    } catch (e: any) {
        return { acara: [], error: e.message };
    }
};
