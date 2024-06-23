import React from "react";
import { push } from "connected-react-router";
import { reducerType } from "redux/reducers";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import HeaderBarSub from "components/HeaderBarSub";
import Container from "@material-ui/core/Container";
import styles from "./styles";
import FormLiaison from "components/FormLiaison";
import GridFullHeight from "components/GridFullHeight";
import GridFormContainer from "components/GridFormContainer";
import { useTranslation } from "react-i18next";

interface NewLiaisonProps {
  dispatch: Dispatch;
}

const mapStateToProps = (state: reducerType) => {
  return {};
};

const NewLiaison = React.memo((props: NewLiaisonProps) => {
  const { dispatch } = props;
  const classes = styles();
  const openUrl = url => {
    dispatch(push(url));
  };
  const translate = useTranslation().t;

  return (
    <GridFullHeight container>
      <GridFormContainer item xs={12} sm={12} md={12}>
        <GridFullHeight container>
          <HeaderBarSub
            backUrl={"/liaisons"}
            openUrl={openUrl}
            name={translate("ADD_LIAISON")}
          />
          <Container className={classes.root}>
            <FormLiaison isCreate={true} />
          </Container>
        </GridFullHeight>
      </GridFormContainer>
    </GridFullHeight>
  );
});

export default connect(mapStateToProps)(NewLiaison);
