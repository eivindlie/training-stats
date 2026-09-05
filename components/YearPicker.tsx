import Link from "next/link";

import styles from "./YearPicker.module.css";

interface Props {
  year: number;
  thisYear?: number;
}

export const getYearPickerLinks = (year: number, thisYear: number) => ({
  prevHref: `/?year=${year - 1}`,
  nextHref: year < thisYear ? `/?year=${year + 1}` : null,
});

export const YearPicker = ({ year, thisYear = new Date().getFullYear() }: Props) => {
  const { prevHref, nextHref } = getYearPickerLinks(year, thisYear);

  return (
    <div className={styles.wrapper}>
      <Link href={prevHref}>&laquo;</Link>
      <span>{year}</span>
      {nextHref ? (
        <Link href={nextHref}>&raquo;</Link>
      ) : (
        <span className={styles.disabled}>&raquo;</span>
      )}
    </div>
  );
};
