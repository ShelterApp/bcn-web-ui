import React, { useState } from "react";
import Container from "@material-ui/core/Container";
import styles from "./styles";
import { Region } from "@fywinnv/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import RegionItem from "components/RegionItem";
import { reducerType } from "redux/reducers";
import { useSelector, useDispatch } from "react-redux";
import Alert from "components/Alert";
import { DELETE_REGION_REQUEST } from "redux/reducers/service/actionTypes";
import { useTranslation } from "react-i18next";
interface RegionsProps {
  openUrl: Function;
  regions: Region[];
  loadingMore: boolean;
  loadmoreFunction: Function;
  canLoadmore: boolean;
}

const RegionsContainer = React.memo((props: RegionsProps) => {
  const translate = useTranslation().t;
  const {
    regions,
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
      type: DELETE_REGION_REQUEST,
      id: id
    });
  };

  return (
    <>
      <Container className={classes.root}>
        {regions.map((region, index) => (
          <RegionItem
            key={index}
            region={region}
            isAdmin={current_user.isAdmin}
            openUrl={openUrl}
            handleOpenAlert={handleOpenAlert}
          />
        ))}
        {canLoadmore && (
          <Container className={classes.textCenter}>
            <CircularProgress
              style={{ width: 25, height: 25 }}
              className={classes.loadmore}
            />
          </Container>
        )}
        <Alert
          title={translate("DO_YOU_WANT_TO_DELETE_THIS", {
            value: translate("REGION")
          })}
          open={openAlert}
          handleClose={handleCloseAlert}
          handleClickYes={handleClickYes}
        />
      </Container>
    </>
  );
});

export default RegionsContainer;
