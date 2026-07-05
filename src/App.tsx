import { useState } from "react";
import {
  useEarthquakeSocket,
  type Earthquake,
} from "./hooks/useEarthquakeSocket";
import { Globe } from "./components/Globe";
import { LatestEarthquakeList } from "./components/LatestEarthquakeList";
import { SelectedEarthquakeCard } from "./components/SelectedEarthquakeCard";
import { SummaryCard } from "./components/SummaryCard";
import styles from "./App.module.css";

export const App = () => {
  const { earthquakes, status } = useEarthquakeSocket();
  const [selectedEarthquake, setSelectedEarthquake] =
    useState<Earthquake | null>(null);

  return (
    <div className={styles.shell}>
      <div className={styles.globeStage}>
        <Globe
          earthquakes={earthquakes}
          selectedEarthquakeId={selectedEarthquake?.id ?? null}
          onSelectEarthquake={setSelectedEarthquake}
        />
      </div>

      <aside className={styles.panel}>
        <SummaryCard status={status} />
        <SelectedEarthquakeCard earthquake={selectedEarthquake} />
        <LatestEarthquakeList earthquakes={earthquakes} />
      </aside>
    </div>
  );
};

export default App;
