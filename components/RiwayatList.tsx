// components/RiwayatList.tsx
import { View, Text } from "react-native";
import { Link } from "expo-router"; // Pastikan Link diimport

interface RiwayatListProps {
    daftarKota: string[];
}

export default function RiwayatList({ daftarKota }: RiwayatListProps) {
    return (
        <View>
            {daftarKota.map((kota) => (
                <Link
                    key={kota}
                    href={{
                        pathname: "/detail/[kota]",
                        params: { kota: kota }
                    }}
                >
                    <Text>{kota}</Text>
                </Link>
            ))}
        </View>
    );
}
