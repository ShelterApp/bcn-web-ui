import React, { useState, useEffect, useRef } from "react";
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
import { Unit as IUnit, Region } from "@bcn/core";
import { Coordinator } from "common/models/units";
import { useDispatch } from "react-redux";
import { SET_MESSAGES_REDUCER } from "redux/reducers/messages/actionTypes";
import { createUnit, updateUnit } from "api/units";
import FormCoordinator from "./FormCoordinator";
import CoordinatorItem from "components/CoordinatorItem";
import { optionType } from "common";
import { isNumber } from "util";

interface FormUnitProps {
  initialValues?: IUnit;
  isCreate: boolean | false;
  regions: optionType[];
}

const initDefaultValues: IUnit = {
  region: "",
  name: "",
  coordinators: [] as Coordinator[]
};

const FormUnit = React.memo((props: FormUnitProps) => {
  const translate = useTranslation().t;
  const dispatch = useDispatch();
  const [indexItemUpdated, setIndexItemUpdated] = useState<number | null>(null);
  const { initialValues, isCreate, regions } = props;
  const defaultValues = initialValues ? initialValues : initDefaultValues;
  const { register, errors, handleSubmit, reset } = useForm({
    defaultValues: defaultValues
  });
  // eslint-disable-next-line
  const _coordinators = defaultValues.coordinators || [];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>();
  const [region, setRegion] = useState("");
  const [coordinators, setCoordinators] = useState(_coordinators.slice());
  const formRef = useRef(null);
  const addCoordinators = obj => {
    if (isNumber(indexItemUpdated)) {
      const newData = coordinators.map((she, idx) =>
        idx === indexItemUpdated ? obj : she
      );
      setCoordinators(newData);
    } else {
      setCoordinators([...coordinators, obj]);
    }
    setIndexItemUpdated(null);
  };

  const onDeleteCoordinator = rowKey => {
    const newData = coordinators.map((she, idx) => ({ ...she, key: idx }));
    const index = newData.findIndex(fa => fa.key === rowKey);
    newData.splice(index, 1);
    setCoordinators(newData);
  };

  const setItemUpdated = rowKey => {
    setIndexItemUpdated(rowKey);
    const itemEdit = coordinators[rowKey];
    if (itemEdit) {
      formRef.current.setData(itemEdit);
    }
  };

  const transformCoordinators = coordinators => {
    return coordinators.map((coordinator, idx) => ({
      key: idx,
      ...coordinator
    }));
  };

  const submit = async (data: any, e: any) => {
    setLoading(true);
    e.preventDefault();

    const _region: Region = !isCreate && (initialValues.region as Region);

    if (!region) {
      setError(translate("REQUIRED_INPUT_CTA", { value: translate("REGION") }));
      setLoading(false);
      return;
    }

    if (coordinators.length === 0) {
      setError(translate("PLEASE_INPUT_AT_LEAST_ONE_COORDINATOR"));
      setLoading(false);
      return;
    }

    const obj = {
      ...data,
      name: isCreate ? data.name : initialValues.name,
      region: isCreate ? region : _region.id,
      coordinators: coordinators
    };

    if (props.isCreate) {
      const res = await createUnit(obj);
      if (res) {
        dispatch(push("/coordinators"));
        dispatch({
          type: SET_MESSAGES_REDUCER,
          message: {
            type: "success",
            key: "ADD_COORDINATOR_SUCCESSFULLY",
            message: translate("ADD_COORDINATOR_SUCCESSFULLY")
          }
        });
        return;
      }
    } else {
      obj.id = initialValues.id;
      const res = await updateUnit(obj);

      if (res && res.id) {
        dispatch(push("/coordinators"));
        dispatch({
          type: SET_MESSAGES_REDUCER,
          message: {
            type: "success",
            key: "UPDATE_COORDINATOR_SUCCESSFULLY",
            message: translate("UPDATE_COORDINATOR_SUCCESSFULLY")
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

  useEffect(() => {
    if (!region) {
      regions.length > 0 && setRegion(regions[0].value);
    }
    // eslint-disable-next-line
  }, [regions]);

  return (
    <React.Fragment>
      <form name="form_region" onSubmit={handleSubmit(submit)}>
        {isCreate && (
          <>
            <Input
              name="region"
              type="select"
              fullWidth
              label={translate("SELECT_REGION")}
              changeHandler={e => setRegion(e)}
              value={region}
              options={regions}
            />
            <Input
              name="name"
              type="string"
              fullWidth
              placeholder={translate("PH_COORDINATOR_NAME")}
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
            <br />
          </>
        )}
        <fieldset className={classes.fieldset}>
          <legend className={classes.legend}>{translate("COORDINATOR")}</legend>
          <FormCoordinator addCoordinators={addCoordinators} ref={formRef} />
          <div className={classes.root}>
            {transformCoordinators(coordinators).map((coordinator, index) => (
              <CoordinatorItem
                key={index}
                keyItem={index}
                coordinator={coordinator}
                onUpdate={setItemUpdated}
                onDeleteCoordinator={onDeleteCoordinator}
              />
            ))}
          </div>
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
                  translate("ADD_COORDINATOR")
                ) : (
                  translate("UPDATE_COORDINATOR")
                )}
              </SubmitButton>
            </ButtonGroup>
          </Grid>
        </Grid>
      </form>
    </React.Fragment>
  );
});

export default FormUnit;
