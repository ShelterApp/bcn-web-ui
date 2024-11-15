import React, { useState, useEffect } from "react";
import clsx from "clsx";
import styles from "./styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import imgLoading from "asset/img/loading.gif";
import Collapse from "@material-ui/core/Collapse";
import CloseIcon from "@material-ui/icons/Close";
import { useSelector, useDispatch } from "react-redux";
import { reducerType } from "redux/reducers";
import { initQuerySearch, searchByName } from "common/";
import {
  GET_SERVICES_REDUCER,
  SET_MY_FAVORITES,
  GET_CRISISLINES_REQUEST,
  GET_FEEDBACKS_REQUEST,
  GET_SERVICES,
  GET_USERS_REQUEST,
  // GET_LIAISONS_REQUEST,
  GET_REGIONS_REQUEST
  // GET_UNITS_REQUEST
} from "redux/reducers/service/actionTypes";
import { SORT, DIRECTION, LIMIT, SKIP } from "common/utils";
import { useTranslation } from "react-i18next";

const commonQuery = {
  sort: SORT,
  direction: DIRECTION,
  limit: LIMIT,
  skip: SKIP,
  isShowAll: false
};

interface SearchBarProps {
  isOpenSearch: boolean;
  clickOpenSearch: Function;
  handleSearch?: Function;
  handleCloseSearch?: Function;
}

