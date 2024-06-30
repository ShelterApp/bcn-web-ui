import React from "react";
import useStyles from "./styles";
import clsx from "clsx";
import { CrisisLine } from "@fywinnv/core";
import CallIcon from "@material-ui/icons/Call";
import MdChatboxes from "react-ionicons/lib/MdChatboxes";
import IosChatboxes from "react-ionicons/lib/IosChatboxes";
import MdGlobe from "react-ionicons/lib/MdGlobe";
import { parseURL } from "common/";
import IconButton from "@material-ui/core/IconButton";
import IosCreate from "react-ionicons/lib/IosCreate";
import MdTrash from "react-ionicons/lib/MdTrash";
import { useTranslation } from "react-i18next";

export interface CrisisLineProps {
    crisis_line: CrisisLine;
    isAdmin: boolean;
    openUrl: Function;
    handleOpenAlert: Function;
}

const CrisisLineItem = React.memo((props: CrisisLineProps) => {
    const translate = useTranslation().t;
    const classes = useStyles();
    const {
        name,
        description,
        text,
        website,
        phone,
        area,
        chatWebLink,
        time,
        id,
    } = props.crisis_line;

    return (
        <div className={classes.card}>
            <div
                className={clsx(
                    classes.title,
                    classes.dFlex,
                    classes.justifyBetween
                )}
            >
                <p className={classes.m0}>{name}</p>
                <div>
                    {!!chatWebLink && (
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={parseURL(chatWebLink)}
                            className={clsx(classes.hrefLink, classes.pr10)}
                        >
                            <MdChatboxes color="#5A6EB7" fontSize="18px" />
                        </a>
                    )}
                    {!!website && (
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={parseURL(website)}
                            className={classes.hrefLink}
                        >
                            <MdGlobe color="#5A6EB7" fontSize="18px" />
                        </a>
                    )}
                </div>
            </div>
            {(phone || !!text) && (
                <p className={clsx(classes.desc)}>
                    <span>
                        {phone && (
                            <a
                                href={`tel:${phone}`}
                                className={clsx(
                                    classes.hrefLink,
                                    classes.itemPhone
                                )}
                            >
                                <CallIcon fontSize="small" />
                                {phone}
                            </a>
                        )}
                    </span>
                    <span className={classes.itemPhone}>
                        {text && (
                            <>
                                <IosChatboxes color="#5A6EB7" fontSize="18px" />
                                {text}
                            </>
                        )}
                    </span>
                </p>
            )}
            <p className={classes.blockDesc}>{description}</p>
            <div className={clsx(classes.lastDesc)}>
                <div className={clsx(classes.first)}>
                    {area && (
                        <span>
                            <span className={classes.font600}>
                                {translate("AREA")}:
                            </span>{" "}
                            {area}
                        </span>
                    )}
                    {area && time && ", "}
                    {time && (
                        <span>
                            <span className={classes.font600}>
                                {translate("HOURS")}:
                            </span>{" "}
                            {time}
                        </span>
                    )}
                </div>
                <div className={clsx(classes.second)}>
                    {props.isAdmin && (
                        <>
                            <IconButton
                                onClick={() =>
                                    props.openUrl(`/crisis_lines/${id}/edit`)
                                }
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
export default CrisisLineItem;
