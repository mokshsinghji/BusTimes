import {useEffect, useState} from "react";

export function useGetBusStops(searchQuery: string) {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        (async () => {
            if (searchQuery.length > 0) {
                const request = await fetch(`https://api.tfl.gov.uk/StopPoint/Search/${searchQuery}?modesFilter=bus&oysterOnly=false&maxResults=20`);
                const data = await request.json();
                console.log(JSON.stringify(data, null, 2));
                setData(data.matches);
            }
        })();
    }, [searchQuery]);

    return data;

}

export function useGetBusStop(id: string) {
    const [data, setData] = useState<any>()
}