import { Text, TextInput, ToastAndroid, View } from "react-native";
import {
  useGetBusStopInfo,
  useGetBusStops,
  useGetBusStopsByLocation,
} from "@/hooks/useGetBusStops";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import * as Location from "expo-location";
import MapView, { Marker, PROVIDER_GOOGLE, UrlTile } from "react-native-maps";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [id, setId] = useState("");
  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObject>();

  const busStops = useGetBusStops(debouncedSearchQuery);
  // const tmpId = useMemo(() => busStops?.matches?.[5]?.id ?? "", [busStops]);
  const busStop = useGetBusStopInfo(id);

  const busStopsByLocation = useGetBusStopsByLocation(currentLocation);

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
    console.log(busStopsByLocation);
  }, [busStopsByLocation]);

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

  return (
    <View
      style={{
        flex: 1,
        // justifyContent: "center",
        alignItems: "center",
      }}
    >
      {currentLocation && (
        <MapView
          initialRegion={{
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          style={{ height: "30%", width: "100%" }}
          provider={PROVIDER_GOOGLE}
        >
          <Marker
            coordinate={currentLocation.coords}
            title="Current location"
          ></Marker>
          {busStopsByLocation?.stopPoints?.map((s) => {
            return (
              <Marker
                key={s.id}
                coordinate={{ latitude: s.lat ?? 0, longitude: s.lon ?? 0 }}
                title={s.name}
              >
                <View
                  style={{
                    alignItems: "center",
                    borderRadius: 100,
                    height: 20,
                    width: 20,
                    margin: 0,
                    padding: 0,
                    backgroundColor: "red",
                  }}
                >
                  <Text>{s.stopLetter}</Text>
                </View>
              </Marker>
            );
          })}
          {/* <UrlTile
            urlTemplate="http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maximumZ={19}
            flipY={false}
          /> */}
        </MapView>
      )}
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
