// context/ThemeContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ModeTema = "light" | "dark" | "system";

export interface SkemaWarna {
  background: string;
  card: string;
  text: string;
  subtext: string;
  border: string;
  primary: string;
  isDark: boolean;
}

const temaTerang: SkemaWarna = {
  background: "#ffffff",
  card: "#f8fafc",
  text: "#0f172a",
  subtext: "#64748b",
  border: "#e2e8f0",
  primary: "#2563eb",
  isDark: false,
};

const temaGelap: SkemaWarna = {
  background: "#0f172a",
  card: "#1e293b",
  text: "#f8fafc",
  subtext: "#94a3b8",
  border: "#334155",
  primary: "#3b82f6",
  isDark: true,
};

interface KonteksTema {
  mode: ModeTema;
  tema: SkemaWarna;
  setMode: (mode: ModeTema) => void;
}

const KUNCI_STORAGE = "@jelajah_aman:tema";
const ThemeContext = createContext<KonteksTema>({
  mode: "system",
  tema: temaTerang,
  setMode: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const skemaSistem = useColorScheme();
  const [mode, setModeState] = useState<ModeTema>("system");

  useEffect(() => {
    AsyncStorage.getItem(KUNCI_STORAGE)
      .then((nilai) => {
        if (nilai === "light" || nilai === "dark" || nilai === "system") {
          setModeState(nilai);
        }
      })
      .catch(() => {});
  }, []);

  function setMode(modeBaru: ModeTema) {
    setModeState(modeBaru);
    AsyncStorage.setItem(KUNCI_STORAGE, modeBaru).catch(() => {});
  }


  const aktifGelap =
    mode === "dark" || (mode === "system" && skemaSistem === "dark");
  const tema = aktifGelap ? temaGelap : temaTerang;

  return (
    <ThemeContext.Provider value={{ mode, tema, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
