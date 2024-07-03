import React, { useState, useEffect } from "react";
import { push } from "connected-react-router";
import useForm from "react-hook-form";
import ErrorMessage from "components/ErrorMessage";
import Input from "components/Input";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Grid from "@material-ui/core/Grid";
import SubmitButton from "components/Button";
import { useTranslation } from "react-i18next";
import Alert from "@material-ui/lab/Alert";
import imgLoading from "asset/img/loading.gif";
import { User } from "@bcn/core";
import { useDispatch } from "react-redux";
import { SET_MESSAGES_REDUCER } from "redux/reducers/messages/actionTypes";
import { updateUser, updatePermissionUser } from "api/services/getUsers";
import dayjs from "dayjs";
import { UserRole } from "common/";

interface FormUserProps {
  user: User;
}

const FormUser = React.memo((props: FormUserProps) => {
  const translate = useTranslation().t;
  const dispatch = useDispatch();

  const { user } = props;
  const [role, setRole] = useState("");
  const initUsew = user;
  const { register, errors, handleSubmit, reset } = useForm({
    defaultValues: initUsew
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>();

  const submit = async (data: any, e: any) => {
    setLoading(true);
    e.preventDefault();
    const obj = {
      ...data,
      userId: user.id
    };

    let form = {
      displayName: obj.displayName,
      phone: obj.phone,
      totalServices:
        data.totalServices && data.totalServices > 0
          ? parseInt(data.totalServices)
          : 3
    };

    if (role === UserRole.Administrator) {
      delete form.totalServices;
    }

    const res = await updateUser({
      userId: obj.userId,
      form: form
    });
    const res1 = await updatePermissionUser({
      role: role,
      userId: obj.userId
    });

    if (res && res.id && res1 && res1.id) {
      dispatch(push("/manage_users"));
      dispatch({
        type: SET_MESSAGES_REDUCER,
        message: {
          type: "success",
          key: "UPDATE_USER_SUCCESSFULLY",
          message: translate("UPDATE_USER_SUCCESSFULLY")
        }
      });
      return;
    }
    setError("");
    setLoading(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (user && user.id) {
      setRole(
        user.roles.includes(UserRole.Administrator)
          ? UserRole.Administrator
          : user.roles.includes(UserRole.SuperUser)
          ? UserRole.SuperUser
          : user.roles.includes(UserRole.AutoUser)
          ? UserRole.AutoUser
          : UserRole.User
      );
      reset(user);
      return;
    }
    // eslint-disable-next-line
  }, [user]);

  const getRoles = key => {
    return key === "SUPER USER"
      ? translate("REGIONAL_COORDINATOR")
      : key === "AUTO USER"
      ? translate("HOMELESS_LIAISON")
      : key === "USER"
      ? translate("SERVICE_PROVIDER")
      : "ADMINISTRATOR";
  };

  const listRoles = ["USER", "AUTO USER", "SUPER USER", "ADMINISTRATOR"].map(
    i => ({
      label: getRoles(i),
      value: i
    })
  );

  return (
    <React.Fragment>
      <form name="form_user" onSubmit={handleSubmit(submit)}>
        <Input
          name="displayName"
          type="string"
          fullWidth
          placeholder={translate("PH_DISPLAY_NAME_SIGNUP")}
          label={translate("DISPLAY_NAME_SIGNUP")}
          validate={register({
            required: false
          })}
          error={errors.displayName}
        />
        {errors.displayName && errors.displayName.type === "required" && (
          <ErrorMessage>
            {translate("REQUIRED_INPUT_CTA", {
              value: translate("DISPLAY_NAME_SIGNUP")
            })}
          </ErrorMessage>
        )}
        <Input
          name="phone"
          type="phonenumber"
          fullWidth
          placeholder="(303) 555-0100"
          label={translate("PHONE")}
          validate={register({
            required: false
          })}
          error={errors.phone}
        />
        <Input
          name="roles"
          type="select"
          fullWidth
          label={translate("ROLE")}
          changeHandler={e => setRole(e)}
          value={role}
          options={listRoles}
        />
        {user.roles && !user.roles.includes(UserRole.Administrator) && (
          <>
            <Input
              name="totalServices"
              type="number"
              fullWidth
              placeholder=""
              label={translate("TOTAL_SERVICE")}
              validate={register({
                required: false,
                min: 1
              })}
              error={errors.totalServices}
            />
            {errors.totalServices && errors.totalServices.type === "min" && (
              <ErrorMessage>
                {translate("MINIMUM_TOTAL_SERVICE", {
                  value: 1
                })}
              </ErrorMessage>
            )}
          </>
        )}
        <Input
          name="email"
          type="email"
          fullWidth
          placeholder="mark@gmail.com"
          label={translate("EMAIL")}
          validate={register}
          error={errors.email}
          disabled
        />
        <Input
          name="createdAt"
          type="string"
          fullWidth
          placeholder=""
          label={translate("CREATED_AT")}
          value={dayjs(user.createdAt).format("MM/DD/YYYY hh:mm A")}
          error={errors.createdAt}
          disabled
        />
        <Input
          name="lastMethod"
          type="string"
          fullWidth
          placeholder=""
          label={translate("LAST_LOGIN_METHOD")}
          validate={register}
          error={errors.lastMethod}
          disabled
        />
        <Input
          name="lastSignedIn"
          type="string"
          fullWidth
          placeholder=""
          label={translate("LAST_LOGIN_AT")}
          value={dayjs(user.lastSignedIn).format("MM/DD/YYYY hh:mm A")}
          error={errors.lastSignedIn}
          disabled
        />
        <Input
          name="updatedAt"
          type="string"
          fullWidth
          placeholder=""
          label={translate("LAST_UPDATED_AT")}
          value={dayjs(user.updatedAt).format("MM/DD/YYYY hh:mm A")}
          error={errors.updatedAt}
          disabled
        />
        {error && <Alert severity="error">{error}</Alert>}
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
                  translate("UPDATE_PROFILE")
                )}
              </SubmitButton>
            </ButtonGroup>
          </Grid>
        </Grid>
      </form>
    </React.Fragment>
  );
});

export default FormUser;
