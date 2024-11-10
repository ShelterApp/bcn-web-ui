import React from "react";
import useStyles from "./styles";
import clsx from "clsx";
import CallIcon from "@material-ui/icons/Call";
import EmailIcon from "@material-ui/icons/Email";
import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SubtitlesIcon from "@material-ui/icons/Subtitles";
import IconButton from "@material-ui/core/IconButton";
import IosCreate from "react-ionicons/lib/IosCreate";
import MdTrash from "react-ionicons/lib/MdTrash";

export interface LiaisonProps {
  liaison: any;
  isAdmin: boolean;
  isSuperUser: boolean;
  openUrl: Function;
  handleOpenAlert: Function;
}

const LiaisonItem = React.memo((props: LiaisonProps) => {
  const classes = useStyles();
  const {
    id,
    schoolDistrict,
    displayName,
    title,
    email,
    phone,
    extension
  } = props.liaison;

  return (
    <div className={classes.card}>
      <div
        className={clsx(classes.title, classes.dFlex, classes.justifyBetween)}
      >
        <p className={classes.m0}>{schoolDistrict}</p>
        <div className={clsx(classes.second)}>
          {(props.isAdmin || props.isSuperUser) && (
            <IconButton
              onClick={() => props.openUrl(`/liaisons/${id}/edit`)}
              className={clsx(classes.p0, classes.pr10)}
            >
              <IosCreate color="#191970" fontSize="18px" />
            </IconButton>
          )}
          {props.isAdmin && (
            <IconButton
              onClick={() => props.handleOpenAlert(id)}
              className={classes.p0}
            >
              <MdTrash color="#191970" fontSize="18px" />
            </IconButton>
          )}
        </div>
      </div>
      <p className={clsx(classes.desc)}>
        <span>
          <FontAwesomeIcon
            icon={faUserTie}
            className={clsx(classes.userTieIcon, classes.pr10)}
          />
          {` ${displayName}`}
        </span>
      </p>
      <p className={clsx(classes.desc)}>
        <span className={clsx(classes.dFlex)}>
          <SubtitlesIcon fontSize="small" className={classes.pr10} />
          {title}
        </span>
      </p>
      {phone && (
        <p className={clsx(classes.desc)}>
          <span>
            {phone && (
              <a
                href={`tel:${phone}`}
                className={clsx(classes.hrefLink, classes.itemPhone)}
              >
                <CallIcon fontSize="small" className={classes.pr10} />
                {phone}
                {extension && ` ext. ${extension}`}
              </a>
            )}
          </span>
        </p>
      )}
      {email && (
        <div className={clsx(classes.desc)}>
          <div className={clsx(classes.first)}>
            <span>
              <a
                href={`mailto:${email}`}
                className={clsx(classes.hrefLink, classes.itemPhone)}
              >
                <EmailIcon fontSize="small" className={classes.pr10} />
                {email}
              </a>
            </span>
          </div>
        </div>
      )}
    </div>
  );
});
export default LiaisonItem;
