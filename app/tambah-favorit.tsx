// app/tambah-favorit.tsx
import { View, Text, Button } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { tambahFavorit } from "../services/favoritStorage";
import { useTheme } from "../context/ThemeContext";

export default function ModalTambahFavorit() {
  const { tema } = useTheme();
  const { id, nama, lat, lon } = useLocalSearchParams<{
    id: string;
    nama: string;
    lat: string;
    lon: string;
  }>();

  async function simpan() {
    await tambahFavorit({
      id: Number(id),
      nama,
      latitude: Number(lat),
      longitude: Number(lon),
    });
    router.back();
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: tema.background,
        padding: 16,
        gap: 16,
      }}
    >
      <Text style={{ fontSize: 16, color: tema.text }}>
        Tambahkan {nama} ke daftar favorit?
      </Text>
      <Button title="Simpan" onPress={simpan} />
    </View>
  );
}

