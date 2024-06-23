import React, { useState, useEffect } from "react";
import { push } from "connected-react-router";
import styles from "./styles";
import useForm from "react-hook-form";
import ErrorMessage from "components/ErrorMessage";
import Input from "components/Input";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Grid from "@material-ui/core/Grid";
import SubmitButton from "components/Button";
import { useTranslation } from "react-i18next";
import Alert from "@material-ui/lab/Alert";
import imgLoading from "asset/img/loading.gif";
import { Liaison as ILiaison } from "@fywinnv/core";
import { useDispatch } from "react-redux";
import { SET_MESSAGES_REDUCER } from "redux/reducers/messages/actionTypes";
import { createLiaison, updateLiaison } from "api/liaisons";

import listLocations from "./locations";
interface FormLiaisonProps {
  initialValues?: ILiaison;
  isCreate: boolean | false;
}

const initDefaultValues: ILiaison = {
  county: "",
  schoolDistrict: "",
  displayName: "",
  title: "",
  email: "",
  phone: "",
  extension: ""
};

const FormLiaison = React.memo((props: FormLiaisonProps) => {
  const translate = useTranslation().t;
  const dispatch = useDispatch();
  const { initialValues, isCreate } = props;
  const defaultValues = initialValues ? initialValues : initDefaultValues;
  const { register, errors, handleSubmit, reset } = useForm({
    defaultValues: defaultValues
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>();
  const [location, setLocation] = useState<null | string>("Adams");

  const submit = async (data: any, e: any) => {
    setLoading(true);
    e.preventDefault();

    if (!location) {
      setError(translate("REQUIRED_INPUT_CTA", { value: translate("COUNTY") }));
      return;
    }

    const obj = {
      ...data,
      county: location
    };

    if (props.isCreate) {
      const res = await createLiaison(obj);
      if (res) {
        dispatch(push("/liaisons"));
        dispatch({
          type: SET_MESSAGES_REDUCER,
          message: {
            type: "success",
            key: "ADD_LIAISON_SUCCESSFULLY",
            message: translate("ADD_LIAISON_SUCCESSFULLY")
          }
        });
        return;
      }
    } else {
      obj.id = initialValues.id;
      const res = await updateLiaison(obj);

      if (res && res.id) {
        dispatch(push("/liaisons"));
        dispatch({
          type: SET_MESSAGES_REDUCER,
          message: {
            type: "success",
            key: "UPDATE_LIAISON_SUCCESSFULLY",
            message: translate("UPDATE_LIAISON_SUCCESSFULLY")
          }
        });
        return;
      }
      setError("");
      setLoading(false);
    }

    setError("");
    setLoading(false);
  };

  const classes = styles();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (initialValues && initialValues.id) {
      setLocation(initialValues.county);
      reset(initialValues);
      return;
    }
    // eslint-disable-next-line
  }, [initialValues, isCreate]);

  return (
    <React.Fragment>
      <form name="form_liaison" onSubmit={handleSubmit(submit)}>
        <fieldset className={classes.fieldset}>
          <legend className={classes.legend}>{translate("LOCATION")}</legend>
          <Input
            name="county"
            type="select"
            fullWidth
            label={translate("SELECT_COUNTY")}
            changeHandler={e => setLocation(e)}
            value={location}
            options={listLocations}
          />
          <Input
            name="schoolDistrict"
            type="string"
            fullWidth
            placeholder={translate("PH_DISTRICT")}
            label={translate("DISTRICT")}
            validate={register({
              required: true
            })}
            error={errors.schoolDistrict}
          />
          {errors.schoolDistrict && errors.schoolDistrict.type === "required" && (
            <ErrorMessage>
              {translate("REQUIRED_INPUT_CTA", {
                value: translate("DISTRICT")
              })}
            </ErrorMessage>
          )}
        </fieldset>
        <br />
        <fieldset className={classes.fieldset}>
          <legend className={classes.legend}>
            {translate("LIAISON_INFORMATION")}
          </legend>
          <Input
            name="displayName"
            type="string"
            fullWidth
            placeholder={translate("NAME")}
            label={translate("NAME")}
            validate={register({
              required: true
            })}
            error={errors.displayName}
          />
          {errors.displayName && errors.displayName.type === "required" && (
            <ErrorMessage>
              {translate("REQUIRED_INPUT_CTA", {
                value: translate("LIAISON_NAME")
              })}
            </ErrorMessage>
          )}
          <Input
            name="title"
            type="string"
            fullWidth
            placeholder={translate("PH_LIAISON_TITLE")}
            label={translate("LIAISON_TITLE")}
            validate={register({
              required: true
            })}
            error={errors.title}
          />
          {errors.title && errors.title.type === "required" && (
            <ErrorMessage>
              {translate("REQUIRED_INPUT_CTA", {
                value: translate("LIAISON_TITLE")
              })}
            </ErrorMessage>
          )}
          <Input
            name="email"
            type="email"
            fullWidth
            placeholder={translate("PH_EMAIL")}
            label={translate("EMAIL")}
            validate={register({
              required: false,
              // eslint-disable-next-line
              pattern: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
            })}
            error={errors.email}
          />
          {errors.email && errors.email.type === "pattern" && (
            <ErrorMessage>
              {translate("EMAIL_MUST_BE_A_VALID_EMAIL")}
            </ErrorMessage>
          )}
          <Input
            name="phone"
            type="string"
            fullWidth
            placeholder="(303) 555-0100"
            label={translate("PHONE")}
            validate={register({
              required: true
            })}
            error={errors.phone}
          />
          {errors.phone && errors.phone.type === "required" && (
            <ErrorMessage>
              {translate("REQUIRED_INPUT_CTA", {
                value: translate("PHONE")
              })}
            </ErrorMessage>
          )}
          <Input
            name="extension"
            type="string"
            fullWidth
            placeholder={translate("PH_EXT")}
            label={translate("EXTENSION")}
            validate={register({
              required: false
            })}
          />
          <br />
        </fieldset>
        <br />
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
                ) : isCreate ? (
                  translate("ADD_LIAISON")
                ) : (
                  translate("UPDATE_LIAISON")
                )}
              </SubmitButton>
            </ButtonGroup>
          </Grid>
        </Grid>
      </form>
    </React.Fragment>
  );
});

export default FormLiaison;
