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
import { CrisisLine as ICrisisLine } from "@bcn/core";
import { useDispatch } from "react-redux";
import { SET_MESSAGES_REDUCER } from "redux/reducers/messages/actionTypes";
import { createCrisisLine, updateCrisisLine } from "api/crisislines";

interface FormCrisisLineProps {
  initialValues?: ICrisisLine;
  isCreate: boolean | false;
}

const initDefaultValues: ICrisisLine = {
  name: "",
  description: "",
  phone: "",
  text: "",
  chatWebLink: "",
  time: "",
  area: "",
  website: ""
};

const FormCrisisLine = React.memo((props: FormCrisisLineProps) => {
  const translate = useTranslation().t;
  const dispatch = useDispatch();
  const { initialValues, isCreate } = props;
  const defaultValues = initialValues ? initialValues : initDefaultValues;
  const { register, errors, handleSubmit, reset } = useForm({
    defaultValues: defaultValues
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>();

  const submit = async (data: any, e: any) => {
    setLoading(true);
    e.preventDefault();

    const obj = {
      ...data
    };

    if (props.isCreate) {
      const res = await createCrisisLine(obj);
      if (res) {
        dispatch(push("/"));
        dispatch({
          type: SET_MESSAGES_REDUCER,
          message: {
            type: "success",
            key: "ADD_LINE_SUCCESSFULLY",
            message: translate("ADD_LINE_SUCCESSFULLY")
          }
        });
        return;
      }
    } else {
      obj.id = initialValues.id;
      const res = await updateCrisisLine(obj);
      if (res && res.id) {
        dispatch(push("/crisis_lines"));
        dispatch({
          type: SET_MESSAGES_REDUCER,
          message: {
            type: "success",
            key: "UPDATE_LINE_SUCCESSFULLY",
            message: translate("UPDATE_LINE_SUCCESSFULLY")
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
      reset(initialValues);
      return;
    }
    // eslint-disable-next-line
  }, [initialValues, isCreate]);

  return (
    <React.Fragment>
      <form name="form_crisisline" onSubmit={handleSubmit(submit)}>
        <fieldset className={classes.fieldset}>
          <legend className={classes.legend}>{translate("NAME")}</legend>
          <Input
            name="name"
            type="string"
            fullWidth
            placeholder={translate("PH_LINE_NAME")}
            label={translate("CRISIS_LINE_NAME")}
            validate={register({
              required: true
            })}
            error={errors.name}
          />
          {errors.name && errors.name.type === "required" && (
            <ErrorMessage>
              {translate("REQUIRED_INPUT_CTA", {
                value: translate("CRISIS_LINE_NAME")
              })}
            </ErrorMessage>
          )}
          <Input
            name="description"
            type="textarea"
            fullWidth
            placeholder={translate("DESC_LESS_THAN_VALUE", {
              value: 1000
            })}
            label=""
            validate={register({
              required: true,
              maxLength: 1000
            })}
            error={errors.description}
          />
          {errors.description && errors.description.type === "required" && (
            <ErrorMessage>
              {translate("REQUIRED_INPUT_CTA", {
                value: translate("CRISIS_LINE_DESC")
              })}
            </ErrorMessage>
          )}
          {errors.description && errors.description.type === "maxLength" && (
            <ErrorMessage>
              {translate("DESC_LESS_THAN_VALUE", {
                value: 1000
              })}
            </ErrorMessage>
          )}
        </fieldset>
        <br />
        <fieldset className={classes.fieldset}>
          <legend className={classes.legend}>
            {translate("CRISIS_LINE_INFORMATION")}
          </legend>
          <Input
            name="phone"
            type="phonenumber"
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
            name="text"
            type="string"
            fullWidth
            placeholder={translate("PH_TEXT_NUMBER")}
            label={translate("TEXT")}
            validate={register({
              required: false
            })}
            error={errors.text}
          />
          <Input
            name="chatWebLink"
            type="string"
            fullWidth
            placeholder="www.abc.org/chatlink"
            label={translate("CHAT_WEB_LINK")}
            validate={register({
              required: false
            })}
            error={errors.chatWebLink}
          />
          <Input
            name="website"
            type="string"
            fullWidth
            placeholder="www.abc.org"
            label={translate("WEBSITE")}
            validate={register({
              required: false
            })}
            error={errors.website}
          />
          <Input
            name="area"
            type="string"
            fullWidth
            placeholder="USA"
            label={translate("AREA")}
            validate={register({
              required: true
            })}
            error={errors.area}
          />
          {errors.area && errors.area.type === "required" && (
            <ErrorMessage>
              {translate("REQUIRED_INPUT_CTA", {
                value: translate("AREA")
              })}
            </ErrorMessage>
          )}
          <Input
            name="time"
            type="string"
            fullWidth
            placeholder="24/7"
            label={translate("HOURS")}
            validate={register({
              required: true
            })}
            error={errors.time}
          />
          {errors.time && errors.time.type === "required" && (
            <ErrorMessage>
              {translate("REQUIRED_INPUT_CTA", {
                value: translate("HOURS")
              })}
            </ErrorMessage>
          )}
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
                  translate("ADD_CRISIS_LINE")
                ) : (
                  translate("UPDATE_LINE")
                )}
              </SubmitButton>
            </ButtonGroup>
          </Grid>
        </Grid>
      </form>
    </React.Fragment>
  );
});

export default FormCrisisLine;
