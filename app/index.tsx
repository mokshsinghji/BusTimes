import { Text, TextInput, View } from "react-native";
import { useGetBusStopInfo, useGetBusStops } from "@/hooks/useGetBusStops";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("Plough");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [id, setId] = useState("");
  const busStops = useGetBusStops(debouncedSearchQuery);
  // const tmpId = useMemo(() => busStops?.matches?.[5]?.id ?? "", [busStops]);
  const busStop = useGetBusStopInfo(id);

  useEffect(() => {
    if (busStops?.matches?.length ?? 0 > 5) {
      const newValue = busStops?.matches?.[4]?.id ?? "";
      if (busStops === newValue) {
        return;
      }
      setId(newValue);
    }
  }, [busStops]);

  useEffect(() => {
    console.log("Something changed");
  });

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TextInput
        style={{
          borderStyle: "solid",
          padding: 10,
          width: "80%",
          margin: 20,
          borderColor: "gray",
          borderWidth: 1,
        }}
        value={searchQuery}
        onChangeText={(t) => {
          if (searchQuery === t) {
            return;
          }
          setSearchQuery(t);
        }}
      ></TextInput>

      {busStops?.matches?.map((s) => {
        return (
          <Text key={s.id} selectable={true}>
            {s.id} - {s.name}
          </Text>
        );
      })}

      <View
        style={{
          marginTop: 30,
        }}
      >
        {busStop?.at(0)?.children?.map((b) => {
          return (
            <Text key={b.id} selectable>
              {b.id} - {b.commonName} ({b.stopLetter})
            </Text>
          );
        })}
      </View>
    </View>
  );
}
