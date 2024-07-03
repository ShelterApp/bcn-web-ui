import React from "react";
import useStyles from "./styles";
import clsx from "clsx";
import { Region } from "@bcn/core";
import IconButton from "@material-ui/core/IconButton";
import IosCreate from "react-ionicons/lib/IosCreate";
import MdTrash from "react-ionicons/lib/MdTrash";
import { parseURL } from "common";
import MdGlobe from "react-ionicons/lib/MdGlobe";

export interface RegionProps {
  region: Region;
  isAdmin: boolean;
  openUrl: Function;
  handleOpenAlert: Function;
}

const RegionItem = React.memo((props: RegionProps) => {
  const classes = useStyles();
  const { name, website, id } = props.region;

  return (
    <div className={classes.card}>
      <div
        className={clsx(classes.title, classes.dFlex, classes.justifyBetween)}
      >
        <p className={classes.m0}>
          {name}
          {!!website && (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={parseURL(website)}
              className={clsx(classes.hrefLink, classes.pl5)}
            >
              <MdGlobe color="#5A6EB7" fontSize="18px" />
            </a>
          )}
        </p>
        <div className={clsx(classes.second)}>
          {props.isAdmin && (
            <>
              <IconButton
                onClick={() => props.openUrl(`/regions/${id}/edit`)}
                className={clsx(classes.p0, classes.pr10)}
              >
                <IosCreate color="#5A6EB7" fontSize="18px" />
              </IconButton>
              <IconButton
                onClick={() => props.handleOpenAlert(id)}
                className={classes.p0}
              >
                <MdTrash color="#5A6EB7" fontSize="18px" />
              </IconButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
});
export default RegionItem;
