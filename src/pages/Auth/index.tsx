import React, { lazy, useState } from "react";

import { LOGIN_REQUEST } from "redux/reducers/auth/actionTypes";
import { push } from "connected-react-router";

import { reducerType } from "redux/reducers";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import HeaderBarSub from "components/HeaderBarSub";
// import Loading from "components/Loading";
import AuthContainer from "containers/AuthContainer";
import { useTranslation } from "react-i18next";

const GridFullHeight = lazy(() => import("components/GridFullHeight"));
const GridFormContainer = lazy(() => import("components/GridFormContainer"));

interface AuthPageProps {
  dispatch: Dispatch;
}

const mapStateToProps = (state: reducerType) => {
  return {};
};

const AuthPage = React.memo((props: AuthPageProps) => {
  const translate = useTranslation().t;
  const { dispatch } = props;

  const login = form => {
    dispatch({
      type: LOGIN_REQUEST,
      current_user: form
    });
  };

  const openUrl = url => {
    dispatch(push(url));
  };

  const [title, setTitle] = useState("SERVICE_PROVIDER_LOGIN");

  const handleChangeTitle = title => {
    setTitle(title);
  };

  return (
    <GridFullHeight container>
      <GridFormContainer item xs={12} sm={12} md={12}>
        <GridFullHeight container>
          <HeaderBarSub openUrl={openUrl} name={translate(title)} />
          <AuthContainer
            handleChangeTitle={handleChangeTitle}
            openUrl={openUrl}
            login={login}
          />
        </GridFullHeight>
      </GridFormContainer>
    </GridFullHeight>
  );
});

export default connect(mapStateToProps)(AuthPage);
