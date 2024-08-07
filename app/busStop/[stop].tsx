import React from "react";
import {
  useGetBusStopArrivals,
  useGetBusStopInfo,
} from "@/hooks/useGetBusStops";
import { useLocalSearchParams } from "expo-router";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function BusStop() {
  // ... (keep your existing variable declarations and logic)
  const { stop } = useLocalSearchParams();
  const stopPairInfo = useGetBusStopInfo(
    typeof stop === "string" ? stop : stop[0]
  );
  const stopArrivals = useGetBusStopArrivals(
    typeof stop === "string" ? stop : stop[0]
  );
  const stopInfo = stopPairInfo?.at(0)?.children?.find((c) => c.id === stop);
  stopArrivals?.push(stopArrivals?.at(-1) ?? { id: "0", timeToStation: 0 });
  console.log(stopPairInfo?.at(0)?.children?.find((c) => c.id === stop));

  return (
    <View style={styles.container}>
      <MapView
        region={{
          latitude: stopInfo?.lat ?? 0,
          longitude: stopInfo?.lon ?? 0,
          latitudeDelta: 0.0025,
          longitudeDelta: 0.0025,
        }}
        style={styles.map}
      >
        <Marker
          coordinate={{
            latitude: stopInfo?.lat ?? 0,
            longitude: stopInfo?.lon ?? 0,
          }}
          title={stopInfo?.commonName}
          description={"Stop: " + stopInfo?.commonName}
        />
      </MapView>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <View style={styles.stopLetterContainer}>
            <Text style={styles.stopLetter}>{stopInfo?.stopLetter}</Text>
          </View>
          <Text style={styles.stopName}>{stopInfo?.commonName}</Text>
        </View>
        <Text style={styles.sectionTitle}>Bus Arrivals</Text>
        <ScrollView style={styles.scrollView}>
          {stopArrivals?.map((a) => (
            <View key={a.id} style={styles.arrivalItem}>
              <View style={styles.lineNameContainer}>
                <Text style={styles.lineName}>{a.lineName}</Text>
              </View>
              <Text style={styles.destinationName}>{a.destinationName}</Text>
              <Text style={styles.arrivalTime}>
                {(a.timeToStation ?? 0) > 0
                  ? `${Math.floor((a.timeToStation ?? 0) / 60)} mins`
                  : "Arriving"}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    height: 225,
    width: "100%",
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  stopLetterContainer: {
    height: 50,
    width: 50,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
  },
  stopLetter: {
    color: "white",
    fontSize: 36,
  },
  stopName: {
    fontSize: 25,
  },
  sectionTitle: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 10,
  },
  scrollView: {
    flex: 1,
  },
  arrivalItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 60,
  },
  lineNameContainer: {
    height: 40,
    width: 65,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
  lineName: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
  },
  destinationName: {
    fontSize: 20,
    flex: 1,
  },
  arrivalTime: {
    fontSize: 20,
    width: 70,
  },
});
