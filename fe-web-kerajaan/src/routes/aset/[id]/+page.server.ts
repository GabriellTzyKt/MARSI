import type { PageServerLoad } from "../$types";
import situs1 from '$lib/asset/kerajaan/situs1.png';

export const load: PageServerLoad = async () => {
    const data = {
        id: 1,
        header: 'Keraton Surakarta Hadiningrat',
        isi: `Umbul Tirtomulyo adalah sebuah mata air alami yang terletak di Surakarta, Jawa Tengah.
              Dikenal karena kejernihan airnya yang memukau, tempat ini menjadi salah satu tujuan
              wisata populer bagi penduduk lokal maupun wisatawan. Dengan suasana yang tenang dan
              pemandangan alam yang indah, Umbul Tirtomulyo menawarkan pengalaman rekreasi yang
              menyegarkan. In the name of the wind`,
        situs: situs1,
        status: 'benda'
    }
    return { data };
};