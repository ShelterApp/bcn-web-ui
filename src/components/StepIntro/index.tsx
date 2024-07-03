import React from "react";
import clsx from "clsx";
import styles from "./styles";
import Button from "components/Button";

import firstscreen from "asset/img/1firstscreen.png";
import secondscreen from "asset/img/2secondscreen.png";
import bottomIcons from "asset/img/3BottomIcons.png";
import optionsImg from "asset/img/4Options.png";
import crisisLines from "asset/img/5CrisisLines.png";
import contactImg from "asset/img/6Contact.png";
import mapviewimg from "asset/img/7Mapview.png";
import chatbotImg from "asset/img/8Chatbot.png";
import chatbotIcon from "asset/img/chatbox.png";

import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import StarIcon from "@material-ui/icons/Star";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import RoomIcon from "@material-ui/icons/Room";
import CheckIcon from "@material-ui/icons/Check";
import Cookie from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
interface StepIntroProps {
  stepNumber: number;
  goToSlide: Function;
  openUrl: Function;
}

const StepIntro = React.memo((props: StepIntroProps) => {
  const classes = styles();
  const { stepNumber, goToSlide, openUrl } = props;
  const translate = useTranslation().t;
  const [language, setLanguage] = React.useState(
    JSON.parse(localStorage.getItem("@bcn_language"))
      ? JSON.parse(localStorage.getItem("@bcn_language"))
      : "en"
  );

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    localStorage.setItem(
      "@bcn_language",
      JSON.stringify(event.target.value as string)
    );
    setLanguage(event.target.value as string);
    window.location.reload();
  };
  return (
    <React.Fragment>
      {stepNumber === 0 && (
        <div className={classes.stepContainer}>
          <p onClick={() => goToSlide(8)} className={classes.textSkip}>
            {translate("SKIP")}
          </p>
          <img
            alt={`img-${stepNumber}`}
            src={firstscreen}
            width={320}
            height={320}
          />
          <p className={classes.title}>{translate("WELCOME_FYWINNV")}</p>
          <p className={classes.desc}>
            {translate("SLIDE_1")}{" "}
            <span className={classes.kudoIcon}>
              <ThumbUpAltIcon fontSize="small" />
            </span>
          </p>
          <div className={classes.selectLanguage}>
            <Select
              value={language}
              onChange={handleChange}
              disableUnderline
              className={classes.ml7}
            >
              <MenuItem value={"en"}>English</MenuItem>
              <MenuItem value={"es"}>Spanish</MenuItem>
            </Select>
          </div>
        </div>
      )}
      {stepNumber === 1 && (
        <div className={classes.stepContainer}>
          <p onClick={() => goToSlide(8)} className={classes.textSkip}>
            {translate("SKIP")}
          </p>
          <img
            alt={`img-${stepNumber}`}
            src={secondscreen}
            width={320}
            height={320}
          />
          <p className={classes.desc}>
            {translate("SLIDE_2_1")}
            <span className={classes.kudoIcon}>
              <StarIcon fontSize="small" />
            </span>
            {translate("SLIDE_2_2")}
          </p>
        </div>
      )}
      {stepNumber === 2 && (
        <div className={classes.stepContainer}>
          <p onClick={() => goToSlide(8)} className={classes.textSkip}>
            {translate("SKIP")}
          </p>
          <img
            alt={`img-${stepNumber}`}
            src={bottomIcons}
            width={320}
            height={320}
          />
          <p className={classes.desc}>{translate("SLIDE_3")}</p>
        </div>
      )}
      {stepNumber === 3 && (
        <div className={classes.stepContainer}>
          <p onClick={() => goToSlide(8)} className={classes.textSkip}>
            {translate("SKIP")}
          </p>
          <img
            alt={`img-${stepNumber}`}
            src={optionsImg}
            width={320}
            height={320}
          />
          <p className={classes.desc}>
            {translate("CLICK_ON")}
            <span className={classes.kudoIcon}>
              <MenuIcon fontSize="small" />
            </span>
            {translate("SLIDE_4")}
          </p>
        </div>
      )}
      {stepNumber === 4 && (
        <div className={classes.stepContainer}>
          <p onClick={() => goToSlide(8)} className={classes.textSkip}>
            {translate("SKIP")}
          </p>
          <img
            alt={`img-${stepNumber}`}
            src={crisisLines}
            width={320}
            height={320}
          />
          <p className={classes.desc}>
            {translate("SLIDE_5")}
            <span className={classes.kudoIcon}>
              <SearchIcon fontSize="small" />
            </span>
          </p>
        </div>
      )}
      {stepNumber === 5 && (
        <div className={classes.stepContainer}>
          <p onClick={() => goToSlide(8)} className={classes.textSkip}>
            {translate("SKIP")}
          </p>
          <img
            alt={`img-${stepNumber}`}
            src={contactImg}
            width={320}
            height={320}
          />
          <p className={classes.desc}>
            {translate("CLICKING")}
            <FontAwesomeIcon icon={faFlag} className={clsx(classes.kudoIcon)} />
            {translate("SLIDE_6")}
          </p>
        </div>
      )}
      {stepNumber === 6 && (
        <div className={classes.stepContainer}>
          <p onClick={() => goToSlide(8)} className={classes.textSkip}>
            {translate("SKIP")}
          </p>
          <img
            alt={`img-${stepNumber}`}
            src={mapviewimg}
            width={320}
            height={320}
          />
          <p className={classes.desc}>
            {translate("SLIDE_7_1")}
            <span className={classes.kudoIcon}>
              <RoomIcon fontSize="small" />
            </span>
            {translate("SLIDE_7_2")}
          </p>
        </div>
      )}
      {stepNumber === 7 && (
        <div className={classes.stepContainer}>
          <p onClick={() => goToSlide(8)} className={classes.textSkip}>
            {translate("SKIP")}
          </p>
          <img
            alt={`img-${stepNumber}`}
            src={chatbotImg}
            width={320}
            height={320}
          />
          <p className={classes.desc}>
            {translate("CLICK_ON")}
            {
              <img
                src={chatbotIcon}
                className={classes.iconChatbot}
                alt="chatbox"
              />
            }
            {translate("SLIDE_8")}
          </p>
        </div>
      )}
      {stepNumber === 8 && (
        <div className={classes.stepContainer}>
          <div className={classes.checked}>
            <CheckIcon fontSize="large" />
          </div>
          <h1 className={classes.title}>{translate("ACCEPT_TERMS")}</h1>
          <p className={clsx(classes.desc, classes.borderCenter)}>
            {translate("SLIDE_9")}
            <span
              onClick={() => openUrl("/terms_of_use")}
              className={classes.textLink}
            >
              {translate("TERMS_OF_USE")}
            </span>
            {" & "}
            <span
              onClick={() => openUrl("/privacy_policy")}
              className={classes.textLink}
            >
              {translate("PRIVACY_POLICY")}
            </span>
          </p>
          <div className={classes.groupBtn}>
            <Button onClick={() => goToSlide(0)} className={classes.mr7}>
              {translate("CANCEL")}
            </Button>
            <Button
              onClick={() => {
                Cookie.set("@bcn_alreadyaccess", JSON.stringify(true));
                openUrl("/");
              }}
              className={classes.ml7}
            >
              {translate("I_AGREE")}
            </Button>
          </div>
        </div>
      )}
    </React.Fragment>
  );
});

export default StepIntro;
