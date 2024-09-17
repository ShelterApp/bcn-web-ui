import React, { useState } from "react";

// import { GET_UNITS_REQUEST } from "redux/reducers/service/actionTypes";
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
import UnitsContainer from "containers/UnitsContainer";
import { useTranslation } from "react-i18next";
import axios from "axios";

const regionDetail = {
  "Region 1": "Philadelphia",
  "Region 2": "Berks, Chester, Dauphin, Lancaster, Lebanon, Schuylkill",
  "Region 3":
    "Adams, Cumberland, Franklin, Mifflin, Huntingdon, Juniata, Perry, York",
  "Region 4":
    "Allegheny, Beaver, Bedford, Fayette, Fulton, Greene, Somerset, Washington, Westmoreland",
  "Region 5":
    "Butler, Crawford, Clarion, Erie, Forest, Lawrence, McKean, Mercer, Venango, Warren",
  "Region 6":
    "Armstrong, Blair, Cambria, Cameron, Centre, Clearfield, Clinton, Elk, Indiana, Jefferson, Potter",
  "Region 7":
    "Bradford, Carbon, Columbia, Lackawanna, Luzerne, Lycoming, Monroe, Montour Northumberland, Pike, Snyder, Sullivan, Susquehanna, Tioga, Union, Wayne, Wyoming ",
  "Region 8": "Bucks, Delaware, Lehigh, Montgomery, Northampton",
  Statewide: ""
};
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
  const { dispatch } = props;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [allData, setAllData] = useState([]);
  const [originalData, setOriginalData] = useState(null);
  const classes = styles();

  const handleResult = async () => {
    setLoading(true);
    let res = await axios(
      "https://api.bigcountrynavigator.com/common/regional-coordinators",
      {
        method: "get",
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
    if (res && res.data) {
      let groupData = res.data;
      setAllData(groupData);
      groupData = groupData.reduce((r, a) => {
        const _name = a.regionID ? `Region ${a.regionID}` : "Statewide";
        r[_name] = r[_name] || [];
        r[_name].push(a);
        return r;
      }, Object.create(null));
      var stateWide = [...groupData["Statewide"]];
      // console.log(groupData,'before');

      groupData["Statewide"] = [...stateWide.sort().reverse()];
      // console.log(Object.keys(groupData),'after');
      // Object.keys(data)
      setOriginalData(groupData);

      setData(groupData);
      // console.log(groupData);

      setRegions(Object.keys(groupData).map(x => ({ label: x, value: x })));
    }
    setLoading(false);
  };

  const [regions, setRegions] = useState([]);

  React.useEffect(() => {
    handleResult();
    // eslint-disable-next-line
  }, []);

  const openUrl = url => {
    dispatch(push(url));
  };

  const [regionType, setRegionType] = useState<null | string>();

  const filterRegion = e => {
    setRegionType(e);

    if (e === "All Regions") {
      setData(originalData);
      return;
    }

    setData({ [e]: originalData[e] });
  };

  var listRegions = [...regions];

  listRegions = [
    { value: "All Regions", label: "All Regions" },
    ...listRegions
  ];

  const handleSearch = keyword => {
    setLoading(true);
    let newData = allData.filter(
      (item: any) =>
        item.name.toLowerCase().includes(keyword.toLowerCase()) ||
        item.company.toLowerCase().includes(keyword.toLowerCase()) ||
        item.phone1.toLowerCase().includes(keyword.toLowerCase()) ||
        item.phone2.toLowerCase().includes(keyword.toLowerCase()) ||
        item.email.toLowerCase().includes(keyword.toLowerCase()) ||
        item.title.toLowerCase().includes(keyword.toLowerCase())
    );
    newData = newData.reduce((r, a) => {
      const _name = a.regionID ? `Region ${a.regionID}` : "Statewide";
      r[_name] = r[_name] || [];
      r[_name].push(a);
      return r;
    }, Object.create(null));

    setData(newData);
    setLoading(false);
  };

  const handleCloseSearch = () => {
    setData(originalData);
  };

  const translate = useTranslation().t;

  return (
    <GridFullHeight container>
      <GridFormContainer item xs={12} sm={12} md={12}>
        <GridFullHeight container>
          <HeaderBarSub
            openUrl={openUrl}
            isSearch
            name={translate("REGIONAL_COORDINATORS")}
            handleSearch={handleSearch}
            handleCloseSearch={handleCloseSearch}
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
            <>
              {data && Object.keys(data).length > 0 ? (
                Object.keys(data)
                  .sort()
                  .map((key, index) => (
                    <React.Fragment key={index}>
                      <Container className={classes.title}>
                        <p className={classes.textLink}>{key}</p>
                        <p className={classes.pr10}>{regionDetail[key]}</p>
                      </Container>
                      <UnitsContainer openUrl={openUrl} units={data[key]} />
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
                  No Regional Coordinators
                </i>
              )}
            </>
          )}
        </GridFullHeight>
      </GridFormContainer>
    </GridFullHeight>
  );
});

export default connect(mapStateToProps)(Units);
