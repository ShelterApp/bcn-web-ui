import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: 10,
        },
        title: {
            fontSize: 14,
            color: "#5A6EB7",
            "& a": {
                color: "#5A6EB7",
                "-webkit-user-drag": "none",
                "-webkit-tap-highlight-color": "transparent",
                textDecoration: "underline",
                cursor: "pointer",
                "&:active": {
                    backgroundColor: "unset",
                    color: "#5A6EB7",
                },
                "&:hover": {
                    backgroundColor: "unset",
                    color: "#5A6EB7",
                },
            },
        },
        font600: {
            fontWeight: 600,
        },
        groupBtn: {
            backgroundColor: "#5A6EB7",
            borderRadius: 4,
            width: "100%",
            color: "white",
            fontSize: 20,
            display: "flex",
            justifyContent: "space-around",
            paddingTop: 5,
            paddingBottom: 5,
            alignItems: "center",
            "& a": {
                color: "white",
                "-webkit-user-drag": "none",
                "-webkit-tap-highlight-color": "transparent",
                textDecoration: "none",
                cursor: "pointer",
                "&:active": {
                    color: "white",
                    backgroundColor: "unset",
                },
                "&:hover": {
                    color: "white",
                    backgroundColor: "unset",
                },
            },
        },
    })
);

export default useStyles;
