import React, { useState } from "react";
import Container from "@material-ui/core/Container";
import styles from "./styles";
import { Liaison } from "@bcn/core";
// import CircularProgress from "@material-ui/core/CircularProgress";
import LiaisonItem from "components/LiaisonItem";
import { reducerType } from "redux/reducers";
import { useSelector, useDispatch } from "react-redux";
import Alert from "components/Alert";
import { DELETE_LIAISON_REQUEST } from "redux/reducers/service/actionTypes";
import { useTranslation } from "react-i18next";
import { UserRole } from "common";
interface LiaisonsProps {
  openUrl: Function;
  liaisons: Liaison[];
  loadingMore: boolean;
  loadmoreFunction: Function;
  canLoadmore: boolean;
}

const LiaisonsContainer = React.memo((props: LiaisonsProps) => {
  const translate = useTranslation().t;
  const {
    liaisons,
    loadmoreFunction,
    canLoadmore,
    loadingMore,
    openUrl
  } = props;
  const classes = styles();
  const dispatch = useDispatch();
  const current_user = useSelector(
    (state: reducerType) => state.auth.current_user
  );
  const handleWindowScroll = () => {
    const bottomOfWindow =
      window.scrollY + window.innerHeight >= document.body.scrollHeight - 500;
    if (bottomOfWindow && !loadingMore && canLoadmore) {
      loadmoreFunction();
    }

    return;
  };

  React.useEffect(() => {
    window.addEventListener("scroll", handleWindowScroll);
    return () => {
      window.removeEventListener("scroll", handleWindowScroll);
    };
  });
  const [openAlert, setOpenAlert] = useState(false);
  const [selectedLine, setSelectedLine] = useState<any>();

  const handleCloseAlert = () => {
    setOpenAlert(false);
    setSelectedLine(null);
  };

  const handleOpenAlert = id => {
    setOpenAlert(true);
    setSelectedLine(id);
  };

  const handleClickYes = () => {
    selectedLine && onDelete(selectedLine);
    handleCloseAlert();
  };

  const onDelete = id => {
    dispatch({
      type: DELETE_LIAISON_REQUEST,
      id: id
    });
  };

  return (
    <>
      <Container className={classes.root}>
        {liaisons.map((liaison, index) => (
          <LiaisonItem
            key={index}
            liaison={liaison}
            isAdmin={current_user.isAdmin}
            isSuperUser={current_user.roles.includes(UserRole.SuperUser)}
            openUrl={openUrl}
            handleOpenAlert={handleOpenAlert}
          />
        ))}
        <Alert
          title={translate("DO_YOU_WANT_TO_DELETE_THIS", {
            value: translate("LIAISON")
          })}
          open={openAlert}
          handleClose={handleCloseAlert}
          handleClickYes={handleClickYes}
        />
      </Container>
    </>
  );
});

export default LiaisonsContainer;
