import { createUseStyles } from "react-jss";
import { ActivityStats } from "./components/ActivityStats";
import { Profile } from "./components/Profile";

const useStyles = createUseStyles({
  wrapper: {
    padding: "2rem",
  },
});

const App = () => {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <ActivityStats />
      <Profile />
    </div>
  );
};

export default App;
