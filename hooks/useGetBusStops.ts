import {useEffect, useState} from "react";

export function useGetBusStops(searchQuery: string) {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        (async () => {
            if (searchQuery.length > 0) {
                const request = await fetch(`https://api.tfl.gov.uk/StopPoint/Search/${searchQuery}?modesFilter=bus&oysterOnly=false&maxResults=20`);
                const data = await request.json();
                // console.log(data);
                setData(data.matches);
            }
        })();
    }, [searchQuery]);

    return data;

}

export function useGetBusStop(id: string) {
    const [data, setData] = useState<any>();

    useEffect(() => {
        console.log("getting bus stop");

        (async () => {
            if (id.length > 0) {
                const request = await fetch(`https://api.tfl.gov.uk/StopPoint/${id}`)
                const data = await request.json();
                console.log("bus stop:", data);
                setData(data);
            }
        })();
    }, [id]);

    return data;
}