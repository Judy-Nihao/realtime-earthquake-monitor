import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Color, NoToneMapping, type Mesh } from "three";
import type { Earthquake } from "../hooks/useEarthquakeSocket";
import { getDepthColor } from "../utils/earthquakeVisuals";

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

// 選取時不要換成別的色系，而是在原本 depth color 基礎上變深。
const darkenColor = (color: string) =>
  `#${new Color(color).multiplyScalar(0.62).getHexString()}`;

type MarkerProps = {
  earthquake: Earthquake;
  isSelected: boolean;
  onSelect: (earthquake: Earthquake) => void;
};

type GlobeProps = {
  earthquakes: Earthquake[];
  selectedEarthquakeId: string | null;
  onSelectEarthquake: (earthquake: Earthquake) => void;
};

const PoleStickers = () => {
  return (
    <group>
      <mesh position={[0, 2.02, 0]}>
        <octahedronGeometry args={[0.095, 0]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>

      <mesh position={[0, -2.02, 0]}>
        <octahedronGeometry args={[0.095, 0]} />
        <meshBasicMaterial color="#2563eb" />
      </mesh>
    </group>
  );
};

// 一筆 earthquake 會被畫成地球表面上的一顆小球。
const Marker = ({ earthquake, isSelected, onSelect }: MarkerProps) => {
  const markerRef = useRef<Mesh | null>(null);
  const bounceProgressRef = useRef(0);

  // 地球本體半徑是 2，marker 用 2.05，讓它稍微浮在地球表面外面。
  const position = latLonToVector3(earthquake.lat, earthquake.lon, 2.05);

  // 用地震規模決定 marker 大小；Math.max 確保規模太小時也看得到。
  const size = Math.max(0.03, earthquake.mag * 0.015);
  const markerScale = isSelected ? 1.45 : 1;

  // 用地震深度決定 marker 顏色，讓深度差異不只存在文字列表裡。
  const color = getDepthColor(earthquake.depth);
  const markerColor = isSelected ? darkenColor(color) : color;

  useFrame((_, delta) => {
    if (!markerRef.current) return;

    if (bounceProgressRef.current > 0) {
      bounceProgressRef.current = Math.max(
        0,
        bounceProgressRef.current - delta * 4,
      );
    }

    const bounceScale =
      bounceProgressRef.current > 0
        ? Math.sin(bounceProgressRef.current * Math.PI) * 0.45
        : 0;

    markerRef.current.scale.setScalar(markerScale + bounceScale);
  });

  return (
    <group position={position}>
      {/* mesh 是 Three.js 裡的一個可見 3D 物件，position 決定它放在哪裡。 */}
      <mesh
        ref={markerRef}
        scale={markerScale}
        onClick={(event) => {
          // 點 marker 時只選取這顆 marker，不把 click 事件繼續往外傳。
          event.stopPropagation();
          bounceProgressRef.current = 1;
          onSelect(earthquake);
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      >
        {/* sphereGeometry 代表這個 marker 的形狀是一顆小球。 */}
        <sphereGeometry args={[size, 16, 16]} />
        {/* material 決定物件外觀，這裡把 depth 對應到 marker color。 */}
        <meshBasicMaterial color={markerColor} />
      </mesh>
    </group>
  );
};

// Globe 接收 App 傳進來的 earthquakes，負責畫出 3D 地球和所有地震 marker。
export const Globe = ({
  earthquakes,
  selectedEarthquakeId,
  onSelectEarthquake,
}: GlobeProps) => {
  return (
    // Canvas 是 React Three Fiber 的 3D 畫布，裡面放的都是 Three.js 場景內容。
    // camera position [0, 0, 5] 代表攝影機在 z 軸前方，能看到半徑 2 的地球。
    <Canvas
      camera={{ position: [0, 0, 5] }}
      gl={{ toneMapping: NoToneMapping }}
    >
      {/* 環境光讓物件不會是全黑。 */}
      <ambientLight intensity={1} />

      {/* 地球本體：先用 wireframe 線框球，方便 MVP 確認 marker 位置。 */}
      <mesh>
        {/* 半徑 2，64 / 64 是球體切分數，數字越高看起來越圓。 */}
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial wireframe />
      </mesh>

      <PoleStickers />

      {/* earthquakes 有幾筆，就畫幾個 Marker。key 用 id，幫 React 辨識每個 marker。 */}
      {earthquakes.map((eq) => (
        <Marker
          key={eq.id}
          earthquake={eq}
          isSelected={eq.id === selectedEarthquakeId}
          onSelect={onSelectEarthquake}
        />
      ))}

      {/* OrbitControls 讓使用者可以用滑鼠旋轉、縮放、拖曳地球。 */}
      <OrbitControls />
    </Canvas>
  );
};
