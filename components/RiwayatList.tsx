import { View, Text } from "react-native";
import { Link } from "expo-router";

interface RiwayatListProps {
    daftarKota: string[];
}
export default function RiwayatList({ daftarKota }: RiwayatListProps) {
    return (
        <View>
            {daftarKota.map((kota) => (
                // Link dengan string path yang lebih disukai Router v3
                <Link key={kota} href={{ pathname: "../detail/[kota]", params: { kota } }}>
                    <Text>{kota}</Text>
                </Link>
            ))}
        </View>
    );
}