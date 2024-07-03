import React, { useState } from "react";
import Container from "@material-ui/core/Container";
import styles from "./styles";
// import { Unit } from "@bcn/core";
import UnitItem from "components/UnitItem";
import { reducerType } from "redux/reducers";
import { useSelector, useDispatch } from "react-redux";
import Alert from "components/Alert";
import { DELETE_UNIT_REQUEST } from "redux/reducers/service/actionTypes";
import { useTranslation } from "react-i18next";
interface UnitsProps {
  openUrl: Function;
  units: any[];
}

const UnitsContainer = React.memo((props: UnitsProps) => {
  const translate = useTranslation().t;
  const { units, openUrl } = props;
  const classes = styles();
  const dispatch = useDispatch();
  const current_user = useSelector(
    (state: reducerType) => state.auth.current_user
  );

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
      type: DELETE_UNIT_REQUEST,
      id: id
    });
  };

  const data = units.reduce((r, a) => {
    r[a.company] = r[a.company] || [];
    r[a.company].push(a);
    return r;
  }, Object.create(null));

  return (
    <>
      <Container className={classes.root}>
        {data &&
          Object.keys(data).length > 0 &&
          Object.keys(data).map((key, index) => (
            <UnitItem
              company={key}
              key={index}
              unit={data[key]}
              isAdmin={current_user.isAdmin}
              openUrl={openUrl}
              handleOpenAlert={handleOpenAlert}
            />
          ))}
        {/* {units.map((unit, index) => (
          <UnitItem
            key={index}
            unit={unit}
            isAdmin={current_user.isAdmin}
            openUrl={openUrl}
            handleOpenAlert={handleOpenAlert}
          />
        ))} */}
        <Alert
          title={translate("DO_YOU_WANT_TO_DELETE_THIS", {
            value: translate("REGIONAL_COORDINATOR")
          })}
          open={openAlert}
          handleClose={handleCloseAlert}
          handleClickYes={handleClickYes}
        />
      </Container>
    </>
  );
});

export default UnitsContainer;
