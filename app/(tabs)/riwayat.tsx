// app/(tabs)/riwayat.tsx
import { useFocusEffect, router } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Button,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ambilSemuaFavorit, hapusFavorit } from "../../services/favoritStorage";
import {
  daftarKotaTersimpan,
  hapusCacheKota,
} from "../../services/cacheRepository";
import {
  ambilRiwayatPencarian,
  hapusSatuRiwayat,
  ItemRiwayatPencarian,
} from "../../services/riwayatPencarianStorage";
import { KotaFavorit } from "../../types/favorit";
import { RingkasanKotaTersimpan } from "../../types/cache";
import { useTheme } from "../../context/ThemeContext";

export default function TabRiwayat() {
  const { tema } = useTheme();
  const [daftarFavorit, setDaftarFavorit] = useState<KotaFavorit[]>([]);
  const [daftarRiwayat, setDaftarRiwayat] = useState<ItemRiwayatPencarian[]>([]);
  const [daftarCache, setDaftarCache] = useState<RingkasanKotaTersimpan[]>([]);

  const muatSemuaData = useCallback(() => {
    ambilSemuaFavorit().then(setDaftarFavorit).catch(() => {});
    ambilRiwayatPencarian().then(setDaftarRiwayat).catch(() => {});
    daftarKotaTersimpan().then(setDaftarCache).catch(() => {});
  }, []);

  useFocusEffect(
    useCallback(() => {
      muatSemuaData();
    }, [muatSemuaData])
  );

  // --- 1. Aksi Klik Riwayat: buka otomatis di Beranda ---
  function bukaKotaDiBeranda(kota: {
    id: number;
    nama: string;
    latitude: number;
    longitude: number;
  }) {
    router.push({
      pathname: "/",
      params: {
        id: String(kota.id),
        kota: kota.nama,
        lat: String(kota.latitude),
        lon: String(kota.longitude),
      },
    });
  }

  // --- 2. Hapus Cache Kota (dengan Alert) ---
  async function eksekusiHapusCache(kunci: string) {
    await hapusCacheKota(kunci);
    setDaftarCache((prev) => prev.filter((c) => c.kunci !== kunci));
  }

  function konfirmasiHapusCache(item: RingkasanKotaTersimpan) {
    if (Platform.OS === "web") {
      const yakin =
        typeof window !== "undefined"
          ? window.confirm(
              `Yakin ingin menghapus cache data cuaca kota ${item.nama}?`
            )
          : true;
      if (yakin) {
        eksekusiHapusCache(item.kunci);
      }
      return;
    }

    Alert.alert(
      "Konfirmasi Hapus Cache",
      `Apakah Anda yakin ingin menghapus data cache cuaca untuk "${item.nama}" dari perangkat?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: () => eksekusiHapusCache(item.kunci),
        },
      ]
    );
  }

  // --- 3. Hapus Favorit ---
  async function eksekusiHapusFavorit(id: number | string) {
    await hapusFavorit(id);
    setDaftarFavorit((prev) => prev.filter((k) => String(k.id) !== String(id)));
  }

  function konfirmasiHapusFavorit(kota: KotaFavorit) {
    if (Platform.OS === "web") {
      const yakin =
        typeof window !== "undefined"
          ? window.confirm(`Yakin hapus ${kota.nama} dari favorit?`)
          : true;
      if (yakin) {
        eksekusiHapusFavorit(kota.id);
      }
      return;
    }

    Alert.alert("Konfirmasi", `Yakin hapus ${kota.nama} dari favorit?`, [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => eksekusiHapusFavorit(kota.id),
      },
    ]);
  }

  // --- 4. Hapus Satu Riwayat Pencarian ---
  async function eksekusiHapusRiwayat(id: number, nama: string) {
    await hapusSatuRiwayat(id, nama);
    setDaftarRiwayat((prev) =>
      prev.filter((item) => !(item.id === id && item.nama === nama))
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tema.background }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* SECTION 1: RIWAYAT PENCARIAN TERAKHIR (MAX 10) */}
        <View style={{ gap: 8 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: tema.text,
              }}
            >
              🕒 Riwayat Pencarian Terakhir
            </Text>
            <Text style={{ fontSize: 12, color: tema.subtext }}>
              {daftarRiwayat.length}/10 kota
            </Text>
          </View>
          <Text style={{ fontSize: 12, color: tema.subtext }}>
            Ketuk kota untuk langsung menampilkan informasi cuaca
          </Text>

          {daftarRiwayat.length === 0 ? (
            <Text style={{ color: tema.subtext, fontStyle: "italic" }}>
              Belum ada riwayat pencarian.
            </Text>
          ) : (
            daftarRiwayat.map((item, idx) => (
              <View
                key={`${item.id}-${idx}`}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: tema.card,
                  padding: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: tema.border,
                }}
              >
                <TouchableOpacity
                  onPress={() => bukaKotaDiBeranda(item)}
                  style={{ flex: 1 }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: tema.text,
                    }}
                  >
                    {item.nama}
                  </Text>
                  {item.country ? (
                    <Text style={{ fontSize: 12, color: tema.subtext }}>
                      {item.country}
                    </Text>
                  ) : null}
                </TouchableOpacity>
                <Button
                  title="Hapus"
                  color="#ef4444"
                  onPress={() => eksekusiHapusRiwayat(item.id, item.nama)}
                />
              </View>
            ))
          )}
        </View>

        {/* SECTION 2: CACHE KOTA TERSIMPAN (OFFLINE FIRST) */}
        <View style={{ gap: 8 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: tema.text,
              }}
            >
              💾 Cache Cuaca Tersimpan
            </Text>
            <Text style={{ fontSize: 12, color: tema.subtext }}>
              {daftarCache.length} tersimpan
            </Text>
          </View>
          <Text style={{ fontSize: 12, color: tema.subtext }}>
            Data cuaca tersimpan di SQLite perangkat untuk akses offline
          </Text>

          {daftarCache.length === 0 ? (
            <Text style={{ color: tema.subtext, fontStyle: "italic" }}>
              Tidak ada data cache tersimpan di perangkat.
            </Text>
          ) : (
            daftarCache.map((item) => (
              <View
                key={item.kunci}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: tema.card,
                  padding: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: tema.border,
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    bukaKotaDiBeranda({
                      id: item.id,
                      nama: item.nama,
                      latitude: item.latitude,
                      longitude: item.longitude,
                    })
                  }
                  style={{ flex: 1 }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: tema.text,
                    }}
                  >
                    {item.nama}
                  </Text>
                  <Text style={{ fontSize: 11, color: tema.subtext }}>
                    Disimpan: {new Date(item.disimpanPada).toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
                <Button
                  title="Hapus Cache"
                  color="#dc2626"
                  onPress={() => konfirmasiHapusCache(item)}
                />
              </View>
            ))
          )}
        </View>

        {/* SECTION 3: KOTA FAVORIT */}
        <View style={{ gap: 8 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: tema.text,
              }}
            >
              ⭐ Kota Favorit
            </Text>
            <Text style={{ fontSize: 12, color: tema.subtext }}>
              {daftarFavorit.length} favorit
            </Text>
          </View>

          {daftarFavorit.length === 0 ? (
            <Text style={{ color: tema.subtext, fontStyle: "italic" }}>
              Belum ada kota favorit.
            </Text>
          ) : (
            daftarFavorit.map((kota, index) => (
              <View
                key={kota.id ?? index}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: tema.card,
                  padding: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: tema.border,
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    bukaKotaDiBeranda({
                      id: kota.id,
                      nama: kota.nama,
                      latitude: kota.latitude,
                      longitude: kota.longitude,
                    })
                  }
                  style={{ flex: 1 }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: tema.text,
                    }}
                  >
                    {kota.nama}
                  </Text>
                </TouchableOpacity>
                <Button
                  title="Hapus"
                  color="#ef4444"
                  onPress={() => konfirmasiHapusFavorit(kota)}
                />
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

