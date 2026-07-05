import { Badge, Card, Group, Text, Title } from "@mantine/core";
import type { SocketStatus } from "../hooks/useEarthquakeSocket";
import styles from "../App.module.css";

type SummaryCardProps = {
  status: SocketStatus;
};

export const SummaryCard = ({ status }: SummaryCardProps) => {
  return (
    <Card withBorder radius="md" padding="md" className={styles.summaryCard}>
      <Group justify="space-between" align="center" gap="md">
        <div>
          <Title order={2} size="h3">
            Realtime Earthquake Monitor
          </Title>
          <Text size="sm" c="dimmed">
            Live events from Seismic Portal
          </Text>
          <Text size="xs" c="dimmed" className={styles.controlHint}>
            Drag to rotate · Scroll to zoom · Right-drag to pan
          </Text>
        </div>

        <Badge variant="light" color="green">
          {status}
        </Badge>
      </Group>
    </Card>
  );
};
