import { useEffect, useState } from "react";
import { getActivitiesBetween } from "../clients/stravaClient";
import { IActivity } from "../types/contractTypes";

export const ActivityStats = () => {
  const [activities, setActivities] = useState<IActivity[]>();

  useEffect(() => {
    const today = new Date();
    const yearStart = new Date(today.getFullYear(), 0, 1);
    const yearEnd = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999);

    getActivitiesBetween(yearStart, yearEnd).then((result) => {
      setActivities(result);
    });
  }, []);

  const skiDistance = activities
    ?.filter((a) => a.type === "NordicSki")
    .map((a) => a.distance)
    .reduce((a, b) => a + b);

  const runDistance = activities
    ?.filter((a) => a.type === "Run")
    .map((a) => a.distance)
    .reduce((a, b) => a + b);

  return (
    <div>
      <p>
        Avstand tilbakelagt på ski i år:{" "}
        {!!skiDistance ? (skiDistance / 1000).toFixed(2) : ""} km
      </p>
      <p>
        Avstand løpt i år:{" "}
        {!!runDistance ? (runDistance / 1000).toFixed(2) : ""} km
      </p>
    </div>
  );
};
