import { useEffect, useMemo, useState } from "react";
import {
  Api,
  TflApiPresentationEntitiesMatchedStop,
  TflApiPresentationEntitiesPrediction,
  TflApiPresentationEntitiesSearchResponse,
  TflApiPresentationEntitiesStopPoint,
  TflApiPresentationEntitiesStopPointsResponse,
} from "@/hooks/tflApi";
import * as Location from "expo-location";

export function useGetBusStops(searchQuery: string) {
  const [data, setData] =
    useState<
      TflApiPresentationEntitiesSearchResponse<TflApiPresentationEntitiesMatchedStop>
    >();

  useEffect(() => {
    console.log(`[${new Date().toLocaleString()}], getting bus stops`);
    (async () => {
      if (searchQuery.length > 0) {
        const api = new Api();
        const response = await api.stopPoint.stopPointSearch(searchQuery, {
          modes: ["bus"],
          maxResults: 10,
        });

        const data =
          (await response.json()) as TflApiPresentationEntitiesSearchResponse<TflApiPresentationEntitiesMatchedStop>;
        setData(data);
      }
    })();
  }, [searchQuery]);

  return data;
}

export function useGetBusStopInfo(id: string) {
  const data = useMemo(() => (id.length > 0 ? [id] : []), [id]);
  return useGetBusStopsBusInfo(data);
}

export function useGetBusStopsBusInfo(ids: string[]) {
  const [data, setData] = useState<TflApiPresentationEntitiesStopPoint[]>();

  useEffect(() => {
    console.log(new Date().toLocaleString(), "getting bus stops info");

    (async () => {
      if (ids.length > 0 || (ids.length == 1 && ids[0].length == 0)) {
        const api = new Api();
        const response = await api.stopPoint.stopPointGet(ids);
        const data = await response.json();

        if (ids.length == 1) {
          setData([data] as TflApiPresentationEntitiesStopPoint[]);
          return;
        }

        setData(data as TflApiPresentationEntitiesStopPoint[]);
      }
    })();
  }, [ids]);

  return data;
}

export function useGetBusStopsByLocation(
  location: Location.LocationObject | undefined
) {
  const [data, setData] =
    useState<
      TflApiPresentationEntitiesSearchResponse<TflApiPresentationEntitiesMatchedStop>
    >();

  useEffect(() => {
    console.log(
      `[${new Date().toLocaleString()}], getting bus stops by location`
    );
    (async () => {
      if (location) {
        const api = new Api();
        const response = await api.stopPoint.stopPointGetByGeoPoint({
          radius: 500,
          stopTypes: ["NaptanPublicBusCoachTram"],
          // modes: ["bus"],
          lat: location.coords.latitude,
          lon: location.coords.longitude,
        });

        try {
          const data =
            (await response.json()) as TflApiPresentationEntitiesSearchResponse<TflApiPresentationEntitiesMatchedStop>;

          console.log(data);
          setData(data);
        } catch (error) {
          console.error(error);
        }
      }
    })();
  }, [location]);

  return data;
}

export function useGetBusStopArrivals(id: string) {
  const [data, setData] = useState<TflApiPresentationEntitiesPrediction[]>();

  useEffect(() => {
    console.log(new Date().toLocaleString(), "getting bus arrivals");

    (async () => {
      if (id.length > 0) {
        const api = new Api();
        const response = await api.stopPoint.stopPointArrivals(id);
        const data =
          (await response.json()) as TflApiPresentationEntitiesPrediction[];

        data.sort((a, b) => {
          return (a.timeToStation ?? 0) - (b.timeToStation ?? 0);
        });

        setData(data);
      }
    })();
  }, [id]);

  return data;
}
