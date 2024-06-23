import React from "react";

import {
  GET_REGIONS_REQUEST,
  LOADMORE_REGIONS_REQUEST
} from "redux/reducers/service/actionTypes";
import { push } from "connected-react-router";
import { reducerType } from "redux/reducers";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Region } from "@fywinnv/core";
import HeaderBarSub from "components/HeaderBarSub";
import Loading from "components/Loading";
import RegionsContainer from "containers/RegionContainer";
import GridFullHeight from "components/GridFullHeight";
import GridFormContainer from "components/GridFormContainer";
import { useTranslation } from "react-i18next";
interface RegionsProps {
  dispatch: Dispatch;
  regions: Region[];
  loading: boolean;
  loadingMore: boolean;
  canLoadmore: boolean;
}

const mapStateToProps = (state: reducerType) => {
  return {
    loading: state.service.loading,
    regions: state.service.regions,
    loadingMore: state.service.loadingMore,
    canLoadmore: state.service.canLoadmore
  };
};

const Regions = React.memo((props: RegionsProps) => {
  const { dispatch, loading, loadingMore, canLoadmore, regions } = props;

  React.useEffect(() => {
    dispatch({
      type: GET_REGIONS_REQUEST,
      params: {}
    });
    // eslint-disable-next-line
  }, []);

  const loadmoreFunction = () => {
    dispatch({
      type: LOADMORE_REGIONS_REQUEST,
      params: {}
    });
  };

  const openUrl = url => {
    dispatch(push(url));
  };
  const translate = useTranslation().t;

  return (
    <GridFullHeight container>
      <GridFormContainer item xs={12} sm={12} md={12}>
        <GridFullHeight container>
          <HeaderBarSub
            openUrl={openUrl}
            isSearch
            name={translate("REGIONS")}
          />
          {loading ? (
            <Loading />
          ) : (
            <RegionsContainer
              openUrl={openUrl}
              regions={regions}
              loadmoreFunction={loadmoreFunction}
              loadingMore={loadingMore}
              canLoadmore={canLoadmore}
            />
          )}
        </GridFullHeight>
      </GridFormContainer>
    </GridFullHeight>
  );
});

export default connect(mapStateToProps)(Regions);
