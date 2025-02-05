// store.ts
import { writable } from 'svelte/store';

// Store untuk menyimpan ID dropdown yang terbuka
export const openDropdown = writable<string | null>(null);