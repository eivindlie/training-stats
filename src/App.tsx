import { createUseStyles } from "react-jss";
import { Routes } from "./Routes";
import { Header } from "./components";
import React from "react";
import GithubCorner from "react-github-corner";

const useStyles = createUseStyles({
  wrapper: {},
  content: {
    padding: "2rem",
  },
});

export const App = () => {
  const classes = useStyles();

  return (
    <>
      <GithubCorner
        href="https://github.com/Lagostra/training-stats"
        direction="left"
      />
      <div className={classes.wrapper}>
        <Header />
        <div className={classes.content}>
          <Routes />
        </div>
      </div>
    </>
  );
};
