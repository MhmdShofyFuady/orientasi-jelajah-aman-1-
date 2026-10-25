import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { typeScale, spacing } from "../../constants/styles";
import { useTheme } from "../../context/ThemeContext";

export default function TabTentang() {
  const { tema } = useTheme();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: tema.background,
        padding: spacing.sedang,
        gap: spacing.sedang,
      }}
    >
      <View
        style={{
          backgroundColor: tema.card,
          padding: spacing.sedang,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: tema.border,
          gap: spacing.kecil,
        }}
      >
        <Text
          accessibilityLabel="Judul halaman Tentang aplikasi Jelajah Aman"
          style={{
            fontSize: typeScale.judul,
            fontWeight: "bold",
            color: tema.text,
          }}
        >
          Jelajah Aman
        </Text>
        <Text style={{ fontSize: typeScale.subjudul, color: tema.subtext }}>
          Versi 1.0.0
        </Text>
        <Text
          style={{
            fontSize: typeScale.isi,
            color: tema.subtext,
            marginTop: spacing.kecil,
          }}
        >
          Aplikasi Visualisasi Cuaca & Kualitas Udara Berbasis Offline-First.
        </Text>
        <Text
          style={{
            fontSize: typeScale.isi,
            color: tema.text,
            fontWeight: "500",
            marginTop: spacing.kecil,
          }}
        >
          Dibuat oleh: Muhammad Shofy Fuady
        </Text>
      </View>
    </SafeAreaView>
  );
}

