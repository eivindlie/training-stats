import { useState, useEffect } from "react";
import { createUseStyles } from "react-jss";

import { getActivitiesBetween } from "clients/stravaClient";
import { IActivity } from "types/contractTypes";
import { ActivityStats } from "./ActivityStats";
import { YearPicker } from "./YearPicker";

const useStyles = createUseStyles({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2rem",
  },
  list: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "5rem",
    "& > *": {
      flexShrink: 0,
      flexGrow: 0,
    },
  },
});

export const ActivityStatList = () => {
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<IActivity[]>();
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setLoading(true);
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31, 23, 59, 59, 999);

    getActivitiesBetween(yearStart, yearEnd).then((result) => {
      setActivities(result);
      setLoading(false);
    });
  }, [year, setLoading]);

  const displayTypes: { type: string; name: string }[] = [
    {
      type: "NordicSki",
      name: "Langrenn",
    },
    { type: "Run", name: "Løping" },
    { type: "Hike", name: "Gåtur" },
    { type: "Kayaking", name: "Kajakk" },
  ];

  const classes = useStyles();
  return (
    <div className={classes.wrapper}>
      <YearPicker year={year} setYear={setYear} />
      {!loading && (
        <div className={classes.list}>
          {displayTypes.map(
            (type) =>
              activities?.some((a) => a.type === type.type) && (
                <ActivityStats
                  activities={
                    activities?.filter((a) => a.type === type.type) ?? []
                  }
                  type={type.type}
                  typeName={type.name}
                  key={type.type}
                />
              )
          )}
        </div>
      )}
    </div>
  );
};
