import React from "react";
import useStyles from "./styles";
import clsx from "clsx";
import { Unit } from "@bcn/core";
import IconButton from "@material-ui/core/IconButton";
import IosCreate from "react-ionicons/lib/IosCreate";
import MdTrash from "react-ionicons/lib/MdTrash";
import { Coordinator } from "common/models/units";
import SubtitlesIcon from "@material-ui/icons/Subtitles";
import CallIcon from "@material-ui/icons/Call";
import EmailIcon from "@material-ui/icons/Email";
import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface UnitProps {
  unit: any[];
  isAdmin: boolean;
  openUrl: Function;
  handleOpenAlert: Function;
  company: string;
}

interface CoordinatorProps {
  coordinator: any;
}

const UnitItem = React.memo((props: UnitProps) => {
  const classes = useStyles();
  const { unit } = props;
  const { id } = unit[0];

  const CoordinatorItem = (props: CoordinatorProps) => {
    const { coordinators } = props.coordinator;
    const unitData = coordinators[0];
    const { displayName, title, officePhone, extension, email } = unitData;

    const phones = [
      { label: officePhone, value: officePhone, ext: extension }
    ].filter(x => x.value !== "");
    return (
      <div className={classes.card}>
        <div className={classes.desc}>
          <span className={clsx(classes.font600)}>
            <FontAwesomeIcon
              icon={faUserTie}
              className={clsx(classes.userTieIcon, classes.pr10)}
            />
            {displayName}
          </span>
          <br />
        </div>
        <div className={classes.desc}>
          <SubtitlesIcon fontSize="small" className={classes.pr10} />
          {title}
        </div>
        {phones.length > 0 && (
          <div className={classes.desc}>
            <CallIcon fontSize="small" className={classes.pr10} />
            {phones.map((phone, index) => (
              <React.Fragment key={index}>
                <a
                  href={`tel:${phone.value}`}
                  className={clsx(
                    classes.hrefLink,
                    classes.itemPhone,
                    classes.pr10
                  )}
                >
                  {phone.value} {phone.ext && `ext ${phone.ext}`}{" "}
                </a>
              </React.Fragment>
            ))}
          </div>
        )}
        {email && (
          <div className={classes.desc}>
            {email && (
              <a
                href={`mailto:${email}`}
                className={clsx(classes.hrefLink, classes.itemPhone)}
              >
                <EmailIcon fontSize="small" className={classes.pr10} />
                {email}
              </a>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={classes.pb30}>
      <div className={classes.card}>
        <div
          className={clsx(classes.title, classes.dFlex, classes.justifyBetween)}
        >
          <p className={classes.m0}>
            {unit[0].name}
            <br />
          </p>
          <div className={clsx(classes.second)}>
            {props.isAdmin && (
              <>
                <IconButton
                  onClick={() => props.openUrl(`/coordinators/${id}/edit`)}
                  className={clsx(classes.p0, classes.pr10)}
                >
                  <IosCreate color="#191970" fontSize="18px" />
                </IconButton>
                <IconButton
                  onClick={() => props.handleOpenAlert(id)}
                  className={classes.p0}
                >
                  <MdTrash color="#191970" fontSize="18px" />
                </IconButton>
              </>
            )}
          </div>
        </div>
      </div>

      {unit.map((coordinator, key) => (
        <CoordinatorItem key={key} coordinator={coordinator} />
      ))}
    </div>
  );
});
export default UnitItem;
