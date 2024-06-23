import React from "react";
import useStyles from "./styles";
import clsx from "clsx";
import { Coordinator } from "common/models/units";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { useTranslation } from "react-i18next";

export interface CoordinatorProps {
  coordinator: Coordinator;
  onDeleteCoordinator: (key) => void;
  keyItem?: number;
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
        <span
          className={classes.wrapDelete}
          onClick={() => props.onDeleteCoordinator(props.keyItem)}
        >
          <DeleteOutlineIcon className={classes.iconDelete} />
        </span>
      </div>
      <p className={clsx(classes.desc)}>
        {translate("TITLE")}: {title}
        <br />
        {translate("OFFICE_PHONE")}: {officePhone}
        <br />
        {translate("MOBILE_PHONE")}: {mobile}
        <br />
        {translate("FAX_PHONE")}: {fax}
        <br />
        {translate("EMAIL")}: {email}
        <br />
      </p>
    </div>
  );
});
export default CoordinatorItem;
