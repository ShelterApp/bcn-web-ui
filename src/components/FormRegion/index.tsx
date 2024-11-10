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
import { Region as IRegion } from "@bcn/core";
import { useDispatch } from "react-redux";
import { SET_MESSAGES_REDUCER } from "redux/reducers/messages/actionTypes";
import { createRegion, updateRegion } from "api/regions";
interface FormRegionProps {
  initialValues?: IRegion;
  isCreate: boolean | false;
}

const initDefaultValues: IRegion = {
  name: "",
  website: "",
  counties: ""
};

const FormRegion = React.memo((props: FormRegionProps) => {
  const translate = useTranslation().t;
  const dispatch = useDispatch();
  const { initialValues, isCreate } = props;
  const defaultValues = initialValues ? initialValues : initDefaultValues;
  const { register, errors, handleSubmit, reset } = useForm({
    defaultValues: defaultValues
  });
  // eslint-disable-next-line
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>();

  const submit = async (data: any, e: any) => {
    setLoading(true);
    e.preventDefault();

    const obj = {
      ...data
    };

    if (props.isCreate) {
      const res = await createRegion(obj);
      if (res) {
        dispatch(push("/regions"));
        dispatch({
          type: SET_MESSAGES_REDUCER,
          message: {
            type: "success",
            key: "CREATE_REGION_SUCCESSFULLY",
            message: translate("ADD_REGION_SUCCESSFUL")
          }
        });
        return;
      }
    } else {
      obj.id = initialValues.id;
      const res = await updateRegion(obj);

      if (res && res.id) {
        dispatch(push("/regions"));
        dispatch({
          type: SET_MESSAGES_REDUCER,
          message: {
            type: "success",
            key: "UPDATE_REGION_SUCCESSFULLY",
            message: translate("UPDATE_REGION_SUCCESSFULLY")
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
      <form name="form_region" onSubmit={handleSubmit(submit)}>
        <Input
          name="name"
          type="string"
          fullWidth
          placeholder={translate("PH_REGION_NAME")}
          label={translate("NAME")}
          validate={register({
            required: true
          })}
          error={errors.name}
        />
        {errors.name && errors.name.type === "required" && (
          <ErrorMessage>
            {translate("REQUIRED_INPUT_CTA", {
              value: translate("NAME")
            })}
          </ErrorMessage>
        )}
        <Input
          name="website"
          type="string"
          fullWidth
          placeholder="Ex: https://www.esc14.net"
          label={translate("WEBSITE")}
          validate={register({
            required: false
          })}
          error={errors.website}
        />
        {errors.website && errors.website.type === "required" && (
          <ErrorMessage>
            {translate("REQUIRED_INPUT_CTA", {
              value: translate("WEBSITE")
            })}
          </ErrorMessage>
        )}
        <Input
          name="counties"
          type="string"
          fullWidth
          placeholder="Ex: Taylor"
          label={translate("COUNTIES")}
          validate={register({
            required: false
          })}
          error={errors.counties}
        />
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
                  translate("ADD_REGIONS")
                ) : (
                  translate("UPDATE_REGION")
                )}
              </SubmitButton>
            </ButtonGroup>
          </Grid>
        </Grid>
      </form>
    </React.Fragment>
  );
});

export default FormRegion;
