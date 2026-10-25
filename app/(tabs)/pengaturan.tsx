import { useState } from "react";
import { Text, Button, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { hapusSemuaCache } from "../../services/cacheRepository";
import { useTheme, ModeTema } from "../../context/ThemeContext";

export default function TabPengaturan() {
  const { mode, tema, setMode } = useTheme();
  const [pesan, setPesan] = useState<string | null>(null);

  async function hapusDataTersimpan() {
    await hapusSemuaCache();
    setPesan("Data cuaca tersimpan sudah dihapus.");
  }

  const opsiMode: { label: string; nilai: ModeTema; ikon: string }[] = [
    { label: "Terang", nilai: "light", ikon: "☀️" },
    { label: "Gelap", nilai: "dark", ikon: "🌙" },
    { label: "Ikuti Sistem", nilai: "system", ikon: "⚙️" },
  ];

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: tema.background, padding: 16, gap: 20 }}
    >
      <View style={{ gap: 4 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: tema.text }}>
          Pengaturan Aplikasi
        </Text>
        <Text style={{ fontSize: 13, color: tema.subtext }}>
          Jelajah Aman - Versi 1.0.0
        </Text>
      </View>

      {/* PILIHAN MODE TAMPILAN TEMA */}
      <View
        style={{
          backgroundColor: tema.card,
          padding: 16,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: tema.border,
          gap: 12,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600", color: tema.text }}>
          🎨 Mode Tampilan
        </Text>
        <Text style={{ fontSize: 12, color: tema.subtext }}>
          Pilih tema antarmuka sesuai kenyamanan Anda
        </Text>

        <View style={{ flexDirection: "row", gap: 8 }}>
          {opsiMode.map((item) => {
            const aktif = mode === item.nilai;
            return (
              <TouchableOpacity
                key={item.nilai}
                onPress={() => setMode(item.nilai)}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  paddingHorizontal: 8,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: aktif ? tema.primary : tema.border,
                  backgroundColor: aktif ? tema.primary : tema.background,
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                }}
              >
                <Text style={{ fontSize: 18 }}>{item.ikon}</Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: aktif ? "bold" : "normal",
                    color: aktif ? "#ffffff" : tema.text,
                  }}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* MANAJEMEN PENYIMPANAN */}
      <View
        style={{
          backgroundColor: tema.card,
          padding: 16,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: tema.border,
          gap: 10,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600", color: tema.text }}>
          🧹 Penyimpanan & Cache
        </Text>
        <Text style={{ fontSize: 12, color: tema.subtext }}>
          Hapus seluruh data cache cuaca yang tersimpan di database perangkat
        </Text>
        <Button
          title="Hapus Seluruh Data Cuaca Tersimpan"
          color="#dc2626"
          onPress={hapusDataTersimpan}
        />
        {pesan && (
          <Text
            accessibilityLabel={pesan}
            style={{ fontSize: 12, color: "#16a34a" }}
          >
            ✓ {pesan}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}