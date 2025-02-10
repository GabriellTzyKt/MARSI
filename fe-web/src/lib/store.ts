// store.ts
import { writable } from 'svelte/store';

// Store untuk menyimpan ID dropdown yang terbuka
export const openDropdown = writable<string | null>(null);

export const colors: Record<any,string> = {
    Berlangsung: '#9DD4FB',
    Disetujui: '#87EC80',
    Pending: '#EAEC6E',
    Selesai: '#A1A1A1',
    Ditolak: '#E58D8D'
}

export const kerajaanData = writable({
	nama_kerajaan: '',
	lokasi: '',
	gambar: '',
    lambang: '',
    bendera: '',
    tahun: '',
    nama_kasunanan: '',
    isi_singkat:'',
    gambar1: '',
    gambar2: '',
    gambar3: '',
    gambar4: '',
});