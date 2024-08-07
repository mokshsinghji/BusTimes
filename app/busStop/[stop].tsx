import {
  useGetBusStopArrivals,
  useGetBusStopInfo,
} from "@/hooks/useGetBusStops";
import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function BusStop() {
  const { stop } = useLocalSearchParams();
  const stopPairInfo = useGetBusStopInfo(
    typeof stop === "string" ? stop : stop[0]
  );

  const stopArrivals = useGetBusStopArrivals(
    typeof stop === "string" ? stop : stop[0]
  );

  const stopInfo = stopPairInfo?.at(0)?.children?.find((c) => c.id === stop);

  console.log(stopPairInfo?.at(0)?.children?.find((c) => c.id === stop));

  return (
    <View>
      <MapView
        region={{
          latitude: stopInfo?.lat ?? 0,
          longitude: stopInfo?.lon ?? 0,
          latitudeDelta: 0.0025,
          longitudeDelta: 0.0025,
        }}
        style={{ height: "40%", width: "100%" }}
      >
        <Marker
          coordinate={{
            latitude: stopInfo?.lat ?? 0,
            longitude: stopInfo?.lon ?? 0,
          }}
          title={stopInfo?.commonName}
          description={"Stop: " + stopInfo?.commonName}
        ></Marker>
      </MapView>
      <View style={{ padding: 20 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View
            style={{
              height: 40,
              width: 40,
              backgroundColor: "red",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 100,
            }}
          >
            <Text
              style={{
                color: "white",
                margin: 0,
                padding: 0,
                alignSelf: "center",
                fontSize: 30,
              }}
            >
              {stopInfo?.stopLetter}
            </Text>
          </View>
          <Text style={{ fontSize: 20 }}>{stopInfo?.commonName}</Text>
        </View>
        <View>
          <Text style={{ fontSize: 20 }}>Bus Arrivals</Text>
          {stopArrivals?.map((a) => {
            return (
              <Text key={a.id} selectable>
                {a.lineName} - {a.destinationName} -{" "}
                {(a.timeToStation ?? 0) > 0
                  ? `${Math.floor((a.timeToStation ?? 0) / 60)} mins`
                  : "Arriving"}
              </Text>
            );
          })}
        </View>
      </View>
    </View>
  );
}
