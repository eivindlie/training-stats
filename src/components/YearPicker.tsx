import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  wrapper: {
    display: "flex",
    gap: "5rem",
    fontSize: "1.5rem",
  },
});

interface IProps {
  year: number;
  setYear: (year: number) => void;
}
export const YearPicker = ({ year, setYear }: IProps) => {
  const thisYear = new Date().getFullYear();
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <button
        onClick={() => {
          setYear(year - 1);
        }}
      >
        &laquo;
      </button>
      <span>{year}</span>
      <button
        onClick={() => {
          setYear(year + 1);
        }}
        disabled={thisYear === year}
      >
        &raquo;
      </button>
    </div>
  );
};
