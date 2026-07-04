import { useEarthquakeSocket } from "./hooks/useEarthquakeSocket";
import { Globe } from "./components/Globe";

export const App = () => {
  const { earthquakes, status } = useEarthquakeSocket();

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ flex: 1 }}>
        <Globe earthquakes={earthquakes} />
      </div>

      <aside style={{ width: 360, padding: 16, overflow: "auto" }}>
        <h2>Realtime Earthquake Monitor</h2>
        <p>Status: {status}</p>

        {earthquakes.slice(0, 10).map((eq) => (
          <div key={eq.id} style={{ marginBottom: 12 }}>
            <strong>M{eq.mag}</strong> {eq.region}
            <br />
            Depth: {eq.depth} km
            <br />
            {eq.time}
          </div>
        ))}
      </aside>
    </div>
  );
};

export default App;
