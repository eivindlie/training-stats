import { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { getProfile } from "../clients/stravaClient";
import { IAthlete } from "../types/contractTypes";
import { signOut } from "../utils/auth";

const useStyles = createUseStyles({
  nav: {
    width: "calc(100% - 2rem)",
    height: "60px",

    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "0 1rem",
    gap: "0.5rem",
  },
});

export const Header = () => {
  const [profile, setProfile] = useState<IAthlete>();

  useEffect(() => {
    getProfile().then((result) => setProfile(result));
  }, []);

  const classes = useStyles();

  return (
    <nav className={classes.nav}>
      <div>
        {profile?.firstname} {profile?.lastname}
      </div>
      <button onClick={signOut}>Logg ut</button>
    </nav>
  );
};
