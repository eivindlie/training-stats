import { createUseStyles } from "react-jss";

import { IActivity } from "types/contractTypes";

const useStyles = createUseStyles({
  wrapper: {
    padding: "1rem 2rem",
    boxShadow: "#222 0 25px 70px",
  },
  header: {
    marginBottom: "2rem",
  },
  detailList: {
    "& dd": {
      display: "inline",
      margin: 0,
    },
    "& dd::after": {
      display: "block",
      content: "''",
    },
    "& dt": {
      display: "inline-block",
      minWidth: "8rem",
      marginBottom: "0.75rem",
    },
  },
});

interface IProps {
  activities: IActivity[];
  type: string;
  typeName: string;
}

const formatTime = (seconds: number): string => {
  const date = new Date(0);
  date.setSeconds(seconds);

  return date.toISOString().slice(11, 19);
};

export const ActivityStats = ({ activities, typeName }: IProps) => {
  const distance = activities.map((a) => a.distance).reduce((a, b) => a + b, 0);

  const totalTime = activities
    .map((a) => a.moving_time)
    .reduce((a, b) => a + b, 0);

  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <h2 className={classes.header}>{typeName}</h2>
      <dl className={classes.detailList}>
        <dt>Antall aktiviteter</dt>
        <dd>{activities.length}</dd>

        <dt>Avstand</dt>
        <dd>{(distance / 1000).toFixed(2)} km</dd>

        <dt>Snittavstand</dt>
        <dd>
          {activities.length === 0
            ? 0
            : (distance / (1000 * activities.length)).toFixed(2)}{" "}
          km
        </dd>

        <dt>Total tid</dt>
        <dd>{formatTime(totalTime)}</dd>

        <dt>Snittid</dt>
        <dd>
          {activities.length === 0
            ? 0
            : formatTime(totalTime / activities.length)}
        </dd>
      </dl>
    </div>
  );
};
