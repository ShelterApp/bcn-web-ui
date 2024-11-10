import React, { useState } from "react";

import { GET_UNITS_REQUEST } from "redux/reducers/service/actionTypes";
import { push } from "connected-react-router";
import { reducerType } from "redux/reducers";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import HeaderBarSub from "components/HeaderBarSub";
import Loading from "components/Loading";
import GridFullHeight from "components/GridFullHeight";
import GridFormContainer from "components/GridFormContainer";
import Container from "@material-ui/core/Container";
import styles from "./styles";
import Input from "components/Input";
import clsx from "clsx";
import { getRegions } from "api/regions";
import UnitsContainer from "containers/UnitsContainer";
import { parseURL } from "common";
import { useTranslation } from "react-i18next";

interface UnitsProps {
  dispatch: Dispatch;
  groupUnits: any;
  loading: boolean;
}

const mapStateToProps = (state: reducerType) => {
  return {
    loading: state.service.loading,
    groupUnits: state.service.groupUnits
  };
};

const Units = React.memo((props: UnitsProps) => {
  const { dispatch, loading, groupUnits } = props;

  const classes = styles();

  const [regions, setRegions] = useState([]);

  const fetchRegions = async () => {
    const _regions = await getRegions({});
    setRegions(
      _regions.map(r => ({
        label: r.name,
        value: r.id,
        website: r.website,
        counties: r.counties
      }))
    );
  };

  React.useEffect(() => {
    fetchRegions();
    dispatch({
      type: GET_UNITS_REQUEST,
      params: {}
    });
    // eslint-disable-next-line
  }, []);

  const openUrl = url => {
    dispatch(push(url));
  };

  const [regionType, setRegionType] = useState<null | string>();

  const filterRegion = e => {
    setRegionType(e);

    if (e === "All Regions") {
      dispatch({
        type: GET_UNITS_REQUEST,
        params: {}
      });
      return;
    }

    dispatch({
      type: GET_UNITS_REQUEST,
      params: {
        filter: "region",
        region: e
      }
    });
  };

  var listRegions = [...regions];

  listRegions = [
    { value: "All Regions", label: "All Regions" },
    ...listRegions
  ];

  const getWebsite = key => {
    const region = regions.find(r => r.label === key);
    return region ? region.website : "";
  };

  const getCounties = key => {
    const region = regions.find(r => r.label === key);
    return region ? region.counties : "";
  };

  const translate = useTranslation().t;

  const newRegions = Object.keys(groupUnits).sort((a, b) => {
    // Extract numeric part and compare
    return parseInt(a.split(" ")[2]) - parseInt(b.split(" ")[2]);
  });

  return (
    <GridFullHeight container>
      <GridFormContainer item xs={12} sm={12} md={12}>
        <GridFullHeight container>
          <HeaderBarSub
            openUrl={openUrl}
            isSearch
            name={translate("REGIONAL_COORDINATORS")}
          />
          <Container className={clsx(classes.title, classes.dFlex)}>
            <span className={clsx(classes.pr10, classes.center)}>
              Select Region:
            </span>
            <div className={clsx(classes.flex1, classes.dFlex)}>
              <Input
                name="country"
                type="select"
                fullWidth
                label=""
                changeHandler={e => filterRegion(e)}
                value={regionType}
                options={listRegions}
              />
            </div>
          </Container>
          {loading ? (
            <Loading />
          ) : (
            newRegions.map((key, index) => (
              <React.Fragment key={index}>
                <Container className={classes.title}>
                  {getWebsite(key) ? (
                    <a
                      className={classes.textLink}
                      href={parseURL(getWebsite(key))}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {key}
                    </a>
                  ) : (
                    <p className={classes.textLink}>{key}</p>
                  )}
                </Container>
                {getCounties(key) && (
                  <Container className={classes.counties}>
                    {`(${translate("COUNTIES")}: ${getCounties(key)})`}
                  </Container>
                )}
                <UnitsContainer openUrl={openUrl} units={groupUnits[key]} />
              </React.Fragment>
            ))
          )}
        </GridFullHeight>
      </GridFormContainer>
    </GridFullHeight>
  );
});

export default connect(mapStateToProps)(Units);
