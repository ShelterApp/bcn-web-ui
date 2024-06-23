import React, { lazy } from "react";
import { push } from "connected-react-router";
import { reducerType } from "redux/reducers";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import HeaderBarSub from "components/HeaderBarSub";
import Container from "@material-ui/core/Container";
import styles from "./styles";
import useForm from "react-hook-form";
import ErrorMessage from "components/ErrorMessage";
import Input from "components/Input";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Grid from "@material-ui/core/Grid";
import SubmitButton from "components/Button";
import FlashMessage from "components/FlashMessage";
import { useTranslation } from "react-i18next";
import { resetPassword } from "api/auth/resetPassword";
import imgLoading from "asset/img/loading.gif";

const GridFullHeight = lazy(() => import("components/GridFullHeight"));
const GridFormContainer = lazy(() => import("components/GridFormContainer"));

interface ForgotPasswordProps {
  dispatch: Dispatch;
}

const mapStateToProps = (state: reducerType) => {
  return {};
};

const ForgotPassword = React.memo((props: ForgotPasswordProps) => {
  const translate = useTranslation().t;
  const { dispatch } = props;
  const [open, setOpen] = React.useState(false);
  const { register, errors, handleSubmit, setValue } = useForm();
  const [emailNotFound, setEmailNotFound] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const submit = (data: any, e: any) => {
    setLoading(true);
    setEmailNotFound(false);
    e.preventDefault();
    resetPassword(data.email).then(data => {
      if (data.code === 404) {
        setEmailNotFound(true);
      } else if (data.code === 200) {
        setValue("email", "");
        setEmailNotFound(false);
        setOpen(true);
      }
      setLoading(false);
    });
  };

  const classes = styles();

  const openUrl = url => {
    dispatch(push(url));
  };

  return (
    <GridFullHeight container>
      <GridFormContainer item xs={12} sm={12} md={12}>
        <GridFullHeight container>
          <HeaderBarSub
            backUrl={"/login"}
            openUrl={openUrl}
            name={translate("FORGOT_PASSWORD")}
          />
          <Container className={classes.root}>
            <form name="forgot_password" onSubmit={handleSubmit(submit)}>
              <Input
                name="email"
                type="email"
                fullWidth
                placeholder="mark@gmail.com"
                label={translate("EMAIL")}
                validate={register({
                  required: true,
                  // eslint-disable-next-line
                  pattern: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
                })}
                error={errors.email}
              />
              {errors.email && errors.email.type === "required" && (
                <ErrorMessage>
                  {translate("REQUIRED_INPUT_CTA", {
                    value: translate("EMAIL")
                  })}
                </ErrorMessage>
              )}
              {errors.email && errors.email.type === "pattern" && (
                <ErrorMessage>
                  {translate("EMAIL_MUST_BE_A_VALID_EMAIL")}
                </ErrorMessage>
              )}
              {emailNotFound && (
                <ErrorMessage className={classes.boxError}>
                  {translate("EMAIL_NOT_FOUND")}
                </ErrorMessage>
              )}
              <Grid
                style={{ paddingTop: "20px" }}
                container
                spacing={1}
                direction="row"
              >
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <ButtonGroup fullWidth>
                    <SubmitButton
                      disabled={loading}
                      type="submit"
                      variant="contained"
                    >
                      {loading ? (
                        <img alt="loading" src={imgLoading} width="30px" />
                      ) : (
                        translate("RESET_PASSWORD")
                      )}
                    </SubmitButton>
                  </ButtonGroup>
                </Grid>
              </Grid>
            </form>
            <FlashMessage
              open={open}
              setOpen={setOpen}
              message={translate("REQUEST_RESET_PASSWORD_SUCCESSFULLY")}
              type={"success"}
            />
          </Container>
        </GridFullHeight>
      </GridFormContainer>
    </GridFullHeight>
  );
});

export default connect(mapStateToProps)(ForgotPassword);
