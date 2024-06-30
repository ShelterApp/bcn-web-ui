import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            paddingTop: 30,
        },
        title: {
            paddingTop: 15,
            color: "#5A6EB7",
            fontWeight: "bold",
        },
        flex1: {
            flex: 1,
        },
        dFlex: {
            display: "flex",
        },
        pr10: {
            paddingRight: 10,
        },
        center: {
            alignSelf: "center",
        },
        textLink: {
            textDecoration: "underline",
            cursor: "pointer",
            color: "#5A6EB7",
            margin: 0,
            padding: 0,
            "&:hover": {
                color: "#5A6EB7",
            },
        },
        counties: {
            fontSize: 14,
            paddingTop: 5,
            color: "#5A6EB7",
        },
    })
);

export default useStyles;
