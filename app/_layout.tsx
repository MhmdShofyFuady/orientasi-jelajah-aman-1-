import { Stack } from "expo-router";
import { ThemeProvider, useTheme } from "../context/ThemeContext";

function RootNavigator() {
  const { tema } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: tema.card },
        headerTintColor: tema.text,
        contentStyle: { backgroundColor: tema.background },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="detail/[kota]" options={{ title: "Detail Cuaca" }} />
      <Stack.Screen
        name="tambah-favorit"
        options={{ presentation: "modal", title: "Tambah Favorit" }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootNavigator />
    </ThemeProvider>
  );
}