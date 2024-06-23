import React from "react";
import Container from "@material-ui/core/Container";
import styles from "./styles";
import FormAuth from "components/FormAuth";

interface AuthProps {
  login: Function;
  openUrl: Function;
  handleChangeTitle: Function;
}

const AuthContainer = React.memo((props: AuthProps) => {
  const { login, openUrl, handleChangeTitle } = props;
  const classes = styles();

  return (
    <>
      <Container className={classes.root}>
        <FormAuth
          openUrl={openUrl}
          login={login}
          handleChangeTitle={handleChangeTitle}
        />
      </Container>
    </>
  );
});

export default AuthContainer;
