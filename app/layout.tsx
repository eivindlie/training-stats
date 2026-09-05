import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Header } from "@/components/Header";

import styles from "./layout.module.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Training stats",
  description: "Stats fra Strava.",
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="no">
    <body>
      <Header />
      <div className={styles.content}>{children}</div>
    </body>
  </html>
);

export default RootLayout;
