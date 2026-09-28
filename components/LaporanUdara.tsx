import { Text, View } from "react-native";
import { spacing, typeScale } from "../constants/styles";
import { TingkatAQI } from "../types/cuaca";

interface LaporanUdaraProps {
    tingkatAQI: TingkatAQI;
    nilaiAQI: number;
    kelembapan: number;
    pm25: number;
}

const warnaAQIMap: Record<TingkatAQI, string> = {
    BAIK: "#22c55e",
    SEDANG: "#f59e0b",
    TIDAK_SEHAT: "#f97316",
    BERBAHAYA: "#ef4444",
};

const deskripsiAQI: Record<TingkatAQI, string> = {
    BAIK: "Kualitas udara baik, aman untuk beraktivitas di luar.",
    SEDANG: "Kualitas udara sedang, kelompok sensitif perlu berhati-hati.",
    TIDAK_SEHAT: "Kurangi aktivitas di luar ruangan.",
    BERBAHAYA: "Hindari aktivitas di luar ruangan!",
};

export default function LaporanUdara({ tingkatAQI, nilaiAQI, kelembapan, pm25 }: LaporanUdaraProps) {
    const warnaAQI = warnaAQIMap[tingkatAQI];

    return (
        <View style={{ padding: spacing.sedang, borderRadius: 12, backgroundColor: "#F4F7FA", gap: 12 }}>
            {/* Header */}
            <Text style={{ fontWeight: "bold", fontSize: typeScale.subjudul }}>
                📊 Laporan Kualitas Udara
            </Text>

            {/* Indikator AQI */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <View
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: warnaAQI,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>{nilaiAQI}</Text>
                </View>
                <View>
                    <Text style={{ fontWeight: "bold", fontSize: typeScale.isi, color: warnaAQI }}>
                        {tingkatAQI}
                    </Text>
                    <Text style={{ fontSize: typeScale.keterangan, color: "#64748b", maxWidth: 240 }}>
                        {deskripsiAQI[tingkatAQI]}
                    </Text>
                </View>
            </View>

            {/* Bar indikator AQI */}
            <View style={{ height: 8, borderRadius: 4, backgroundColor: "#e2e8f0" }}>
                <View
                    style={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: warnaAQI,
                        width: `${Math.min((nilaiAQI / 300) * 100, 100)}%`,
                    }}
                />
            </View>

            {/* Detail metrik */}
            <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 4 }}>
                <View style={{ alignItems: "center" }}>
                    <Text style={{ fontSize: typeScale.keterangan, color: "#94a3b8" }}>Kelembapan</Text>
                    <Text style={{ fontWeight: "bold", fontSize: typeScale.isi }}>💧 {kelembapan}%</Text>
                </View>
                <View style={{ alignItems: "center" }}>
                    <Text style={{ fontSize: typeScale.keterangan, color: "#94a3b8" }}>PM2.5</Text>
                    <Text style={{ fontWeight: "bold", fontSize: typeScale.isi }}>🌫️ {pm25} µg/m³</Text>
                </View>
                <View style={{ alignItems: "center" }}>
                    <Text style={{ fontSize: typeScale.keterangan, color: "#94a3b8" }}>Indeks AQI</Text>
                    <Text style={{ fontWeight: "bold", fontSize: typeScale.isi, color: warnaAQI }}>{nilaiAQI}</Text>
                </View>
            </View>
        </View>
    );
}
