/**
 * 即時資料接收器
 * 負責連到地震資料來源、收到資料、整理成乾淨格式、存進 React state
 * 最後讓畫面可以拿這些資料去畫 3D marker
 */

import { useEffect, useState } from "react";
import SockJS from "sockjs-client";

export type Earthquake = {
  id: string;
  lat: number;
  lon: number;
  mag: number;
  depth: number;
  region: string;
  time: string;
};

export const useEarthquakeSocket = () => {
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [status, setStatus] = useState("connecting");

  useEffect(() => {
    // 幫我跟這個 realtime earthquake server 建立一條即時資料通道
    const socket = new SockJS("https://www.seismicportal.eu/standing_order");

    socket.onopen = () => {
      setStatus("connected");
      console.log("Connected");
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const props = message.data?.properties;
      const coords = message.data?.geometry?.coordinates;

      if (!props || !coords) return;

      const earthquake: Earthquake = {
        id: props.unid,
        lon: coords[0],
        lat: coords[1],
        depth: props.depth,
        mag: props.mag,
        region: props.flynn_region,
        time: props.time,
      };

      setEarthquakes((prev) =>
        [earthquake, ...prev.filter((eq) => eq.id !== earthquake.id)].slice(
          0,
          100,
        ),
      );
    };

    socket.onclose = () => {
      setStatus("disconnected");
      console.log("Disconnected");
    };

    // 如果使用這個 hook 的元件被移除，就把 socket 關掉
    // 不然可能會留下背景連線，造成重複收到資料或 memory leak
    return () => {
      socket.close();
    };
  }, []);

  return { earthquakes, status };
};
