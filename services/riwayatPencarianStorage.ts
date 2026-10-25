// services/riwayatPencarianStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface ItemRiwayatPencarian {
  id: number;
  nama: string;
  latitude: number;
  longitude: number;
  country?: string;
  waktu: number;
}

const KUNCI_STORAGE = "@jelajah_aman:riwayat_pencarian";
const MAKSIMAL_RIWAYAT = 10;

export async function ambilRiwayatPencarian(): Promise<ItemRiwayatPencarian[]> {
  try {
    const raw = await AsyncStorage.getItem(KUNCI_STORAGE);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function simpanRiwayatPencarian(
  item: Omit<ItemRiwayatPencarian, "waktu">
): Promise<void> {
  try {
    const daftar = await ambilRiwayatPencarian();
    // Cegah duplikasi: buang jika nama atau koordinat sama
    const filtered = daftar.filter(
      (k) =>
        k.nama.toLowerCase() !== item.nama.toLowerCase() &&
        !(k.latitude === item.latitude && k.longitude === item.longitude)
    );
    const dataBaru: ItemRiwayatPencarian[] = [
      { ...item, waktu: Date.now() },
      ...filtered,
    ].slice(0, MAKSIMAL_RIWAYAT); // Maksimal 10 pencarian terakhir

    await AsyncStorage.setItem(KUNCI_STORAGE, JSON.stringify(dataBaru));
  } catch (e) {
    console.error("Gagal menyimpan riwayat pencarian:", e);
  }
}

export async function hapusSatuRiwayat(id: number, nama: string): Promise<void> {
  try {
    const daftar = await ambilRiwayatPencarian();
    const baru = daftar.filter((k) => k.id !== id || k.nama !== nama);
    await AsyncStorage.setItem(KUNCI_STORAGE, JSON.stringify(baru));
  } catch (e) {
    console.error("Gagal menghapus item riwayat:", e);
  }
}

export async function hapusSemuaRiwayat(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KUNCI_STORAGE);
  } catch (e) {
    console.error("Gagal mengosongkan riwayat:", e);
  }
}
