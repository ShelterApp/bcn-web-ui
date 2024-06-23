import React, { useEffect, useState } from "react";
import { push } from "connected-react-router";
import { reducerType } from "redux/reducers";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import HeaderBarSub from "components/HeaderBarSub";
import Container from "@material-ui/core/Container";
import styles from "./styles";
import FormUnit from "components/FormUnit";
import GridFullHeight from "components/GridFullHeight";
import GridFormContainer from "components/GridFormContainer";
import { Unit as IUnit } from "@fywinnv/core";
import { GET_UNIT_REQUEST } from "redux/reducers/service/actionTypes";
import Loading from "components/Loading";
import { getRegions } from "api/regions";
import { useTranslation } from "react-i18next";

interface EditUnitProps {
  dispatch: Dispatch;
  match: any;
  loading: boolean;
  unit: IUnit;
}

const mapStateToProps = (state: reducerType) => {
  return {
    loading: state.service.loading,
    unit: state.service.unit
  };
};

const EditUnit = React.memo((props: EditUnitProps) => {
  const { dispatch, loading, match, unit } = props;
  const classes = styles();
  const openUrl = url => {
    dispatch(push(url));
  };

  const [regions, setRegions] = useState([]);

  const fetchRegions = async () => {
    const data = await getRegions({});
    setRegions(data.map(re => ({ value: re.id, label: re.name })));
  };

  useEffect(() => {
    if (!match.params.id) return;
    fetchRegions();
    dispatch({
      type: GET_UNIT_REQUEST,
      id: match.params.id
    });
    // eslint-disable-next-line
  }, []);

  const translate = useTranslation().t;

  return (
    <GridFullHeight container>
      <GridFormContainer item xs={12} sm={12} md={12}>
        <GridFullHeight container>
          <HeaderBarSub
            backUrl={"/coordinators"}
            openUrl={openUrl}
            name={translate("EDIT_COORDINATOR")}
          />
          {loading ? (
            <Loading />
          ) : (
            <Container className={classes.root}>
              <FormUnit
                isCreate={false}
                initialValues={unit}
                regions={regions}
              />
            </Container>
          )}
        </GridFullHeight>
      </GridFormContainer>
    </GridFullHeight>
  );
});

export default connect(mapStateToProps)(EditUnit);
