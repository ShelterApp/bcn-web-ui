import React from "react";
import useStyles from "./styles";
import clsx from "clsx";
import CallIcon from "@material-ui/icons/Call";
import EmailIcon from "@material-ui/icons/Email";
import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SubtitlesIcon from "@material-ui/icons/Subtitles";

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
    company,
    firstName,
    lastName,
    prefix,
    title,
    email,
    firstPhoneNumber,
    firstPhoneExtension
  } = props.liaison;

  return (
    <div className={classes.card}>
      <div
        className={clsx(classes.title, classes.dFlex, classes.justifyBetween)}
      >
        <p className={classes.m0}>{company}</p>
      </div>
      <p className={clsx(classes.desc)}>
        <span>
          <FontAwesomeIcon
            icon={faUserTie}
            className={clsx(classes.userTieIcon, classes.pr10)}
          />
          {` ${prefix}${firstName} ${lastName}`}
        </span>
      </p>
      <p className={clsx(classes.desc)}>
        <span className={clsx(classes.dFlex)}>
          <SubtitlesIcon fontSize="small" className={classes.pr10} />
          {title}
        </span>
      </p>
      {firstPhoneNumber && (
        <p className={clsx(classes.desc)}>
          <span>
            {firstPhoneNumber && (
              <a
                href={`tel:${firstPhoneNumber}`}
                className={clsx(classes.hrefLink, classes.itemPhone)}
              >
                <CallIcon fontSize="small" className={classes.pr10} />
                {firstPhoneNumber}
                {firstPhoneExtension && ` ext. ${firstPhoneExtension}`}
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
