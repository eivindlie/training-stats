import Link from "next/link";

import { logoutAction } from "@/app/actions";
import { getProfile } from "@/lib/strava/client";

import styles from "./Header.module.css";

export const Header = async () => {
  const profile = await getProfile();

  return (
    <nav className={styles.nav}>
      <Link href="/profile">
        {profile.firstname} {profile.lastname}
      </Link>
      <form action={logoutAction}>
        <button type="submit">Logg ut</button>
      </form>
    </nav>
  );
};
