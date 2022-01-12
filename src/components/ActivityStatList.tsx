import { useState, useEffect } from "react";
import { createUseStyles } from "react-jss";

import { getActivitiesBetween } from "clients/stravaClient";
import { IActivity } from "types/contractTypes";
import { ActivityStats } from "./ActivityStats";

const useStyles = createUseStyles({
  list: {
    display: "flex",
    justifyContent: "center",
    gap: "5rem",
  },
});

export const ActivityStatList = () => {
  const [activities, setActivities] = useState<IActivity[]>();

  useEffect(() => {
    const today = new Date();
    const yearStart = new Date(today.getFullYear(), 0, 1);
    const yearEnd = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999);

    getActivitiesBetween(yearStart, yearEnd).then((result) => {
      setActivities(result);
    });
  }, []);

  const displayTypes: { type: string; name: string }[] = [
    {
      type: "NordicSki",
      name: "Langrenn",
    },
    { type: "Run", name: "Løping" },
  ];

  const classes = useStyles();
  return (
    <div className={classes.list}>
      {displayTypes.map((type) => (
        <ActivityStats
          activities={activities?.filter((a) => a.type === type.type) ?? []}
          type={type.type}
          typeName={type.name}
          key={type.type}
        />
      ))}
    </div>
  );
};
