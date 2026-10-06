import { useEffect, useState } from "react";
import { ActivityIndicator, Button, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBox from "../../components/SearchBox";
import WeatherCard from "../../components/WeatherCard";
import { useDebounce } from "../../hooks/use-debounce";
import { cariKota } from "../../services/geocodingService";
import { HasilGeocoding } from "../../types/geocoding";

export default function HalamanUtama() {
    const [teksCari, setTeksCari] = useState("");
    const [hasil, setHasil] = useState<HasilGeocoding[]>([]);
    const [sedangMemuat, setSedangMemuat] = useState(false);
    const [pesanError, setPesanError] = useState<string | null>(null);
    const teksTertunda = useDebounce(teksCari, 800);

    // Nomor urut permintaan — bertahan antar-render tanpa memicu render ulang
    const requestIdRef = useRef(0);

    useEffect(() => {
        if (teksTertunda.trim().length === 0) {
            setHasil([]);
            setPesanError(null);
            return;
        }
        ambilData(teksTertunda);
    }, [teksTertunda]);
    async function ambilData(nama: string) {
        // Tandai permintaan ini dengan nomor urut baru
        const idSaatIni = ++requestIdRef.current;

        setSedangMemuat(true);
        setPesanError(null);
        try {
            const data = await cariKota(nama);

            // Abaikan hasil jika sudah ada permintaan lebih baru
            if (idSaatIni !== requestIdRef.current) return;

            setHasil(data);
        } catch (err) {
            // Abaikan error dari permintaan yang sudah basi
            if (idSaatIni !== requestIdRef.current) return;

            setPesanError("Gagal mengambil data. Periksa koneksi internet Anda.");
        } finally {
            setSedangMemuat(false);
        }
    }
    return (
        <SafeAreaView style={{ flex: 1, padding: 16, gap: 16 }}>
            <SearchBox onCari={setTeksCari} />
            {sedangMemuat && <ActivityIndicator />}
            {pesanError && (
                <View>
                    <Text accessibilityLabel={pesanError}>{pesanError}</Text>
                    <Button title="Coba Lagi" onPress={() => ambilData(teksTertunda)} />
                </View>
            )}
            {!sedangMemuat && !pesanError && teksTertunda.length > 0 && hasil.length === 0
                && (
                    <Text accessibilityLabel="Kota tidak ditemukan">Kota tidak ditemukan</Text>
                )}
            {hasil.length > 0 && (
                <Text>Ditemukan {hasil.length} kota</Text>
            )}
            {hasil.map((kota) => (
                <WeatherCard key={kota.id} kota={kota.name} suhu={29} tingkatAQI="BAIK" />
            ))}
        </SafeAreaView>
    );
}