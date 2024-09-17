import React, { useState } from "react";
import clsx from "clsx";
import styles from "./styles";

import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

import {
  Call as CallIcon,
  StarRate as StarRateIcon,
  Info as InfoIcon,
  Help as HelpIcon,
  Security as SecurityIcon,
  ExitToApp as ExitToAppIcon,
  Fingerprint as FingerprintIcon,
  AddCircle as AddCircleIcon,
  Language as LanguageIcon
} from "@material-ui/icons";

import IosMapOutline from "react-ionicons/lib/IosMapOutline";
import MdThumbsUp from "react-ionicons/lib/MdThumbsUp";
import IosTime from "react-ionicons/lib/IosTime";
import IosKeypad from "react-ionicons/lib/IosKeypad";
import IosCreate from "react-ionicons/lib/IosCreate";
import MdClipboard from "react-ionicons/lib/MdClipboard";
import MdContact from "react-ionicons/lib/MdContact";
import MdPersonAdd from "react-ionicons/lib/MdPersonAdd";
import MdCheckmarkCircle from "react-ionicons/lib/MdCheckmarkCircle";
import MdUnlock from "react-ionicons/lib/MdUnlock";
import IosHappy from "react-ionicons/lib/IosHappy";

import { useSelector, useDispatch } from "react-redux";
import { reducerType } from "redux/reducers";
import { GET_SERVICES_REDUCER } from "redux/reducers/service/actionTypes";
import { LOGOUT_REQUEST } from "redux/reducers/auth/actionTypes";
import AntSwitch from "components/SwitchButton";
import { faUserTie, faHandshake } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserRole } from "common";
import { useTranslation } from "react-i18next";

interface SideBarProps {
  menuIsOpen: boolean;
  clickOpenMenu: Function;
  openUrl: Function;
  isMapView: boolean;
  setIsMapView: Function;
  setOpenServices: Function;
  isOpenService: boolean;
  setCategory: Function;
  category: string;
  badges: any;
}

