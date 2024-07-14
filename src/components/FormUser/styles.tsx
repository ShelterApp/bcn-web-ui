import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingTop: 10
    },
    boxError: {
      backgroundColor: "#ffe0e0",
      padding: 10
    },
    legend: {
      fontSize: 14,
      paddingLeft: 5,
      paddingRight: 5,
      color: "#191970"
    },
    fieldset: {
      borderColor: "rgba(255, 255, 255, 0.3)"
    }
  })
);

export default useStyles;
