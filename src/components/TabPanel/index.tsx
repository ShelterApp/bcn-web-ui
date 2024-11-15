import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import LocalDiningIcon from "@material-ui/icons/LocalDining";
import HomeIcon from "@material-ui/icons/Home";
import FavoriteIcon from "@material-ui/icons/Favorite";
import Button from "@material-ui/core/Button";
import clsx from "clsx";
import MdShirt from "react-ionicons/lib/MdShirt";
import { push } from "connected-react-router";
import { Dispatch } from "redux";
import styles from "./styles";
import { faUserGraduate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const types: string[] = ["FOOD", "SHELTER", "HEALTH", "RESOURCES", "EDUCATION"];
const params: any = [
  {
    type: "FOOD",
    filters: ["Meals", "All", "Food Pantries"]
  },
  {
    type: "SHELTER",
    filters: ["Emergency", "All", "Transitional"]
  },
  {
    type: "HEALTH",
    filters: ["Medical", "All", "Counseling"]
  },
  {
    type: "RESOURCES",
    filters: ["Clothes", "Hygiene", "All", "Tech", "Assistance"]
  },
  {
    type: "EDUCATION",
    filters: ["Education", "All", "Employment"]
  }
];

interface TabPanelProps {
  router: {
    pathname: string;
    search: string;
    hash: string;
  };
  dispatch: Dispatch;
  getFilter: Function;
  loading: boolean;
  setIsOpenSearch: Function;
  isOpenSearch: boolean;
}

const ScrollableTabs = React.memo((props: TabPanelProps) => {
  const classes = styles();
  const history = useHistory();
  const { dispatch, getFilter, setIsOpenSearch } = props;
  const translate = useTranslation().t;
  const [value, setValue] = React.useState(
    sessionStorage.getItem("@bcn_tab_filter")
      ? types.indexOf(JSON.parse(sessionStorage.getItem("@bcn_tab_filter")))
      : 1
  );
  const [filters, setFilters] = React.useState<string[]>(params[value].filters);
  const [valueFilter, setValueFilter] = React.useState(
    sessionStorage.getItem("@bcn_tab_filter_sub")
      ? JSON.parse(sessionStorage.getItem("@bcn_tab_filter_sub"))
      : "All"
  );

  React.useEffect(() => {
    if (Boolean(JSON.parse(sessionStorage.getItem("@bcnGoBack")))) {
      if (history.location.pathname === "/") {
        getFilter({ type: types[value], q: valueFilter });
      }
      sessionStorage.setItem("@bcnGoBack", JSON.stringify(false));
    } else {
      window.scrollTo(0, 0);
      if (types.includes(props.router.hash.replace("#", ""))) {
        const i = types.indexOf(props.router.hash.replace("#", ""));
        setValue(i);
        setFilters(params[i].filters);
        getFilter({ type: types[i], q: valueFilter });
        return;
      }
      getFilter({ type: types[value], q: valueFilter });
    }
    // eslint-disable-next-line
  }, [history]);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    // setIsOpenSearch(false);

    sessionStorage.setItem("@bcn_tab_filter", JSON.stringify(types[newValue]));
    sessionStorage.setItem("@bcn_tab_filter_sub", JSON.stringify("All"));
    window.scrollTo(0, 0);
    setValue(newValue);
    setFilters(params[newValue].filters);
    setValueFilter("All");
    if (props.isOpenSearch) {
      setIsOpenSearch(types[newValue]);
    } else {
      getFilter({ type: types[newValue], q: "All" });
    }
    dispatch(push(`/#${types[newValue]}`));
  };

  const handleChangeFilter = (filter: string) => {
    window.scrollTo(0, 0);
    setValueFilter(filter);
    sessionStorage.setItem("@bcn_tab_filter_sub", JSON.stringify(filter));
    if (!props.isOpenSearch) getFilter({ type: types[value], q: filter });
  };

  return (
    <React.Fragment>
      <AppBar className={classes.bar1} position="static">
        {filters.map((filter: string, key) => {
          return (
            <Button
              onClick={() => handleChangeFilter(filter)}
              key={key}
              variant="outlined"
              size="small"
              className={clsx(
                {
                  [classes.activeBtn]: valueFilter === filter,
                  [classes.allbtn]: filter === "All",
                  [classes.cBtn]: filter !== "All"
                },
                classes.cusBtn
              )}
            >
              {filter === "Education"
                ? "Learning"
                : filter === "Tech"
                ? "Transit"
                : translate(filter.toUpperCase().replace(/ /g, "_"))}
            </Button>
          );
        })}
      </AppBar>
      <div className={classes.root}>
        <AppBar className={classes.pBottom} position="static">
          <Tabs
            className={classes.stTabs}
            indicatorColor="primary"
            value={value}
            onChange={handleChange}
            variant="fullWidth"
            scrollButtons="off"
          >
            <Tab
              className={classes.prTab}
              label={translate("FOOD")}
              icon={<LocalDiningIcon className={classes.iService} />}
            />
            <Tab
              className={classes.prTab}
              label={translate("SHELTER")}
              icon={<HomeIcon className={classes.iService} />}
            />
            <Tab
              className={classes.prTab}
              label={translate("HEALTH")}
              icon={<FavoriteIcon className={classes.iService} />}
            />
            <Tab
              className={classes.prTab}
              label={translate("RESOURCES")}
              icon={
                <MdShirt
                  color="white"
                  fontSize="32px"
                  className={classes.iService}
                />
              }
            />
            <Tab
              className={clsx(classes.prTab, classes.iconEducation)}
              label={translate("EDUCATION")}
              icon={<FontAwesomeIcon icon={faUserGraduate} />}
            />
          </Tabs>
        </AppBar>
      </div>
    </React.Fragment>
  );
});

export default ScrollableTabs;
