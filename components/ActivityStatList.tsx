import type { IActivity } from "@/lib/strava/types";

import { ActivityStats } from "./ActivityStats";
import { YearPicker } from "./YearPicker";
import styles from "./ActivityStatList.module.css";

const DISPLAY_TYPES: { type: string; name: string }[] = [
  { type: "NordicSki", name: "Langrenn" },
  { type: "Run", name: "Løping" },
  { type: "Hike", name: "Gåtur" },
  { type: "Kayaking", name: "Kajakk" },
];

export const groupActivitiesByDisplayType = (activities: IActivity[]) =>
  DISPLAY_TYPES.map((displayType) => ({
    ...displayType,
    activities: activities.filter((a) => a.type === displayType.type),
  })).filter((group) => group.activities.length > 0);

interface Props {
  activities: IActivity[];
  year: number;
}

export const ActivityStatList = ({ activities, year }: Props) => (
  <div className={styles.wrapper}>
    <YearPicker year={year} />
    <div className={styles.list}>
      {groupActivitiesByDisplayType(activities).map((group) => (
        <ActivityStats key={group.type} activities={group.activities} typeName={group.name} />
      ))}
    </div>
  </div>
);
