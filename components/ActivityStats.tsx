import type { IActivity } from "@/lib/strava/types";

import styles from "./ActivityStats.module.css";

interface Props {
  activities: IActivity[];
  typeName: string;
}

export const formatTime = (seconds: number): string => {
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  const m = (Math.floor(seconds / 60) % 60).toString().padStart(2, "0");
  const h = Math.floor(seconds / 3600).toString().padStart(2, "0");

  return `${h}:${m}:${s}`;
};

const sum = (values: number[]): number => values.reduce((a, b) => a + b, 0);

export const summarizeActivities = (activities: IActivity[]) => {
  const count = activities.length;
  const totalDistance = sum(activities.map((a) => a.distance));
  const totalTime = sum(activities.map((a) => a.moving_time));

  return {
    count,
    totalDistanceKm: totalDistance / 1000,
    averageDistanceKm: count === 0 ? 0 : totalDistance / 1000 / count,
    totalTime,
    averageTime: count === 0 ? 0 : totalTime / count,
  };
};

export const ActivityStats = ({ activities, typeName }: Props) => {
  const stats = summarizeActivities(activities);

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.header}>{typeName}</h2>
      <dl className={styles.detailList}>
        <dt>Antall aktiviteter</dt>
        <dd>{stats.count}</dd>

        <dt>Avstand</dt>
        <dd>{stats.totalDistanceKm.toFixed(2)} km</dd>

        <dt>Snittavstand</dt>
        <dd>{stats.averageDistanceKm.toFixed(2)} km</dd>

        <dt>Total tid</dt>
        <dd>{formatTime(stats.totalTime)}</dd>

        <dt>Snittid</dt>
        <dd>{stats.count === 0 ? 0 : formatTime(stats.averageTime)}</dd>
      </dl>
    </div>
  );
};
