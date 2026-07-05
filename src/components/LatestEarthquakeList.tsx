import { Card, Group, ScrollArea, Stack, Text } from "@mantine/core";
import type { Earthquake } from "../hooks/useEarthquakeSocket";
import styles from "../App.module.css";

type LatestEarthquakeListProps = {
  earthquakes: Earthquake[];
};

export const LatestEarthquakeList = ({
  earthquakes,
}: LatestEarthquakeListProps) => {
  const latestEarthquakes = earthquakes.slice(0, 10);

  return (
    <ScrollArea className={styles.eventScroll}>
      <Stack gap="sm">
        {latestEarthquakes.length === 0 ? (
          <Card
            withBorder
            radius="md"
            padding="md"
            className={styles.emptyStateCard}
          >
            <Text fw={700} c="dimmed" className={styles.loadingText}>
              Waiting for live earthquake events
              <span className={styles.loadingDots} aria-hidden="true">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            </Text>
          </Card>
        ) : (
          latestEarthquakes.map((earthquake) => (
            <Card key={earthquake.id} withBorder radius="md" padding="sm">
              <Group justify="space-between" align="flex-start" gap="sm">
                <Text fw={700}>M{earthquake.mag}</Text>
                <Text size="sm" c="dimmed" ta="right">
                  {earthquake.time}
                </Text>
              </Group>

              <Text fw={500}>{earthquake.region}</Text>
              <Text size="sm" c="dimmed">
                Depth: {earthquake.depth} km
              </Text>
            </Card>
          ))
        )}
      </Stack>
    </ScrollArea>
  );
};
