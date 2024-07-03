import React, { useEffect } from "react";
import { push } from "connected-react-router";
import { reducerType } from "redux/reducers";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import HeaderBarSub from "components/HeaderBarSub";
import Container from "@material-ui/core/Container";
import styles from "./styles";
import FormRegion from "components/FormRegion";
import GridFullHeight from "components/GridFullHeight";
import GridFormContainer from "components/GridFormContainer";
import { Region } from "@bcn/core";
import { GET_REGION_REQUEST } from "redux/reducers/service/actionTypes";
import Loading from "components/Loading";
import { useTranslation } from "react-i18next";

interface EditRegionProps {
  dispatch: Dispatch;
  data: Region;
  match: any;
  loading: boolean;
}

const mapStateToProps = (state: reducerType) => {
  return {
    data: state.service.region,
    loading: state.service.loading
  };
};

const EditRegion = React.memo((props: EditRegionProps) => {
  const { dispatch, loading, data, match } = props;
  const classes = styles();
  const openUrl = url => {
    dispatch(push(url));
  };

  useEffect(() => {
    if (!match.params.id) return;
    dispatch({
      type: GET_REGION_REQUEST,
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
            backUrl={"/regions"}
            openUrl={openUrl}
            name={translate("EDIT_REGIONS")}
          />
          {loading ? (
            <Loading />
          ) : (
            <Container className={classes.root}>
              <FormRegion isCreate={false} initialValues={data} />
            </Container>
          )}
        </GridFullHeight>
      </GridFormContainer>
    </GridFullHeight>
  );
});

export default connect(mapStateToProps)(EditRegion);
