import { useEarthquakeSocket } from "./hooks/useEarthquakeSocket";
import { Globe } from "./components/Globe";
import styles from "./App.module.css";

export const App = () => {
  const { earthquakes, status } = useEarthquakeSocket();

  return (
    <div className={styles.shell}>
      <div className={styles.globeStage}>
        <Globe earthquakes={earthquakes} />
      </div>

      <aside className={styles.panel}>
        <h2>Realtime Earthquake Monitor</h2>
        <p>Status: {status}</p>

        {earthquakes.slice(0, 10).map((eq) => (
          <div key={eq.id} className={styles.eventItem}>
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
