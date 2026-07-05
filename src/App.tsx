import {
  Badge,
  Card,
  Group,
  ScrollArea,
  Stack,
  Text,
  Title,
} from "@mantine/core";
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
