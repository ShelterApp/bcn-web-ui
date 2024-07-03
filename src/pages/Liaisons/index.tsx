import React, { useState } from "react";
import { LOADMORE_LIAISONS_REQUEST } from "redux/reducers/service/actionTypes";
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
import axios from "axios";

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
  const { dispatch, loadingMore, canLoadmore } = props;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [allData, setAllData] = useState([]);
  const [originalData, setOriginalData] = useState(null);
  const classes = styles();
  const translate = useTranslation().t;

  const handleResult = async () => {
    setLoading(true);
    let res = await axios("https://api.fywinnv.app/common/homeless-liaison", {
      method: "get",
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    });
    if (res && res.data) {
      let groupCounty = res.data;
      setAllData(groupCounty);
      groupCounty = groupCounty.reduce((r, a) => {
        r[a.county] = r[a.county] || [];
        r[a.county].push(a);
        return r;
      }, Object.create(null));
      setOriginalData(groupCounty);
      setData(groupCounty);
    }
    setLoading(false);
  };

  const handleSearch = keyword => {
    setLoading(true);
    let newData = allData.filter(
      (item: any) =>
        item.company.toLowerCase().includes(keyword.toLowerCase()) ||
        item.firstName.toLowerCase().includes(keyword.toLowerCase()) ||
        item.lastName.toLowerCase().includes(keyword.toLowerCase())
    );
    newData = newData.reduce((r, a) => {
      r[a.county] = r[a.county] || [];
      r[a.county].push(a);
      return r;
    }, Object.create(null));

    setData(newData);
    setLoading(false);
  };

  const handleCloseSearch = () => {
    setData(originalData);
  };

  React.useEffect(() => {
    handleResult();
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
      setData(originalData);
      return;
    }

    setData({ [e]: originalData[e] });
  };

  const locations = [
    { value: "All Counties", label: "All Counties" },
    ...listLocations
  ];

  return (
    <GridFullHeight container>
      <GridFormContainer item xs={12} sm={12} md={12}>
        <GridFullHeight container>
          <HeaderBarSub
            handleSearch={handleSearch}
            handleCloseSearch={handleCloseSearch}
            openUrl={openUrl}
            isSearch
            name={translate("HOMELESS_LIAISONS")}
          />
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
            <>
              {data && Object.keys(data).length > 0 ? (
                Object.keys(data).map((key, index) => (
                  <React.Fragment key={index}>
                    {key && (
                      <Container className={classes.title}>
                        {translate("COUNTY")}: {key}
                      </Container>
                    )}
                    <LiaisonsContainer
                      openUrl={openUrl}
                      liaisons={data[key]}
                      loadmoreFunction={loadmoreFunction}
                      loadingMore={loadingMore}
                      canLoadmore={canLoadmore}
                    />
                  </React.Fragment>
                ))
              ) : (
                <i
                  style={{
                    textAlign: "center",
                    width: "100%",
                    paddingTop: 10
                  }}
                >
                  No Homeless Liaisons
                </i>
              )}
            </>
          )}
        </GridFullHeight>
      </GridFormContainer>
    </GridFullHeight>
  );
});

export default connect(mapStateToProps)(Liaisons);
