import React from "react";
import {
  Button,
  Pressable,
  Text,
  TextInput,
  ToastAndroid,
  View,
  StyleSheet,
  ScrollView,
} from "react-native";
import {
  useGetBusStopInfo,
  useGetBusStops,
  useGetBusStopsByLocation,
} from "@/hooks/useGetBusStops";
import { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import * as Location from "expo-location";
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Link, router } from "expo-router";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObject>();

  const busStops = useGetBusStops(debouncedSearchQuery);
  const busStopsByLocation = useGetBusStopsByLocation(currentLocation);

  useEffect(() => {
    console.log(busStopsByLocation);
  }, [busStopsByLocation]);

  useEffect(() => {
    console.log("Rerendering");
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        ToastAndroid.show(
          "Permission to access location was denied.",
          ToastAndroid.LONG
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: 1000,
      });

      setCurrentLocation(location);
      console.log(location);
    })();
  }, []);

  console.log("stopPoints:", busStops);

  return (
    <View style={styles.container}>
      <MapView
        region={{
          latitude: currentLocation?.coords.latitude ?? 0,
          longitude: currentLocation?.coords.longitude ?? 0,
          latitudeDelta: 0.0025,
          longitudeDelta: 0.0025,
        }}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
      >
        {busStopsByLocation?.stopPoints?.map((s, idx) => (
          <Marker
            key={s.id}
            coordinate={{ latitude: s.lat ?? 0, longitude: s.lon ?? 0 }}
            title={s.name}
            description={"Stop: " + s.name}
          >
            <View style={styles.markerView}>
              <Text style={styles.markerText}>{s.stopLetter}</Text>
            </View>
            <Callout
              style={styles.callout}
              onPress={() => {
                router.push(`/busStop/${s.id}`);
              }}
            >
              <View style={styles.calloutView}>
                <Text style={styles.calloutText}>
                  {s.commonName} ({s.stopLetter})
                </Text>
                <Pressable
                  style={styles.calloutButton}
                  onPress={() => {
                    console.log("Pressed Pressable");
                  }}
                >
                  <Text style={styles.calloutButtonText}>Go to Bus Stop</Text>
                </Pressable>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      <TextInput
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={(t) => {
          if (searchQuery !== t) {
            setSearchQuery(t);
          }
        }}
        placeholder="Search for a bus stop"
      />

      <ScrollView style={styles.scrollView}>
        <View style={styles.busStopList}>
          {busStops?.map((s) => (
            <React.Fragment key={s.id}>
              {s.children?.map((b) => (
                <Link
                  key={b.id}
                  href={`/busStop/${b.id}`}
                  style={styles.busStopLink}
                  asChild
                >
                  <Pressable style={styles.busStopItem}>
                    <View style={styles.busStopLetterContainer}>
                      <Text style={styles.busStopLetter}>{b.stopLetter}</Text>
                    </View>
                    <Text style={styles.busStopName}>{b.commonName}</Text>
                  </Pressable>
                </Link>
              ))}
            </React.Fragment>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  map: {
    height: "30%",
    width: "100%",
  },
  markerView: {
    alignItems: "center",
    borderRadius: 10,
    height: 20,
    width: 20,
    backgroundColor: "red",
    justifyContent: "center",
  },
  markerText: {
    color: "white",
    fontSize: 14,
  },
  callout: {
    width: 150,
  },
  calloutView: {
    width: 150,
  },
  calloutText: {
    fontSize: 12,
  },
  calloutButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: 150,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
  },
  calloutButtonText: {
    fontSize: 10,
  },
  searchInput: {
    borderStyle: "solid",
    padding: 10,
    margin: 20,
    borderColor: "gray",
    borderWidth: 1,
  },
  scrollView: {
    flex: 1,
  },
  busStopList: {
    gap: 10,
    padding: 10,
    // borderColor: "gray",
    // borderWidth: 1,
    // borderStyle: "solid",
  },
  busStopLink: {
    // borderColor: "gray",
    // borderWidth: 1,
    // borderStyle: "solid",
    width: "100%",
    // No specific styles needed
  },
  busStopItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 60,
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 10,
  },
  busStopLetterContainer: {
    height: 40,
    width: 40,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  busStopLetter: {
    color: "white",
    fontSize: 20,
  },
  busStopName: {
    fontSize: 20,
    flex: 1,
  },
});
