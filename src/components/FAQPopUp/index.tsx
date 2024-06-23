import React from "react";
import clsx from "clsx";
import styles from "./styles";
import Drawer from "@material-ui/core/Drawer";
import Container from "@material-ui/core/Container";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CancelIcon from "@material-ui/icons/Cancel";
import { useTranslation } from "react-i18next";

interface SearchBarProps {
  isOpenSearch: boolean;
  clickOpenSearch: Function;
  content: string;
}

const SearchBar = React.memo((props: SearchBarProps) => {
  const classes = styles();
  const { clickOpenSearch, isOpenSearch, content } = props;
  const translate = useTranslation().t;
  const toggleDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" ||
        (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    clickOpenSearch(open);
  };

  const list = () => (
    <div className={clsx(classes.fullList)}>
      <AppBar className={classes.toolbar} position="static">
        <Toolbar className={classes.containerHeader}>
          <Typography variant="h6" className={classes.title}>
            {translate("CHATBOT_FAQ")}
          </Typography>
          <IconButton
            onClick={toggleDrawer(false)}
            edge="end"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <CancelIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container className={classes.root}>
        <div dangerouslySetInnerHTML={{ __html: content }}></div>
      </Container>
    </div>
  );

  return (
    <React.Fragment key={"bottom"}>
      <Drawer
        anchor={"bottom"}
        open={isOpenSearch}
        onClose={toggleDrawer(false)}
      >
        {list()}
      </Drawer>
    </React.Fragment>
  );
});

export default SearchBar;
