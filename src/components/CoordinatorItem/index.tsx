import React from "react";
import useStyles from "./styles";
import clsx from "clsx";
import { Coordinator } from "common/models/units";
import IosCreate from "react-ionicons/lib/IosCreate";
import IconButton from "@material-ui/core/IconButton";
import MdTrash from "react-ionicons/lib/MdTrash";
import { useTranslation } from "react-i18next";

export interface CoordinatorProps {
  coordinator: Coordinator;
  onDeleteCoordinator: (key) => void;
  onUpdate: (key) => void;
  keyItem?: number;
  key: number;
}

const CoordinatorItem = React.memo((props: CoordinatorProps) => {
  const classes = useStyles();
  const translate = useTranslation().t;
  const {
    displayName,
    title,
    email,
    officePhone,
    fax,
    mobile
  } = props.coordinator;

  return (
    <div className={classes.card}>
      <div
        className={clsx(classes.title, classes.dFlex, classes.justifyBetween)}
      >
        <p className={classes.m0}>{displayName}</p>
        <div className={clsx(classes.second)}>
          <IconButton
            onClick={() => props.onUpdate(props.keyItem)}
            className={clsx(classes.p0, classes.pr10)}
          >
            <IosCreate color="#191970" fontSize="18px" />
          </IconButton>
          <IconButton
            onClick={() => props.onDeleteCoordinator(props.keyItem)}
            className={classes.p0}
          >
            <MdTrash color="#191970" fontSize="18px" />
          </IconButton>
        </div>
      </div>
      <p className={clsx(classes.desc)}>
        {translate("TITLE")}: {title}
        <br />
        {translate("OFFICE_PHONE")}: {officePhone}
        <br />
        {translate("MOBILE_PHONE")}: {mobile}
        <br />
        {translate("EMAIL")}: {email}
        <br />
      </p>
    </div>
  );
});
export default CoordinatorItem;
