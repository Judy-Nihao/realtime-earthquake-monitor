import { useState } from "react";
import {
  Badge,
  Card,
  Group,
  ScrollArea,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  useEarthquakeSocket,
  type Earthquake,
} from "./hooks/useEarthquakeSocket";
import { Globe } from "./components/Globe";
import { DEFAULT_DEPTH_COLOR, getDepthColor } from "./utils/earthquakeVisuals";
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
        <Card withBorder radius="md" padding="md">
          <Group justify="space-between" align="center" gap="md">
            <div>
              <Title order={2} size="h3">
                Realtime Earthquake Monitor
              </Title>
              <Text size="sm" c="dimmed">
                Live events from Seismic Portal
              </Text>
            </div>

            <Badge variant="light" color="green">
              {status}
            </Badge>
          </Group>
        </Card>

        <Card
          withBorder
          radius="md"
          padding="md"
          className={styles.selectedCard}
          style={
            {
              "--selected-depth-color": selectedEarthquake
                ? getDepthColor(selectedEarthquake.depth)
                : DEFAULT_DEPTH_COLOR,
            } as React.CSSProperties
          }
        >
          <Stack gap="xs">
            <Text size="sm" fw={700} tt="uppercase" c="dimmed">
              Selected earthquake
            </Text>

            {selectedEarthquake ? (
              <>
                <Group justify="space-between" align="flex-start" gap="sm">
                  <div>
                    <Title order={3} size="h4">
                      M{selectedEarthquake.mag} {selectedEarthquake.region}
                    </Title>
                    <Text size="sm" c="dimmed">
                      {selectedEarthquake.time}
                    </Text>
                  </div>

                  <Badge variant="light" className={styles.depthBadge}>
                    {selectedEarthquake.depth} km
                  </Badge>
                </Group>

                <Text size="sm">
                  Lat/Lon: {selectedEarthquake.lat.toFixed(3)},{" "}
                  {selectedEarthquake.lon.toFixed(3)}
                </Text>
              </>
            ) : (
              <Text size="sm" c="dimmed">
                Select a globe marker to inspect an earthquake.
              </Text>
            )}
          </Stack>
        </Card>

        <ScrollArea className={styles.eventScroll}>
          <Stack gap="sm">
            {earthquakes.slice(0, 10).map((eq) => (
              <Card key={eq.id} withBorder radius="md" padding="sm">
                <Group justify="space-between" align="flex-start" gap="sm">
                  <Text fw={700}>M{eq.mag}</Text>
                  <Text size="sm" c="dimmed" ta="right">
                    {eq.time}
                  </Text>
                </Group>

                <Text fw={500}>{eq.region}</Text>
                <Text size="sm" c="dimmed">
                  Depth: {eq.depth} km
                </Text>
              </Card>
            ))}
          </Stack>
        </ScrollArea>
      </aside>
    </div>
  );
};

export default App;