const SearchBar = React.memo((props: SearchBarProps) => {
  const translate = useTranslation().t;
  const classes = styles();
  const {
    clickOpenSearch,
    isOpenSearch,
    handleSearch,
    handleCloseSearch
  } = props;
  const [value, setValue] = useState("");
  const [tempData, setTempData] = useState<any>();
  const dispatch = useDispatch();
  const [placeholder, setPlaceholder] = useState<string>(
    translate("SEARCH_SERVICE")
  );
  useEffect(() => {
    if (typeof isOpenSearch === "string") {
      fetchDataSearchHomePage(isOpenSearch);
    }
  }, [props.isOpenSearch]);
  const loading: any = useSelector(
    (state: reducerType) => state.service.loading
  );

  const services: any = useSelector((state: reducerType) => state.service.data);

  const current_user = useSelector(
    (state: reducerType) => state.auth.current_user
  );

  const currentPath = useSelector(
    (state: reducerType) => state.router.location.pathname
  );

  const myFavorites = useSelector(
    (state: reducerType) => state.service.myFavorites
  );

  const queryData = useSelector(
    (state: reducerType) => state.service.queryData
  );

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
    setValue("");
    if (currentPath === "/") {
      const query = {
        ...initQuerySearch,
        // q: debouncedSearchTerm,
        type: queryData.type,
        pageSize: LIMIT
      };
      dispatch({
        type: GET_SERVICES_REDUCER,
        params: query,
        searchService: true
      });

      // dispatch({
      //   type: GET_SERVICES_REDUCER,
      //   params: obj,
      //   pageSize: LIMIT
      // });
    }
    if (currentPath === "/my_favorites") {
      dispatch({
        type: SET_MY_FAVORITES,
        services: tempData
      });
    }

    if (currentPath === "/manage_approvals") {
      if (typeof handleCloseSearch !== "function") return null;
      handleCloseSearch();
    }

    if (currentPath === "/available_beds") {
      dispatch({
        type: GET_SERVICES,
        services: tempData
      });
    }

    if (currentPath === "/crisis_lines") {
      dispatch({
        type: GET_CRISISLINES_REQUEST,
        params: {}
      });
    }

    if (
      currentPath === "/manage_access" ||
      currentPath === "/manage_superusers" ||
      currentPath === "/manage_users"
    ) {
      dispatch({
        type: GET_USERS_REQUEST,
        params: {}
      });
    }

    if (currentPath === "/liaisons") {
      if (typeof handleCloseSearch !== "function") return null;
      handleCloseSearch();
    }

    if (currentPath === "/regions") {
      dispatch({
        type: GET_REGIONS_REQUEST,
        params: {}
      });
    }

    if (currentPath === "/coordinators") {
      if (typeof handleCloseSearch !== "function") return null;
      handleCloseSearch();
    }

    if (currentPath === "/feedbacks") {
      dispatch({
        type: GET_FEEDBACKS_REQUEST,
        params: {}
      });
    }

    if (currentPath === "/manage_services") {
      const obj = {
        ...commonQuery
      } as any;

      if (!current_user.isAdmin) {
        obj.filter = `${obj.filter},user,isShowAll`;
        obj.user = current_user.id;
        obj.isShowAll = true;
      } else {
        delete obj.filter;
        obj.filter = "isShowAll";
        obj.isShowAll = true;
      }

      dispatch({
        type: GET_SERVICES_REDUCER,
        params: obj,
        searchService: true,
        pageSize: LIMIT
      });
    }

    clickOpenSearch(open);
  };

  const onChange = text => {
    setValue(text);
  };

  const onClear = () => {
    setValue("");
  };

  const useDebounce = (_value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(_value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(_value);
      }, delay);
      return () => {
        clearTimeout(handler);
      };
    }, [_value, delay]);

    return debouncedValue;
  };

  const debouncedSearchTerm = useDebounce(value, 500);

  const fetchDataSearchHomePage = type => {
    const query = {
      ...initQuerySearch,
      q: debouncedSearchTerm
    };
    dispatch({
      type: GET_SERVICES_REDUCER,
      params: query,
      searchService: true
    });
  };

  const fetchDataSearchManageServices = () => {
    const obj = {
      ...commonQuery,
      q: debouncedSearchTerm,
      search: "name"
    } as any;

    if (!current_user.isAdmin) {
      obj.filter = `${obj.filter},user,isShowAll`;
      obj.user = current_user.id;
      obj.isShowAll = true;
    } else {
      delete obj.filter;
      obj.filter = "isShowAll";
      obj.isShowAll = true;
    }

    dispatch({
      type: GET_SERVICES_REDUCER,
      params: obj,
      searchService: true,
      pageSize: LIMIT
    });
  };

  const fetchDataSearchMyFavorites = () => {
    setTempData(myFavorites);
    dispatch({
      type: SET_MY_FAVORITES,
      services: searchByName(debouncedSearchTerm, myFavorites)
    });
  };

  const fetchDataSearchAvailableBeds = () => {
    setTempData(services);
    dispatch({
      type: GET_SERVICES,
      services: searchByName(debouncedSearchTerm, services)
    });
  };

  const fetchDataSearchCrisisLines = () => {
    dispatch({
      type: GET_CRISISLINES_REQUEST,
      params: {
        search: "name",
        q: debouncedSearchTerm
      }
    });
  };

  const fetchDataSearchUsers = () => {
    dispatch({
      type: GET_USERS_REQUEST,
      params: {
        search: "email",
        q: debouncedSearchTerm
      }
    });
  };

  const fetchDataSearchUsersManage = () => {
    var params = {
      search: "name, email, phone, displayName",
      q: debouncedSearchTerm
    };

    if (
      debouncedSearchTerm.toLowerCase().includes("administrator") ||
      debouncedSearchTerm.toLowerCase().includes("super user") ||
      debouncedSearchTerm.toLowerCase().includes("auto user")
    ) {
      params.search = "roles";
    } else if (
      debouncedSearchTerm.toLowerCase().includes("facebook") ||
      debouncedSearchTerm.toLowerCase().includes("local") ||
      debouncedSearchTerm.toLowerCase().includes("google") ||
      debouncedSearchTerm.toLowerCase().includes("twitter")
    ) {
      params.search = "lastMethod";
    }

    dispatch({
      type: GET_USERS_REQUEST,
      params: params
    });
  };

  const fetchDataSearchFeedbacks = () => {
    dispatch({
      type: GET_FEEDBACKS_REQUEST,
      params: {
        search: "subject, message",
        q: debouncedSearchTerm
      }
    });
  };

  const fetchDataSearchManageApprovals = () => {
    if (typeof handleSearch !== "function") return null;
    handleSearch(debouncedSearchTerm);
  };

  const fetchDataSearchLiaisons = () => {
    if (typeof handleSearch !== "function") return null;
    handleSearch(debouncedSearchTerm);
  };

  const fetchDataSearchRegions = () => {
    dispatch({
      type: GET_REGIONS_REQUEST,
      params: {
        search: "name",
        q: debouncedSearchTerm
      }
    });
  };

  const fetchDataSearchUnits = () => {
    if (typeof handleSearch !== "function") return null;
    handleSearch(debouncedSearchTerm);
  };

  useEffect(() => {
    if (debouncedSearchTerm) {
      window.scrollTo(0, 0);
      if (currentPath === "/my_favorites") {
        fetchDataSearchMyFavorites();
        return;
      }
      if (currentPath === "/crisis_lines") {
        fetchDataSearchCrisisLines();
        return;
      }
      if (currentPath === "/feedbacks") {
        fetchDataSearchFeedbacks();
        return;
      }
      if (currentPath === "/manage_services") {
        fetchDataSearchManageServices();
        return;
      }
      if (currentPath === "/available_beds") {
        fetchDataSearchAvailableBeds();
        return;
      }
      if (currentPath === "/manage_approvals") {
        fetchDataSearchManageApprovals();
        return;
      }
      if (currentPath === "/liaisons") {
        fetchDataSearchLiaisons();
        return;
      }
      if (currentPath === "/regions") {
        fetchDataSearchRegions();
        return;
      }

      if (currentPath === "/coordinators") {
        fetchDataSearchUnits();
        return;
      }
      if (
        currentPath === "/manage_access" ||
        currentPath === "/manage_superusers"
      ) {
        fetchDataSearchUsers();
        return;
      }
      if (currentPath === "/manage_users") {
        fetchDataSearchUsersManage();
        return;
      }
      fetchDataSearchHomePage(null);
      return;
    }
    // eslint-disable-next-line
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (isOpenSearch == true) {
      document.getElementById("search-input-e").focus();
    }
  }, [isOpenSearch]);

  useEffect(() => {
    if (currentPath === "/my_favorites") {
      setPlaceholder(translate("SEARCH_FAVORITES"));
    }

    if (currentPath === "/manage_approvals") {
      setPlaceholder(translate("SEARCH_APPROVALS"));
    }

    if (currentPath === "/crisis_lines") {
      setPlaceholder(translate("SEARCH_LINES"));
    }

    if (
      currentPath === "/manage_access" ||
      currentPath === "/manage_superusers" ||
      currentPath === "/manage_users"
    ) {
      setPlaceholder(translate("SEARCH_USERS"));
    }

    if (currentPath === "/liaisons") {
      setPlaceholder(translate("SEARCH_LIAISONS"));
    }

    if (currentPath === "/coordinators") {
      setPlaceholder(translate("SEARCH_COORDINATOR"));
    }

    if (currentPath === "/feedbacks") {
      setPlaceholder(translate("SEARCH_FEEDBACK"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const list = () => (
    <div className={clsx(classes.fullList)}>
      <List className={classes.rootList}>
        <ListItem className={classes.rootListItem}>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              id="search-input-e"
              value={value}
              onChange={e => onChange(e.target.value)}
              placeholder={placeholder}
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput
              }}
              inputProps={{ "aria-label": "search" }}
            />
            <div className={classes.clearIcon}>
              {loading && (
                <img src={imgLoading} alt="..." width={30} height={30} />
              )}
            </div>
            <div onClick={() => onClear()} className={classes.clearIcon}>
              {value && <CloseIcon />}
            </div>
          </div>
          <span onClick={toggleDrawer(false)} className={classes.cancelbtn}>
            {translate("CANCEL")}
          </span>
        </ListItem>
      </List>
    </div>
  );

  return (
    <React.Fragment key={"top"}>
      <Collapse in={isOpenSearch}>
        <AppBar className={classes.toolbar} position="static">
          <Toolbar className={classes.containerHeader}>{list()}</Toolbar>
        </AppBar>
      </Collapse>
    </React.Fragment>
  );
});

export default SearchBar;
