import { Text, View } from "react-native";
import { spacing, typeScale } from "../constants/styles";
import { TingkatAQI, WeatherCardProps } from "../types/cuaca";
import { useTheme } from "../context/ThemeContext";

const warnaPerTingkat: Record<TingkatAQI, string> = {
  BAIK: "#16a34a",
  SEDANG: "#d97706",
  TIDAK_SEHAT: "#ea580c",
  BERBAHAYA: "#dc2626",
};

export default function WeatherCard({
  kota,
  suhu,
  tingkatAQI,
  indeksAQI,
}: WeatherCardProps) {
  const { tema } = useTheme();

  const teksAQI =
    indeksAQI !== undefined
      ? `AQI: ${indeksAQI} (${tingkatAQI})`
      : `AQI: ${tingkatAQI}`;
  const labelAksesibilitas =
    indeksAQI !== undefined
      ? `Cuaca ${kota}, suhu ${suhu} derajat, indeks kualitas udara ${indeksAQI}, kategori ${tingkatAQI}`
      : `Cuaca ${kota}, suhu ${suhu} derajat, kualitas udara ${tingkatAQI}`;
  return (
    <View
      accessible
      accessibilityLabel={labelAksesibilitas}
      style={{
        padding: spacing.sedang,
        borderRadius: 8,
        backgroundColor: tema.card,
        borderWidth: 1,
        borderColor: tema.border,
      }}
    >
      <Text
        style={{
          fontWeight: "bold",
          fontSize: typeScale.judul,
          color: tema.text,
        }}
      >
        {kota}
      </Text>
      <Text style={{ fontSize: 32, color: tema.text }}>{suhu}°C</Text>
      <Text
        style={{
          color: warnaPerTingkat[tingkatAQI],
          fontSize: typeScale.isi,
          fontWeight: "600",
        }}
      >
        {teksAQI}
      </Text>
    </View>
  );
}