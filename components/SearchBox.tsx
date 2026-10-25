import { useEffect, useState } from "react";
import { TextInput, View } from "react-native";
import { useTheme } from "../context/ThemeContext";

interface SearchBoxProps {
  onCari: (teks: string) => void;
  nilaiAwal?: string;
}

export default function SearchBox({ onCari, nilaiAwal = "" }: SearchBoxProps) {
  const { tema } = useTheme();
  const [teks, setTeks] = useState(nilaiAwal);

  useEffect(() => {
    setTeks(nilaiAwal);
  }, [nilaiAwal]);

  function handleChange(nilaiBaru: string) {
    setTeks(nilaiBaru);
    onCari(nilaiBaru); // kirim setiap perubahan, debounce diatur di pemanggilnya
  }

  return (
    <View>
      <TextInput
        placeholder="Cari nama kota..."
        placeholderTextColor={tema.subtext}
        value={teks}
        onChangeText={handleChange}
        accessibilityLabel="Cari cuaca untuk kota yang dimasukkan"
        style={{
          borderWidth: 1,
          borderColor: tema.border,
          backgroundColor: tema.card,
          color: tema.text,
          padding: 10,
          borderRadius: 8,
        }}
      />
    </View>
  );
}