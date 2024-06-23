import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingTop: 30
    },
    title: {
      paddingTop: 15,
      color: "#472F92",
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
      color: "#472F92",
      margin: 0,
      padding: 0,
      "&:hover": {
        color: "#472F92"
      }
    },
    counties: {
      fontSize: 14,
      paddingTop: 5,
      color: "#472F92"
    }
  })
);

export default useStyles;
