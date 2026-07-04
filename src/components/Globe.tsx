import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { Earthquake } from "../hooks/useEarthquakeSocket";

const latLonToVector3 = (lat: number, lon: number, radius = 2) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return [x, y, z] as const;
};

const Marker = ({ earthquake }: { earthquake: Earthquake }) => {
  const position = latLonToVector3(earthquake.lat, earthquake.lon, 2.05);
  const size = Math.max(0.03, earthquake.mag * 0.015);

  return (
    <mesh position={position}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial />
    </mesh>
  );
};

export const Globe = ({ earthquakes }: { earthquakes: Earthquake[] }) => {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={1} />

      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial wireframe />
      </mesh>

      {earthquakes.map((eq) => (
        <Marker key={eq.id} earthquake={eq} />
      ))}

      <OrbitControls />
    </Canvas>
  );
};
