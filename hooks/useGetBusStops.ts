import {useEffect, useState} from "react";
import {
    Api,
    TflApiPresentationEntitiesMatchedStop,
    TflApiPresentationEntitiesSearchResponse, TflApiPresentationEntitiesStopPoint,
    TflApiPresentationEntitiesStopPointsResponse
} from "@/hooks/tflApi";

export function useGetBusStops(searchQuery: string) {
    const [data, setData] = useState<TflApiPresentationEntitiesSearchResponse<TflApiPresentationEntitiesMatchedStop>>();

    console.log("getting bus stops")

    useEffect(() => {
        (async () => {
            if (searchQuery.length > 0) {
                const api = new Api();
                const response = await api.stopPoint.stopPointSearch(searchQuery, {
                    modes: ["bus"],
                    maxResults: 10
                })

                const data = await response.json() as TflApiPresentationEntitiesSearchResponse<TflApiPresentationEntitiesMatchedStop>;
                setData(data);
            }
        })();
    }, [searchQuery]);

    return data;

}

export function useGetBusStopInfo(id: string) {
    return useGetBusStopsBusInfo([id])
}

export function useGetBusStopsBusInfo(ids: string[]) {
    const [data, setData] = useState<TflApiPresentationEntitiesStopPoint[]>();

    useEffect(() => {
        console.log("getting bus stops info");

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