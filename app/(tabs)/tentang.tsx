import { View, Text } from "react-native";
import { typeScale, spacing } from "../../constants/styles";

export default function TabTentang() {
    return (
        <View style={{ padding: spacing.sedang, gap: spacing.kecil }}>
            <Text
                accessibilityLabel="Judul halaman Tentang aplikasi Jelajah Aman"
                style={{ fontSize: typeScale.judul, fontWeight: "bold" }}
            >
                Jelajah Aman
            </Text>
            <Text style={{ fontSize: typeScale.subjudul, color: "#64748b" }}>
                Versi 1.0.0
            </Text>
            <Text style={{ fontSize: typeScale.isi, color: "#94a3b8", marginTop: spacing.kecil }}>
                Dibuat oleh Muhammad Shofy Fuady
            </Text>
        </View>
    );
}
