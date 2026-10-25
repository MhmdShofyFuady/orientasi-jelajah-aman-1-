// services/favoritStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KotaFavorit } from "../types/favorit";

const KUNCI_PENYIMPANAN = "@jelajah_aman:favorit";

export async function ambilSemuaFavorit(): Promise<KotaFavorit[]> {
    try {
        const json = await AsyncStorage.getItem(KUNCI_PENYIMPANAN);
        return json ? JSON.parse(json) : [];
    } catch {
        return [];
    }
}

export async function tambahFavorit(kota: KotaFavorit): Promise<void> {
    try {
        const daftar = await ambilSemuaFavorit();
        const sudahAda = daftar.some((k) => String(k.id) === String(kota.id));
        if (sudahAda) return;
        const daftarBaru = [...daftar, { ...kota, id: Number(kota.id) }];
        await AsyncStorage.setItem(KUNCI_PENYIMPANAN, JSON.stringify(daftarBaru));
    } catch (e) {
        console.error("Gagal menambah favorit:", e);
    }
}

export async function hapusFavorit(id: number | string): Promise<void> {
    try {
        const daftar = await ambilSemuaFavorit();
        const daftarBaru = daftar.filter((k) => String(k.id) !== String(id));
        await AsyncStorage.setItem(KUNCI_PENYIMPANAN, JSON.stringify(daftarBaru));
    } catch (e) {
        console.error("Gagal menghapus favorit:", e);
    }
}
