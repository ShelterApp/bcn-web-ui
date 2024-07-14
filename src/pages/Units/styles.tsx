import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingTop: 30
    },
    title: {
      paddingTop: 15,
      color: "#191970",
      fontWeight: "bold"
    },
    flex1: {
      flex: 1
    },
    dFlex: {
      display: "flex"
    },
    pr10: {
      paddingRight: 10
    },
    center: {
      alignSelf: "center"
    },
    textLink: {
      textDecoration: "underline",
      cursor: "pointer",
      color: "#191970",
      margin: 0,
      padding: 0,
      "&:hover": {
        color: "#191970"
      }
    },
    counties: {
      fontSize: 14,
      paddingTop: 5,
      color: "#191970"
    }
  })
);

export default useStyles;
