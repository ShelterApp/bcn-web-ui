import React from "react";
import styles from "../../styles";
import useForm from "react-hook-form";
import ErrorMessage from "components/ErrorMessage";
import Input from "components/Input";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Grid from "@material-ui/core/Grid";
import SubmitButton from "components/Button";
import { useTranslation } from "react-i18next";
import { login } from "api/auth/login";
import imgLoading from "asset/img/loading.gif";

interface LoginProps {
  login: Function;
  openUrl: Function;
}

const LoginForm = React.memo((props: LoginProps) => {
  const { openUrl } = props;
  const classes = styles();
  const { register, errors, handleSubmit } = useForm();
  const translate = useTranslation().t;
  const [errorLogin, setErrorLogin] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const submit = (data: any, e: any) => {
    setLoading(true);
    setErrorLogin(false);
    e.preventDefault();
    login({
      email: data.email.toLowerCase(),
      password: data.password
    }).then(data => {
      if (
        (data.code === 401 || data.code === 400) &&
        data.message === "Email or password invalid"
      ) {
        setLoading(false);
        setErrorLogin(true);
      } else if (data) {
        props.login(data);
      }
    });
  };

  return (
    <form name="login" onSubmit={handleSubmit(submit)}>
      <Input
        name="email"
        type="email"
        fullWidth
        placeholder="name@your-nonprofit.org"
        label="EMAIL"
        validate={register({
          required: true,
          // eslint-disable-next-line
          pattern: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
        })}
        error={errors.email}
      />
      {errors.email && errors.email.type === "required" && (
        <ErrorMessage>
          {translate("REQUIRED_INPUT_CTA", { value: translate("EMAIL") })}
        </ErrorMessage>
      )}
      {errors.email && errors.email.type === "pattern" && (
        <ErrorMessage>{translate("EMAIL_MUST_BE_A_VALID_EMAIL")}</ErrorMessage>
      )}
      <Input
        name="password"
        type="password"
        fullWidth
        placeholder={"******"}
        label={"PASSWORD"}
        validate={register({
          minLength: 6,
          required: true
        })}
        error={errors.password}
      />
      {errors.password && errors.password.type === "minLength" && (
        <ErrorMessage>
          {translate("PASSWORD_MIN_LENGTH", { value: 6 })}
        </ErrorMessage>
      )}
      {errors.password && errors.password.type === "required" && (
        <ErrorMessage>
          {translate("REQUIRED_INPUT_CTA", { value: translate("PASSWORD") })}
        </ErrorMessage>
      )}
      {errorLogin && (
        <ErrorMessage className={classes.boxError}>
          {translate("EMAIL_OR_PASSWORD_INVALID")}
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
            <SubmitButton disabled={loading} type="submit" variant="contained">
              {loading ? (
                <img alt="loading" src={imgLoading} width="30px" />
              ) : (
                translate("SIGN_IN")
              )}
            </SubmitButton>
          </ButtonGroup>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <p
            className={classes.forgotPassword}
            onClick={() => openUrl("/forgot_password")}
          >
            {translate("FORGOT_PASSWORD")}?
          </p>
        </Grid>
      </Grid>
    </form>
  );
});

export default LoginForm;
