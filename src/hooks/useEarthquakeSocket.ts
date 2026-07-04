/**
 * 即時資料接收器
 * 負責連到地震資料來源、收到資料、整理成乾淨格式、存進 React state
 * 最後讓畫面可以拿這些資料去畫 3D marker
 */

import { useEffect, useState } from "react";
import SockJS from "sockjs-client";

// 定義我們 App 內部要使用的地震資料格式。
// 外部 API 的資料很多又比較複雜，先整理成這種乾淨格式，後面 UI 會比較好用。
export type Earthquake = {
  id: string;
  lat: number;
  lon: number;
  mag: number;
  depth: number;
  region: string;
  time: string;
};

// 這是一個 custom hook，負責處理「即時地震資料」這件事。
// App.tsx 只要呼叫它，就可以拿到 earthquakes 和目前連線 status。
export const useEarthquakeSocket = () => {
  // 存目前收到的地震列表。初始值是空陣列，代表一開始還沒有任何地震資料。
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);

  // 存 socket 的連線狀態，讓畫面可以顯示 connecting / connected / disconnected。
  const [status, setStatus] = useState("connecting");

  useEffect(() => {
    // useEffect 會在元件第一次出現在畫面時執行。
    // 這裡建立一條連到 Seismic Portal 的即時資料通道。
    const socket = new SockJS("https://www.seismicportal.eu/standing_order");

    // socket 成功連線時會觸發 onopen。
    // 這裡把狀態改成 connected，畫面右側就能同步顯示連線成功。
    socket.onopen = () => {
      setStatus("connected");
      console.log("Connected");
    };

    // server 每送來一筆資料，就會觸發 onmessage。
    // event.data 是字串格式的 JSON，所以要先 JSON.parse 轉成 JavaScript object。
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      // Seismic Portal 的資料主要放在 data.properties 和 data.geometry.coordinates。
      // properties 是地震屬性，例如規模、深度、地區、時間。
      // coordinates 是座標，格式通常是 [longitude, latitude, depth]。
      const props = message.data?.properties;
      const coords = message.data?.geometry?.coordinates;

      // 如果這筆資料缺少 properties 或 coordinates，就先跳過，避免後面讀資料時報錯。
      if (!props || !coords) return;

      // 把外部 API 的原始資料整理成我們自己的 Earthquake 格式。
      // 注意 GeoJSON 座標通常是 lon 在前、lat 在後，所以 coords[0] 是經度，coords[1] 是緯度。
      const earthquake: Earthquake = {
        id: props.unid,
        lon: coords[0],
        lat: coords[1],
        depth: props.depth,
        mag: props.mag,
        region: props.flynn_region,
        time: props.time,
      };

      // 把最新地震放到列表最前面。
      // 如果同一個 id 已經存在，就先從舊列表移除，避免 React key 重複。
      // 最後只保留最新 100 筆，避免資料越存越多讓畫面變慢。
      setEarthquakes((prev) =>
        [earthquake, ...prev.filter((eq) => eq.id !== earthquake.id)].slice(
          0,
          100,
        ),
      );
    };

    // socket 關閉時會觸發 onclose。
    // 這裡更新狀態，讓畫面知道目前已經斷線。
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

  // 把地震列表和連線狀態交給使用這個 hook 的元件。
  // 例如 App.tsx 可以用 const { earthquakes, status } = useEarthquakeSocket();
  return { earthquakes, status };
};
