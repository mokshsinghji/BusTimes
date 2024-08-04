import {Text, TextInput, View} from "react-native";
import {useGetBusStopInfo, useGetBusStops} from "@/hooks/useGetBusStops";
import {useEffect, useState} from "react";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("Plough");
  const [id, setId] = useState("");
  const busStops = useGetBusStops(searchQuery);
  const busStop = useGetBusStopInfo(id);

  useEffect(() => {
    if (busStops?.matches?.length ?? 0 > 0) {
      setId(busStops?.matches?.[0]?.id ?? "");
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
      <TextInput style={{
        borderStyle: "solid",
        padding: 10,
        width: "80%",
        margin: 20,
        borderColor: "gray",
        borderWidth: 1
      }} value={searchQuery} onChangeText={setSearchQuery}></TextInput>

      {busStops?.matches?.map((s) => {
        return (
          <Text key={s.id} selectable={true}>{s.id} - {s.name}</Text>
        )
      })}

      <View style={{
        marginTop: 30
      }}>
      {busStop?.at(0)?.children?.map(b => {
        return (
          <Text key={b.id} selectable>{b.id} - {b.commonName} ({b.stopLetter})</Text>
        )
      })}
      </View>
    </View>
  );
}
