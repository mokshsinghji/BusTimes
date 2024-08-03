import {Text, View} from "react-native";
import {useGetBusStop, useGetBusStops} from "@/hooks/useGetBusStops";
import {useEffect, useState} from "react";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("Plough");
  const [id, setId] = useState("");
  const busStops = useGetBusStops(searchQuery);
  const busStop = useGetBusStop(id);

  useEffect(() => {
    if (busStops.length > 4) {
      console.log(busStops);

      setId(busStops[3].id);
    }
  }, [busStops]);

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

      <View style={{
        marginTop: 30
      }}>
      {busStop.children.map(b => {
        return (
          <Text key={b.id} selectable>{b.id} - {b.commonName} ({b.stopLetter})</Text>
        )
      })}
      </View>
    </View>
  );
}
