import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";

const AntSwitch = withStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 28,
      height: 14,
      padding: 0,
      display: "flex",
      overflow: "unset"
    },
    switchBase: {
      padding: 2,
      color: theme.palette.common.white,
      "&$checked": {
        transform: "translateX(12px)",
        color: theme.palette.common.white,
        "& + $track": {
          opacity: 1,
          backgroundColor: "#472F92",
          borderColor: "#472F92"
        }
      }
    },
    thumb: {
      width: 12,
      height: 12,
      boxShadow: "none"
    },
    track: {
      border: `1px solid ${theme.palette.grey[500]}`,
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor: theme.palette.grey[500]
    },
    checked: {}
  })
)(Switch);

export default AntSwitch;
