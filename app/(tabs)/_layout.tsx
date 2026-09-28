import { Tabs } from "expo-router";

export default function TabsLayout() {
    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{ title: "Beranda", headerShown: false }}
            />
            <Tabs.Screen
                name="riwayat"
                options={{ title: "Riwayat" }}
            />
            <Tabs.Screen
                name="pengaturan"
                options={{ title: "Pengaturan" }}
            />
            <Tabs.Screen
                name="tentang"
                options={{ title: "Tentang" }}
            />
        </Tabs>
    );
}
