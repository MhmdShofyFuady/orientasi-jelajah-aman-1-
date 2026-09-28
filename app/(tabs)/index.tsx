import { useEffect, useState } from "react";
import { ScrollView, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import IndikatorAQI from "../../components/IndikatorAQI";
import SearchBox from "../../components/SearchBox";
import WeatherCard from "../../components/WeatherCard";

export default function HalamanUtama() {
    const [kotaAktif, setKotaAktif] = useState("Pekalongan");
    const [riwayat, setRiwayat] = useState<string[]>(["Pekalongan"]);
    const { width } = useWindowDimensions();
    const isTablet = width > 768;
    useEffect(() => {
        console.log("Kota aktif berubah menjadi:", kotaAktif);
    }, [kotaAktif]);

    function handleCari(kota: string) {
        setKotaAktif(kota);
        if (!riwayat.includes(kota)) {
            setRiwayat([...riwayat, kota]);
        }
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView
                style={{ padding: isTablet ? 32 : 16 }}
                contentContainerStyle={{ gap: 16, paddingBottom: 32 }}
            >
                <SearchBox onCari={handleCari} />
                <WeatherCard kota={kotaAktif} suhu={29} tingkatAQI="BAIK" />
                <IndikatorAQI
                    kota={kotaAktif}
                    indeksAQI={42}
                    tingkat="BAIK"
                    diperbaruiPada="28 Sep 2026, 15:00"
                />
            </ScrollView>
        </SafeAreaView>
    );
}