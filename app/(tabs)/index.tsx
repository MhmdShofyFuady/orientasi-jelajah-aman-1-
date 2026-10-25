import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Button,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import SearchBox from "../../components/SearchBox";
import WeatherCard from "../../components/WeatherCard";
import AtribusiCuaca from "../../components/AtribusiCuaca";
import StatusData from "../../components/StatusData";
import { useDebounce } from "../../hooks/use-debounce";
import { cariKota } from "../../services/geocodingService";
import {
  ambilCuacaOfflineFirst,
  BATAS_CACHE_MS,
} from "../../services/cuacaRepository";
import {
  bersihkanCacheLama,
  daftarKotaTersimpan,
} from "../../services/cacheRepository";
import {
  mintaIzinLokasi,
  ambilKoordinatSaatIni,
} from "../../services/locationService";
import { simpanRiwayatPencarian } from "../../services/riwayatPencarianStorage";
import { useTheme } from "../../context/ThemeContext";
import { konversiTingkatAQI } from "../../services/weatherAdapter";
import { labelKodeCuaca } from "../../constants/weatherCodes";
import { HasilGeocoding } from "../../types/geocoding";
import { HasilCuacaOffline, RingkasanKotaTersimpan } from "../../types/cache";

export default function HalamanUtama() {
  const { tema } = useTheme();
  const params = useLocalSearchParams<{
    kota?: string;
    lat?: string;
    lon?: string;
    id?: string;
  }>();

  const [teksCari, setTeksCari] = useState("");
  const [hasilPencarian, setHasilPencarian] = useState<HasilGeocoding[]>([]);
  const [kotaTerpilih, setKotaTerpilih] = useState<HasilGeocoding | null>(null);
  const [hasil, setHasil] = useState<HasilCuacaOffline | null>(null);
  const [kotaTersimpan, setKotaTersimpan] = useState<RingkasanKotaTersimpan[]>(
    []
  );
  const [sedangMemuat, setSedangMemuat] = useState(false);
  const [pesanError, setPesanError] = useState<string | null>(null);
  const [pesanLokasi, setPesanLokasi] = useState<string | null>(null);
  const teksTertunda = useDebounce(teksCari, 500);
  const requestIdRef = useRef(0); // pencegah race condition

  async function muatKotaTersimpan() {
    setKotaTersimpan(await daftarKotaTersimpan());
  }

  // Saat aplikasi dibuka: buang cache > 7 hari, lalu tampilkan daftar tersimpan
  useEffect(() => {
    bersihkanCacheLama(BATAS_CACHE_MS)
      .then(muatKotaTersimpan)
      .catch(() => {});
  }, []);

  // Tangani perpindahan kota jika user memilih dari Riwayat Pencarian / Tab Riwayat
  useEffect(() => {
    if (params.kota && params.lat && params.lon) {
      pilihKota({
        id: Number(params.id ?? 0),
        name: params.kota,
        latitude: Number(params.lat),
        longitude: Number(params.lon),
        country: "",
      });
    }
  }, [params.kota, params.lat, params.lon]);

  useEffect(() => {
    if (teksTertunda.trim().length === 0) {
      setHasilPencarian([]);
      return;
    }
    cariKota(teksTertunda)
      .then(setHasilPencarian)
      .catch(() => setHasilPencarian([]));
  }, [teksTertunda]);

  async function pilihKota(kota: HasilGeocoding, paksaPerbarui = false) {
    setKotaTerpilih(kota);

    // Simpan ke riwayat pencarian (kecuali lokasi saat ini / id negatif)
    if (kota.id !== -1 && kota.name !== "Lokasi Saat Ini") {
      simpanRiwayatPencarian({
        id: kota.id,
        nama: kota.name,
        latitude: kota.latitude,
        longitude: kota.longitude,
        country: kota.country ?? "",
      });
    }

    const idSaatIni = ++requestIdRef.current;
    setSedangMemuat(true);
    setPesanError(null);
    try {
      const data = await ambilCuacaOfflineFirst(
        {
          id: kota.id,
          nama: kota.name,
          latitude: kota.latitude,
          longitude: kota.longitude,
        },
        { paksaPerbarui }
      );
      if (idSaatIni !== requestIdRef.current) return; // hasil basi, abaikan
      setHasil(data);
      muatKotaTersimpan();
    } catch (err) {
      if (idSaatIni !== requestIdRef.current) return;
      setHasil(null);
      setPesanError(
        "Belum ada data tersimpan dan tidak ada koneksi internet. Sambungkan internet lalu coba lagi."
      );
    } finally {
      if (idSaatIni === requestIdRef.current) setSedangMemuat(false);
    }
  }

  async function gunakanLokasiSaatIni() {
    const status = await mintaIzinLokasi();
    if (status === "denied") {
      setPesanLokasi(
        "Izin lokasi ditolak. Silakan cari kota secara manual di atas."
      );
      return;
    }
    if (status === "unavailable") {
      setPesanLokasi(
        "Layanan lokasi tidak aktif di perangkat ini. Silakan cari kota secara manual."
      );
      return;
    }
    setPesanLokasi(null);
    const koordinat = await ambilKoordinatSaatIni();
    pilihKota({
      id: -1,
      name: "Lokasi Saat Ini",
      latitude: koordinat.latitude,
      longitude: koordinat.longitude,
      country: "",
    });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tema.background }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        <SearchBox onCari={setTeksCari} />
        <Button
          title="Gunakan Lokasi Saat Ini"
          onPress={gunakanLokasiSaatIni}
        />
        {pesanLokasi && (
          <Text
            accessibilityLabel={pesanLokasi}
            style={{ color: tema.subtext }}
          >
            {pesanLokasi}
          </Text>
        )}
        {hasilPencarian.map((kota) => (
          <TouchableOpacity
            key={kota.id}
            onPress={() => pilihKota(kota)}
            style={{
              padding: 12,
              backgroundColor: tema.card,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: tema.border,
            }}
          >
            <Text style={{ color: tema.text, fontSize: 16 }}>{kota.name}</Text>
            {kota.country ? (
              <Text style={{ color: tema.subtext, fontSize: 12 }}>
                {kota.admin1 ? `${kota.admin1}, ` : ""}
                {kota.country}
              </Text>
            ) : null}
          </TouchableOpacity>
        ))}
        {kotaTersimpan.length > 0 && (
          <View style={{ gap: 8 }}>
            <Text
              style={{
                fontWeight: "bold",
                color: tema.text,
                fontSize: 16,
              }}
            >
              Tersimpan di perangkat (bisa dibuka offline)
            </Text>
            {kotaTersimpan.map((k) => (
              <TouchableOpacity
                key={k.kunci}
                onPress={() =>
                  pilihKota({
                    id: k.id,
                    name: k.nama,
                    latitude: k.latitude,
                    longitude: k.longitude,
                    country: "",
                  })
                }
                style={{
                  padding: 12,
                  backgroundColor: tema.card,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: tema.border,
                }}
              >
                <Text style={{ color: tema.text, fontWeight: "500" }}>
                  {k.nama}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {sedangMemuat && <ActivityIndicator color={tema.primary} />}
        {pesanError && (
          <View style={{ gap: 8 }}>
            <Text accessibilityLabel={pesanError} style={{ color: "#ef4444" }}>
              {pesanError}
            </Text>
            <Button
              title="Coba Lagi"
              onPress={() => kotaTerpilih && pilihKota(kotaTerpilih, true)}
            />
          </View>
        )}
        {hasil && kotaTerpilih && !sedangMemuat && (
          <>
            <StatusData
              sumber={hasil.sumber}
              disimpanPada={hasil.disimpanPada}
            />
            <WeatherCard
              kota={kotaTerpilih.name}
              suhu={hasil.cuaca.saatIni.suhu}
              tingkatAQI={konversiTingkatAQI(hasil.kualitasUdara.indeksAQI)}
            />
            <Text style={{ fontSize: 12, color: tema.subtext }}>
              Kondisi: {labelKodeCuaca(hasil.cuaca.saatIni.kodeCuaca)} {"\u2022"}{" "}
              Angin {hasil.cuaca.saatIni.kecepatanAngin} km/j
            </Text>
            <Button
              title="Perbarui Sekarang"
              onPress={() => pilihKota(kotaTerpilih, true)}
            />
            <Button
              title="Tambahkan ke Favorit"
              onPress={() =>
                router.push({
                  pathname: "/tambah-favorit",
                  params: {
                    id: String(kotaTerpilih.id),
                    nama: kotaTerpilih.name,
                    lat: String(kotaTerpilih.latitude),
                    lon: String(kotaTerpilih.longitude),
                  },
                })
              }
            />
          </>
        )}
        <AtribusiCuaca />
      </ScrollView>
    </SafeAreaView>
  );
}