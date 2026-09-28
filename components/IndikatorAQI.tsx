import { View, Text } from "react-native";
import { LaporanUdara } from "../types/cuaca";
import { typeScale, spacing } from "../constants/styles";

// Warna berbeda untuk setiap tingkat kualitas udara
const warnaPerTingkat: Record<LaporanUdara["tingkat"], string> = {
    BAIK: "#22c55e",         // hijau
    SEDANG: "#f59e0b",       // kuning/oranye
    TIDAK_SEHAT: "#f97316",  // oranye
    BERBAHAYA: "#ef4444",    // merah
};

const deskripsiPerTingkat: Record<LaporanUdara["tingkat"], string> = {
    BAIK: "Kualitas udara baik, aman untuk beraktivitas di luar.",
    SEDANG: "Kualitas udara sedang, kelompok sensitif perlu berhati-hati.",
    TIDAK_SEHAT: "Kurangi aktivitas di luar ruangan.",
    BERBAHAYA: "Hindari aktivitas di luar ruangan!",
};

export default function IndikatorAQI({ kota, indeksAQI, tingkat, diperbaruiPada }: LaporanUdara) {
    const warna = warnaPerTingkat[tingkat];

    return (
        <View style={{ padding: spacing.sedang, borderRadius: 12, backgroundColor: "#F4F7FA", gap: 10 }}>
            {/* Header */}
            <Text style={{ fontWeight: "bold", fontSize: typeScale.subjudul }}>
                📊 Indikator Kualitas Udara
            </Text>

            {/* Nama kota */}
            <Text style={{ fontSize: typeScale.isi, color: "#64748b" }}>
                Lokasi: {kota}
            </Text>

            {/* Indeks AQI + Tingkat */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <View
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: warna,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
                        {indeksAQI}
                    </Text>
                </View>
                <View>
                    <Text style={{ fontWeight: "bold", fontSize: typeScale.isi, color: warna }}>
                        {tingkat}
                    </Text>
                    <Text style={{ fontSize: typeScale.keterangan, color: "#64748b", maxWidth: 240 }}>
                        {deskripsiPerTingkat[tingkat]}
                    </Text>
                </View>
            </View>

            {/* Bar indikator */}
            <View style={{ height: 8, borderRadius: 4, backgroundColor: "#e2e8f0" }}>
                <View
                    style={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: warna,
                        width: `${Math.min((indeksAQI / 300) * 100, 100)}%`,
                    }}
                />
            </View>

            {/* Waktu diperbarui (opsional) */}
            {diperbaruiPada && (
                <Text style={{ fontSize: typeScale.keterangan, color: "#94a3b8" }}>
                    Diperbarui: {diperbaruiPada}
                </Text>
            )}
        </View>
    );
}
