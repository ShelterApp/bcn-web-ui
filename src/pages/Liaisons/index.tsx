import React, { useState } from "react";
import {
  GET_LIAISONS_REQUEST,
  LOADMORE_LIAISONS_REQUEST
} from "redux/reducers/service/actionTypes";
import { push } from "connected-react-router";
import { reducerType } from "redux/reducers";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Liaison } from "@bcn/core";
import HeaderBarSub from "components/HeaderBarSub";
import Loading from "components/Loading";
import LiaisonsContainer from "containers/LiaisonsContainer";
import GridFullHeight from "components/GridFullHeight";
import GridFormContainer from "components/GridFormContainer";
import Container from "@material-ui/core/Container";
import styles from "./styles";
import listLocations from "components/FormLiaison/locations";
import Input from "components/Input";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

interface LiaisonsProps {
  dispatch: Dispatch;
  liaisons: Liaison[];
  groupLiaisons: any;
  loading: boolean;
  loadingMore: boolean;
  canLoadmore: boolean;
}

const mapStateToProps = (state: reducerType) => {
  return {
    loading: state.service.loading,
    liaisons: state.service.liaisons,
    groupLiaisons: state.service.groupLiaisons,
    loadingMore: state.service.loadingMore,
    canLoadmore: state.service.canLoadmore
  };
};

const Liaisons = React.memo((props: LiaisonsProps) => {
  const { dispatch, loading, loadingMore, canLoadmore, groupLiaisons } = props;
  const classes = styles();
  const translate = useTranslation().t;

  React.useEffect(() => {
    dispatch({
      type: GET_LIAISONS_REQUEST,
      params: {}
    });
    // eslint-disable-next-line
  }, []);

  const loadmoreFunction = () => {
    dispatch({
      type: LOADMORE_LIAISONS_REQUEST,
      params: {}
    });
  };

  const openUrl = url => {
    dispatch(push(url));
  };

  const [location, setLocation] = useState<null | string>();

  const filterCounty = e => {
    setLocation(e);

    if (e === "All Counties") {
      dispatch({
        type: GET_LIAISONS_REQUEST,
        params: {}
      });
      return;
    }

    dispatch({
      type: GET_LIAISONS_REQUEST,
      params: {
        search: "county",
        q: e
      }
    });
  };

  const locations = [
    { value: "All Counties", label: "All Counties" },
    ...listLocations
  ];

  return (
    <GridFullHeight container>
      <GridFormContainer item xs={12} sm={12} md={12}>
        <GridFullHeight container>
          <HeaderBarSub openUrl={openUrl} isSearch name="Homeless Liaisons" />
          <Container className={clsx(classes.title, classes.dFlex)}>
            <span className={clsx(classes.pr10, classes.center)}>
              {translate("SELECT_COUNTY")}:
            </span>
            <div className={clsx(classes.flex1, classes.dFlex)}>
              <Input
                name="country"
                type="select"
                fullWidth
                changeHandler={e => filterCounty(e)}
                value={location}
                options={locations}
              />
            </div>
          </Container>
          {loading ? (
            <Loading />
          ) : (
            Object.keys(groupLiaisons).map((key, index) => (
              <React.Fragment key={index}>
                <Container className={classes.title}>
                  {translate("COUNTY")}: {key}
                </Container>
                <LiaisonsContainer
                  openUrl={openUrl}
                  liaisons={groupLiaisons[key]}
                  loadmoreFunction={loadmoreFunction}
                  loadingMore={loadingMore}
                  canLoadmore={canLoadmore}
                />
              </React.Fragment>
            ))
          )}
        </GridFullHeight>
      </GridFormContainer>
    </GridFullHeight>
  );
});

export default connect(mapStateToProps)(Liaisons);
