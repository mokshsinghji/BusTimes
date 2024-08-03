import { Text, View } from "react-native";
import {useGetBusStops} from "@/hooks/useGetBusStops";
import {useState} from "react";

export default function Index() {
    const [searchQuery, setSearchQuery] = useState("Plough");
    const busStops = useGetBusStops(searchQuery);
    console.log(busStops);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}
    >
        {busStops?.map((s) => {
            return (
                <Text key={s.id} selectable={true}>{s.id} - {s.name}</Text>
            )
        })}
    </View>
  );
}