const SideBar = React.memo((props: SideBarProps) => {
  const translate = useTranslation().t;
  const current_user = useSelector(
    (state: reducerType) => state.auth.current_user
  );
  const role =
    current_user && current_user.isLogin
      ? current_user.isAdmin
        ? "admin"
        : "user"
      : "guest";

  const dispatch = useDispatch();
  const classes = styles();
  const {
    clickOpenMenu,
    menuIsOpen,
    isMapView,
    setIsMapView,
    setOpenServices,
    isOpenService,
    category,
    setCategory,
    badges
  } = props;

  const [topKudos, setTopKudos] = useState(
    Boolean(JSON.parse(sessionStorage.getItem("@bcn_isTopKudos")))
  );

  const setSortTopKudos = open => {
    sessionStorage.setItem("@bcn_isTopKudos", JSON.stringify(open));
    window.scrollTo(0, 0);
    let params = {
      skip: 0,
      sort: open ? "likes" : ""
    };
    dispatch({
      type: GET_SERVICES_REDUCER,
      params: params
    });
    setTopKudos(open);
  };

  const openUrl = url => {
    props.openUrl(url);
  };

  const toggleDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" ||
        (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    clickOpenMenu(open);
  };

  const logout = () => {
    dispatch({
      type: LOGOUT_REQUEST
    });
  };

  const [language, setLanguage] = useState(
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

  const list = () => (
    <div
      className={clsx(classes.list)}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <div className={classes.toolbar}>
        {role !== "guest" ? (
          <p>{current_user.email}</p>
        ) : (
          <p>{translate("OPTIONS")}</p>
        )}
      </div>
      <Divider />
      <ListItem className={classes.optMenu} button>
        <ListItemIcon>
          <IosTime color="#191970" fontSize="18px" />
        </ListItemIcon>
        <ListItemText primary={translate("OPEN_SERVICES")} />
        <Typography component="div">
          <Grid component="label" container alignItems="center" spacing={1}>
            <Grid item>
              <AntSwitch
                checked={isOpenService}
                onChange={() => {
                  setOpenServices(!isOpenService);
                }}
                name="checkedC"
              />
            </Grid>
          </Grid>
        </Typography>
      </ListItem>
      <Divider />
      <ListItem className={classes.listSelections}>
        {["MEN", "WOMEN", "YOUTH_AND_KIDS", "ALL"].map((text, index) => {
          return (
            <span
              className={clsx(
                {
                  [classes.borderRadiusLeft]: index === 0,
                  [classes.borderRadiusRight]: index === 3,
                  [classes.selectActive]: category === text
                },
                classes.selection
              )}
              onClick={() => setCategory(text)}
              key={text}
            >
              {translate(text)}
            </span>
          );
        })}
      </ListItem>
      <ListItem className={classes.listSelections}>
        {["SENIORS", "DISABLED", "FAMILIES", "VETERANS"].map((text, index) => {
          return (
            <span
              className={clsx(
                {
                  [classes.borderRadiusLeft]: index === 0,
                  [classes.borderRadiusRight]: index === 3,
                  [classes.selectActive]: category === text
                },
                classes.selection
              )}
              onClick={() => setCategory(text)}
              key={text}
            >
              {translate(text)}
            </span>
          );
        })}
      </ListItem>
      <Divider />
      <ListItem className={classes.optMenu} button>
        <ListItemIcon>
          <IosMapOutline color="#191970" fontSize="18px" />
        </ListItemIcon>
        <ListItemText primary={translate("MAP_VIEW")} />
        <Typography component="div">
          <Grid component="label" container alignItems="center" spacing={1}>
            <Grid item>
              <AntSwitch
                checked={isMapView}
                onChange={() => {
                  setIsMapView(!isMapView);
                }}
                name="checkedC"
              />
            </Grid>
          </Grid>
        </Typography>
      </ListItem>
      <Divider />
      {role === "admin" && (
        <>
          <ListItem className={classes.optMenu} button>
            <ListItemIcon>
              <MdThumbsUp color="#191970" fontSize="18px" />
            </ListItemIcon>
            <ListItemText primary={translate("TOP_KUDOS")} />
            <Typography component="div">
              <Grid component="label" container alignItems="center" spacing={1}>
                <Grid item>
                  <AntSwitch
                    checked={topKudos}
                    onChange={() => {
                      setSortTopKudos(!topKudos);
                    }}
                    name="checkedC"
                  />
                </Grid>
              </Grid>
            </Typography>
          </ListItem>
          <Divider />
        </>
      )}
      <ListItem
        onClick={() => openUrl("/crisis_lines")}
        className={classes.optMenu}
        button
      >
        <ListItemIcon>
          <CallIcon className={classes.iconM} />
        </ListItemIcon>
        <ListItemText primary={translate("CRISIS_LINES")} />
      </ListItem>
      <Divider />
      <ListItem className={classes.optMenu} button>
        <ListItemIcon>
          <LanguageIcon className={classes.iconM} />
        </ListItemIcon>
        <ListItemText primary={"Language"} />
        <Typography component="div">
          <Grid component="label" container alignItems="center" spacing={1}>
            <Grid item>
              <Select value={language} onChange={handleChange} disableUnderline>
                <MenuItem value={"en"}>English</MenuItem>
                <MenuItem value={"es"}>Spanish</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </Typography>
      </ListItem>
      <Divider />
      <ListItem
        onClick={() => openUrl("/liaisons")}
        className={classes.optMenu}
        button
      >
        <ListItemIcon>
          <FontAwesomeIcon
            icon={faHandshake}
            className={clsx(classes.userTieIcon)}
          />
        </ListItemIcon>
        <ListItemText primary={translate("HOMELESS_LIAISONS")} />
      </ListItem>
      <Divider />
      <ListItem
        onClick={() => openUrl("/coordinators")}
        className={classes.optMenu}
        button
      >
        <ListItemIcon>
          <FontAwesomeIcon
            icon={faUserTie}
            className={clsx(classes.userTieIcon)}
          />
        </ListItemIcon>
        <ListItemText primary={translate("REGIONAL_COORDINATORS")} />
      </ListItem>
      {/* <Divider /> */}
      <Divider />
      <ListItem
        onClick={() => openUrl("/my_favorites")}
        className={classes.optMenu}
        button
      >
        <ListItemIcon>
          <StarRateIcon className={classes.iconM} />
        </ListItemIcon>
        <ListItemText primary={translate("MY_FAVORITES")} />
      </ListItem>
      {role !== "guest" && (
        <>
          <Divider />
          <ListItem
            onClick={() => openUrl("/add_service")}
            className={classes.optMenu}
            button
          >
            <ListItemIcon>
              <AddCircleIcon className={classes.iconM} />
            </ListItemIcon>
            <ListItemText primary={translate("ADD_SERVICE")} />
          </ListItem>
          {role === "admin" && (
            <>
              <Divider />
              <ListItem
                onClick={() => openUrl("/crisis_lines/new")}
                className={classes.optMenu}
                button
              >
                <ListItemIcon>
                  <AddCircleIcon className={classes.iconM} />
                </ListItemIcon>
                <ListItemText primary={translate("ADD_CRISIS_LINE")} />
              </ListItem>
              <Divider />
              <ListItem
                onClick={() => openUrl("/liaisons/new")}
                className={classes.optMenu}
                button
              >
                <ListItemIcon>
                  <AddCircleIcon className={classes.iconM} />
                </ListItemIcon>
                <ListItemText primary={translate("ADD_LIAISON")} />
              </ListItem>
              <Divider />
              <ListItem
                onClick={() => openUrl("/regions/new")}
                className={classes.optMenu}
                button
              >
                <ListItemIcon>
                  <AddCircleIcon className={classes.iconM} />
                </ListItemIcon>
                <ListItemText primary={translate("ADD_REGIONS")} />
              </ListItem>
              <Divider />
              <ListItem
                onClick={() => openUrl("/coordinators/new")}
                className={classes.optMenu}
                button
              >
                <ListItemIcon>
                  <AddCircleIcon className={classes.iconM} />
                </ListItemIcon>
                <ListItemText primary={translate("ADD_COORDINATOR")} />
              </ListItem>
            </>
          )}
          <Divider />

          {role !== "admin" && current_user.roles.includes(UserRole.SuperUser) && (
            <>
              <ListItem
                onClick={() => openUrl("/liaisons/new")}
                className={classes.optMenu}
                button
              >
                <ListItemIcon>
                  <AddCircleIcon className={classes.iconM} />
                </ListItemIcon>
                <ListItemText primary={translate("ADD_LIAISON")} />
              </ListItem>
              <Divider />
            </>
          )}

          <ListItem
            onClick={() => openUrl("/manage_services")}
            className={classes.optMenu}
            button
          >
            <ListItemIcon>
              <IosKeypad color="#191970" fontSize="18px" />
            </ListItemIcon>
            <Badge
              max={9999}
              classes={{
                badge: classes.badge
              }}
              badgeContent={badges ? Number(badges.countManagedServices) : 0}
              color="error"
            >
              <ListItemText primary={translate("MANAGE_SERVICES")} />
            </Badge>
          </ListItem>
          <Divider />
          <ListItem
            onClick={() => openUrl("/feedbacks")}
            className={classes.optMenu}
            button
          >
            <ListItemIcon>
              <IosHappy color="#191970" fontSize="18px" />
            </ListItemIcon>
            <Badge
              max={9999}
              classes={{
                badge: classes.badge
              }}
              badgeContent={badges ? Number(badges.countUnReadFeedbacks) : 0}
              color="error"
            >
              <ListItemText primary={translate("MANAGE_FEEDBACK")} />
            </Badge>
          </ListItem>
          <Divider />
          {!!(
            current_user.isAdmin ||
            current_user.roles.includes(UserRole.SuperUser)
          ) && (
            <ListItem
              onClick={() => openUrl("/available_beds")}
              className={classes.optMenu}
              button
            >
              <ListItemIcon>
                <MdCheckmarkCircle color="#191970" fontSize="18px" />
              </ListItemIcon>
              <Badge
                max={9999}
                classes={{
                  badge: classes.badge
                }}
                badgeContent={badges ? Number(badges.countManagedShelters) : 0}
                color="error"
              >
                <ListItemText primary={translate("UPDATE_SHELTER")} />
              </Badge>
            </ListItem>
          )}
          {current_user.isAdmin ? (
            <>
              <Divider />
              <ListItem
                onClick={() => openUrl("/manage_approvals")}
                className={classes.optMenu}
                button
              >
                <ListItemIcon>
                  <MdUnlock color="#191970" fontSize="18px" />
                </ListItemIcon>
                <Badge
                  max={9999}
                  classes={{
                    badge: classes.badge
                  }}
                  badgeContent={
                    badges ? Number(badges.countNotApprovedServices) : 0
                  }
                  color="error"
                >
                  <ListItemText primary={translate("MANAGE_APPROVALS")} />
                </Badge>
              </ListItem>
              <Divider />
              {
                // <ListItem
                //   onClick={() => openUrl("/manage_access")}
                //   className={classes.optMenu}
                //   button
                // >
                //   <ListItemIcon>
                //     <MdUnlock color="#191970" fontSize="18px" />
                //   </ListItemIcon>
                //   <Badge
                //     max={9999}
                //     classes={{
                //       badge: classes.badge
                //     }}
                //     badgeContent={badges ? Number(badges.countAdminUsers) : 0}
                //     color="error"
                //   >
                //     <ListItemText primary={"Manage Admin Access"} />
                //   </Badge>
                // </ListItem>
                // <Divider />
                // <ListItem
                //   onClick={() => openUrl("/manage_superusers")}
                //   className={classes.optMenu}
                //   button
                // >
                //   <ListItemIcon>
                //     <MdPersonAdd color="#191970" fontSize="18px" />
                //   </ListItemIcon>
                //   <Badge
                //     max={9999}
                //     classes={{
                //       badge: classes.badge
                //     }}
                //     badgeContent={badges ? Number(badges.countSupperUsers) : 0}
                //     color="error"
                //   >
                //     <ListItemText primary={translate("MANAGE_USERS")} />
                //   </Badge>
                // </ListItem>
              }
              <ListItem
                onClick={() => openUrl("/manage_users")}
                className={classes.optMenu}
                button
              >
                <ListItemIcon>
                  <MdPersonAdd color="#191970" fontSize="18px" />
                </ListItemIcon>
                <Badge
                  max={9999}
                  classes={{
                    badge: classes.badge
                  }}
                  badgeContent={badges ? Number(badges.countTotalUsers) : 0}
                  color="error"
                >
                  <ListItemText primary={translate("MANAGE_USERS")} />
                </Badge>
              </ListItem>
            </>
          ) : (
            <>
              <Divider />
              <ListItem
                onClick={() => openUrl("/update_profile")}
                className={classes.optMenu}
                button
              >
                <ListItemIcon>
                  <MdContact color="#191970" fontSize="18px" />
                </ListItemIcon>
                <ListItemText primary={translate("MANAGE_PROFILE")} />
              </ListItem>
            </>
          )}
          {current_user.lastMethod === "LOCAL" && (
            <>
              <Divider />
              <ListItem
                onClick={() => openUrl("/change_password")}
                className={classes.optMenu}
                button
              >
                <ListItemIcon>
                  <FingerprintIcon className={classes.iconM} />
                </ListItemIcon>
                <ListItemText primary={translate("CHANGE_PASSWORD")} />
              </ListItem>
            </>
          )}
        </>
      )}
      {(role === "guest" || role === "user") && (
        <>
          <Divider />
          <ListItem
            onClick={() => openUrl("/about")}
            className={classes.optMenu}
            button
          >
            <ListItemIcon>
              <InfoIcon className={classes.iconM} />
            </ListItemIcon>
            <ListItemText primary={translate("ABOUT_BCN")} />
          </ListItem>
          <Divider />
          <ListItem
            onClick={() => openUrl("/introduce")}
            className={classes.optMenu}
            button
          >
            <ListItemIcon>
              <HelpIcon className={classes.iconM} />
            </ListItemIcon>
            <ListItemText primary={translate("SHOW_TUTORIAL")} />
          </ListItem>
          <Divider />
          <ListItem
            onClick={() => openUrl("/feedback")}
            className={classes.optMenu}
            button
          >
            <ListItemIcon>
              <IosCreate color="#191970" fontSize="18px" />
            </ListItemIcon>
            <ListItemText primary={translate("GIVE_FEEDBACK")} />
          </ListItem>
          <Divider />
          <ListItem
            onClick={() => openUrl("/terms_of_use")}
            className={classes.optMenu}
            button
          >
            <ListItemIcon>
              <MdClipboard color="#191970" fontSize="18px" />
            </ListItemIcon>
            <ListItemText primary={translate("TERMS_OF_USE")} />
          </ListItem>
          <Divider />
          <ListItem
            onClick={() => openUrl("/privacy_policy")}
            className={classes.optMenu}
            button
          >
            <ListItemIcon>
              <SecurityIcon className={classes.iconM} />
            </ListItemIcon>
            <ListItemText primary={translate("PRIVACY_POLICY")} />
          </ListItem>
        </>
      )}
      {role !== "guest" ? (
        <>
          <Divider />
          <ListItem onClick={logout} className={classes.optMenu} button>
            <ListItemIcon>
              <ExitToAppIcon className={classes.iconM} />
            </ListItemIcon>
            <ListItemText primary={translate("LOGOUT")} />
          </ListItem>
        </>
      ) : (
        <>
          <Divider />
          <ListItem
            onClick={() => openUrl("/login")}
            className={classes.optMenu}
            button
          >
            <ListItemIcon>
              <ExitToAppIcon className={classes.iconM} />
            </ListItemIcon>
            <ListItemText primary={translate("LOGIN_AND_SIGNUP")} />
          </ListItem>
        </>
      )}
    </div>
  );

  return (
    <React.Fragment key={"left"}>
      <Drawer anchor={"left"} open={menuIsOpen} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
    </React.Fragment>
  );
});

export default SideBar;
