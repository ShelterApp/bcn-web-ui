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
    })
);

export default useStyles;
