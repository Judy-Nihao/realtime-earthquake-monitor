import { Badge, Card, Group, Stack, Text, Title } from "@mantine/core";
import type { CSSProperties } from "react";
import type { Earthquake } from "../hooks/useEarthquakeSocket";
import { DEFAULT_DEPTH_COLOR, getDepthColor } from "../utils/earthquakeVisuals";
import styles from "../App.module.css";

type SelectedEarthquakeCardProps = {
  earthquake: Earthquake | null;
};

export const SelectedEarthquakeCard = ({
  earthquake,
}: SelectedEarthquakeCardProps) => {
  return (
    <Card
      withBorder
      radius="md"
      padding="md"
      className={styles.selectedCard}
      style={
        {
          "--selected-depth-color": earthquake
            ? getDepthColor(earthquake.depth)
            : DEFAULT_DEPTH_COLOR,
        } as CSSProperties
      }
    >
      <Stack gap="xs">
        <Text
          size="sm"
          fw={700}
          tt="uppercase"
          c="dimmed"
          className={styles.selectedLabel}
        >
          Selected earthquake
        </Text>

        {earthquake ? (
          <>
            <Group justify="space-between" align="flex-start" gap="sm">
              <div>
                <Title order={3} size="h4" className={styles.selectedTitle}>
                  M{earthquake.mag} {earthquake.region}
                </Title>
                <Text size="sm" c="dimmed" className={styles.selectedTime}>
                  {earthquake.time}
                </Text>
              </div>

              <Badge variant="light" className={styles.depthBadge}>
                {earthquake.depth} km
              </Badge>
            </Group>

            <Text size="sm" className={styles.selectedCoordinates}>
              Lat/Lon: {earthquake.lat.toFixed(3)}, {earthquake.lon.toFixed(3)}
            </Text>
          </>
        ) : (
          <Text size="sm" c="dimmed">
            Select a globe marker to inspect an earthquake.
          </Text>
        )}
      </Stack>
    </Card>
  );
};
