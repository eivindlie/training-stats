import { createUseStyles } from "react-jss";
import { Routes } from "./Routes";
import { Header } from "./components";

const useStyles = createUseStyles({
  wrapper: {},
  content: {
    padding: "2rem",
  },
});

export const App = () => {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <Header />
      <div className={classes.content}>
        <Routes />
      </div>
    </div>
  );
};
