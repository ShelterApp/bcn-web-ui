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
import { getRegions } from "api/regions";
import { useTranslation } from "react-i18next";

interface NewUnitProps {
  dispatch: Dispatch;
}

const mapStateToProps = (state: reducerType) => {
  return {};
};

const NewUnit = React.memo((props: NewUnitProps) => {
  const { dispatch } = props;
  const translate = useTranslation().t;
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
    fetchRegions();
  }, []);

  return (
    <GridFullHeight container>
      <GridFormContainer item xs={12} sm={12} md={12}>
        <GridFullHeight container>
          <HeaderBarSub
            backUrl={"/coordinators"}
            openUrl={openUrl}
            name={translate("ADD_COORDINATOR")}
          />
          <Container className={classes.root}>
            <FormUnit isCreate={true} regions={regions} />
          </Container>
        </GridFullHeight>
      </GridFormContainer>
    </GridFullHeight>
  );
});

export default connect(mapStateToProps)(NewUnit);
