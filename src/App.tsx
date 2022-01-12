import { createUseStyles } from "react-jss";
import { ActivityStats } from "./components/ActivityStats";
import { Header } from "./components/Header";
import { Profile } from "./components/Profile";

const useStyles = createUseStyles({
  wrapper: {},
  content: {
    padding: "2rem",
  },
});

const App = () => {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <Header />
      <div className={classes.content}>
        <ActivityStats />
        <Profile />
      </div>
    </div>
  );
};

export default App;
