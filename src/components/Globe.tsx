import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { Earthquake } from "../hooks/useEarthquakeSocket";

// 把地震資料的經緯度轉成 Three.js 3D 世界裡的 x/y/z 座標。
// 地震 API 給的是 lat/lon，但 3D marker 需要的是 position: [x, y, z]。
const latLonToVector3 = (lat: number, lon: number, radius = 2) => {
  // JavaScript 的 Math.sin / Math.cos 使用的是弧度，不是一般地圖上的角度。
  // 所以這裡先把緯度、經度換算成球體公式可以使用的角度。
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  // 用球體座標公式，把地球表面上的一個點換成 3D 空間座標。
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  // 回傳固定三個數字的 tuple，剛好可以給 Three.js 的 position 使用。
  return [x, y, z] as const;
};

// 用地震深度決定 marker 顏色。
// 淺層地震用黃色，中層用橘色，深層用紅色，讓 depth 也能被視覺化。
const getDepthColor = (depth: number) => {
  if (depth < 30) return "#facc15";
  if (depth < 100) return "#fb923c";
  return "#ef4444";
};

// 一筆 earthquake 會被畫成地球表面上的一顆小球。
const Marker = ({ earthquake }: { earthquake: Earthquake }) => {
  // 地球本體半徑是 2，marker 用 2.05，讓它稍微浮在地球表面外面。
  const position = latLonToVector3(earthquake.lat, earthquake.lon, 2.05);

  // 用地震規模決定 marker 大小；Math.max 確保規模太小時也看得到。
  const size = Math.max(0.03, earthquake.mag * 0.015);

  // 用地震深度決定 marker 顏色，讓深度差異不只存在文字列表裡。
  const color = getDepthColor(earthquake.depth);

  return (
    // mesh 是 Three.js 裡的一個可見 3D 物件，position 決定它放在哪裡。
    <mesh position={position}>
      {/* sphereGeometry 代表這個 marker 的形狀是一顆小球。 */}
      <sphereGeometry args={[size, 16, 16]} />
      {/* material 決定物件外觀，這裡把 depth 對應到 marker color。 */}
      <meshBasicMaterial color={color} />
    </mesh>
  );
};

// Globe 接收 App 傳進來的 earthquakes，負責畫出 3D 地球和所有地震 marker。
export const Globe = ({ earthquakes }: { earthquakes: Earthquake[] }) => {
  return (
    // Canvas 是 React Three Fiber 的 3D 畫布，裡面放的都是 Three.js 場景內容。
    // camera position [0, 0, 5] 代表攝影機在 z 軸前方，能看到半徑 2 的地球。
    <Canvas camera={{ position: [0, 0, 5] }}>
      {/* 環境光讓物件不會是全黑。 */}
      <ambientLight intensity={1} />

      {/* 地球本體：先用 wireframe 線框球，方便 MVP 確認 marker 位置。 */}
      <mesh>
        {/* 半徑 2，64 / 64 是球體切分數，數字越高看起來越圓。 */}
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial wireframe />
      </mesh>

      {/* earthquakes 有幾筆，就畫幾個 Marker。key 用 id，幫 React 辨識每個 marker。 */}
      {earthquakes.map((eq) => (
        <Marker key={eq.id} earthquake={eq} />
      ))}

      {/* OrbitControls 讓使用者可以用滑鼠旋轉、縮放、拖曳地球。 */}
      <OrbitControls />
    </Canvas>
  );
};
