import { router, useLocalSearchParams } from "expo-router";
import { Button, View } from "react-native";
import WeatherCard from "../../components/WeatherCard";
import { useTheme } from "../../context/ThemeContext";

export default function HalamanDetail() {
  const { kota } = useLocalSearchParams<{ kota: string }>();
  const { tema } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: tema.background, padding: 16, gap: 16 }}>
      <WeatherCard kota={kota} suhu={29} tingkatAQI="BAIK" />
      <Button
        title="Tambahkan ke Favorit"
        onPress={() => router.push("/tambah-favorit")}
      />
    </View>
  );
}