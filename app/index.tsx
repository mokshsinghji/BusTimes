import {
  Button,
  Pressable,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from "react-native";
import {
  useGetBusStopInfo,
  useGetBusStops,
  useGetBusStopsByLocation,
} from "@/hooks/useGetBusStops";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import * as Location from "expo-location";
import MapView, {
  Callout,
  Marker,
  PROVIDER_GOOGLE,
  UrlTile,
} from "react-native-maps";
import { Link, router } from "expo-router";

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

  const [selectedBusStopIndex, setSelectedBusStopIndex] = useState(0);

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
            latitudeDelta: 0.0025,
            longitudeDelta: 0.0025,
          }}
          style={{ height: "30%", width: "100%" }}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
        >
          {/* <Marker
            coordinate={currentLocation.coords}
            title="Current location"
          ></Marker> */}
          {busStopsByLocation?.stopPoints?.map((s, idx) => {
            return (
              <Marker
                key={s.id}
                coordinate={{ latitude: s.lat ?? 0, longitude: s.lon ?? 0 }}
                title={s.name}
                description={"Stop: " + s.name}
                onPress={() => {
                  setSelectedBusStopIndex(idx);
                }}
                onCalloutPress={() => {
                  console.log("Pressed");
                }}
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
                    justifyContent: "center",
                    alignContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: s.stopLetter.length > 1 ? 10 : 14,
                    }}
                  >
                    {s.stopLetter}
                  </Text>
                </View>
                <Callout
                  style={{ width: 150 }}
                  onPress={() => {
                    router.push(`/busStop/${s.id}`);
                  }}
                >
                  <View
                    style={{
                      // position: "absolute",
                      // top: 0,
                      // left: 0,
                      // width: "100%",
                      width: 150,
                      // borderColor: "gray",
                      // borderWidth: 1,
                      // borderRadius: 10,
                      // borderStyle: "solid",
                    }}
                  >
                    {(() => {
                      console.log(s.commonName);
                      return null;
                    })()}
                    <Text style={{ fontSize: 12 }}>
                      {s.commonName} ({s.stopLetter})
                    </Text>
                    {/* <Link href={`/busStop/${s.id}`} asChild> */}
                    <Pressable
                      style={{
                        marginTop: 10,
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                        width: 150,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderColor: "gray",
                        borderWidth: 1,
                        borderRadius: 10,
                        borderStyle: "solid",
                      }}
                      onPress={() => {
                        console.log("Pressed Pressable");
                      }}
                    >
                      <Text style={{ fontSize: 10 }}>Go to Bus Stop </Text>
                    </Pressable>
                    {/* </Link> */}
                    {/* <Text style={{ fontSize: 10 }}>{s.name}</Text> */}
                  </View>
                </Callout>
                {/* <View
                  style={{
                    display: idx === selectedBusStopIndex ? "flex" : "none",
                    backgroundColor: "white",
                    position: "absolute",
                  }}
                >
                  <Text>{s.commonName}</Text>
                </View> */}
              </Marker>
            );
          })}
          {/* <Marker
            coordinate={currentLocation.coords}
            title="Test"
            description="Test Description"
          ></Marker> */}
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
